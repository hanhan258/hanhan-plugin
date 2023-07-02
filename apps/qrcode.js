import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'oicq'
import { Config } from '../utils/config.js'
import puppeteer from 'puppeteer'

const chromeF = Config.chromeF

export class qrcode extends plugin {
  constructor () {
    super({
      name: '憨憨转二维码',
      dsc: '憨憨转二维码',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?转二维码(.*)$',
          fnc: 'ewm'
        },
        {
          reg: '^#?转两层二维码(.*)$',
          fnc: 'ewm2'
        }
      ]
    })
  }

  async ewm (e) {
    logger.info('[用户命令]', e.msg)
    let msg = e.msg.replace('#转二维码', '').trim()
    msg = msg.split(' ')
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromeF
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 150, height: 150 })
    await page.goto('https://qun.qq.com/qrcode/index?data=' + msg, { waitUntil: 'networkidle2' })
    const qrcodePath = 'qrcode.png'
    await page.screenshot({ path: qrcodePath })
    await browser.close()
    let QCmsg = [
      segment.image(`file:///${qrcodePath}`)
    ]
    await this.reply(QCmsg, true /* { recallMsg: e.isGroup ? 50 : 0 } */)
  }

  async ewm2 (e) {
    logger.info('[用户命令]', e.msg)
    let msg = e.msg.replace('#转两层二维码', '').trim()
    msg = msg.split(' ')
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromeF
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 250, height: 250 })
    await page.goto('https://api.qrserver.com/v1/create-qr-code/?size=200%C3%97200&margin=10&data=' + 'https://qun.qq.com/qrcode/index?data=' + msg, { waitUntil: 'networkidle2' })
    const qrcodePath = 'qrcode.png'
    await page.screenshot({ path: qrcodePath })
    await browser.close()
    let QCmsg = [
      segment.image(`file:///${qrcodePath}`)
    ]
    await this.reply(QCmsg, true /* { recallMsg: e.isGroup ? 50 : 0 } */)
  }
}
