import plugin from '../../lib/plugins/plugin.js'
import tf from "@tensorflow/tfjs-node"
import nsfw from "nsfwjs"
import https from 'https'
//import axios from 'axios'


/**
 * 一个很简单的插件。
 * 这里提供了两种操作思路，一种是官方示例使用的axios方法，另一种是nodejs内置https.get方法。我认为https.get()的操作思路与自动扫描二维码类似，所以使用了https.get()
 * 详见https://www.npmjs.com/package/nsfwjs#node-js-app
 * 如果同时使用自动扫描二维码和自动色图评分，或许你应该在图片处理上共用一套逻辑。
 * 实测bot内存占用多次超过1G，这是pm2默认的512M分分钟自动重启的节奏。
 */
export class nsfwImageCheck extends plugin {
  constructor() {
    super({
      name: '自动色图评分',
      dsc: '简单开发示例',
      event: 'message',
      priority: 5050,
      rule: [
        {
          fnc: 'nsfwImageCheck'
        }
      ]
    })
  }

  async nsfwImageCheck() {
    // 检查消息类型
    // console.log('debug', this.e.message)
    if (this.e.message[0].type !== 'image' || !this.e.message[0].url) {
      return false
    }
    const imageUrl = this.e.message[0].url
    const regex = /-(\w{32})\//
    const hash = imageUrl.match(regex)[1]
    if (await redis.exists(`Yz:nsfwCheck:${hash}`)) {
      //console.log('[二维码扫描]重置缓存时间')
      await redis.expire(`Yz:nsfwCheck:${hash}`, 36 * 60 * 60)
      return false
    }

    const buffer = await getImageBuffer(imageUrl)
    const uint8Array = new Uint8Array(buffer)

    // const pic = await axios.get(imageUrl, {
    //   responseType: 'arraybuffer',
    // })

    const model = await nsfw.load()

    const image = await tf.node.decodeImage(uint8Array, 3)

    // const image = await tf.node.decodeImage(pic.data,3)

    const predictions = await model.classify(image)
    image.dispose() // 张量的内存必须显式地进行管理（仅仅使 tf.Tensor 超出范围不足以释放其内存）。意思是别删掉这一行！

    console.log(predictions)

    if (predictions[0].className === 'Hentai') {
      this.e.reply(`好涩 (*/ω\\*) ，Hentai分数：${predictions[0].probability}`)
    } else if (predictions[0].className === 'Porn') {
      this.e.reply(`太变态啦，这是能发出来的嘛？，色情概率：${predictions[0].probability}`)
    } else if (predictions[0].className === 'Sexy') {
      this.e.reply(`好性感，依米也可以哦，涩度：${predictions[0].probability}`)
    } else {
      await redis.set(`Yz:nsfwCheck:${hash}`, '0', { EX: 24 * 60 * 60 })
      return false
    }
    return true
  }
}

async function getImageBuffer(imageUrl) {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Request failed with status code ${response.statusCode}`))
        return
      }

      const chunks = []

      response.on('data', (chunk) => {
        chunks.push(chunk)
      })

      response.on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve(buffer)
      })

      response.on('error', (error) => {
        reject(new Error(`Resource download failed with error code ${error}`))
      })
    })
  })
}