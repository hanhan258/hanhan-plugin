import plugin from '../../../lib/plugins/plugin.js'

export class urlAndBase extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨编码',
      /** 功能描述 */
      dsc: '憨憨编码',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?(url|URL)编码',
          /** 执行方法 */
          fnc: 'urlEn'
        },
        {
          /** 命令正则匹配 */
          reg: '^#(url|URL)解码',
          /** 执行方法 */
          fnc: 'urlDe'
        },
        {
          /** 命令正则匹配 */
          reg: '^#(base64|Base64)编码',
          /** 执行方法 */
          fnc: 'baseEn'
        },
        {
          /** 命令正则匹配 */
          reg: '^#(base64|Base64)解码',
          /** 执行方法 */
          fnc: 'baseDe'
        }
      ]
    })
  }

  // url编码
  async urlEn (e) {
    let encode = e.msg.replace(/^#?(url|URL)编码/, '').trim()
    let result = encodeURI(encode)
    await this.reply(result, true)
  }

  // url解码
  async urlDe (e) {
    let encode = e.msg.replace(/^#?(url|URL)解码/, '').trim()
    let result = decodeURI(encode)
    await this.reply(result, true)
  }

  // base64编码
  async baseEn (e) {
    let encode = e.msg.replace(/^#?(base64|Base64)编码/, '').trim()
    let result = Buffer.from(encode).toString('base64')
    await this.reply(result, true)
  }

  // base64解码
  async baseDe (e) {
    let encode = e.msg.replace(/^#?(base64|Base64)解码/, '').trim()
    let result = Buffer.from(encode, 'base64').toString()
    await this.reply(result, true)
  }
}
