import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
import dns from 'dns'
import { exec } from 'child_process'
import pingMan from 'pingman'
import net from 'net'

export class Ping extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨Ping',
      /** 功能描述 */
      dsc: '憨憨Ping',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?[pP]ing ',
          /** 执行方法 */
          fnc: 'ping'
        }
      ]
    })
  }

  // ping网站或ip
  async ping (e) {
    if (!Config.pingToken) {
      e.reply('请前往 https://ipinfo.io 注册账号，使用 #憨憨设置pingtoken 命令进行设置，设置好之后请重启')
      return false
    }

    let msg = e.msg.trim().replace(/^#?[pP]ing\s/, '').replace(/https?:\/\//, '')
    await this.reply('在ping了、在ping了。。。', true, { recallMsg: 3 })
    let ipInfo; let pingRes; let domain; let ipAddress = msg; let isShowIP = false; const numberOfEchos = 6
    if (e.msg.trim().includes('#Ping')) isShowIP = true
    if (msg !== 'me') {
      const options = {
        logToFile: false,
        numberOfEchos,
        timeout: 2
      }
      if (net.isIPv4(msg)) {
        options.IPV4 = true
      } else if (net.isIPv6(msg)) {
        options.IPV6 = true
      } else {
        domain = getDomain(msg)
        ipAddress = domain ? await getIPAddress(domain) : ''
        if (!ipAddress) {
          await this.reply('解析域名ip出错！')
          return false
        }
      }
      try {
        let response = await pingMan(ipAddress, options)
        if (response.alive) {
          pingRes = '最小延迟：' + Math.floor(response.min) + 'ms\n' +
              '最大延迟：' + Math.floor(response.max) + 'ms\n' +
              '平均延迟：' + Math.floor(response.avg) + 'ms\n' +
              '发送数据包: ' + numberOfEchos + '\n' +
              '丢失数据包: ' + (numberOfEchos - response.times.length) + '\n' +
              '丢包率：' + response.packetLoss + '%'
        } else {
          pingRes = `目标地址${!e.isGroup ? '(' + ipAddress + ')' : domain || ''}无法响应，请检查网络连接是否正常(是否需要代理访问？)，或该站点是否已关闭。`
        }
      } catch (error) {
        logger.error(`ping 执行出错: ${error}`)
        await this.reply('ping 执行出错: ', error)
      }
    }
    try {
      // 通过ipinfo.io获取ip地址相关信息
      ipInfo = await new Promise((resolve, reject) => {
        exec(`curl https://ipinfo.io/${msg === 'me' ? '' : ipAddress}?token=${Config.pingToken}`, async (error, stdout, stderr) => {
          if (error) {
            reject(error)
          } else {
            resolve(stdout)
          }
        })
      })
    } catch (error) {
      logger.error(`exec curl执行出错: ${error}`)
      await this.reply(`exec curl执行出错: ${error}`, e.isGroup)
      return false
    }
    ipInfo = JSON.parse(ipInfo.trim())

    logger.warn(ipInfo)
    if (ipInfo.bogon) {
      await this.reply(pingRes, e.isGroup)
      return false
    }
    let res = `${isShowIP ? 'IP: ' + ipInfo.ip + '\n' : ''}${domain ? 'Domain: ' + domain + '\n' : ''}国家：${ipInfo.country}\n地区：${ipInfo.region}\n城市：${ipInfo.city}\n时区：${ipInfo.timezone}\n经纬度：${ipInfo.loc}\n运营商：${ipInfo.org}\n${pingRes || ''}`
    await this.reply(res, e.isGroup)
    return true
  }
}
function getDomain (url) {
  const domainRegex = /((?:[\u4e00-\u9fa5a-zA-Z0-9-]+\.)+[\u4e00-\u9fa5a-zA-Z]{2,})/
  const match = url.match(domainRegex)
  return match ? match[1] : false
}
async function getIPAddress (host) {
  try {
    return await new Promise((resolve, reject) => {
      dns.lookup(host, (err, address) => {
        if (err) {
          reject(err)
        } else {
          resolve(address)
        }
      })
    })
  } catch (error) {
    logger.error(error)
    return false
  }
}
