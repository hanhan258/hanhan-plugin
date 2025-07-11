import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
import fetch from 'node-fetch'

export class voice extends plugin {
  constructor() {
    super({
      name: '憨憨语音类',
      dsc: '憨憨语音类',
      event: 'message',
      priority: 6,
      rule: [
        { reg: '^#?(唱鸭|随机唱鸭)$', fnc: 'changya', dsc: '唱鸭' },
        { reg: '^#?(坤坤语音|随机坤坤)$', fnc: 'kunkun', dsc: '坤坤语音' },
        { reg: '^#?(网易云|随机网易云)$', fnc: 'wyy', dsc: '随机网易云' },
        { reg: '^#?骂我$', fnc: 'mawo', dsc: '骂我' },
        { reg: '^#?(绿茶|随机绿茶)$', fnc: 'lvcha', dsc: '绿茶语音' },
        { reg: '^#?语音类菜单$', fnc: 'voiceMenu', dsc: '语音类菜单' }
      ]
    })
  }

  async helps(e) {
    if (e.bot.config?.markdown?.type) {
      return await this.sendReply('按钮菜单')
    }
  }

  // 随机网易云
  async wyy(e) {
    const maxAttempts = 3 // 最大重试次数
    let attempts = 0 // 当前尝试次数
    let url = 'https://api.yujn.cn/api/sjwyy.php?type=json'

    while (attempts < maxAttempts) {
      try {
        let response = await fetch(url)
        let result = await response.json()

        if (result.code != 200) {
          return this.sendReply('api寄了')
        }

        if (result.id) {
          await this.sendReply(segment.image(result.img))
          await this.sendReply(segment.record(result.url))
          return true
        } else {
          await this.sendReply('随机到vip歌曲了，已自动随机下一首')
          attempts++
        }
      } catch (error) {
        attempts++
      }
    }

    return this.sendReply('已达到最大重试次数，无法获取歌曲。')
  }

  // 处理简单音频请求
  async handleAudio(url) {
    await this.sendReply(segment.record(url))
    await this.is_MD(this.e)
    return true
  }

  // 随机唱鸭
  async changya() {
    return this.handleAudio('http://api.yujn.cn/api/changya.php?type=mp3')
  }

  // 随机坤坤
  async kunkun() {
    return this.handleAudio('http://api.yujn.cn/api/sjkunkun.php?')
  }

  // 随机语音骂人
  async mawo() {
    return this.handleAudio('http://api.yujn.cn/api/maren.php?')
  }

  // 绿茶语音包
  async lvcha() {
    return this.handleAudio('https://api.yujn.cn/api/lvcha.php?')
  }

  // 重命名为sendReply避免与原始reply冲突
  async sendReply(message) {
    return await this.e.reply(message, false, { recallMsg: Config.recall_s })
  }

  async voiceMenu(e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) {
        return false
      }
    }
    if (e.bot.config?.markdown?.type) {
      return await this.sendReply('语音类菜单')
    }
  }
}