import plugin from '../../../lib/plugins/plugin.js'


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
        }
      ]
    })
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
