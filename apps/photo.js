import { endingSpeech, followMe, pepTalk } from '../utils/const.js'
import { sleep, makeForwardMsg } from '../utils/common.js'
import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
import fetch from 'node-fetch'
import { segment } from 'icqq'
import axios from 'axios'

export class photo extends plugin {
  constructor () {
    super({
      name: '憨憨图片类',
      dsc: '憨憨图片类',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?mc酱$',
          fnc: 'mc'
        },
        {
          reg: '^#?小c酱$',
          fnc: 'xiaoc'
        },
        {
          reg: '^#?兽猫酱$',
          fnc: 'shoumao'
        },
        {
          reg: '^#?买家秀$',
          fnc: 'buyerShow'
        },
        {
          reg: '^#?mt$',
          fnc: 'mt'
        },
        {
          reg: '^#?随机(ai|AI)$',
          fnc: 'sjai'
        },
        {
          reg: '^#?每日英语$',
          fnc: 'mryy'
        },
        {
          reg: '^#?随机柴郡$',
          fnc: 'cj'
        },
        {
          reg: '^#?随机acg$',
          fnc: 'random_acg'
        },
        {
          reg: '^#?随机东方$',
          fnc: 'random_orient'
        },
        {
          reg: '^#?一二布布$',
          fnc: 'yebb'
        },
        {
          reg: '^#?情侣头像$',
          fnc: 'qltx'
        },
        {
          reg: '^#?弱智吧',
          fnc: 'rzb'
        }
      ]
    })
    this.task = [
      {
        cron: '30 7 * * *',
        // cron: '*/1 * * * *',
        name: 'englishTimeIsUp',
        fnc: this.englishTimeIsUp
      }
    ]
  }

  async englishTimeIsUp () {
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

  // 弱智吧
  async rzb (e) {
    let forwardMsgs = []
    let url = 'http://api.yujn.cn/api/tieba.php?type=json&msg=%E5%BC%B1%E6%99%BA'
    let res = await axios.get(url) // 调用接口获取数据
    let result = await res.data
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
          forwardMsgs.push(result.images[i])
          forwardMsgs.push(segment.image(result.images[i]))
          console.log(i)
        }
        forwardMsgs.push('如果图片裂开了，请复制链接到浏览器打开')
      }
      let dec = '弱智吧'
      let forwardMsg = makeForwardMsg(e, forwardMsgs, dec)
      if (forwardMsg) {
        Bot.sendGroupMsg(e.group_id, forwardMsg)
      }
    } else {
      e.reply('查询失败,可能接口失效力~，请联系憨憨捏~')
    }
  }

  // 情侣头像
  async qltx (e) {
    let url = 'http://api.yujn.cn/api/qltx.php?type=json&lx=qltx'
    let response = await fetch(url) // 调用接口获取数据
    let result = await response.json()
    console.log(result)
    let forwardMsgs = []
    forwardMsgs.push(result.title)
    forwardMsgs.push(result.detail)
    forwardMsgs.push('如果图片裂开了，请复制链接到浏览器打开')
    if (result.image_count == 0) {
      forwardMsgs.push('没有图片')
    } else {
      for (let i = 0; i < result.image_count; i++) {
        forwardMsgs.push(result.img[i])
        forwardMsgs.push(segment.image(result.img[i]))
        console.log(i)
      }
    }

    let dec = '情侣头像'
    let forwardMsg = await makeForwardMsg(e, forwardMsgs, dec)
    if (forwardMsg) {
      await Bot.sendGroupMsg(e.group_id, forwardMsg)
    }
  }

  // 一二布布
  async yebb (e) {
    // 发送消息
    await this.reply(segment.image('http://api.yujn.cn/api/bubu.php?'))
    return true // 返回true 阻挡消息不再往下
  }

  // 随机柴郡
  async cj (e) {
    let urls = ['http://api.yujn.cn/api/chaijun.php?', 'http://chaijun.avocado.wiki']
    const randomIndex = Math.random()
    let url
    console.log('randomIndex: ' + randomIndex)
    if (randomIndex < 0.7) {
      url = urls[1] // 返回第一个 URL，概率为 0.7
    } else {
      url = urls[0] // 返回第二个 URL，概率为 0.3
    }
    // 发送消息
    await this.reply(segment.image(url))
    return true // 返回true 阻挡消息不再往下
  }

  // 每日英语
  async mryy (e) {
    let sendmsg = []
    let url = 'https://open.iciba.com/dsapi/'
    let response = await axios.get(url) // 调用接口获取数据
    sendmsg.push(segment.image(response.data.fenxiang_img))
    await this.reply(sendmsg)
  }

  // mc酱
  async mc (e) {
    // 发送消息
    await this.reply(segment.image('https://www.hlapi.cn/api/mcj'))
    return true // 返回true 阻挡消息不再往下
  }

  // 小c酱
  async xiaoc (e) {
    // 发送消息
    await this.reply(segment.image('http://api.yujn.cn/api/xcj.php?'))
    return true // 返回true 阻挡消息不再往下
  }

  // 兽猫酱
  async shoumao (e) {
    // 发送消息
    await this.reply(segment.image('http://api.yujn.cn/api/smj.php?'))
    return true // 返回true 阻挡消息不再往下
  }

  // 美腿
  async mt (e) {
    await this.reply(segment.image('http://lx.linxi.icu/API/meitui.php'))
    return true // 返回true 阻挡消息不再往下
  }

  // 随机ai
  async sjai (e) {
    // 发送消息
    await this.reply(segment.image('http://lx.linxi.icu/API/aitu.php'))
    return true // 返回true 阻挡消息不再往下
  }

  // 买家秀
  async buyerShow (e) {
    // 发送消息
    await this.reply(segment.image('https://api.dzzui.com/api/imgtaobao'))
    return true // 返回true 阻挡消息不再往下
  }

  // 随机二次元
  async random_acg (e) {
    let apiList = [
      'https://www.dmoe.cc/random.php',
      'http://www.98qy.com/sjbz/api.php',
      'https://t.mwm.moe/mp/',
      'https://t.mwm.moe/pc/',
      'https://api.ghser.com/random/pc.php',
      'https://api.ghser.com/random/pe.php',
      'https://www.loliapi.com/acg/',
      'https://api.paugram.com/wallpaper/'
    ]
    let randomType = Math.random()
    if (randomType < 1) {
      let apiNumber = Math.ceil(Math.random() * apiList.length)
      await this.reply(segment.image(`${apiList[apiNumber - 1]}`))
      return true
    }
  }

  // 随机东方
  async random_orient (e) {
    // 发送消息
    await this.reply(segment.image('https://img.paulzzh.tech/touhou/random'))
    return true
  }
}
