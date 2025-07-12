import plugin from '../../../lib/plugins/plugin.js'

export default class JsonCardPlugin extends plugin {
  constructor() {
    super({
      name: '憨憨JSON卡片',
      dsc: '发送原始JSON消息卡片',
      event: 'message',
      priority: 50,
      rule: [
        {
          reg: '^#json\\s*([\\s\\S]+)$',
          fnc: 'sendJson',
          dsc: '发送json卡片'
        }
      ]
    })
  }

  async sendJson(e) {
    const jsonString = e.msg.match(this.rule[0].reg)[1].trim()

    if (!jsonString) {
      return e.reply('JSON内容不能为空，请在 #json 命令后输入内容。', true)
    }

    let jsonData
    try {
      jsonData = JSON.parse(jsonString)
    } catch (error) {
      logger.error(`[JSON卡片] 用户 ${e.sender.nickname}(${e.user_id}) 发送了无效的JSON:`, jsonString)
      // 向用户发送友好的错误提示
      return e.reply(`JSON格式错误，请检查！\n错误信息：${error.message}`, true)
    }

    try {
      await e.reply(segment.json(jsonData))
    } catch (err) {
      logger.error(`[JSON卡片] 发送失败: `, err)
      await e.reply(`卡片消息发送失败，可能是消息内容不符合规范。\n错误: ${err.message}`)
    }

    return true // 阻止事件继续传递
  }
}