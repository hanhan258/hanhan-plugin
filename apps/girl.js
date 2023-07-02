import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'oicq'

export class girl extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨Girl',
      /** 功能描述 */
      dsc: '憨憨Girl',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?(jk|JK)$',
          /** 执行方法 */
          fnc: 'jk'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(黑丝|hs)$',
          /** 执行方法 */
          fnc: 'hs'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(白丝|bs)$',
          /** 执行方法 */
          fnc: 'bs'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(写真|xz)$',
          /** 执行方法 */
          fnc: 'xz'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(小姐姐|xjj)$',
          /** 执行方法 */
          fnc: 'xjj'
        }
      ]
    })
  }

  // 小姐姐
  async xjj (e) {
    // 发送消息
    await this.reply(segment.image('http://api.yujn.cn/api/yangyan.php?'))
    return true // 返回true 阻挡消息不再往下
  }

  // JK
  async jk (e) {
    // 发送消息
    await this.reply(segment.image('http://api.yujn.cn/api/jk.php??'))
    return true // 返回true 阻挡消息不再往下
  }

  // 黑丝
  async hs (e) {
    // 发送消息
    // http://api.yujn.cn/api/heisi.php?
    await this.reply(segment.image('http://shanhe.kim/api/tu/hs.php'))
    return true // 返回true 阻挡消息不再往下
  }

  // 白丝
  async bs (e) {
    // 发送消息
    await this.reply(segment.image('http://api.yujn.cn/api/baisi.php?'))
    return true // 返回true 阻挡消息不再往下
  }

  // 写真
  async xz (e) {
    // 发送消息
    await this.reply(segment.image('http://api.yujn.cn/api/xiezhen.php?type=image'))
    return true // 返回true 阻挡消息不再往下
  }
}
