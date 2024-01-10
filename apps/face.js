import plugin from '../../../lib/plugins/plugin.js'

export class diaotu extends plugin {
  constructor () {
    super({
      name: '憨憨表情包',
      dsc: '憨憨表情包',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?(坤坤|小黑子|鸡|cxk|鸡脚|鸽鸽|哥哥)$',
          fnc: 'cxk'
        },
        {
          reg: '^(#|/)?随机表情$',
          fnc: 'sjbq'
        },
        {
          reg: '^(#|/)?随机柴郡$',
          fnc: 'cj'
        },
        {
          reg: '^(#|/)?一二布布$',
          fnc: 'yebb'
        },
        {
          reg: '^(#|/)?废柴$',
          fnc: 'fc'
        },
        {
          reg: '^(#|/)?小恐龙$',
          fnc: 'xkl'
        },
        {
          reg: '^(#|/)?(哆啦)?(A梦|a梦)|阿蒙$',
          fnc: 'ameng'
        },
        {
          reg: '^(#|/)?(随机)?(狐狐|狐狸)$',
          fnc: 'fox'
        },
        {
          reg: '^(#|/)?(kabo|咖波|kapo|capo|猫虫)$',
          fnc: 'kabo'
        },
        {
          reg: '^(#|/)?(库洛米|kuluomi|klm)$',
          fnc: 'klm'
        },
        {
          reg: '^(#|/)?(龙图|随机龙图)$',
          fnc: 'lt'
        },
        {
          reg: '^(#|/)?(蘑菇头|随机蘑菇头)$',
          fnc: 'mgt'
        },
        {
          reg: '^(#|/)?(派大星|随机派大星)$',
          fnc: 'pdx'
        },
        {
          reg: '^(#|/)?(熊猫头|随机熊猫头)$',
          fnc: 'panda'
        },
        {
          reg: '^(#|/)?(小黄鸡|随机小黄鸡)$',
          fnc: 'xhj'
        },
        {
          reg: '^(#|/)?(小灰灰|随机小灰灰)$',
          fnc: 'xhh'
        },
        {
          reg: '^(#|/)?小豆泥$',
          fnc: 'xdn'
        }
      ]
    })
  }

  // 小豆泥
  async xdn (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki/?xiaodouni'))
    return true // 返回true 阻挡消息不再往下
  }

  // 小恐龙
  async xkl (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki/?xiaokonglong'))
    return true // 返回true 阻挡消息不再往下
  }

  // 废柴
  async fc (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki/?cheems'))
    return true // 返回true 阻挡消息不再往下
  }

  // 随机表情
  async sjbq (e) {
    let resp = await fetch('http://api.yujn.cn/api/emo.php')
    let result = await resp.text()
    await this.reply(segment.image(result))
    return true // 返回true 阻挡消息不再往下
  }

  // 随机坤坤
  async cxk (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki/?cxk'))
    return true // 返回true 阻挡消息不再往下
  }

  // 一二布布
  async yebb (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki?bubu'))
    return true // 返回true 阻挡消息不再往下
  }

  // 随机柴郡
  async cj (e) {
    await this.reply(segment.image('http://chaijun.avocado.wiki'))
    return true // 返回true 阻挡消息不再往下
  }

  // 哆啦A梦
  async ameng (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki?ameng'))
    return true // 返回true 阻挡消息不再往下
  }

  // 狐狐
  async fox (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki?fox'))
    return true // 返回true 阻挡消息不再往下
  }

  // 咖波
  async kabo (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki?kabo'))
    return true // 返回true 阻挡消息不再往下
  }

  // 库洛米
  async klm (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki?kuluomi'))
    return true // 返回true 阻挡消息不再往下
  }

  // 龙图
  async lt (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki?longtu'))
    return true // 返回true 阻挡消息不再往下
  }

  // 蘑菇头
  async mgt (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki?mogutou'))
    return true // 返回true 阻挡消息不再往下
  }

  // 派大星
  async pdx (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki?paidaxing'))
    return true // 返回true 阻挡消息不再往下
  }

  // 熊猫头
  async panda (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki?panda'))
    return true // 返回true 阻挡消息不再往下
  }

  // 小黄鸡
  async xhj (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki?xiaohuangji'))
    return true // 返回true 阻挡消息不再往下
  }

  // 小灰灰
  async xhh (e) {
    await this.reply(segment.image('http://hanhan.avocado.wiki?xiaohuihui'))
    return true // 返回true 阻挡消息不再往下
  }
}
