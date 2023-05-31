import plugin from '../../../lib/plugins/plugin.js'
import fetch from 'node-fetch'

export class shouyu extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨兽语',
      /** 功能描述 */
      dsc: '憨憨兽语',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?兽语帮助',
          /** 执行方法 */
          fnc: 'shouyuHelp'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(兽语|猫语|喵语|狗语|动物语)加密',
          /** 执行方法 */
          fnc: 'shouyuEn'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(兽语|猫语|喵语|狗语|动物语)解密',
          /** 执行方法 */
          fnc: 'shouyuDe'
        }
      ]
    })
  }

  // 兽语加密
  async shouyuEn (e) {
    let msg = e.msg
    let encode
    let url
    let response
    let res
    let sendmsg = []
    if (msg.includes('兽语')) {
      msg = e.msg.replace(/^#?兽语加密/, '').trim()
      encode = encodeURIComponent(msg)// 将文本转成url编码
      url = `https://www.sgtap.tk/API/shouyu.php?act=jm&content=${encode}&miyu=sy&type=text`
      response = await fetch(url) // 调用接口获取数据
      res = await response.text()
    }
    if (msg.includes('猫语') || msg.includes('喵语')) {
      msg = e.msg.replace(/^#?(猫语|喵语)加密/, '').trim()
      encode = encodeURIComponent(msg)// 将文本转成url编码
      url = `https://www.sgtap.tk/API/shouyu.php?act=jm&content=${encode}&miyu=my&type=text`
      response = await fetch(url) // 调用接口获取数据
      res = await response.text()
    }
    if (msg.includes('狗语')) {
      msg = e.msg.replace(/^#?狗语加密/, '').trim()
      encode = encodeURIComponent(msg)// 将文本转成url编码
      url = `https://www.sgtap.tk/API/shouyu.php?act=jm&content=${encode}&miyu=gy&type=text`
      response = await fetch(url) // 调用接口获取数据
      res = await response.text()
    }
    if (msg.includes('动物语')) {
      msg = e.msg.replace(/^#?动物语加密/, '').trim()
      encode = encodeURIComponent(msg)// 将文本转成url编码
      url = `https://www.sgtap.tk/API/shouyu.php?act=jm&content=${encode}&miyu=dw&type=text`
      response = await fetch(url) // 调用接口获取数据
      res = await response.text()
    }

    sendmsg.push(res)
    await this.reply(sendmsg, true)
  }

  // 兽语解密
  async shouyuDe (e) {
    let msg = e.msg
    let encode
    let url
    let response
    let res
    let sendmsg = []
    if (msg.includes('兽语')) {
      msg = e.msg.replace(/^#?兽语解密/, '').trim()
      encode = encodeURIComponent(msg)// 将文本转成url编码
      url = `https://www.sgtap.tk/API/shouyu.php?act=py&content=${encode}&miyu=sy&type=text`
      response = await fetch(url) // 调用接口获取数据
      res = await response.text()
    }
    if (msg.includes('猫语') || msg.includes('喵语')) {
      msg = e.msg.replace(/^#?(猫语|喵语)解密/, '').trim()
      encode = encodeURIComponent(msg)// 将文本转成url编码
      url = `https://www.sgtap.tk/API/shouyu.php?act=py&content=${encode}&miyu=my&type=text`
      response = await fetch(url) // 调用接口获取数据
      res = await response.text()
    }
    if (msg.includes('狗语')) {
      msg = e.msg.replace(/^#?狗语解密/, '').trim()
      encode = encodeURIComponent(msg)// 将文本转成url编码
      url = `https://www.sgtap.tk/API/shouyu.php?act=py&content=${encode}&miyu=gy&type=text`
      response = await fetch(url) // 调用接口获取数据
      res = await response.text()
    }
    if (msg.includes('动物语')) {
      msg = e.msg.replace(/^#?动物语解密/, '').trim()
      encode = encodeURIComponent(msg)// 将文本转成url编码
      url = `https://www.sgtap.tk/API/shouyu.php?act=py&content=${encode}&miyu=dw&type=text`
      response = await fetch(url) // 调用接口获取数据
      res = await response.text()
    }

    sendmsg.push(res)
    await this.reply(sendmsg, true)
  }
}
