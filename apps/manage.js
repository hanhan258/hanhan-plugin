import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'

let No_admin_prompts = '需要主人才能设置捏~'

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
          reg: '^#(关闭|开启)(tmdb|TMDB)(R18|r18|瑟瑟)$',
          fnc: 'enable_tmdb_r18'
        },
        {
          reg: '^#憨憨设置按钮白名单$',
          fnc: 'setwhitegroup'
        },
        {
          reg: '^#憨憨删除按钮白名单$',
          fnc: 'delwhitegroup'
        },
        {
          reg: '^#(关闭|开启)按钮白名单$',
          fnc: 'enableWhiteGroup'
        },
        {
          reg: '^#(关闭|开启)视频$',
          fnc: 'enableVideo'
        }
      ]
    })
  }

  // 设置PingToken
  async setPingToken (e) {
    if (!this.e.isMaster) {
      e.reply(No_admin_prompts)
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
      e.reply(No_admin_prompts)
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

  // 关闭开启tmdb瑟瑟
  async enable_tmdb_r18 (e) {
    if (!this.e.isMaster) {
      e.reply(No_admin_prompts)
      return false
    }
    const reg = /(关闭|开启)/
    const match = e.msg.match(reg)
    if (match) {
      const action = match[1]
      if (action === '关闭') {
        Config.tmdb_r18 = false // 关闭
        await this.reply('已启动安全等级内容', true)
      } else {
        Config.tmdb_r18 = true // 打开
        await this.reply('已关闭安全等级内容', true)
      }
    }
    return false
  }

  // 设置whitegroup
  async setwhitegroup (e) {
    if (!this.e.isMaster) {
      e.reply(No_admin_prompts)
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
    const Whitelist_group = Config.buttonWhiteGroups || []
    if (Whitelist_group.includes(key)) {
      await this.reply('群号已存在', true)
      this.finish('savewhitegroup')
      return
    }
    Whitelist_group.push(key)
    Config.buttonWhiteGroups = Whitelist_group
    await this.reply('按钮白名单群设置成功', true)
    this.finish('savewhitegroup')
  }

  // 删除whitegroup
  async delwhitegroup (e) {
    if (!this.e.isMaster) {
      e.reply(No_admin_prompts)
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
    const Whitelist_group = Config.buttonWhiteGroups
    if (!Whitelist_group.includes(key)) {
      await this.reply('群号不存在', true)
      this.finish('savedelwhitegroup')
      return
    }
    const index = Whitelist_group.indexOf(key)

    if (index > -1) {
      Whitelist_group.splice(index, 1)
    }
    Config.buttonWhiteGroups = Whitelist_group
    await this.reply('按钮白名单群删除成功', true)
    this.finish('savedelwhitegroup')
  }

  // 开启关闭按钮白名单
  async enableWhiteGroup (e) {
    if (!this.e.isMaster) {
      e.reply(No_admin_prompts)
      return false
    }
    const reg = /(关闭|开启)/
    const match = e.msg.match(reg)
    if (match) {
      const action = match[1]
      if (action === '关闭') {
        Config.enableButton = false // 关闭
        await this.reply('已关闭按钮白名单', true)
      } else {
        Config.enableButton = true // 打开
        await this.reply('已打开按钮白名单', true)
      }
    }
    return false
  }

  // 开启关闭视频
  async enableVideo (e) {
    if (!this.e.isMaster) {
      e.reply(No_admin_prompts)
      return false
    }
    const reg = /(关闭|开启)/
    const match = e.msg.match(reg)
    if (match) {
      const action = match[1]
      if (action === '关闭') {
        Config.enableVideo = false // 关闭
        await this.reply('已关闭发送视频', true)
      } else {
        Config.enableVideo = true // 打开
        await this.reply('已打开发送视频', true)
      }
    }
    return false
  }
}
