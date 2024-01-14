import plugin from '../../../lib/plugins/plugin.js'

export class RussiaRoundPlatePlugin extends plugin {
  constructor () {
    super({
      name: '憨憨小游戏-俄罗斯轮盘',
      dsc: '憨憨小游戏-俄罗斯轮盘',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?(开启俄罗斯轮盘|开盘|开启轮盘|开启转盘|俄罗斯轮盘)$',
          fnc: 'start'
        },
        {
          reg: '^#?开枪$',
          fnc: 'shoot'
        },
        {
          reg: '^#?结束游戏$',
          fnc: 'stopShoop'
        }, {
          reg: '^#?当前子弹$',
          fnc: 'nowBullet'
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
      let totalBullets = Math.floor(Math.random() * 6) + 3
      let realBullets = Math.floor(Math.random() * totalBullets)
      let bulletNum = JSON.stringify([totalBullets, realBullets])
      await redis.set(`HANHAN:ELS:${groupId}`, bulletNum + '', { EX: 10 * 60 * 1000 })
      await e.reply(`当前群俄罗斯轮盘已开启！\n弹夹有【${totalBullets}】发子弹。\n请发送#开枪 参与游戏`)
    } else {
      await e.reply('当前群俄罗斯轮盘正在进行中！\n请发送#开枪 参与游戏')
    }
  }

  async shoot (e) {
    if (!e.isGroup) {
      await e.reply('当前不在群聊里')
      return false
    }
    let groupId = e.group_id
    let leftBullets = JSON.parse(await redis.get(`HANHAN:ELS:${groupId}`))
    if (!leftBullets) {
      await this.start(e)
      leftBullets = JSON.parse(await redis.get(`HANHAN:ELS:${groupId}`))
    }
    let username = e.sender.card || e.sender.nickname || (e.bot.config?.markdown ? `<@${e.sender.user_openid}>` : e.sender.user_openid)
    let totalBullets = leftBullets[0]
    let realBullets = leftBullets[1]
    totalBullets--
    realBullets--
    if (realBullets < 1) {
      let group = e.group || (await e.bot.pickGroup(groupId))
      let max = 300
      let min = 60
      let time = Math.floor(Math.random() * (max - min + 1)) + min
      let msg
      try {
        await group.muteMember(e.sender.user_id, time)
        msg = `【${username}】开了一枪，枪响了。\n恭喜【${username}】被禁言${time}秒\n本轮游戏结束。请使用#开盘 开启新一轮游戏`
      } catch (error) {
        msg = `【${username}】开了一枪，枪响了。\n未获得管理员权限，跳过禁言环节。\n本轮游戏结束。请使用#开盘 开启新一轮游戏`
      }
      msg = (username != (e.sender.card | e.sender.nickname)) ? `【${username}】开了一枪，枪响了。\npia~\n本轮游戏结束。请使用#开盘 开启新一轮游戏` : msg
      await e.reply(msg)
      await redis.del(`HANHAN:ELS:${groupId}`)
    } else {
      leftBullets = JSON.stringify([totalBullets, realBullets])
      await redis.set(`HANHAN:ELS:${groupId}`, leftBullets + '', { EX: 10 * 60 * 1000 })
      await e.reply(`【${username}】开了一枪，没响。\n还剩【${totalBullets}】发子弹`)
      // e.reply(`${leftBullets}`)
    }
  }

  async stopShoop (e) {
    if (!e.isGroup) {
      await e.reply('当前不在群聊里')
      return false
    }
    let groupId = e.group_id
    let groupLock = await redis.get(`HANHAN:ELS:${groupId}`)
    // e.reply(groupLock)
    if (!groupLock) {
      e.reply('当前群没有开盘')
    } else {
      await redis.del(`HANHAN:ELS:${groupId}`)
      e.reply('结束成功')
    }
  }

  async nowBullet (e) {
    if (!e.isGroup) {
      await e.reply('当前不在群聊里')
      return false
    }
    let groupId = e.group_id
    let groupLock = await redis.get(`HANHAN:ELS:${groupId}`)
    if (!groupLock) {
      e.reply('当前群没有开盘')
    } else {
      e.reply('当前还有' + groupLock + '发子弹')
    }
  }
}
