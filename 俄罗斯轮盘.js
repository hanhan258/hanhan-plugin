import plugin from '../../lib/plugins/plugin.js'

export class RussiaRoundPlatePlugin extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨小功能',
      /** 功能描述 */
      dsc: '憨憨写的无用小功能',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?(开启俄罗斯轮盘|开盘|开启轮盘|开启转盘|俄罗斯轮盘)$',
          /** 执行方法 */
          fnc: 'start'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?开枪$',
          /** 执行方法 */
          fnc: 'shoot'
        }
      ]
    })
  }

  async start (e) {
    if (!e.isGroup) {
      await e.reply('当前不在群聊里')
      return false
    }
    let groupId = e.group_id
    let groupLock = await redis.get(`HANHAN:ELS:${groupId}`)
    if (!groupLock) {
      let bulletNum = Math.floor(Math.random() * 5) + 5
      await redis.set(`HANHAN:ELS:${groupId}`, bulletNum + '', { EX: 10 * 60 * 1000 })
      await e.reply(`当前群俄罗斯轮盘已开启！\n弹夹有【${bulletNum}】发子弹。\n请发送#开枪 参与游戏`)
    } else {
      await e.reply('当前群俄罗斯轮盘正在进行中！\n请发送#开枪 参与游戏')
    }
  }

  async shoot (e) {
    if (!e.isGroup) {
      return false
    }
    let groupId = e.group_id
    let leftBullets = await redis.get(`HANHAN:ELS:${groupId}`)
    if (!leftBullets) {
      return false
    }
    let username = e.sender.card || e.sender.nickname
    leftBullets = parseInt(leftBullets)
    leftBullets--
    if (leftBullets <= 0 || Math.random() < 1 / leftBullets) {
      let group = await Bot.pickGroup(groupId)
      let time = Math.floor(Math.random() * 30) * 60
      await group.muteMember(e.sender.user_id, time)
      await e.reply(`【${username}】开了一枪，枪响了。\n恭喜【${username}】被禁言${time}秒\n本轮游戏结束。请使用#开盘 开启新一轮游戏`)
      await redis.del(`HANHAN:ELS:${groupId}`)
    } else {
      await redis.set(`HANHAN:ELS:${groupId}`, leftBullets + '', { EX: 10 * 60 * 1000 })
      await e.reply(`【${username}】开了一枪，没响。\n还剩【${leftBullets}】发子弹`)
    }
  }
}
