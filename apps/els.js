import plugin from '../../../lib/plugins/plugin.js'

const REDIS_KEY_PREFIX = 'HANHAN:ELS_GAME:'

export class RussiaRoundPlatePlugin extends plugin {
  constructor() {
    super({
      name: '憨憨小游戏-俄罗斯轮盘',
      dsc: '憨憨小游戏-俄罗斯轮盘',
      event: 'message',
      priority: 6,
      rule: [
        { reg: '^#?开启俄罗斯轮盘$', fnc: 'start', dsc: '开启俄罗斯轮盘' },
        { reg: '^#?开枪$', fnc: 'shot', dsc: '开枪' },
        { reg: '^#?结束游戏$', fnc: 'stop', dsc: '结束游戏' },
        { reg: '^#?当前子弹$', fnc: 'showBullet', dsc: '查看当前子弹' }
      ]
    })
  }

  getGameKey(groupId) {
    return `${REDIS_KEY_PREFIX}${groupId}`
  }

  // 开启游戏
  async start(e) {
    if (!e.isGroup) return e.reply('俄罗斯轮盘只能在群聊中开启哦~')

    const gameKey = this.getGameKey(e.group_id)

    if (await redis.get(gameKey)) {
      return e.reply('当前群的俄罗斯轮盘正在进行中！\n请发送 #开枪 参与游戏')
    }

    const bulletCount = Math.floor(Math.random() * 6) + 3 // 弹夹容量3-8
    const bullets = new Array(bulletCount).fill(0)
    const bulletPosition = Math.floor(Math.random() * bulletCount)
    bullets[bulletPosition] = 1 // 放入一颗子弹

    Bot.logger.mark(`[俄罗斯轮盘]群 ${e.group_id} 开始游戏, 弹夹:`, bullets)

    await redis.set(gameKey, JSON.stringify(bullets), { EX: 3600 })

    e.reply(`俄罗斯轮盘已开启！\n弹夹容量【${bulletCount}】发，其中只有一发实弹。\n请发送 #开枪 参与游戏，看看谁是下一个幸运儿！`)
  }

  // 开枪
  async shot(e) {
    if (!e.isGroup) return e.reply('只能在群聊中开枪！')

    const gameKey = this.getGameKey(e.group_id)
    let bullets = await redis.get(gameKey)

    if (!bullets) {
      e.reply('本群游戏尚未开始，已为你自动开启新一轮！')
      return this.start(e)
    }

    bullets = JSON.parse(bullets)

    const shotResult = bullets.shift()

    if (shotResult === 0) { // 没响
      // 检查是否只剩最后一发（必中）
      if (bullets.length === 1) {
        e.reply([
          segment.at(e.user_id),
          ` 你开了一枪，无事发生。\n但弹夹里只剩下最后一发，那必定是...留给下一位勇士了！\n本轮游戏结束！`
        ])
        await redis.del(gameKey)
      } else {
        // 更新Redis中的弹夹状态
        await redis.set(gameKey, JSON.stringify(bullets), { EX: 3600 })
        e.reply([segment.at(e.user_id), ` 你开了一枪，无事发生。\n弹夹里还剩【${bullets.length}】发子弹。`])
      }
    } else { // 响了
      const muteTime = Math.floor(Math.random() * 240) + 60 // 禁言60-300秒
      try {
        await e.group.muteMember(e.user_id, muteTime)
        e.reply([
          segment.at(e.user_id),
          ` 只听“砰”的一声，你，中弹了！\n恭喜你获得 ${muteTime}秒 的冷静期。\n本轮游戏结束，发送 #开启俄罗斯轮盘 可开启新游戏。`,
          segment.image('https://www.loliapi.com/acg/pc/')
        ])
      } catch (err) {
        logger.error(`[俄罗斯轮盘] 禁言失败`, err)
        e.reply(`砰！你中弹了！但管理员权限不足，无法将你禁言，算你走运！\n本轮游戏结束。`)
      } finally {
        // 游戏结束，删除key
        await redis.del(gameKey)
      }
    }
  }

  // 结束游戏
  async stop(e) {
    if (!e.isGroup) return

    if (!e.member.is_admin && !e.member.is_owner) {
      return e.reply('只有群主和管理员才能强制结束游戏哦~')
    }

    const gameKey = this.getGameKey(e.group_id)

    if (await redis.del(gameKey)) {
      e.reply('游戏已由管理员强制结束。')
    } else {
      e.reply('当前群没有正在进行的游戏。')
    }
  }

  // 查看剩余子弹
  async showBullet(e) {
    if (!e.isGroup) return

    const gameKey = this.getGameKey(e.group_id)
    const bulletsJson = await redis.get(gameKey) // 直接 get

    if (!bulletsJson) {
      return e.reply('当前群没有正在进行的游戏。')
    }

    const bullets = JSON.parse(bulletsJson)
    e.reply(`弹夹里还剩下【${bullets.length}】发子弹，你敢开枪吗？`)
  }
}