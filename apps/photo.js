import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'oicq'
import axios from 'axios'

export class photo extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨图片类',
      /** 功能描述 */
      dsc: '憨憨图片类',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?天气',
          /** 执行方法 */
          fnc: 'tianqi'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?mc酱',
          /** 执行方法 */
          fnc: 'mc'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?小c酱',
          /** 执行方法 */
          fnc: 'xiaoc'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?兽猫酱',
          /** 执行方法 */
          fnc: 'shoumao'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?买家秀',
          /** 执行方法 */
          fnc: 'buyerShow'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?mt',
          /** 执行方法 */
          fnc: 'mt'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?随机(ai|AI)',
          /** 执行方法 */
          fnc: 'sjai'
        }
      ]
    })
  }

  // 猫羽雫图片天气
  async tianqi (e) {
    let encode = e.msg.replace(/^#?天气/, '').trim()
    // 发送消息
    await this.reply(segment.image(`https://api.caonm.net/api/qqtq/t.php?msg=${encode}&type=img&n=1`), true)

    return true // 返回true 阻挡消息不再往下
  }

  // mc酱
  async mc (e) {
    // 发送消息
    this.reply(segment.image('http://api.caonm.net/api/mc/index.php'))
    return true // 返回true 阻挡消息不再往下
  }

  // 小c酱
  async xiaoc (e) {
    // 发送消息
    this.reply(segment.image('http://api.caonm.net/api/xc/index.php'))

    return true // 返回true 阻挡消息不再往下
  }

  // 兽猫酱
  async shoumao (e) {
    // 接口地址

    // 发送消息
    this.reply(segment.image('http://api.caonm.net/api/smj/index.php'))

    return true // 返回true 阻挡消息不再往下
  }

  // 美腿
  async mt (e) {
    // 发送消息
    this.reply(segment.image('http://lx.linxi.icu/0/'))
    return true // 返回true 阻挡消息不再往下
  }

  // 随机ai
  async sjai (e) {
    // 发送消息
    this.reply(segment.image('http://lx.linxi.icu/0/ai/'))

    return true // 返回true 阻挡消息不再往下
  }

  // 买家秀
  async buyerShow (e) {
    // 接口地址
    let url = 'https://api.dzzui.com/api/imgtaobao?format=json'
    let msg = []
    try {
      let response = await axios.get(url)
      msg.push(segment.image(response.data.imgurl))
      // 发送消息
      this.reply(msg)
    } catch (error) {
      console.error(error)
    }

    return true // 返回true 阻挡消息不再往下
  }
}
