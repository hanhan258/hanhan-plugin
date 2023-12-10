import plugin from '../../../lib/plugins/plugin.js'

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
        }
      ]
    })
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
