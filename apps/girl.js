import plugin from '../../../lib/plugins/plugin.js'
import { recallSendForwardMsg } from '../utils/common.js'

const originalValues = [
  'jk', 'JK', 'ak', 'cos', '国风', '汉服', '黑丝', 'hs', '白丝', 'bs', '小姐姐', 'xjj', '买家秀',
  '小性感', '夏日女友', '诱惑图', 'yht', 'mt', '随机ai', '随机AI']
const correspondingValues = [
  'jk', 'jk', 'ak', 'cos', 'guofeng', 'hanfu', 'heisi', 'heisi', 'baisi', 'baisi', 'xiaojiejie', 'xiaojiejie', 'taobao',
  'xiaoxinggan', 'girlfriend', 'youhuotu', 'youhuotu', 'meitui', 'ai', 'ai']

export class girl extends plugin {
  constructor () {
    super({
      name: '憨憨Girl',
      dsc: '憨憨Girl',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: `^#?(${originalValues.join('|')})$`,
          fnc: 'jh'
        },
        {
          reg: '^(#|/)?waifu$',
          fnc: 'waifu'
        },
        {
          reg: '^(#|/)?微博美女$',
          fnc: 'weibo'
        }
      ]
    })
  }

  // 聚合
  async jh (e) {
    console.log(e.msg)
    let name = correspondingValues[originalValues.indexOf(e.msg)]
    await this.reply(segment.image(`http://hanhan.avocado.wiki?${name}`))
    return true // 返回true 阻挡消息不再往下
  }

  // 微博美女
  async weibo (e) {
    let url = 'https://api.yujn.cn/api/weibo.php?type=json'
    let response = await fetch(url) // 调用接口获取数据
    let result = await response.json()
    if (result.code != 200) {
      return e.reply('api寄了')
    }
    console.log(result)
    let forwardMsgs = []
    forwardMsgs.push(result.title)
    if (result.img && result.img.length > 0) {
      for (let i = 0; i < result.img.length; i++) {
        forwardMsgs.push(segment.image(result.img[i]))
        forwardMsgs.push(result.img[i])
        console.log(i)
      }
      forwardMsgs.push('如果图片裂开了，请复制链接到浏览器打开')
    }

    let dec = '微博美女'
    return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
  }
}
