import { getRandomLineFromFile } from '../utils/common.js'
import plugin from '../../../lib/plugins/plugin.js'
import axios from 'axios'
import he from 'he'
import { Config } from '../utils/config.js'
import path from 'path'

const RootPath = path.join(process.cwd(), 'plugins', 'hanhan-plugin')

const textCommandMap = new Map([
  ['kfc', 'kfc'],
  ['v50', 'kfc'],
  ['网易云热评', 'wyy'],
  ['舔狗日记', 'tg'],
  ['污污', 'saohua'],
  ['污句子', 'saohua'],
  ['日记', 'riji'],
  ['随机日记', 'riji'],
  ['新春祝福', 'newyear']
])

const OIL_PROVINCES = new Set([
  '北京', '上海', '江苏', '天津', '重庆', '江西', '辽宁', '安徽', '内蒙古', '福建',
  '宁夏', '甘肃', '青海', '广东', '山东', '广西', '山西', '贵州', '陕西', '海南',
  '四川', '河北', '西藏', '河南', '新疆', '黑龙江', '吉林', '云南', '湖北', '浙江', '湖南'
])

export class text extends plugin {
  constructor() {
    super({
      name: '憨憨文本类',
      dsc: '憨憨文本类',
      event: 'message',
      priority: 6,
      rule: [
        { reg: '^#?油价(.*)$', fnc: 'oil', dsc: '今日油价' },
        { reg: '^#?发癫(.*)', fnc: 'fadian', dsc: '发癫' },
        { reg: `^#?(${Array.from(textCommandMap.keys()).join('|')})$`, fnc: 'text', dsc: '疯狂星期四/舔狗日记等' },
        { reg: '^#?沙雕新闻$', fnc: 'sdxw', dsc: '沙雕新闻' },
        { reg: '^#?文本类菜单$', fnc: 'textMenu', dsc: '文本类菜单' }
      ]
    })
  }

  async textMenu(e) {
    await this.customReply(e, '文本类功能列表：\n#油价[省份]\n#发癫[对象]\n#kfc\n#舔狗日记\n#网易云热评\n#沙雕新闻\n以及更多...')
  }

  async sdxw(e) {
    try {
      const url = 'https://api.yujn.cn/api/shadiao.php?'
      const res = await axios.get(url, { timeout: 10000 })
      const result = res.data

      if (res.status !== 200 || !result.title) {
        return this.customReply(e, '查询失败，可能接口失效了，请联系憨憨~')
      }

      const forwardMsgs = []
      forwardMsgs.push({
        user_id: this.e.bot.uin,
        nickname: '沙雕新闻',
        message: [result.title, '\n', result.content]
      })

      if (result.images && result.images.length > 0) {
        for (const imageUrl of result.images) {
          forwardMsgs.push({ user_id: this.e.bot.uin, nickname: '沙雕图片', message: segment.image(imageUrl) })
        }
        forwardMsgs.push({ user_id: this.e.bot.uin, nickname: '提示', message: '如果图片裂开了，请复制链接到浏览器打开' })
      }

      if (result.video) {
        forwardMsgs.push({ user_id: this.e.bot.uin, nickname: '沙雕视频', message: segment.video(result.video) })
      }

      await e.reply(await e.bot.makeForwardMsg(forwardMsgs))

    } catch (error) {
      logger.error('[沙雕新闻] 请求失败:', error)
      await this.customReply(e, '连接超时，请稍候重试...')
    }
  }

  async text(e) {
    const command = e.msg.replace(/^#/, '').trim()
    const fileName = textCommandMap.get(command)

    if (!fileName) return // 理论上不会触发，因为正则已匹配

    const filePath = path.join(RootPath, 'resources', 'json', `${fileName}.json`)

    try {
      let content = await getRandomLineFromFile(filePath)
      content = he.decode(content.replace(/<br>/g, '\n'))
      await this.customReply(e, content)
    } catch (err) {
      logger.error(`[文本聚合] 读取文件失败: ${filePath}`, err)
      await this.customReply(e, '哎呀，找不到对应的文案了...')
    }
  }

  async oil(e) {
    const province = e.msg.replace(/^#?油价/, '').trim()
    if (!province) {
      return this.customReply(e, '请输入要查询的省份，例如：#油价 北京')
    }

    if (!OIL_PROVINCES.has(province)) {
      return this.customReply(e, '只支持完整的省份名称查询哦~')
    }

    const url = `https://api.qqsuu.cn/api/dm-oilprice?prov=${encodeURIComponent(province)}`
    try {
      const response = await axios.get(url, { timeout: 10000 })
      const data = response.data

      if (data.code !== 200) {
        return this.customReply(e, '查询失败, 可能接口失效了，请联系憨憨~')
      }

      const oilData = data.data
      const message = [
        `查询省份：${oilData.prov}`,
        `0#柴油：${oilData.p0}`,
        `89#汽油：${oilData.p89}`,
        `92#汽油：${oilData.p92}`,
        `95#汽油：${oilData.p95}`,
        `98#汽油：${oilData.p98}`,
        `更新时间：${oilData.time}`
      ].join('\n')

      await this.customReply(e, message)

    } catch (error) {
      logger.error(`[油价查询] 请求失败:`, error)
      await this.customReply(e, '连接超时，请稍候重试...')
    }
  }

  async fadian(e) {
    let target = ''
    const at = e.message.find(m => m.type === 'at')

    if (at) {
      // 如果有艾特，目标就是被艾特的人
      target = at.text.replace('@', '').trim()
    } else {
      // 如果没有艾特，目标是命令后的文本
      target = e.msg.replace(/^#?发癫/, '').trim()
    }

    // 如果目标仍然为空，则默认是消息发送者
    if (!target) {
      target = e.sender.card || e.sender.nickname
    }

    const filePath = path.join(RootPath, 'resources', 'json', 'psycho.json')
    try {
      let content = await getRandomLineFromFile(filePath)
      content = content.replace(/name/g, target)
      await this.customReply(e, content)
    } catch (err) {
      logger.error(`[发癫] 读取文件失败: ${filePath}`, err)
      await this.customReply(e, '哎呀，词穷了，不知道怎么发癫了...')
    }
  }

  /**
   * @param {object} e 消息事件对象
   * @param {string|object} message 要发送的消息
   */
  async customReply(e, message) {
    const recall_s = Config.recall_s ?? 0 // 默认0秒不撤回
    return e.reply(message, false, { recallMsg: recall_s })
  }
}