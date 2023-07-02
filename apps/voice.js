import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'oicq'

export class voice extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨语音类',
      /** 功能描述 */
      dsc: '憨憨语音类',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?随机唱鸭$',
          /** 执行方法 */
          fnc: 'sjcy'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?随机坤坤$',
          /** 执行方法 */
          fnc: 'sjkk'
        }
      ]
    })
  }

  // 随机唱鸭
  async sjcy (e) {
    // 发送消息
    await this.reply(segment.record('http://api.yujn.cn/api/changya.php?type=mp3'))
    return true // 返回true 阻挡消息不再往下
  }

  // 随机坤坤
  async sjkk (e) {
    // 发送消息
    await this.reply(segment.record('http://api.yujn.cn/api/sjkunkun.php?'))
    return true // 返回true 阻挡消息不再往下
  }
}
