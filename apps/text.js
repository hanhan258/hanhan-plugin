import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import axios from 'axios'
import he from 'he'

export class text extends plugin {
  constructor () {
    super({
      name: '憨憨文本类',
      dsc: '憨憨文本类',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?随机日记$',
          fnc: 'sjrj'
        },
        {
          reg: '^#?新春祝福$',
          fnc: 'newyear'
        },
        {
          reg: '^#?(污污|污句子)$',
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
          reg: '^#?(kfc|v50|网易云热评|舔狗日记)$',
          fnc: 'jh'
        }
      ]
    })
  }

  // 聚合
  async jh (e) {
    let message = e.msg
    let key
    if (message.includes('v50') || message.includes('kfc')) {
      key = 'kfc'
    } else if (message.includes('舔狗日记')) {
      key = 'tg'
    } else if (message.includes('网易云热评')) {
      key = 'wyy'
    }
    let url = `http://api.gakki.icu/${key}?type=json`
    let res = await fetch(url) // 调用接口获取数据
    let result = await res.json()
    if (result.code == 200) {
      await e.reply(result.data)
    } else if (result.code == 429) {
      e.reply('太快了憨憨受不了，请慢一点~')
    } else {
      e.reply('查询失败,可能接口失效力~，请联系憨憨捏~')
    }
  }

  // 油价查询
  async yjcx (e) {
    let sendmsg = []
    let encode = e.msg.replace(/^#?油价/, '').trim()
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
      sendmsg.push('=====查询省份：', response.data.data.prov, '=====\n')
      sendmsg.push('0#柴油：', response.data.data.p0, '\n')
      sendmsg.push('89#汽油：', response.data.data.p89, '\n')
      sendmsg.push('92#汽油：', response.data.data.p92, '\n')
      sendmsg.push('95#汽油：', response.data.data.p95, '\n')
      sendmsg.push('98#汽油：', response.data.data.p98, '\n')
      sendmsg.push(response.data.data.time, '\n')
      sendmsg.push('======================')
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
    let encode
    if (e.at) {
      const at = e.group.pickMember(e.at)
      encode = at.info?.card || at.info?.nickname
    } else {
      encode = e.msg.replace(/^#?发癫/, '').trim()
    }
    if (!encode) return e.reply('输入内容不能为空')
    let url = `https://api.gakki.icu/fd?msg=${encode}`
    let response = await fetch(url) // 调用接口获取数据
    const text = await response.text()
    await this.reply(text)
  }
}
