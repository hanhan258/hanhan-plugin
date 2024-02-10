import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from 'puppeteer'
import common from '../../../lib/common/common.js'

export class multiLocationPing extends plugin {
  constructor () {
    super({
      name: 'multiLocationPing',
      dsc: '全国ping',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?(全国|多地)ping',
          /** 执行方法 */
          fnc: 'itdog'
        }
      ]
    })
  }

  /** 复读 */
  async itdog (e) {
    let domainOrIp = e.msg.replace(/^#?(全国|多地)ping/, '').replace(/https?:\/\//, '').trim()
    if (!domainOrIp) {
      return
    }
    let browser
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-gpu'
        ]
      })
      const page = await browser.newPage()

      await e.reply('开始从多个地点测试延迟了哦')
      // 访问指定 URL
      await page.goto(`https://www.itdog.cn/ping/${domainOrIp}`, {
        waitUntil: 'networkidle2'
      })

      await page.waitForXPath('//button[contains(text(), "单次测试")]')

      const [button] = await page.$x('//button[contains(text(), "单次测试")]')
      if (button) {
        await button.click()
      }
      await common.sleep(500)
      let progress = 0
      while (progress < 100) {
        await page.waitForXPath('//*[@id="complete_progress"]/div')

        const element = await page.$x('//*[@id="complete_progress"]/div')
        const text = await page.evaluate(element => element.textContent, element[0])
        progress = parseInt(text.replace('%', ''))
        await common.sleep(500)
      }
      logger.info('ping测试结束，开始收集结果')
      const tableRowElements = await page.$x('//*[@id="simpletable"]/tbody/tr')
      const rawResults = []
      for (const rowElement of tableRowElements) {
        const node = await page.evaluate(el => el.getAttribute('node'), rowElement)
        const locationElement = (await rowElement.$$('td.text-left'))[0]
        const [isp, location] = (await page.evaluate(element => element.textContent, locationElement)).trim().split(/\s+/)

        const ipElement = (await rowElement.$$('td.real_ip'))[0]
        const ip = (await page.evaluate(element => element.textContent, ipElement)).split('\n')[0]

        const ipLocElement = (await rowElement.$$('td.ip_address'))[0]
        const ipLoc = await page.evaluate(element => element.textContent, ipLocElement)

        const latencyElement = await rowElement.$(`td#ping_${node}`)
        const latency = await page.evaluate(element => element.textContent, latencyElement)
        rawResults.push({ isp, location, ip, ipLoc, latency: parseInt(latency.trim().replace('ms', '')) })
      }
      // console.log(JSON.stringify(rawResults))
      // await e.reply(JSON.stringify(rawResults))
      function getColor (latency = 0) {
        if (latency < 100) {
          return 'green'
        } else if (latency < 150) {
          return 'yellow'
        } else if (latency < 200) {
          return 'orange'
        } else {
          return 'red'
        }
      }
      rawResults.forEach(result => {
        if (!result.latency) {
          result.latency = 999
        }
        result.progressBarWidth = Math.min(result.latency / 400 * 100, 100)
        result.progressBarColor = getColor(result.latency)
        if (result.latency === 999) {
          result.latency = '- '
        }
      })
      const data = {
        time: formatTime(new Date()),
        tester: e.sender.card || e.sender.nickname || e.sender.user_id,
        target: domainOrIp,
        results: rawResults
      }
      const imageData = await this.e.runtime.render(
        'hanhan-plugin',
        '/ping/ping.html',
        data,
        {
          retType: 'base64',
          scale: 2
        }
      )
      await e.reply(imageData)
    } finally {
      browser && await browser.close()
    }
  }
}

/**
 * from icqq
 * @param value
 * @param template
 * @returns {string}
 */
function formatTime (value, template = 'yyyy-MM-dd HH:mm:ss') {
  const date = new Date()
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(template)) { template = template.replace(/(y+)/, (sub) => (date.getFullYear() + '').slice(0, sub.length)) }
  for (let k in o) {
    const reg = new RegExp('(' + k + ')')
    if (reg.test(template)) {
      template = template.replace(reg, (v) => `${o[k]}`.padStart(v.length, ''))
    }
  }
  return template
}
