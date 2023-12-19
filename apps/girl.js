import plugin from '../../../lib/plugins/plugin.js'
import { recallSendForwardMsg } from '../utils/common.js'

export class girl extends plugin {
  constructor () {
    super({
      name: '憨憨Girl',
      dsc: '憨憨Girl',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^(#|/)?(jk|JK)$',
          fnc: 'jk'
        },
        {
          reg: '^(#|/)?(黑丝|hs)$',
          fnc: 'hs'
        },
        {
          reg: '^(#|/)?(白丝|bs)$',
          fnc: 'bs'
        },
        {
          reg: '^(#|/)?(写真|xz)$',
          fnc: 'xz'
        },
        {
          reg: '^(#|/)?(小姐姐|xjj)$',
          fnc: 'xjj'
        },
        {
          reg: '^(#|/)?waifu$',
          fnc: 'waifu'
        },
        {
          reg: '^(#|/)?(Girl|girl)$',
          fnc: 'girl'
        },
        {
          reg: '^(#|/)?买家秀$',
          fnc: 'buyerShow'
        },
        {
          reg: '^(#|/)?微博美女$',
          fnc: 'weibo'
        }
      ]
    })
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

  // 买家秀
  async buyerShow (e) {
    // 发送消息
    await this.reply(segment.image('https://api.dzzui.com/api/imgtaobao'))
    return true // 返回true 阻挡消息不再往下
  }

  // girl
  async girl (e) {
    // 发送消息
    await this.reply(segment.image('http://api.yujn.cn/api/sjvs.php?'))
    return true // 返回true 阻挡消息不再往下
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
        console.log(data)
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

  // 小姐姐
  async xjj (e) {
    // 发送消息
    await this.reply(segment.image('http://api.yujn.cn/api/yangyan.php?'))
    return true // 返回true 阻挡消息不再往下
  }

  // JK
  async jk (e) {
    // 发送消息
    await this.reply(segment.image('http://api.yujn.cn/api/jk.php??'))
    return true // 返回true 阻挡消息不再往下
  }

  // 黑丝
  async hs (e) {
    // 发送消息
    // http://api.tombk.cn/API/hs/hs.php
    await this.reply(segment.image('http://api.yujn.cn/api/heisi.php?'))
    return true // 返回true 阻挡消息不再往下
  }

  // 白丝
  async bs (e) {
    // 发送消息
    // http://api.tombk.cn/API/bs/bs.php
    await this.reply(segment.image('http://api.yujn.cn/api/baisi.php?'))
    return true // 返回true 阻挡消息不再往下
  }

  // 写真
  async xz (e) {
    // 发送消息
    await this.reply(segment.image('http://api.yujn.cn/api/xiezhen.php?type=image'))
    return true // 返回true 阻挡消息不再往下
  }
}
