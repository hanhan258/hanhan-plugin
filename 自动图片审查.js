import plugin from '../../lib/plugins/plugin.js'
import Jimp from "jimp"
import jsQR from "jsqr"
import tf from "@tensorflow/tfjs-node"
import nsfw from "nsfwjs"
import https from 'https'
import fs from "fs"

/**
 * 需要安装依赖``` pnpm i jimp jsqr @tensorflow/tfjs-node nsfwjs -w ```
 * 一个很简单的插件，是在无聊的生活中增加的一个无意义的功能。
 * 加载模型后内存占用较高，您可以尝试将config/pm2/pm2.json里面的max_memory_restart字段的值改成1G，例如"max_memory_restart": "1G"
 */

//是否自动撤回nsfw图片，true为真，false为假，默认不撤回主人。
const recall = false

//是否自动撤回二维码图片，true为真，false为假，默认不撤回主人。开启后默认不会发送解码内容哦。
const recallQR = false

//涩图转发，监听到nsfw图片后转发给预设QQ号或者群号。postMethod可选的值为private或者group，前者表示私聊发送，后者群聊发送。postNum填需要通知的QQ号或者群号，留空则关闭此功能。
const postMethod = 'group'
const postNum = [] //虽然用的是数组，但是最多只能输入一个号码

/**
 * nsfw检测模型路径，模型不存在则加载联网模型，“.”表示云崽根目录。一个文件夹内应包含一个model.json文件和若干个二进制文件。
 * 模型下载地址：https://github.com/GantMan/nsfw_model/releases，经过少量样本对照，Mar 4, 2020 的 nsfw_mobilenet_v2_140_224.zip 135 MB 版本审查的准确率更高。
 * 你只需要选择其中一个二进制模型使用即可，参考下方路径。
 */
const modelPath = './web_model_quantized/model.json'

let loadedModel = null
export class autoCheck extends plugin {
  constructor() {
    super({
      name: '自动图片审查',
      dsc: '简单开发示例',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#?图片安全$',
          fnc: 'isSafety',
          permission: 'master'
        },
        {
          fnc: 'autoCheck'
        }
      ]
    })
  }

  async isSafety() {
    console.log('debug', this.e.message)
    const imageUrl = this.e.message.find(msg => msg.type === 'image')?.url || null
    if (!imageUrl) {
      // 主要是不想处理历史对话的逻辑了
      await this.e.reply('请在消息中带上图片，不要引用回复。')
      return true
    }
    const regex = /-(\w{32})\//
    const hash = imageUrl.match(regex)[1]
    await redis.set(`Yz:autoCheck:${hash}`, '0')
    await this.e.reply('done!')
    return true
  }

  async autoCheck() {
    //检查消息类型
    console.log('debug', this.e.message)
    // if (this.e.message[0].type !== 'image' || !this.e.message[0].url) {
    //   return false
    // }
    // const imageUrl = this.e.message[0].url

    const image = this.e.message.find(msg => msg.type === 'image') || null
    if (!image?.url || image.file.endsWith('.gif')) {
      return false
    }
    const imageUrl = image.url
    const regex = /-(\w{32})\//
    const hash = imageUrl.match(regex)[1]

    if (await redis.exists(`Yz:autoCheck:${hash}`)) {
      logger.info('[图片审查]图片安全，重置缓存时间')
      await redis.expire(`Yz:autoCheck:${hash}`, 72 * 60 * 60)
      return false
    } else if (await redis.exists('Yz:autoCheckLock')) {
      logger.info('[图片审查]当前队列存在待处理图片')
      return false
    }
    await redis.set('Yz:autoCheckLock', '1', { EX: 30 })

    const buffer = await getImageBuffer(imageUrl)

    if (await this.nsfwImageCheck(buffer, imageUrl) || await this.qrcodeScan(buffer)) {
      await redis.del('Yz:autoCheckLock')
      return true
    } else {
      logger.info('[图片审查]图片安全')
      await redis.del('Yz:autoCheckLock')
      await redis.set(`Yz:autoCheck:${hash}`, '0', { EX: 48 * 60 * 60 })
      return false
    }
  }

  async nsfwImageCheck(buffer, imageUrl) {
    logger.info('[图片审查]开始nsfw审查')
    await tf.enableProdMode()
    //测试中使用uint8Array似乎比buffer更稳定
    const uint8Array = new Uint8Array(buffer)
    //load()是从nsfwjs的S3对象存储中加载的模型，是否稳定我也不知道
    //const model = await nsfw.load()

    // 将await nsfw.load()作为一个独立的方法或者模块，可以防止每次运行脚本都加载一次模型，解决了内存泄露问题
    const model = await loadModel()
    const image = await tf.node.decodeImage(uint8Array, 3)
    const predictions = await model.classify(image)
    // 张量的内存必须显式地进行管理（仅仅使 tf.Tensor 超出范围不足以释放其内存）
    image.dispose()
    console.log(predictions)

    let msgArray = []
    if (predictions[0].className === 'Hentai') {
      msgArray.push(`好涩 (*/ω\\*) ，Hentai分数：${predictions[0].probability}`)
    } else if (predictions[0].className === 'Porn') {
      msgArray.push(`太变态啦，这是能发出来的嘛？色情概率：${predictions[0].probability}`)
    } else if (predictions[0].className === 'Sexy') {
      msgArray.push(`好性感，依米也可以哦，涩度：${predictions[0].probability}`)
    } else {
      return false
    }

    try {
      if (postNum.length > 0 && postMethod === 'group') {
        await Bot.pickGroup(postNum).sendMsg(segment.image(imageUrl))
      } else if (postNum.length > 0 && postMethod === 'private') {
        await Bot.pickUser(postNum).sendMsg(segment.image(imageUrl))
      }
    } catch (error) {
      // logger.error(`涩图转发出现错误：${error}`)
      console.log('涩图转发出现错误：', error)
    }

    //涩图撤回
    if (recall && this.e.isGroup && ((this.e.group.is_admin && !this.e.member.is_owner) || this.e.group.is_owner) && !this.e.isMaster) {
      await this.e.group.recallMsg(this.e.message_id)
      msgArray.push('\n主人不允许群里出现这样的图片，依米撤回了哦')
    }
    await this.e.reply(msgArray, true)
    return true
  }

  async qrcodeScan(buffer) {
    const image = await Jimp.read(buffer)
    const width = image.getWidth()
    const height = image.getHeight()
    const imageData = new Uint8ClampedArray(4 * width * height)

    let index = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const rgba = Jimp.intToRGBA(image.getPixelColor(x, y))
        imageData[index++] = rgba.r
        imageData[index++] = rgba.g
        imageData[index++] = rgba.b
        imageData[index++] = rgba.a
      }
    }

    // Release memory by setting jimpObj.bitmap to null
    image.bitmap = null
    //console.log(imageData)
    const code = await jsQR(imageData, width, height, { dontInvert: true })
    if (!code?.data) {
      return false
    }

    //console.log("Found QR code", code)
    if (recallQR && this.e.isGroup && ((this.e.group.is_admin && !this.e.member.is_owner) || this.e.group.is_owner) && !this.e.isMaster) {
      this.e.group.recallMsg(this.e.message_id)
      await this.e.reply('主人要求依米撤回二维码，轰多尼！斯密马赛！')
      return true
    }
    await this.e.reply(`二维码扫描：${code.data}`, true)
    return true
  }
}

async function getImageBuffer(imageUrl) {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, async (response) => {
      if (response.statusCode !== 200) {
        await redis.del('Yz:autoCheckLock')
        reject(new Error(`Request failed with status code ${response.statusCode}`))
      }
      const chunks = []
      response.on('data', (chunk) => {
        chunks.push(chunk)
      })

      response.on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve(buffer)
      })

      response.on('error', async (error) => {
        await redis.del('Yz:autoCheckLock')
        reject(new Error(`Resource download failed with error code ${error}`))
      })
    })
  })
}

async function loadModel() {
  if (!loadedModel) {
    const modelExists = fs.existsSync(modelPath)
    if (modelExists) {
      // 如果模型已存在，则加载本地模型
      logger.info('[图片审查]模型存在，尝试载入本地模型。')
      const ioHandler = tf.io.fileSystem(modelPath)
      loadedModel = await nsfw.load(ioHandler, { type: 'graph' })
    } else {
      // 如果模型不存在，则从网络加载模型，不知道怎么保存权重数据，不想处理了，也不知道这文档哪一行是保存权重数据的API https://js.tensorflow.org/api/latest/#io.copyModel
      logger.info('[图片审查]模型不存在，尝试加载联网模型。')
      loadedModel = await nsfw.load()
    }
  }
  return loadedModel
}