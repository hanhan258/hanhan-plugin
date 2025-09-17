import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'

const NO_ADMIN_PROMPT = '需要主人才能设置捏~'

export class manage extends plugin {
  constructor() {
    super({
      name: '憨憨配置',
      dsc: '憨憨配置',
      event: 'message',
      priority: 6,
      rule: [
        { reg: '^#憨憨设置(Ping|ping)token$', fnc: 'setPingToken', dsc: '设置PingToken' },
        { reg: '^#憨憨设置(tmdb|TMDB) key$', fnc: 'setTmdbKey', dsc: '设置TMDB Key' },
        { reg: '^#(关闭|开启)(tmdb|TMDB)(R18|r18|瑟瑟)$', fnc: 'setTmdbR18', dsc: '开关TMDB R18' },
        { reg: '^#(关闭|开启)(查看|检索)(bt|BT|种子|磁力)$', fnc: 'setBt', dsc: '开关BT检索' },
        { reg: '^#憨憨设置按钮白名单$', fnc: 'setButtonWhiteGroup', dsc: '设置按钮白名单' },
        { reg: '^#憨憨删除按钮白名单$', fnc: 'delButtonWhiteGroup', dsc: '删除按钮白名单' },
        { reg: '^#(关闭|开启)按钮白名单$', fnc: 'setButton', dsc: '开关按钮白名单' },
        { reg: '^#(关闭|开启)视频$', fnc: 'setVideo', dsc: '开关视频' },
        { reg: '^#?管理类菜单$', fnc: 'adminMenu', dsc: '管理类菜单' }
      ]
    })

    // 配置项映射表
    this.featureMap = {
      'tmdbR18': {
        config: 'tmdb_r18',
        msgOn: '已关闭安全等级内容',
        msgOff: '已启动安全等级内容'
      },
      'linkbt': {
        config: 'linkbt',
        msgOn: '已关闭BT内容发现',
        msgOff: '已启动BT内容发现'
      },
      '按钮白名单': {
        config: 'enableButton',
        msgOn: '已打开按钮白名单',
        msgOff: '已关闭按钮白名单'
      },
      '视频': {
        config: 'enableVideo',
        msgOn: '已打开发送视频',
        msgOff: '已关闭发送视频'
      }
    }

    // 令牌验证配置
    this.tokenConfigs = {
      'pingToken': {
        context: 'savePingToken',
        prompt: '请前往 https://ipinfo.io 注册账号获取token，并发送',
        length: 14,
        errorMsg: 'PingToken错误',
        successMsg: 'PingToken设置成功'
      },
      'tmdbkey': {
        context: 'saveTmdbKey',
        prompt: '请前往 https://developer.themoviedb.org/docs 注册账号获取key，并发送',
        length: 211,
        errorMsg: 'tmdb key错误',
        successMsg: 'tmdb key设置成功'
      }
    }
  }

  async helps(e) {
    if (e.bot.config?.markdown?.type) { return await e.reply('按钮菜单') }
  }

  // 检查管理员权限
  checkMaster(e) {
    if (!e.isMaster) {
      e.reply(NO_ADMIN_PROMPT)
      return false
    }
    return true
  }

  // 通用设置令牌方法
  async setToken(tokenType) {
    if (!this.checkMaster(this.e)) return false

    const config = this.tokenConfigs[tokenType]
    this.setContext(config.context)
    await this.reply(config.prompt, true)
    return false
  }

  // 设置PingToken
  async setPingToken() {
    return this.setToken('pingToken')
  }

  // 设置tmdkey
  async settmdbkey() {
    return this.setToken('tmdbkey')
  }

  // 通用保存令牌方法
  async saveToken(tokenType) {
    if (!this.e.msg) return

    const token = this.e.msg
    const config = this.tokenConfigs[tokenType]

    if (token.length != config.length) {
      await this.reply(config.errorMsg, true)
      this.finish(config.context)
      return
    }

    Config[tokenType] = token
    await this.reply(config.successMsg, true)
    this.finish(config.context)
  }

  // 保存PingToken
  async savePingToken() {
    return this.saveToken('pingToken')
  }

  // 保存TmdbKey
  async saveTmdbKey() {
    return this.saveToken('tmdbkey')
  }

  // 通用开关功能方法
  async toggleFeature(e) {
    if (!this.checkMaster(e)) return false

    const reg = /(关闭|开启)(.*?)(?:$|R18|r18|瑟瑟)/
    const match = e.msg.match(reg)

    if (!match) return false

    const action = match[1]
    let feature = match[2]

    // 特殊情况处理，根据消息内容判断功能
    if (e.msg.includes('tmdb') || e.msg.includes('TMDB')) {
      feature = 'tmdbR18'
    } else if (e.msg.includes('bt') || e.msg.includes('BT') || e.msg.includes('种子') || e.msg.includes('磁力')) {
      feature = 'linkbt'
    }

    const featureConfig = this.featureMap[feature]
    if (!featureConfig) return false

    const isEnabled = action === '开启'
    Config[featureConfig.config] = isEnabled

    await this.reply(isEnabled ? featureConfig.msgOn : featureConfig.msgOff, true)
    return false
  }

  // 通用白名单操作方法
  async manageWhitelist(action, contextName, prompt) {
    if (!this.checkMaster(this.e)) return false

    this.setContext(contextName)
    await this.reply(prompt, true)
    return false
  }

  // 设置whitegroup
  async setwhitegroup() {
    return this.manageWhitelist(
      'add',
      'savewhitegroup',
      '请发送群号，格式：机器人Appid-xxxxxx'
    )
  }

  // 删除whitegroup
  async delwhitegroup() {
    return this.manageWhitelist(
      'remove',
      'savedelwhitegroup',
      '请发送要删除的群号，格式：机器人Appid-xxxxxx'
    )
  }

  // 通用保存白名单方法
  async processWhitelist(action) {
    if (!this.e.msg) return

    const key = this.e.msg

    if (key.length != 42) {
      await this.reply('群号不正确', true)
      this.finish(action === 'add' ? 'savewhitegroup' : 'savedelwhitegroup')
      return
    }

    const whitelist = Config.buttonWhiteGroups || []
    const exists = whitelist.includes(key)

    if (action === 'add') {
      if (exists) {
        await this.reply('群号已存在', true)
      } else {
        whitelist.push(key)
        Config.buttonWhiteGroups = whitelist
        await this.reply('按钮白名单群设置成功', true)
      }
      this.finish('savewhitegroup')
    } else {
      if (!exists) {
        await this.reply('群号不存在', true)
      } else {
        const index = whitelist.indexOf(key)
        whitelist.splice(index, 1)
        Config.buttonWhiteGroups = whitelist
        await this.reply('按钮白名单群删除成功', true)
      }
      this.finish('savedelwhitegroup')
    }
  }
  async setVideo(e) {
    return this.toggleFeature(e);
  }
  async setBt(e) {
    return this.toggleFeature(e);
  }
  async setButton(e) {
    return this.toggleFeature(e);
  }
  async setTmdbR18(e) {
    return this.toggleFeature(e);
  }
  async setButtonWhiteGroup(e) {
    return this.setwhitegroup(e);
  }
  async delButtonWhiteGroup(e) {
    return this.delwhitegroup(e);
  }

  // 保存白名单群号
  async savewhitegroup() {
    return this.processWhitelist('add')
  }

  // 保存删除的白名单群号
  async savedelwhitegroup() {
    return this.processWhitelist('remove')
  }

  // 统一回复方法
  async reply(message, quote = false) {
    return await this.e.reply(message, quote)
  }
}
