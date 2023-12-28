import { recallSendForwardMsg, getRandomLineFromFile } from '../utils/common.js'
import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import axios from 'axios'
import he from 'he'
const RootPath = process.cwd() + '/plugins/hanhan-plugin/'

export class text extends plugin {
  constructor () {
    super({
      name: '憨憨文本类',
      dsc: '憨憨文本类',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^(#|/)?随机日记$',
          fnc: 'sjrj'
        },
        {
          reg: '^(#|/)?新春祝福$',
          fnc: 'newyear'
        },
        {
          reg: '^(#|/)?(污污|污句子)$',
          fnc: 'wjz'
        },
        {
          reg: '^#?油价',
          fnc: 'yjcx'
        },
        {
          reg: '^#?发癫(.*)',
          fnc: 'fd'
        },
        {
          reg: '^(#|/)?(kfc|v50|网易云热评|舔狗日记)$',
          fnc: 'jh'
        },
        {
          reg: '^(#|/)?沙雕新闻$',
          fnc: 'sd'
        }
      ]
    })
  }

  // 沙雕新闻
  async sd (e) {
    let forwardMsgs = []
    let url = 'https://api.yujn.cn/api/shadiao.php?'
    let res = await axios.get(url) // 调用接口获取数据
    let result = await res.data
    console.log(result)
    if (res.status == 200) {
      forwardMsgs.push(result.title)
      forwardMsgs.push(result.content)
      if (result.images && result.images.length > 0) {
        for (let i = 0; i < result.images.length; i++) {
          forwardMsgs.push(result.images[i])
          forwardMsgs.push(segment.image(result.images[i]))
          console.log(i)
        }
        forwardMsgs.push('如果图片裂开了，请复制链接到浏览器打开')
      }
      forwardMsgs.push(result.video)
      let dec = e.msg
      return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
    } else {
      e.reply('查询失败,可能接口失效力~，请联系憨憨捏~')
    }
  }

  // 聚合
  async jh (e) {
    let message = e.msg
    let path = RootPath + '/resources/json/kfc.json'
    if (message.includes('舔狗日记')) {
      path = RootPath + '/resources/json/tg.json'
    } else if (message.includes('网易云热评')) {
      path = RootPath + '/resources/json/wyy.json'
    }
    let result = await getRandomLineFromFile(path)
    console.log(result)
    await this.reply(result)
  }

  // 油价查询
  async yjcx (e) {
    let sendmsg = []
    let encode = e.msg.replace(/^#?油价/, '').trim()
    if (!encode) return this.reply('你没有输入要查询的省份')
    let shengfen = ['北京', '上海', '江苏', '天津', '重庆', '江西', '辽宁', '安徽', '内蒙古', '福建',
      '宁夏', '甘肃', '青海', '广东', '山东', '广西', '山西', '贵州', '陕西', '海南', '四川', '河北',
      '西藏', '河南', '新疆', '黑龙江', '吉林', '云南', '湖北', '浙江', '湖南']
    let result = shengfen.includes(encode)
    if (!result) {
      await this.reply('只支持省份查询哦')
      return
    }
    console.log(encode)
    let url = `https://api.qqsuu.cn/api/dm-oilprice?prov=${encode}`
    let response = await axios.get(url) // 调用接口获取数据
    if (response.data.code == 200) {
      sendmsg.push('查询省份：' + response.data.data.prov, '\n')
      sendmsg.push('0#柴油：' + response.data.data.p0, '\n')
      sendmsg.push('89#汽油：' + response.data.data.p89, '\n')
      sendmsg.push('92#汽油：' + response.data.data.p92, '\n')
      sendmsg.push('95#汽油：' + response.data.data.p95, '\n')
      sendmsg.push('98#汽油：' + response.data.data.p98, '\n')
      sendmsg.push(response.data.data.time)
      await this.reply(sendmsg)
    } else {
      await this.reply('查询失败,可能接口失效力~，请联系憨憨捏~')
    }
  }

  // 污句子
  async wjz (e) {
    let resp = await fetch('http://api.yujn.cn/api/text_wu.php')
    let str = await resp.text()
    let result = str.trim()
    await this.reply(result)
  }

  // 新春祝福
  async newyear (e) {
    let resp = await fetch('http://api.yujn.cn/api/zhufu.php')
    let str = await resp.text()
    let result = str.trim()
    await this.reply(result)
  }

  // 随机日记
  async sjrj (e) {
    let resp = await fetch('http://api.yujn.cn/api/baoan.php?')
    let result = he.decode(await resp.text()).replace(/<br>/g, '\n')
    await this.reply(result)
  }

  // 发癫
  async fd (e) {
    let msg = e.msg.replace(/^#?发癫/, '').trim()
    // 判断是否是艾特
    if (e.message.filter(m => m.type === 'at').length > 0) {
      // 解决前缀问题
      msg = e.raw_message.replace(/^#?(.*)发癫/, '').trim() || e.at
      msg = msg.replace(/@/g, '').trim()
    }
    // 判断是否含有发癫对象，没有则默认对憨憨发癫
    if (!msg || msg.length === 0) {
      msg = '憨憨'
    }
    let path = RootPath + '/resources/json/psycho.json'
    let result = await getRandomLineFromFile(path)
    console.log(result)
    result = result.replace(/name/g, msg)
    console.log(result)
    await this.reply(result)
  }
}
