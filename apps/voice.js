import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'

export class voice extends plugin {
  constructor () {
    super({
      name: '憨憨语音类',
      dsc: '憨憨语音类',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?随机唱鸭$',
          fnc: 'sjcy'
        },
        {
          reg: '^#?随机坤坤$',
          fnc: 'sjkk'
        },
        {
          reg: '^#?随机网易云$',
          fnc: 'sjwyy'
        }
      ]
    })
  }

  // 随机网易云
  async sjwyy (e) {
    let url = 'https://api.yujn.cn/api/sjwyy.php?type=json'
    let response = await fetch(url) // 调用接口获取数据
    let result = await response.json()
    if (result.code != 200) {
      return e.reply('api寄了')
    }
    console.log(result)
    if (result.id) {
      await this.reply(segment.image(result.img))
      await this.reply(segment.record(result.url))
    } else {
      this.reply('随机到vip歌曲了，已自动随机下一首')
      this.sjwyy()
    }
  }

  // 随机唱鸭
  async sjcy (e) {
    // 发送消息
    await this.reply(segment.record('http://api.yujn.cn/api/changya.php?type=mp3'))
    return true // 返回true 阻挡消息不再往下
  }

  // 随机坤坤
  async sjkk (e) {
    // 发送消息
    await this.reply(segment.record('http://api.yujn.cn/api/sjkunkun.php?'))
    return true // 返回true 阻挡消息不再往下
  }
}
