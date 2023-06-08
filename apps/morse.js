import plugin from '../../../lib/plugins/plugin.js'
import xmorse from 'xmorse'

export class morse extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '摩斯',
      /** 功能描述 */
      dsc: '摩斯',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?(摩斯|莫斯)加密',
          /** 执行方法 */
          fnc: 'morseEn'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(摩斯|莫斯)解密',
          /** 执行方法 */
          fnc: 'morseDe'
        }
      ]
    })
  }

  // 莫斯加密
  async morseEn(e) {
    let encode = e.msg.replace(/^#?(莫斯|摩斯)加密/, '').trim()
    // standart morse
    let result = xmorse.encode(`${encode}`);
    await this.reply(result, true)
  }

  // 莫斯解密
  async morseDe(e) {
    let encode = e.msg.replace(/^#?(莫斯|摩斯)解密/, '').trim()
    // standart morse
    let result = xmorse.decode(`${encode}`);
    await this.reply(result, true)
  }
}
