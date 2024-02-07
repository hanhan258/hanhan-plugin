import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
import fetch from 'node-fetch'

const originalValues = [
  '抖音变装', '快手变装', '裙子', '随机裙子', '甜妹视频', '小姐姐视频', '随机小姐姐', '双倍快乐', 'loli', '玉足',
  '黑丝视频', '白丝视频', '慢摇视频', 'cos系列', '纯情女高', '吊带系列', '完美身材',
  '热舞视频', '穿搭系列', '学姐系列', '卡哇伊', '清纯系列', '汉服系列'
]
const correspondingValues = [
  'dybianzhuang', 'ksbianzhuang', 'qunzi', 'qunzi', 'tianmei', 'yzxjj', 'yzxjj', 'shuangbei', 'loli', 'yuzu',
  'heisi', 'baisi', 'manyao', 'cos', 'nvgao', 'diaodai', 'shencai',
  'rewu', 'chuanda', 'xuejie', 'kawayi', 'qingchun', 'hanfu'

]

export class voice extends plugin {
  constructor () {
    super({
      name: '憨憨视频类',
      dsc: '憨憨视频类',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: `^#?(${originalValues.join('|')})$`,
          fnc: 'jh'
        },
        {
          reg: '^(#|/)?视频解析(.*)$',
          fnc: 'jx'
        }
      ]
    })
  }

  // 聚合
  async jh (e) {
    try {
      let name = correspondingValues[originalValues.indexOf(e.msg.replace('#', ''))]
      if (!Config.enableVideo) { return }
      let urls = `http://api.hanhan.icu:4006?category=${name}`
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 解析
  async jx (e) {
    let key = e.msg.replace(/^#?视频解析/, '').trim()
    try {
      let url = `http://api.yujn.cn/api/dspjx.php?url=${key}`
      let res = await fetch(url) // 调用接口获取数据
      let result = await res.json()
      console.log(result)
      if (result.code != 200) {
        return e.reply('api寄了')
      }
      e.reply(result.data.title)
      await e.reply(segment.video(result.data.video))
    } catch (error) {
      e.reply('报错：' + error)
    }
  }
}

async function is_MD (e) {
  if (Config.enableButton || false) {
    if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
  }
  if (e.bot.config?.markdown) { await e.reply('视频类菜单') }
}
