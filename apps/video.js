import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
import fetch from 'node-fetch'

const valueMap = {
  抖音变装: 'dybianzhuang',
  快手变装: 'ksbianzhuang',
  裙子: 'qunzi',
  随机裙子: 'qunzi',
  甜妹视频: 'tianmei',
  小姐姐视频: 'yzxjj',
  随机小姐姐: 'yzxjj',
  双倍快乐: 'shuangbei',
  loli: 'loli',
  玉足: 'yuzu',
  黑丝视频: 'heisi',
  白丝视频: 'baisi',
  慢摇视频: 'manyao',
  cos系列: 'cos',
  纯情女高: 'nvgao',
  吊带系列: 'diaodai',
  完美身材: 'shencai',
  热舞视频: 'rewu',
  穿搭系列: 'chuanda',
  学姐系列: 'xuejie',
  卡哇伊: 'kawayi',
  清纯系列: 'qingchun',
  汉服系列: 'hanfu'
}

export class voice extends plugin {
  constructor () {
    super({
      name: '憨憨视频类',
      dsc: '憨憨视频类',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: `^#?(${Object.keys(valueMap).join('|')})$`,
          fnc: 'jh'
        },
        {
          reg: '^#视频解析(.*)$',
          fnc: 'jx'
        },
        {
          reg: '^#?视频类菜单$',
          fnc: 'helps'
        }
      ]
    })
  }

  async helps (e) {
    if (e.bot.config?.markdown) { return await e.reply('按钮菜单') }
  }

  // 聚合
  async jh (e) {
    try {
      let name = valueMap[e.msg.replace('#', '')]
      if (!Config.enableVideo) { return }
      let urls = `http://ap.hanhan.icu:4006?category=${name}`
      let resp = await fetch(urls)
      // console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 解析
  async jx (e) {
    let key = e.msg.replace(/^#视频解析/, '').trim()
    try {
      let url = `http://api.yujn.cn/api/dspjx.php?url=${key}`
      let res = await fetch(url) // 调用接口获取数据
      let result = await res.json()
      console.log(result)
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
