import plugin from '../../../lib/plugins/plugin.js'
import xmorse from 'xmorse'

export class morse extends plugin {
  constructor () {
    super({
      name: '憨憨摩斯',
      dsc: '憨憨摩斯',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?(摩斯|莫斯)加密',
          fnc: 'morseEn'
        },
        {
          reg: '^#?(摩斯|莫斯)解密',
          fnc: 'morseDe'
        }
      ]
    })
  }

  // 莫斯加密
  async morseEn (e) {
    let encode = e.msg.replace(/^#?(莫斯|摩斯)加密/, '').trim()
    if (!encode) return e.reply('输入不能为空', true)
    // standart morse
    let result = xmorse.encode(`${encode}`)
    await this.reply(result, true)
  }

  // 莫斯解密
  async morseDe (e) {
    let encode = e.msg.replace(/^#?(莫斯|摩斯)解密/, '').trim()
    if (!encode) return e.reply('输入不能为空', true)
    // standart morse
    let result = xmorse.decode(`${encode}`)
    await this.reply(result, true)
  }
}
