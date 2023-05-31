import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'

export class morse extends plugin {
  constructor () {
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
  async morseEn (e) {
    let sendmsg = []
    let encode = e.msg.replace(/^#?(莫斯|摩斯)加密/, '').trim()
    // 下面接口二选一
    // https://xiaobapi.top/api/xb/api/mesdm.php?type=en&msg=${encode}
    let url = `http://www.plapi.tk/api/mesdm.php?type=%E5%8A%A0%E5%AF%86&msg=${encode}`
    let response = await fetch(url) // 调用接口获取数据
    let res = await response.text()
    sendmsg.push(res)
    await this.reply(sendmsg, true)
  }

  // 莫斯解密
  async morseDe (e) {
    let sendmsg = []

    let encode = e.msg.replace(/^#?(莫斯|摩斯)解密/, '').trim()
    // 下面接口二选一
    // https://xiaobapi.top/api/xb/api/mesdm.php?type=de&msg=${encode}
    let url = `http://www.plapi.tk/api/mesdm.php?type=%E8%A7%A3%E5%AF%86&msg=${encode}`
    let response = await fetch(url) // 调用接口获取数据
    let res = await response.text()
    sendmsg.push(res)
    await this.reply(sendmsg, true)
  }
}
