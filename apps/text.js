import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import axios from 'axios'

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
          reg: '^#?发癫',
          /** 执行方法 */
          fnc: 'fd'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?今天是几号',
          /** 执行方法 */
          fnc: 'today'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?历史上的今天',
          /** 执行方法 */
          fnc: 'history'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?人生倒计时',
          /** 执行方法 */
          fnc: 'rsdjs'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(今天|早上|中午|晚上|下午|现在)吃什么',
          /** 执行方法 */
          fnc: 'eat'
        }
      ]
    })
  }
  // 今天吃什么
  async eat(e){
    let resp = await fetch('http://api.yujn.cn/api/chi.php?')
    let result = resp.text()
    await this.reply(result)
  }

  // 人生倒计时
  async rsdjs (e) {
    let sendmsg = []
    let url = `https://v.api.aa1.cn/api/rsdjs/`
    let response = await axios.get(url) // 调用接口获取数据
    console.log(response)
    sendmsg.push(response.data.month, "\n")
    sendmsg.push(response.data.week, "\n")
    sendmsg.push(response.data.day, "\n")
    sendmsg.push(response.data.time)
    await this.reply(sendmsg, true)
  }

  // 发癫
  async fd (e) {
    let sendmsg = []
    let encode = e.msg.replace(/^#?发癫/, '').trim()

    let url = `https://xiaobapi.top/api/xb/api/onset.php?name=${encode}`
    let response = await axios.get(url) // 调用接口获取数据
    let res = response.data.data
    sendmsg.push(res)
    await this.reply(sendmsg, true)
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
    await this.reply(sendmsg, true)
  }
}
