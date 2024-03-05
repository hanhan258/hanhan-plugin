import plugin from '../../../lib/plugins/plugin.js'
import { recallSendForwardMsg } from '../utils/common.js'

const valueMap = {
  jk: 'jk',
  JK: 'jk',
  ak: 'ak',
  cos: 'cos',
  国风: 'guofeng',
  汉服: 'hanfu',
  黑丝: 'heisi',
  hs: 'heisi',
  白丝: 'baisi',
  bs: 'baisi',
  小姐姐: 'xiaojiejie',
  xjj: 'xiaojiejie',
  买家秀: 'taobao',
  小性感: 'xiaoxinggan',
  夏日女友: 'girlfriend',
  诱惑图: 'youhuotu',
  yht: 'youhuotu',
  mt: 'meitui',
  随机ai: 'ai',
  随机AI: 'ai',
  ai: 'ai',
  AI: 'ai'
}

export class girl extends plugin {
  constructor () {
    super({
      name: '憨憨Girl',
      dsc: '憨憨Girl',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: `^#?(${Object.keys(valueMap).join('|')})$`,
          fnc: 'jh'
        },
        {
          reg: '^(#|/)?waifu$',
          fnc: 'waifu'
        },
        {
          reg: '^(#|/)?微博美女$',
          fnc: 'weibo'
        },
        {
          reg: '^#?美女类菜单$',
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
    // console.log(e.msg)
    let name = valueMap[e.msg.replace('#', '')]
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

  // waifu
  async waifu (e) {
    const apiUrl = 'https://api.waifu.im/search' // Replace with the actual API endpoint URL
    let sendmsg = []
    const params = {
      included_tags: 'waifu',
      height: '>=2000'
    }

    const queryParams = new URLSearchParams(params)
    const requestUrl = `${apiUrl}?${queryParams}`

    await fetch(requestUrl)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('接口出错哩')
        }
      })
      .then(data => {
        // Process the response data as needed
        // console.log(data)
        console.log(data.images[0].url)
        // 发送消息
        try {
          // sendmsg.push(data.images[0].url)
          sendmsg.push(segment.image(data.images[0].url))
          e.reply(sendmsg)
        } catch (err) {
          console.log(err)
          e.reply(err)
        }
      })
      .catch(error => {
        e.reply(error.message)
        console.error('An error occurred:', error.message)
      })
    return true // 返回true 阻挡消息不再往下
  }
}
