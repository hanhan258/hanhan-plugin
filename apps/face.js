import plugin from '../../../lib/plugins/plugin.js'

const originalValues = [
  '坤坤', '小黑子', '鸡', 'cxk', '鸡脚', '鸽鸽', '哥哥', '一二布布', '废柴', '小恐龙', '哆啦A梦', '哆啦a梦', 'A梦', 'a梦', '阿蒙',
  '狐狐', '随机狐狐', '狐狸', 'kabo', '咖波', 'kapo', '猫虫', '库洛米', 'kuluomi', '龙图', '随机龙图', '蘑菇头', '随机蘑菇头',
  '派大星', '随机派大星', '熊猫头', '随机熊猫头', '小黄鸡', '随机小黄鸡', '小灰灰', '随机小灰灰', '小豆泥'
]
const correspondingValues = [
  'cxk', 'cxk', 'cxk', 'cxk', 'cxk', 'cxk', 'cxk', 'bubu', 'cheems', 'xiaokonglong', 'ameng', 'ameng', 'ameng', 'ameng', 'ameng',
  'fox', 'fox', 'fox', 'kabo', 'kabo', 'kabo', 'kabo', 'kuluomi', 'kuluomi', 'longtu', 'longtu', 'mogutou', 'mogutou',
  'paidaxing', 'paidaxing', 'panda', 'panda', 'xiaohuangji', 'xiaohuangji', 'xiaohuihui', 'xiaohuihui', 'xiaodouni'
]

export class diaotu extends plugin {
  constructor () {
    super({
      name: '憨憨表情包',
      dsc: '憨憨表情包',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: `^#?(${originalValues.join('|')})$`,
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
    let name = correspondingValues[originalValues.indexOf(e.msg.replace('#', ''))]
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
