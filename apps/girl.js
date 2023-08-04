import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'icqq'

export class girl extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨Girl',
      /** 功能描述 */
      dsc: '憨憨Girl',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?(jk|JK)$',
          /** 执行方法 */
          fnc: 'jk'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(黑丝|hs)$',
          /** 执行方法 */
          fnc: 'hs'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(白丝|bs)$',
          /** 执行方法 */
          fnc: 'bs'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(写真|xz)$',
          /** 执行方法 */
          fnc: 'xz'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(小姐姐|xjj)$',
          /** 执行方法 */
          fnc: 'xjj'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?waifu$',
          /** 执行方法 */
          fnc: 'waifu'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(Girl|girl)$',
          /** 执行方法 */
          fnc: 'girl'
        }
      ]
    })
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
    const headers = new Headers()
    headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

    fetch('http://api.yujn.cn/api/yangyan.php', {
      headers
    })
      .then(response => {
        if (response.ok) {
          console.log('请求成功')
          // 发送消息
          this.reply(segment.image('http://api.yujn.cn/api/yangyan.php?'))
        } else {
          throw new Error('接口出错哩')
        }
      })
      .catch(err => {
        console.error('发生错误:', err)
        e.reply(err)
        // 在这里处理错误
      })
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
