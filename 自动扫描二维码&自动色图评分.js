import plugin from '../../lib/plugins/plugin.js'
import Jimp from "jimp"
import jsQR from "jsqr"
import tf from "@tensorflow/tfjs-node"
import nsfw from "nsfwjs"
import https from 'https'

/**
 * 一个很简单的插件，全靠cv都能写出来，一看就知道作者很菜对吧。
 * 实测使用本插件可能很容易超出PM2默认512M内存限制，您应该自己思考是否使用本插件。
 * 可以尝试将config/pm2/pm2.json里面的max_memory_restart字段的值改成1G，例如"max_memory_restart": "1G"
 */
export class autoCheck extends plugin {
  constructor() {
    super({
      name: '自动扫描&评分',
      dsc: '简单开发示例',
      event: 'message',
      priority: 5000,
      rule: [
        {
          fnc: 'autoCheck'
        }
      ]
    })
  }

  async autoCheck() {
    //检查消息类型
    //console.log('debug', this.e.message)
    if (this.e.message[0].type !== 'image' || !this.e.message[0].url) {
      return false
    }

    const imageUrl = this.e.message[0].url
    const regex = /-(\w{32})\//
    const hash = imageUrl.match(regex)[1]

    if (await redis.exists(`Yz:autoCheck:${hash}`)) {
      //console.log('[二维码扫描]重置缓存时间')
      await redis.expire(`Yz:autoCheck:${hash}`, 48 * 60 * 60)
      return false
    } else if (await redis.exists('Yz:autoCheckLock')) {
      //console.log('[自动扫描&评分]当前队列存在待处理图片')
      return false
    }

    await redis.set('Yz:autoCheckLock', '1', { EX: 60 })

    const buffer = await getImageBuffer(imageUrl)

    if (!await this.nsfwImageCheck(buffer) && !await this.qrcodeScan(buffer)) {
      await redis.set(`Yz:autoCheck:${hash}`, '0', { EX: 36 * 60 * 60 })
      await redis.del('Yz:autoCheckLock')
      return false
    } else {
      await redis.del('Yz:autoCheckLock')
      return true
    }
  }

  async nsfwImageCheck(buffer) {
    const uint8Array = new Uint8Array(buffer)
    const model = await nsfw.load()
    const image = await tf.node.decodeImage(uint8Array, 3)
    const predictions = await model.classify(image)
    image.dispose()
    console.log(predictions)

    if (predictions[0].className === 'Hentai') {
      this.e.reply(`好涩 (*/ω\\*) ，Hentai分数：${predictions[0].probability}`, true)
    } else if (predictions[0].className === 'Porn') {
      this.e.reply(`太变态啦，这是能发出来的嘛？，色情概率：${predictions[0].probability}`, true)
    } else if (predictions[0].className === 'Sexy') {
      this.e.reply(`好性感，依米也可以哦，涩度：${predictions[0].probability}`, true)
    } else {
      return false
    }
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

    //console.log(imageData)
    const code = jsQR(imageData, width, height, { dontInvert: true })

    if (code?.data) {
      //console.log("Found QR code", code)
      this.e.reply(`二维码扫描：${code.data}`, true)
      return true
    } else {
      return false
    }
  }
}

async function getImageBuffer(imageUrl) {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, async (response) => {
      if (response.statusCode !== 200) {
        await redis.del('Yz:autoCheckLock')
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

      response.on('error', async (error) => {
        await redis.del('Yz:autoCheckLock')
        reject(new Error(`Resource download failed with error code ${error}`))
      })
    })
  })
}