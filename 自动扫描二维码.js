import plugin from '../../lib/plugins/plugin.js'
import Jimp from "jimp"
import jsQR from "jsqr"

/**
 * 一个很简单的插件，一看就知道作者很菜对吧。
 * 实测使用本插件可能很容易超出PM2默认512M内存限制，主要原因可能在于jimp库处理图片时的内存占用。
 * 您可以尝试将config/pm2/pm2.json里面的max_memory_restart字段的值改成1G，例如"max_memory_restart": "1G"
 */
export class qrcode extends plugin {
  constructor() {
    super({
      name: '自动扫描二维码',
      dsc: '简单开发示例',
      event: 'message',
      priority: 5000,
      rule: [
        {
          fnc: 'qrcodeScan'
        }
      ]
    })
  }

  async qrcodeScan() {
    //检查消息类型
    //console.log('debug', this.e.message)
    // if (this.e.message[0].type !== 'image' || !this.e.message[0].url) {
    //   return false
    // }
    const imageUrl = this.e.message.find(msg => msg.type === 'image')?.url || null
    if (!imageUrl) {
      return false
    }
    //const imageUrl = this.e.message[0].url
    const regex = /-(\w{32})\//
    const hash = imageUrl.match(regex)[1]
    if (await redis.exists(`Yz:qrcode:${hash}`)) {
      console.log('[二维码扫描]不是二维码，重置缓存时间')
      await redis.expire(`Yz:qrcode:${hash}`, 36 * 60 * 60)
      return false
    }
    //cv from https://www.npmjs.com/package/jimp
    const image = await Jimp.read(imageUrl)
    const width = image.getWidth()
    const height = image.getHeight()
    //创建一个数组来存储像素数据，根据JSQR文档 The length of this array should be 4 * width * height
    const imageData = new Uint8ClampedArray(4 * width * height)
    //操作像素。像素通道的位置是连续的，且按照约定的顺序依次存储在数组中。数组中的每四个连续位置可以表示一个完整的像素。
    let index = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const rgba = Jimp.intToRGBA(image.getPixelColor(x, y))
        imageData[index++] = rgba.r // 红色通道
        imageData[index++] = rgba.g // 绿色通道
        imageData[index++] = rgba.b // 蓝色通道
        imageData[index++] = rgba.a // 透明度通道
      }
    }
    // Release memory by setting jimpObj.bitmap to null
    image.bitmap = null
    //console.log(imageData)
    //cv from https://www.npmjs.com/package/jsqr
    const code = jsQR(imageData, width, height, { dontInvert: true })
    if (code?.data) {
      //console.log("Found QR code", code)
      this.e.reply(`二维码扫描：${code.data}`)
      return true
    } else {
      await redis.set(`Yz:qrcode:${hash}`, '0', { EX: 24 * 60 * 60 })
      return false
    }
  }
}
