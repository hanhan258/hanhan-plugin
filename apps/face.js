import plugin from '../../../lib/plugins/plugin.js'

const valueMap = {
  坤坤: 'cxk',
  小黑子: 'cxk',
  鸡: 'cxk',
  cxk: 'cxk',
  鸡脚: 'cxk',
  鸽鸽: 'cxk',
  哥哥: 'cxk',
  一二布布: 'bubu',
  废柴: 'cheems',
  小恐龙: 'xiaokonglong',
  哆啦A梦: 'ameng',
  哆啦a梦: 'ameng',
  A梦: 'ameng',
  a梦: 'ameng',
  阿蒙: 'ameng',
  狐狐: 'fox',
  随机狐狐: 'fox',
  狐狸: 'fox',
  kabo: 'kabo',
  咖波: 'kabo',
  kapo: 'kabo',
  猫虫: 'kabo',
  库洛米: 'kuluomi',
  kuluomi: 'kuluomi',
  龙图: 'longtu',
  随机龙图: 'longtu',
  蘑菇头: 'mogutou',
  随机蘑菇头: 'mogutou',
  派大星: 'paidaxing',
  随机派大星: 'paidaxing',
  熊猫头: 'panda',
  随机熊猫头: 'panda',
  小黄鸡: 'xiaohuangji',
  随机小黄鸡: 'xiaohuangji',
  小灰灰: 'xiaohuihui',
  随机小灰灰: 'xiaohuihui',
  小豆泥: 'xiaodouni'
}
export class diaotu extends plugin {
  constructor () {
    super({
      name: '憨憨表情包',
      dsc: '憨憨表情包',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: `^#?(${Object.keys(valueMap).join('|')})$`,
          fnc: 'jh'
        },
        {
          reg: '^(#|/)?(柴郡|随机柴郡)$',
          fnc: 'cj'
        },
        {
          reg: '^#?表情包菜单$',
          fnc: 'helps'
        }
      ]
    })
  }

  async helps (e) {
    if (e.bot.config?.markdown) { return await e.reply('按钮菜单') }
  }

  // 聚合
  async jh (e) {
    let name = valueMap[e.msg.replace('#', '')]
    console.log(name)
    await this.reply(segment.image(`http://hanhan.avocado.wiki/?${name}`))
    return true // 返回true 阻挡消息不再往下
  }

  // 随机柴郡
  async cj (e) {
    await this.reply(segment.image('http://chaijun.avocado.wiki'))
    return true // 返回true 阻挡消息不再往下
  }
}
