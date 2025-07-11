import { endingSpeech, followMe, pepTalk } from '../utils/const.js'
import { sleep, recallSendForwardMsg } from '../utils/common.js'
import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
import fetch from 'node-fetch'
import axios from 'axios'

export class photo extends plugin {
  constructor() {
    super({
      name: '憨憨网络图片',
      dsc: '憨憨网络图片',
      event: 'message',
      priority: 6,
      rule: [
        { reg: '^#每日英语$', fnc: 'dayEnglish', dsc: '每日英语' },
        { reg: '^#情侣头像$', fnc: 'couple', dsc: '情侣头像' },
        { reg: '^#随机(.*)吧', fnc: 'tieba', dsc: '随机贴吧图片' },
        { reg: '^#英雄联盟台词$', fnc: 'lol', dsc: '英雄联盟台词' },
        { reg: '^#图集解析(.*)$', fnc: 'parseAlbum', dsc: '图集解析' },
      ]
    })
    this.task = [
      {
        cron: '0 30 7 * * ?',
        // cron: '*/1 * * * *',
        name: 'englishTimeIsUp',
        fnc: this.englishTimeIsUp
      }
    ]
  }

  async helps(e) {
    if (e.bot.config?.markdown?.type) { return await this.reply('按钮菜单') }
  }

  async englishTimeIsUp() {
    let toSend = Config.studyGroups || []
    let url = 'https://open.iciba.com/dsapi/'
    let response = await axios.get(url) // 调用接口获取数据
    const res = response.data
    const img = res.fenxiang_img
    if (img) {
      for (const element of toSend) {
        if (!element) {
          continue
        }
        let groupId = parseInt(element)
        if (Bot.getGroupList().get(groupId)) {
          await Bot.sendGroupMsg(groupId, pepTalk[Math.floor(Math.random() * pepTalk.length)])
          await sleep(5000)
          await Bot.sendGroupMsg(groupId, segment.image(img))
          await sleep(1500)
          // 重要的事情说三遍！
          await Bot.sendGroupMsg(groupId, followMe[Math.floor(Math.random() * followMe.length)])
          await sleep(1500)
          await Bot.sendGroupMsg(groupId, segment.record(res.tts))
          await sleep(1500)
          await Bot.sendGroupMsg(groupId, segment.record(res.tts))
          await sleep(1500)
          await Bot.sendGroupMsg(groupId, segment.record(res.tts))
          await sleep(2000)
          await Bot.sendGroupMsg(groupId, endingSpeech[Math.floor(Math.random() * endingSpeech.length)])
        } else {
          logger.warn('机器人不在要发送的群组里。' + groupId)
        }
      }
    }
  }

  // 解析
  async parseAlbum(e) {
    let key = e.msg.replace(/^#图集解析/, '').trim()
    try {
      let url = `http://api.yujn.cn/api/dspjx.php?url=${key}`
      let res = await fetch(url) // 调用接口获取数据
      let result = await res.json()
      let forwardMsgs = []
      console.log(result)
      forwardMsgs.push(result.data.title)
      for (let i = 0; i < result.data.img.length; i++) {
        forwardMsgs.push(segment.image(result.data.img[i]))
      }
      let dec = '图片'
      return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 英雄联盟台词
  async lol(e) {
    let url = 'http://api.yujn.cn/api/yxlm.php?'
    let response = await fetch(url) // 调用接口获取数据
    let result = await response.json()
    if (result.code != 200) {
      return e.reply('api寄了')
    }
    console.log(result)
    let forwardMsgs = []
    forwardMsgs.push('英雄台词：' + result.data.name)
    if (result.data.content) {
      forwardMsgs.push('评论：' + result.data.content)
    }
    if (e.bot?.adapter != 'QQBot') {
      forwardMsgs.push(segment.image(result.data.img))
      forwardMsgs.push(result.data.img)
    }

    let dec = '英雄联盟台词'
    return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
  }

  // 百度贴吧
  async tieba(e) {
    let forwardMsgs = []
    let encode = e.msg.replace(/^#?随机/, '').trim()
    let prefix = encode.split('吧')[0] // 使用split()方法以"吧"为分隔符分割字符串，然后获取第一个元素（吧字前面的内容）
    console.log(prefix) // 输出提取的内容
    if (!prefix && prefix.length == 0) {
      return e.reply('你没有输入要查询的贴吧')
    }
    let url = `https://api.yujn.cn/api/tieba.php?type=json&msg=${prefix}`
    let res = await axios.get(url) // 调用接口获取数据
    let result = await res.data
    // console.log(result.code)
    if (result.code == 201) {
      return this.reply(result.tips)
    }
    console.log(result)
    if (res.status == 200) {
      forwardMsgs.push('昵称：' + result.name)
      forwardMsgs.push(result.time)
      forwardMsgs.push(result.title)
      if (result.text) {
        forwardMsgs.push(result.text)
      }
      if (result.images && result.images.length > 0) {
        for (let i = 0; i < result.images.length; i++) {
          if (result.images[i] != 'null') {
            forwardMsgs.push(segment.image(result.images[i]))
            if (e.bot?.adapter != 'QQBot') {
              forwardMsgs.push(result.images[i])
              // console.log(i)
            }
          }
        }
      }
      forwardMsgs.push('原文链接：' + result.url)
      let dec = encode
      return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
    } else {
      e.reply('查询失败,可能接口失效力~，请联系憨憨捏~')
    }
  }

  // 情侣头像
  async couple(e) {
    let url = 'http://api.yujn.cn/api/qltx.php?type=json&lx=qltx'
    let response = await fetch(url) // 调用接口获取数据
    let result = await response.json()
    console.log(result)
    let forwardMsgs = []
    forwardMsgs.push(result.title)
    forwardMsgs.push(result.detail)
    if (result.image_count == 0) {
      forwardMsgs.push('没有图片')
    } else {
      for (let i = 0; i < result.image_count; i++) {
        forwardMsgs.push(segment.image(result.img[i]))
        if (e.bot?.adapter != 'QQBot') {
          forwardMsgs.push(result.img[i])
        }
        // console.log(i)
      }
    }

    let dec = '情侣头像'
    return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
  }

  // 每日英语
  async dayEnglish(e) {
    let sendmsg = []
    let url = 'https://open.iciba.com/dsapi/'
    let response = await axios.get(url) // 调用接口获取数据
    sendmsg.push(segment.image(response.data.fenxiang_img))
    await this.reply(sendmsg)
  }
}
