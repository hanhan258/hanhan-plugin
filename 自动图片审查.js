import plugin from '../../lib/plugins/plugin.js'
import Jimp from "jimp"
import jsQR from "jsqr"
import tf from "@tensorflow/tfjs-node"
import nsfw from "nsfwjs"
import https from 'https'

/**
 * 需要安装依赖``` pnpm i jimp jsqr @tensorflow/tfjs-node nsfwjs -w ```
 * 一个很简单的插件，一看就是有手就行，没手也行。本来就是看现成的插件满足不了我的需求，做个给自己用罢了。你一定可以写一个比我这个更好的，有现成的插件的话我就不用浪费时间做这个了。
 * 这个插件默认会从nsfwjs库官方提供的S3对象存储中load()模型，模型很小，量化模型只有5.94MB，但仍不能保证网络始终稳定。我试了一下nodejs18本地加载模型失败了，欢迎大佬提pr解决一下本地加载模型的问题。
 * 本插件明确存在内存泄漏现象，您应该自己思考是否使用这个插件。可以尝试将config/pm2/pm2.json文件的max_memory_restart字段的值改成1G，例如"max_memory_restart": "1G"，小鸡可能还需要修改一下内核参数。或许我们应该白嫖huggingface的算力。
 */

//是否自动撤回nsfw图片，true为真，false为假，默认不撤回主人。
const recall = false

//是否自动撤回二维码图片，true为真，false为假，默认不撤回主人。开启后默认不会发送解码内容哦。
const recallQR = false

//涩图转发，监听到nsfw图片后转发给预设QQ号或者群号。postMethod可选的值为private和group，前者表示私聊发送，后者群聊发送。postNum填需要通知的QQ号或者群号，留空则关闭此功能。
const postMethod = 'group'
const postNum = [] //虽然用的是数组，但是最多只能输入一个号码

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
          fnc: 'isSafety'
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

    const imageUrl = this.e.message.find(msg => msg.type === 'image')?.url || null
    if (!imageUrl) {
      return false
    }
    const regex = /-(\w{32})\//
    const hash = imageUrl.match(regex)[1]

    if (await redis.exists(`Yz:autoCheck:${hash}`)) {
      logger.info('[图片审查]图片安全，重置缓存时间')
      await redis.expire(`Yz:autoCheck:${hash}`, 48 * 60 * 60)
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
      await redis.set(`Yz:autoCheck:${hash}`, '0', { EX: 36 * 60 * 60 })
      return false
    }
  }

  async nsfwImageCheck(buffer, imageUrl) {
    logger.info('[图片审查]开始nsfw审查')
    await tf.enableProdMode()
    //测试中使用uint8Array似乎比buffer更稳定
    const uint8Array = new Uint8Array(buffer)
    //load()是从nsfwjs的S3对象存储中加载的模型，是否稳定我也不知道，可以自己研究一下从本地加载模型。实测node18从本地加载模型失败。
    const model = await nsfw.load()
    const image = await tf.node.decodeImage(uint8Array, 3)
    const predictions = await model.classify(image)
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
