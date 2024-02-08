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
          fnc: 'startELSGame'
        },
        {
          reg: '^#?开枪$',
          fnc: 'shoot'
        },
        {
          reg: '^#?结束游戏$',
          fnc: 'stopELSGame'
        }, {
          reg: '^#?当前子弹$',
          fnc: 'nowBullet'
        }
      ]
    })
  }

  async startELSGame (e) {
    if (!e.isGroup) {
      e.reply('当前不在群聊里')
      return false
    }
    let groupId = e.group_id
    // 判断是否已经开启了俄罗斯轮盘
    if (await redis.exists(`HANHAN:ELS2:${groupId}`) === 1) {
      e.reply('当前群俄罗斯轮盘正在进行中！\n请发送#开枪 参与游戏')
      return
    }
    // 随机生成数组，长度从3到8，其中一项为子弹，剩下的为空(0为空，1为子弹)
    let length = Math.floor(Math.random() * 6) + 3
    // 随机指定数组的某一项为子弹，剩下的为空
    let arr = new Array(length).fill(0)
    let target = Math.floor(Math.random() * length)
    arr[target] = 1
    // 记录一下当前的数组
    Bot.logger.mark('arr', arr)
    await redis.set(`HANHAN:ELS2:${groupId}`, JSON.stringify(arr), { EX: 60 * 60 * 24 })
    e.reply(`当前群俄罗斯轮盘已开启！\n弹夹有【${length}】发子弹。\n请发送#开枪 参与游戏`)
  }

  async shoot (e) {
    if (!e.isGroup) {
      e.reply('当前不在群聊里')
      return false
    }
    // 获取一下当前的用户昵称和群id
    let username = e.sender.nickname
    let groupId = e.group_id
    // 判断一下当前群是否开启了俄罗斯轮盘，如果没有开启则开启一下
    if (await redis.exists(`HANHAN:ELS2:${groupId}`) === 0) {
      await this.startELSGame(e)
    }
    // 获取一下当前的数组
    let arr = JSON.parse(await redis.get(`HANHAN:ELS2:${groupId}`))
    // 处理一下高并发问题，如果当前的数组是null，则重新开启一下游戏
    if (arr === null) {
      await redis.del(`HANHAN:ELS2:${groupId}`)
      await this.startELSGame(e)
      return
    }
    if (arr[0] === 0) {
      // 如果当前的数组第一项是0，则表示没响,弹出第一项
      arr.shift()
      // 检查一下是否只剩下一发子弹，如果是则结束游戏
      if (arr.length === 1) {
        e.reply([`【${username}】开了一枪，没响。\n由于只剩一发子弹，本轮游戏结束。\n请使用#开盘 开启新一轮游戏`, segment.image('https://www.loliapi.com/acg/pc/')])
        await redis.del(`HANHAN:ELS2:${groupId}`)
        return
      }
      // 如果不是则继续游戏
      e.reply(`【${username}】开了一枪，没响。\n还剩【${arr.length}】发子弹`)
      await redis.set(`HANHAN:ELS2:${groupId}`, JSON.stringify(arr), { EX: 60 * 60 * 24 })
      return
    }
    // 如果当前的数组第一项是1，则表示响了，结束游戏
    if (arr[0] === 1) {
      let time = Math.floor(Math.random() * 240) + 60
      await e.group.muteMember(e.sender.user_id, time)
      e.reply(`【${username}】开了一枪，枪响了。\n恭喜【${username}】被禁言${time}秒\n本轮游戏结束。请使用#开盘 开启新一轮游戏`)
      await redis.del(`HANHAN:ELS2:${groupId}`)
    }
  }

  async stopELSGame (e) {
    if (!e.isGroup) {
      e.reply('当前不在群聊里')
      return false
    }
    let groupId = e.group_id
    let arr = await redis.exists(`HANHAN:ELS2:${groupId}`)
    if (arr === 0) {
      e.reply('当前群没有开盘')
    } else {
      await redis.del(`HANHAN:ELS2:${groupId}`)
      e.reply('结束成功')
    }
  }

  async nowBullet (e) {
    if (!e.isGroup) {
      e.reply('当前不在群聊里')
      return false
    }
    let groupId = e.group_id
    let arr = JSON.parse(await redis.get(`HANHAN:ELS2:${groupId}`))
    if (!arr) {
      e.reply('当前群没有开盘')
    } else {
      e.reply(`当前还有【${arr.length}】发子弹)`)
    }
  }
}
