import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import axios from 'axios'
import he from 'he'

export class text extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨文本类',
      /** 功能描述 */
      dsc: '憨憨文本类',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?今天是几号$',
          /** 执行方法 */
          fnc: 'today'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?历史上的今天$',
          /** 执行方法 */
          fnc: 'history'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?人生倒计时$',
          /** 执行方法 */
          fnc: 'rsdjs'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?随机日记$',
          /** 执行方法 */
          fnc: 'sjrj'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?舔狗日记$',
          /** 执行方法 */
          fnc: 'tgrj'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?新春祝福$',
          /** 执行方法 */
          fnc: 'newyear'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(污污|污句子)$',
          /** 执行方法 */
          fnc: 'wjz'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?网易云热评$',
          /** 执行方法 */
          fnc: 'wyyrp'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?油价',
          /** 执行方法 */
          fnc: 'yjcx'
        },
        {
          /** 命令正则匹配 */
          reg: `^#?发癫(.*)`,
          /** 执行方法 */
          fnc: 'fd'
        }
      ]
    })
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

  // 网易云热评
  async wyyrp (e) {
    let resp = await fetch('https://api.f4team.cn/API/wyrp/api.php?type=text')
    let result = await resp.text()
    await this.reply(result)
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

  // 舔狗日记
  async tgrj (e) {
    let resp = await fetch('https://api.f4team.cn/API/tgrj/api.php')
    await this.reply(await resp.text())
  }

  // 随机日记
  async sjrj (e) {
    let resp = await fetch('http://api.yujn.cn/api/baoan.php?')
    let result = he.decode(await resp.text()).replace(/<br>/g, '\n')
    await this.reply(result)
  }

  // 人生倒计时
  async rsdjs (e) {
    let sendmsg = []
    let url = 'https://v.api.aa1.cn/api/rsdjs/'
    let response = await axios.get(url) // 调用接口获取数据
    sendmsg.push(response.data.month, '\n')
    sendmsg.push(response.data.week, '\n')
    sendmsg.push(response.data.day, '\n')
    sendmsg.push(response.data.time)
    await this.reply(sendmsg)
  }

  // 发癫
  async fd (e) {
    if (e.at) {
      const at = e.group.pickMember(e.at)
      e.msg = at.info?.card || at.info?.nickname
      console.log(e.msg)
    }
    let encode = e.msg.replace(/^#?发癫/, '').trim()
    e.reply(encode)
    if (!encode) return e.reply('输入内容不能为空')

    let url = `https://api.hanhanz.com/fd?msg=${encode}`
    let response = await fetch(url) // 调用接口获取数据
    const text = await response.text()
    await this.reply(text)
  }

  // 今天是几号
  async today (e) {
    let url = 'https://api.f4team.cn/API/rl/api.php?type=text'
    let response = await fetch(url) // 调用接口获取数据
    let res = await response.text()
    let sendmsg = []
    sendmsg.push(res)
    await this.reply(sendmsg, true)
  }

  // 历史上的今天
  async history (e) {
    let url = 'https://api.f4team.cn/API/lishi/api.php?n=10'
    let response = await fetch(url) // 调用接口获取数据
    let res = await response.text()
    let sendmsg = []
    sendmsg.push(res)
    await this.reply(sendmsg)
  }
}
