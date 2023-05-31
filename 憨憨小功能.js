import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import { segment } from 'oicq'
import axios from 'axios'
import dns from 'dns'
import { exec, execSync } from 'child_process'

// 填入自己的token ==> 获取地址: https://ipinfo.io
const token = ''

export class jiami extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨小功能',
      /** 功能描述 */
      dsc: '憨憨写的无用小功能',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?nav',
          /** 执行方法 */
          fnc: 'hanhanHelp'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?买家秀',
          /** 执行方法 */
          fnc: 'buyerShow'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?mt',
          /** 执行方法 */
          fnc: 'mt'
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
        },
        {
          /** 命令正则匹配 */
          reg: '^#?兽语帮助',
          /** 执行方法 */
          fnc: 'shouyuHelp'
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
          reg: '^#?ping',
          /** 执行方法 */
          fnc: 'ping'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(摩斯|莫斯)加密',
          /** 执行方法 */
          fnc: 'morseEn'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(摩斯|莫斯)解密',
          /** 执行方法 */
          fnc: 'morseDe'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(url|URL)编码',
          /** 执行方法 */
          fnc: 'urlEn'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(url|URL)解码',
          /** 执行方法 */
          fnc: 'urlDe'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(base64|Base64)编码',
          /** 执行方法 */
          fnc: 'baseEn'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(base64|Base64)解码',
          /** 执行方法 */
          fnc: 'baseDe'
        }
      ]
    })
  }

  // 憨憨功能
  async hanhanHelp (e) {
    e.reply('憨憨小功能：\n(#)(兽语|猫语|喵语|狗语|动物语)加(解)密\n(#)mt\n(#)买家秀\n(#)兽语帮助\n(#)今天是几号\n(#)历史上的今天\n(#)ping (ip/域名)\n(#)摩斯加(解)密\n(#)url编(解)码\n(#)base64编(解)码')
  }

  // 兽语帮助
  async shouyuHelp (e) {
    e.reply('请发送：\n#(兽语|猫语|喵语|狗语|动物语)加(解)密+要加(解)密的文字\n或(兽语|猫语|狗语|动物语)加(解)密+要加(解)密的文字\n例如：#(兽语|猫语|喵语|狗语|动物语)加密你好\n(兽语|猫语|喵语|狗语|动物语)加密你好')
  }

  // 美腿
  async mt (e) {
    // 接口地址

    // 发送消息
    this.reply(segment.image('http://cf228e76e6.hk02.hoomoon.cn/0/'))

    return true // 返回true 阻挡消息不再往下
  }

  // 买家秀
  async buyerShow (e) {
    // 接口地址
    let url = 'https://api.dzzui.com/api/imgtaobao?format=json'
    let msg = []
    try {
      let response = await axios.get(url)
      msg.push(segment.image(response.data.imgurl))
      // 发送消息
      this.reply(msg)
    } catch (error) {
      console.error(error)
    }

    return true // 返回true 阻挡消息不再往下
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

  // 今天是几号
  async today (e) {
    let url = 'https://ovooa.ybapi.cn/API/rl/api.php?type=text'
    let response = await fetch(url) // 调用接口获取数据
    let res = await response.text()
    let sendmsg = []
    sendmsg.push(res)
    await this.reply(sendmsg, true)
  }

  // 历史上的今天
  async history (e) {
    let url = 'https://ovooa.ybapi.cn/API/lishi/api.php?n=10'
    let response = await fetch(url) // 调用接口获取数据
    let res = await response.text()
    let sendmsg = []
    sendmsg.push(res)
    await this.reply(sendmsg, true)
  }

  // ping网站或ip
  async ping (e) {
    if (!token) return false
    let host = e.msg.trim().replace(/^#?ping\s?/, '').replace(/https?:\/\//, '')
    if (!host) {
      await this.reply('请检查输入是否有误~', e.isGroup)
      return false
    }
    await this.reply('在ping了、在ping了。。。', true, { recallMsg: e.isGroup ? 3 : 0 })
    const regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,6}:|([0-9a-fA-F]{1,4}:){1,5}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,4}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:)|:((:[0-9a-fA-F]{1,4}){1,6}|:))%?([0-9a-zA-Z]{1,})?$/
    let pingCommand = ''
    let pingRegex = ''
    let pingRes = ''
    // 不ping本机
    if (host !== 'me') {
      // 获取公网ip
      if (!regex.test(host)) {
        function lookup (hostname) {
          return new Promise((resolve, reject) => {
            dns.lookup(hostname, (err, address) => {
              if (err) {
                reject(err)
              } else {
                resolve(address)
              }
            })
          })
        }
        try {
          host = await lookup(host)
        } catch (err) {
          await this.reply(err.toString(), e.isGroup)
          logger.error('ipAddress err: ', err)
          return false
        }
      }

      if (process.platform === 'win32') {
        // 设置控制台的编码格式
        execSync('chcp 65001')
        // 设置ping指令
        pingCommand = `ping -n 4 ${host}`
        // 设置处理ping结果的正则表达式
        pingRegex = /Packets: Sent = (\d+), Received = (\d+), Lost = \d+ \((\d+%) loss\),\s*\nApproximate round trip times in milli-seconds:\s*\n\s*Minimum = (\d+)ms, Maximum = (\d+)ms, Average = (\d+)ms/
      } else {
        process.env.LANG = 'en_US.UTF-8'
        pingCommand = `ping -c 4 ${host}`
        pingRegex = /(\d+\.?\d*) packets transmitted, (\d+\.?\d*) received, (\d+\.?\d*%) packet loss, time \d+ms\s*\n\s*rtt min\/avg\/max\/mdev = (\d+\.?\d*)\/(\d+\.?\d*)\/(\d+\.?\d*)\/\d+\.?\d* ms/
      }
      try {
        // 获取ping结果
        pingRes = await new Promise((resolve, reject) => {
          exec(pingCommand, async (error, stdout, stderr) => {
            if (error) {
              reject(error)
            } else {
              resolve(stdout)
            }
          })
        })
      } catch (error) {
        logger.error(`exec pingCommand执行出错: ${error}`)
      }
      const match = pingRegex.exec(pingRes.toString())
      if (match) {
        const packetCount = match[1]
        const receivedCount = match[2]
        const lossRate = match[3]
        const minDelay = match[4]
        const maxDelay = match[5]
        const avgDelay = match[6]
        pingRes = `最小延迟：${minDelay}ms\n最大延迟：${maxDelay}ms\n平均延迟：${avgDelay}ms\n数据包数：${packetCount}\n接受数据包：${receivedCount}\n丢包率：${lossRate}`
      } else {
        pingRes = pingRes === '' ? `目标地址${!e.isGroup ? '(' + e.msg.trim().match(/^#?ping\s?(.+)/)[1] + ')' : ''}无法响应，请检查网络连接是否正常(是否需要代理访问？)，或者该站点是否已关闭。` : pingRes.replace(new RegExp(host, 'g'), '=͟͟͞͞ʕ•̫͡•ʔ=͟͟͞͞ʕ•̫͡•ʔ=͟͟͞͞ʕ•̫͡•ʔ')
      }
    }
    let ipInfo = ''
    try {
      // 通过ipinfo.io获取ip地址相关信息
      ipInfo = await new Promise((resolve, reject) => {
        exec(`curl https://ipinfo.io/${host === 'me' ? '' : host}?token=${token}`, async (error, stdout, stderr) => {
          if (error) {
            reject(error)
          } else {
            resolve(stdout)
          }
        })
      })
    } catch (error) {
      logger.error(`exec curl执行出错: ${error}`)
      await this.reply(error, e.isGroup)
      return false
    }
    ipInfo = JSON.parse(ipInfo.trim())
    let res = `${!e.isGroup ? 'IP: ' + ipInfo.ip + '\n' : ''}国家：${ipInfo.country}\n地区：${ipInfo.region}\n城市：${ipInfo.city}\n时区：${ipInfo.timezone}\n经纬度：${ipInfo.loc}\n运营商：${ipInfo.org}\n${pingRes}`
    await this.reply(res, e.isGroup)
    return true
  }

  // 莫斯加密
  async morseEn (e) {
    let sendmsg = []
    let encode = e.msg.replace(/^#?(莫斯|摩斯)加密/, '').trim()
    // 下面接口二选一
    // https://xiaobapi.top/api/xb/api/mesdm.php?type=en&msg=${encode}
    let url = `http://www.plapi.tk/api/mesdm.php?type=%E5%8A%A0%E5%AF%86&msg=${encode}`
    let response = await fetch(url) // 调用接口获取数据
    let res = await response.text()
    sendmsg.push(res)
    await this.reply(sendmsg, true)
  }

  // 莫斯解密
  async morseDe (e) {
    let sendmsg = []
    let	encode = e.msg.replace(/^#?(莫斯|摩斯)解密/, '').trim()
    // 下面接口二选一
    // https://xiaobapi.top/api/xb/api/mesdm.php?type=de&msg=${encode}
    let	url = `http://www.plapi.tk/api/mesdm.php?type=%E8%A7%A3%E5%AF%86&msg=${encode}`
    let response = await fetch(url) // 调用接口获取数据
    let res = await response.text()
    sendmsg.push(res)
    await this.reply(sendmsg, true)
  }

  // url编码
  async urlEn (e) {
    let encode = e.msg.replace(/^#?(url|URL)编码/, '').trim()
    let result = encodeURI(encode)
    await this.reply(result, true)
  }

  // url解码
  async urlDe (e) {
    let encode = e.msg.replace(/^#?(url|URL)解码/, '').trim()
    let result = decodeURI(encode)
    await this.reply(result, true)
  }

  // base64编码
  async baseEn (e) {
    let encode = e.msg.replace(/^#?(base64|Base64)编码/, '').trim()
    let result = Buffer.from(encode).toString('base64')
    await this.reply(result, true)
  }

  // base64解码
  async baseDe (e) {
    let encode = e.msg.replace(/^#?(base64|Base64)解码/, '').trim()
    let result = Buffer.from(encode, 'base64').toString()
    await this.reply(result, true)
  }
}
