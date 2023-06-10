import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'

export class manage extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨配置',
      /** 功能描述 */
      dsc: '憨憨配置',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          reg: '^#憨憨设置(Ping|ping)(Token|token)',
          fnc: 'setPingToken',
        }
      ]
    })
  }

  // 设置PingToken
  async setPingToken (e) {
    if (!this.e.isMaster) {
      e.reply('需要主人才能设置捏~')
      return false
    } 
    this.setContext('savePingToken')
    await this.reply('请前往 https://ipinfo.io 注册账号获取token，并发送，设置好之后请重启', true)
    return false
  }

  async savePingToken () {
    if (!this.e.msg) return
    let token = this.e.msg
    console.log(token)
    if (token.length != 14) {
      await this.reply('PingToken错误', true)
      this.finish('savePingToken')
      return
    }
    // todo
    Config.pingToken = token
    await this.reply('PingToken设置成功', true)
    this.finish('savePingToken')
  }
  
}
