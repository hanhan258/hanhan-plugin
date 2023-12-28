import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
const Whitelist_group = Config.buttonWhiteGroups || []
console.log(Whitelist_group)

export class manage extends plugin {
  constructor () {
    super({
      name: '憨憨配置',
      dsc: '憨憨配置',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#憨憨设置(Ping|ping)(Token|token)$',
          fnc: 'setPingToken'
        },
        {
          reg: '^#憨憨设置(tmdb|TMDB) key$',
          fnc: 'settmdbkey'
        },
        {
          reg: '^#憨憨设置按钮白名单$',
          fnc: 'setwhitegroup'
        },
        {
          reg: '^#憨憨删除按钮白名单$',
          fnc: 'delwhitegroup'
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
    await this.reply('请前往 https://ipinfo.io 注册账号获取token，并发送', true)
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

  // 设置tmdkey
  async settmdbkey (e) {
    if (!this.e.isMaster) {
      e.reply('需要主人才能设置捏~')
      return false
    }
    this.setContext('saveTmdbKey')
    await this.reply('请前往 https://developer.themoviedb.org/docs 注册账号获取key，并发送', true)
    return false
  }

  async saveTmdbKey () {
    if (!this.e.msg) return
    let key = this.e.msg
    console.log(key)
    if (key.length != 211) {
      await this.reply('tmdb key错误', true)
      this.finish('saveTmdbKey')
      return
    }
    // todo
    Config.tmdbkey = key
    await this.reply('tmdb key设置成功', true)
    this.finish('saveTmdbKey')
  }

  // 设置whitegroup
  async setwhitegroup (e) {
    if (!this.e.isMaster) {
      e.reply('需要主人才能设置捏~')
      return false
    }
    this.setContext('savewhitegroup')
    await this.reply('请发送群号，格式：机器人Appid-xxxxxx', true)
    return false
  }

  async savewhitegroup () {
    if (!this.e.msg) return
    let key = this.e.msg
    console.log(key)
    if (key.length != 42) {
      await this.reply('群号不正确', true)
      this.finish('savewhitegroup')
      return
    }
    if (Whitelist_group.includes(key)) {
      await this.reply('群号已存在', true)
      this.finish('savewhitegroup')
      return
    }
    Whitelist_group.push(key)
    console.log(Whitelist_group)
    Config.buttonWhiteGroups = Whitelist_group
    await this.reply('按钮白名单群设置成功', true)
    this.finish('savewhitegroup')
  }

  // 设置whitegroup
  async delwhitegroup (e) {
    if (!this.e.isMaster) {
      e.reply('需要主人才能删除捏~')
      return false
    }
    this.setContext('savedelwhitegroup')
    await this.reply('请发送要删除的群号，格式：机器人Appid-xxxxxx', true)
    return false
  }

  async savedelwhitegroup () {
    if (!this.e.msg) return
    let key = this.e.msg
    console.log(key)
    if (key.length != 42) {
      await this.reply('群号不正确', true)
      this.finish('savedelwhitegroup')
      return
    }
    if (!Whitelist_group.includes(key)) {
      await this.reply('群号不存在', true)
      this.finish('savedelwhitegroup')
      return
    }
    const index = Whitelist_group.indexOf(key)

    if (index > -1) {
      Whitelist_group.splice(index, 1)
    }
    console.log(Whitelist_group)
    Config.buttonWhiteGroups = Whitelist_group
    await this.reply('按钮白名单群设置成功', true)
    this.finish('savedelwhitegroup')
  }
}
