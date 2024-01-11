import plugin from '../../../lib/plugins/plugin.js'
import { recallSendForwardMsg } from '../utils/common.js'
import fetch from 'node-fetch'

export class diaotu extends plugin {
  constructor () {
    super({
      name: '憨憨热搜',
      dsc: '憨憨热搜',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?百度热搜$',
          fnc: 'baiduhot'
        }
      ]
    })
  }

  async baiduhot (e) {
    let url = 'https://top.baidu.com/board?tab=homepage'
    let msg = []
    await fetch(url)
      .then(response => response.text())
      .then(html => {
        // 在这里处理HTML响应
        const startIndex = html.indexOf('<!--s-data:') + 11 // 找到<!--s-data:-->的起始位置
        const endIndex = html.indexOf('-->', startIndex) // 找到<!--s-data:-->的结束位置
        const jsonData = html.substring(startIndex, endIndex) // 提取<!--s-data:-->中的数据
        const data = JSON.parse(jsonData) // 将提取到的 JSON 数据转换为 JavaScript 对象
        const content = data.data.cards[0].content
        content.forEach(item => {
          if (!item.isTop) { // 判断是否包含指定的属性值
            // 在这里可以对元素进行操作
            let result = (item.index + 1) + '：' + item.query + '\n' + item.desc
            if (e.bot.adapter != 'QQBot') {
              result += item.appUrl
            }
            msg.push(segment.image(item.img), result)
          }
        })
        let dec = e.msg
        e.reply(recallSendForwardMsg(e, msg, false, dec))
      })
      .catch(error => {
        // 在这里处理错误
        console.log(error)
      })
  }
}
