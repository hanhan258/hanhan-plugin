import plugin from '../../../lib/plugins/plugin.js'
import { recallSendForwardMsg } from '../utils/common.js'
import axios from 'axios'
import { segment } from 'oicq' // 【Bug修复】必须导入 segment 才能使用

export class urlAndBase extends plugin {
  constructor() {
    super({
      name: '憨憨编码和接口访问',
      dsc: '憨憨编码和接口访问',
      event: 'message',
      priority: 6,
      rule: [
        // 【Bug修复】所有fnc都已和下方的方法名对齐
        { reg: '^#?(url|URL)编码', fnc: 'urlEncode', dsc: 'URL编码' },
        { reg: '^#?(url|URL)解码', fnc: 'urlDecode', dsc: 'URL解码' },
        { reg: '^#?(base64|Base64)编码', fnc: 'base64Encode', dsc: 'Base64编码' },
        { reg: '^#?(base64|Base64)解码', fnc: 'base64Decode', dsc: 'Base64解码' },
        { reg: '^#?访问', fnc: 'visit', dsc: '访问链接' , permission: "master" },
        { reg: '^#发图片', fnc: 'sendImage', dsc: '发送图片' , permission: "master" },
        { reg: '^#?取?图链', fnc: 'imgLink', dsc: '图片链接' , permission: "master" },
        { reg: '^#发视频', fnc: 'sendVideo', dsc: '发送视频' , permission: "master" },
        { reg: '^#发语音', fnc: 'sendRecord', dsc: '发送语音' , permission: "master" }
      ]
    })
  }

  // 发送语音
  async sendRecord(e) {
    let url = e.msg.replace(/^#发语音\s*/, '').trim()
    if (!url) return e.reply('你的语音接口呢，你想无中生有？', true)

    if (url.startsWith('http')) {
      // 【Bug修复】正确使用导入的 segment
      e.reply(segment.record(url))
    } else {
      e.reply('请输入一个有效的语音链接。', true)
    }
  }

  // 发送视频
  async sendVideo(e) {
    let url = e.msg.replace(/^#发视频\s*/, '').trim()
    if (!url) return e.reply('你的视频接口呢，你想无中生有？', true)

    if (url.startsWith('http')) {
      e.reply(segment.video(url))
    } else {
      e.reply('请输入一个有效的视频链接。', true)
    }
  }

  // 获取图片直链
  async imgLink(e) {
    let imgUrls = []
    if (e.source) {
      let sourceMsg
      try {
        if (e.isGroup) {
          sourceMsg = (await e.group.getChatHistory(e.source.seq, 1)).pop()
        } else {
          sourceMsg = (await e.friend.getChatHistory(e.source.time, 1)).pop()
        }
        if (sourceMsg) {
          for (const msg of sourceMsg.message) {
            if (msg.type === 'image') {
              imgUrls.push(msg.url)
            }
          }
        }
      } catch (error) {
        logger.error('获取引用消息失败', error)
        return e.reply('获取引用消息失败，可能已被撤回。')
      }
    } else if (e.img && e.img.length > 0) {
      imgUrls = e.img
    }

    if (imgUrls.length === 0) {
      return e.reply('发送的内容或引用的消息里没有图片。', true)
    }

    if (imgUrls.length >= 2) {
      const forwardMsgs = imgUrls.map(url => {
        return {
          user_id: this.e.bot.uin,
          nickname: this.e.bot.nickname,
          message: [segment.image(url), `直链: ${url}`]
        }
      })
      await e.reply(await e.bot.makeForwardMsg(forwardMsgs, '图片链接'))
    } else {
      await e.reply([segment.image(imgUrls[0]), `直链: ${imgUrls[0]}`])
    }
  }

  // 发送图片
  async sendImage(e) {
    let url = e.msg.replace(/^#发图片\s*/, '').trim()
    if (!url) return e.reply('你的图片接口呢，你想无中生有？', true)

    if (url.startsWith('http')) {
      e.reply(segment.image(url))
    } else {
      e.reply('请输入一个有效的图片链接。', true)
    }
  }

  // 访问文字接口
  async visit(e) {
    const url = e.msg.replace(/^#?访问\s*/, '').trim()
    if (!url) return e.reply('你的接口呢，你想无中生有？', true)

    if (!url.startsWith('http')) {
      return e.reply('请输入一个有效的http或https链接。', true)
    }

    try {
      const response = await axios.get(url, { timeout: 10000 }); // 设置10秒超时
      const contentType = response.headers['content-type'] || '';

      let replyContent = '';
      if (contentType.includes('application/json')) {
        // 对于JSON，格式化后发送
        replyContent = JSON.stringify(response.data, null, 2);
      } else if (contentType.includes('text/')) {
        // 对于文本，直接发送，不再使用JSON.stringify
        replyContent = String(response.data);
      } else {
        return e.reply(`不支持的接口返回类型: ${contentType}\n请确认接口返回类型是json或text。`);
      }
      // 防止消息过长
      await e.reply(replyContent.slice(0, 3000));

    } catch (error) {
      logger.error(`[接口访问] 访问失败: ${url}`, error.message);
      let errorMsg = '访问接口失败。';
      if (error.code === 'ECONNABORTED') {
        errorMsg = '访问超时，请稍后再试。';
      } else if (error.response) {
        errorMsg = `访问失败，状态码: ${error.response.status}`;
      }
      await e.reply(errorMsg);
    }
  }

  // URL编码
  async urlEncode(e) {
    const content = e.msg.replace(/^#?(url|URL)编码\s*/, '').trim()
    if (!content) return e.reply('输入不能为空', true)
    // 【优化】使用 encodeURIComponent 更加安全可靠
    const result = encodeURIComponent(content)
    await this.reply(result, true)
  }

  // URL解码
  async urlDecode(e) {
    const content = e.msg.replace(/^#?(url|URL)解码\s*/, '').trim()
    if (!content) return e.reply('输入不能为空', true)
    const result = decodeURIComponent(content)
    await this.reply(result, true)
  }

  // Base64编码
  async base64Encode(e) {
    const content = e.msg.replace(/^#?(base64|Base64)编码\s*/, '').trim()
    if (!content) return e.reply('输入不能为空', true)
    const result = Buffer.from(content).toString('base64')
    await this.reply(result, true)
  }

  // Base64解码
  async base64Decode(e) {
    const content = e.msg.replace(/^#?(base64|Base64)解码\s*/, '').trim()
    if (!content) return e.reply('输入不能为空', true)

    try {
      const result = Buffer.from(content, 'base64').toString('utf-8')
      if (!result) { // 解码出空字符串也提示一下
        return e.reply('解码结果为空，请检查输入是否正确。', true)
      }
      await this.reply(result, true)
    } catch (error) {
      await e.reply('解码失败，请输入有效的Base64字符串。', true)
    }
  }

}
