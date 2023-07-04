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
          reg: '^#憨憨设置(Ping|ping)(Token|token)$',
          fnc: 'setPingToken'
        },
        {
          reg: '^(#憨憨|#)设置(tmdb|TMDB) key=(.*)$',
          fnc: 'settmdbkey'
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

  async settmdbkey (e) {
    if (!this.e.isMaster) {
      e.reply('需要主人才能设置捏~')
      return false
    }
    this.setContext('saveTmdbKey')
    await this.reply('未检测到key！请前往 https://developer.themoviedb.org/docs 注册账号，使用 #憨憨设置tmdb key 命令进行设置', true)
    return false
  }

  async saveTmdbKey (e) {
    console.log('[用户命令]', e.msg)
    let token = e.msg.replace(/^(#憨憨|#)设置(tmdb|TMDB) key=/, '').trim()
    if (token.length != 211) {
      await this.reply('tmdb key错误', true)
      this.finish('settmdbkey')
      return
    }
    // todo
    Config.tmdbkey = token
    await this.reply('tmdb key设置成功', true)
    this.finish('settmdbkey')
  }
}
