import plugin from '../../../lib/plugins/plugin.js'
import dns from 'dns'
import { exec, execSync } from 'child_process'

// token of https://ipinfo.io
const token = 'd557341e6cfb56'
// const reply = true
export class ping extends plugin {
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
          reg: '^#?ping ',
          /** 执行方法 */
          fnc: 'ping'
        }
      ]
    })
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
}