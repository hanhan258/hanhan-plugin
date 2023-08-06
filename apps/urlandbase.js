import plugin from '../../../lib/plugins/plugin.js'

export class urlAndBase extends plugin {
  constructor () {
    super({
      name: '憨憨编码',
      dsc: '憨憨编码',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?(url|URL)编码',
          fnc: 'urlEn'
        },
        {
          reg: '^#?(url|URL)解码',
          fnc: 'urlDe'
        },
        {
          reg: '^#?(base64|Base64)编码',
          fnc: 'baseEn'
        },
        {
          reg: '^#?(base64|Base64)解码',
          fnc: 'baseDe'
        }
      ]
    })
  }

  // url编码
  async urlEn (e) {
    let encode = e.msg.replace(/^#?(url|URL)编码/, '').trim()
    if (!encode) return e.reply('输入不能为空', true)
    let result = encodeURI(encode)
    await this.reply(result, true)
  }

  // url解码
  async urlDe (e) {
    let encode = e.msg.replace(/^#?(url|URL)解码/, '').trim()
    if (!encode) return e.reply('输入不能为空', true)
    let result = decodeURI(encode)
    await this.reply(result, true)
  }

  // base64编码
  async baseEn (e) {
    let encode = e.msg.replace(/^#?(base64|Base64)编码/, '').trim()
    if (!encode) return e.reply('输入不能为空', true)
    let result = Buffer.from(encode).toString('base64')
    await this.reply(result, true)
  }

  // base64解码
  async baseDe (e) {
    let encode = e.msg.replace(/^#?(base64|Base64)解码/, '').trim()
    if (!encode) return e.reply('输入不能为空', true)
    let result = Buffer.from(encode, 'base64').toString()
    await this.reply(result, true)
  }
}
