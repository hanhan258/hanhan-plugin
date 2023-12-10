import plugin from '../../../lib/plugins/plugin.js'
import { recallSendForwardMsg } from '../utils/common.js'
import fetch from 'node-fetch'

export class morse extends plugin {
  constructor () {
    super({
      name: '憨憨数字',
      dsc: '憨憨数字',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#408$',
          fnc: '408'
        },
        {
          reg: '^#?50033$',
          fnc: '50033'
        },
        {
          reg: '^#?(75946|36518|5670)$',
          fnc: '25508'
        }
      ]
    })
  }

  async 408 (e) {
    e.reply('50033\n75946\n36518\n5670')
  }

  async 50033 (e) {
    let forwardMsgs = []
    forwardMsgs.push(segment.image('http://165.154.133.106:50033/'))
    forwardMsgs.push('http://165.154.133.106:50033/')
    let dec = e.msg
    return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
  }

  async 25508 (e) {
    let url = 'http://api.yujn.cn/api/sese.php?'
    if (e.msg.includes('36518')) {
      url = 'http://api.yujn.cn/api/r18.php?'
    } else if (e.msg.includes('5670')) {
      url = 'https://api.yujn.cn/api/Pixiv.php?'
    }
    let res = await fetch(url).catch((err) => logger.error(err))
    if (!res) {
      logger.error('接口请求失败')
      return await this.reply('接口请求失败')
    }
    console.log(res.url)
    let forwardMsgs = []
    forwardMsgs.push(segment.image(res.url))
    forwardMsgs.push(res.url)
    let dec = e.msg
    return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
  }
}
