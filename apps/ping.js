import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
import { exec } from 'child_process'
import pingMan from 'pingman'
import dns from 'dns'
import net from 'net'

export class Ping extends plugin {
  constructor() {
    super({
      name: '憨憨Ping',
      dsc: '憨憨Ping',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?[pP]ing\\s',
          fnc: 'ping',
        },
        {
          reg: '^#?ns\\s',
          fnc: 'resolveNs',
        },
        {
          reg: '^#?系统ping\\s', // 新增规则：直接调用系统 ping 命令
          fnc: 'systemPing',
        },
      ],
    })
  }

  // NS
  async resolveNs(e) {
    let domain = e.msg.trim().replace(/^#?ns/, '').trim()
    console.log(domain)
    dns.resolveNs(domain, (error, addresses) => {
      if (error) {
        console.error(error)
        e.reply(`解析 NS 记录出错：${error.message}`)
        return
      }
      console.log(`Name servers for ${domain}:`)
      e.reply(`Name servers for ${domain}:\n${addresses.join('\n')}`)
    })
  }

  // ping网站或ip
  async ping(e) {
    let msg = e.msg.trim().replace(/^#?[pP]ing\s/, '').replace(/https?:\/\//, '').trim()
    await this.reply('在ping了、在ping了。。。', true, { recallMsg: 3 })
    let ipInfo, pingRes, domain, ipAddress = msg, isShowIP = false, numberOfEchos = 6
    if (e.msg.trim().includes('#Ping')) isShowIP = true

    if (msg !== 'me') {
      const options = {
        logToFile: false,
        numberOfEchos,
        timeout: 2,
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
          pingRes = `最小延迟：${Math.floor(response.min)}ms\n` +
            `最大延迟：${Math.floor(response.max)}ms\n` +
            `平均延迟：${Math.floor(response.avg)}ms\n` +
            `发送数据包: ${numberOfEchos}\n` +
            `丢失数据包: ${Math.round(numberOfEchos * (response.packetLoss / 100))}\n` +
            `丢包率：${response.packetLoss}%`
        } else {
          pingRes = `目标地址${!e.isGroup ? '(' + ipAddress + ')' : domain || ''}无法响应，请检查网络连接是否正常(是否需要代理访问？)，或该站点是否已关闭。`
        }
      } catch (error) {
        logger.error(`ping 执行出错: ${error}`)
        await this.reply(`ping 执行出错: ${error.message}`)
        return false
      }
    }

    if (Config.pingToken) {
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
        ipInfo = JSON.parse(ipInfo.trim())
        logger.warn(ipInfo)
        if (ipInfo.bogon) {
          await this.reply(pingRes, e.isGroup)
          return false
        }
      } catch (error) {
        logger.error(`exec curl执行出错: ${error}`)
        await this.reply(`exec curl执行出错: ${error.message}`, e.isGroup)
        return false
      }
    }

    let res = `${isShowIP ? 'IP: ' + (ipInfo?.ip || ipAddress) + '\n' : ''}${domain ? 'Domain: ' + domain + '\n' : ''}`
    if (Config.pingToken && ipInfo) {
      res += `国家/地区：${ipInfo.country}\n区域：${ipInfo.region}\n城市：${ipInfo.city}\n时区：${ipInfo.timezone}\n经纬度：${ipInfo.loc}\n运营商：${ipInfo.org}\n`
    }
    res += pingRes || ''
    await this.reply(res, e.isGroup)
    return true
  }

  // 系统 ping 命令
  async systemPing(e) {
    let host = e.msg.trim().replace(/^#?系统ping\s/, '').trim()
    if (!host) {
      return e.reply('请指定要 ping 的主机名或 IP 地址。')
    }

    await this.reply('正在执行系统 ping 命令...', true, { recallMsg: 3 })

    let command = ''
    if (process.platform === 'win32') {
      command = `ping -n 3 -w 5000 ${host}` // Windows: -n 次数, -w 超时(毫秒)
    } else {
      command = `ping -c 3 -W 5 ${host}` // Linux/macOS: -c 次数, -W 超时(秒)
    }

    exec(command, { timeout: 10000 }, (error, stdout, stderr) => { // 10秒超时
      if (error) {
        if (error.killed) {
          e.reply('系统 ping 命令超时。')
        } else {
          logger.error(`系统 ping 命令执行出错: ${error}`)
          e.reply(`系统 ping 命令执行出错: ${error.message}`)
        }
        return
      }
      e.reply(`系统 ping 命令结果:\n${stdout}`)
    })
  }
}

function getDomain(url) {
  const domainRegex = /((?:[\u4e00-\u9fa5a-zA-Z0-9-]+\.)+[\u4e00-\u9fa5a-zA-Z]{2,})/
  const match = url.match(domainRegex)
  return match ? match[1] : false
}

async function getIPAddress(host) {
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