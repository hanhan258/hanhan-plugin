import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'

import fetch from 'node-fetch'

export class voice extends plugin {
  constructor () {
    super({
      name: '憨憨视频类',
      dsc: '憨憨视频类',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?(抖音|快手)变装$',
          fnc: 'dyksbz'
        },
        {
          reg: '^#?随机裙子$',
          fnc: 'sjqz'
        },
        {
          reg: '^#?甜妹(视频)$',
          fnc: 'tm'
        },
        {
          reg: '^#?(随机小姐姐|sjxjj)$',
          fnc: 'sjxjj'
        },
        {
          reg: '^#?双倍快乐$',
          fnc: 'sbkl'
        },
        {
          reg: '^#?(萝莉|loli)$',
          fnc: 'loli'
        },
        {
          reg: '^#?玉足$',
          fnc: 'yz'
        },
        {
          reg: '^#?(黑|白)丝视频$',
          fnc: 'hbssp'
        },
        // {
        //   reg: '^#?原神cos$',
        //   fnc: 'yscos'
        // },
        {
          reg: '^#?慢摇视频$',
          fnc: 'mysp'
        },
        {
          reg: '^#?cos系列$',
          fnc: 'cosxl'
        },
        {
          reg: '^#?纯情女高$',
          fnc: 'cqng'
        },
        {
          reg: '^#?吊带系列$',
          fnc: 'ddxl'
        },
        {
          reg: '^#?完美身材$',
          fnc: 'wmsc'
        },
        {
          reg: '^#?热舞视频$',
          fnc: 'rwsp'
        },
        {
          reg: '^#?穿搭系列$',
          fnc: 'cdxl'
        },
        {
          reg: '^#?学姐系列$',
          fnc: 'xjxl'
        },
        {
          reg: '^#?卡哇伊$',
          fnc: 'kwy'
        },
        {
          reg: '^#?清纯系列$',
          fnc: 'qcxl'
        },
        {
          reg: '^#?汉服系列$',
          fnc: 'hfxl'
        }
      ]
    })
  }

  // 汉服系列
  async hfxl (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=hanfu'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      // await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 清纯系列
  async qcxl (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=qingchun'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      // await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 卡哇伊
  async kwy (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=kawayi'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      // await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 学姐系列
  async xjxl (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=xuejie'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      // await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 穿搭系列
  async cdxl (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=chuanda'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 热舞视频
  async rwsp (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=rewu'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 完美身材
  async wmsc (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=shencai'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 抖音快手变装
  async dyksbz (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls
      if (e.msg.includes('抖音')) {
        urls = 'http://api.hanhanz.gq:4006?category=dybianzhuang'
      } else if (e.msg.includes('快手')) {
        urls = 'http://api.hanhanz.gq:4006?category=ksbianzhuang'
      }
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 随机裙子
  async sjqz (e) {
    if (!Config.enableVideo) { return }
    try {
      let urls = 'http://api.hanhanz.gq:4006?category=qunzi'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 甜妹
  async tm (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=tianmei'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 随机小姐姐
  async sjxjj (e) {
    try {
      if (!Config.enableVideo) { return }
      // http://shanhe.kim/api/tu/sp_xjj.php
      let urls = 'http://api.hanhanz.gq:4006?category=yzxjj'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 双倍快乐
  async sbkl (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=shuangbei'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 萝莉
  async loli (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=loli'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 玉足
  async yz (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=yuzu'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 黑白丝
  async hbssp (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls
      if (e.msg.includes('黑丝视频')) {
        urls = 'http://api.hanhanz.gq:4006?category=heisi'
      } else if (e.msg.includes('白丝视频')) {
        urls = 'http://api.hanhanz.gq:4006?category=baisi'
      }
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // // 原神Cos
  // async yscos (e) {
  //   let urls = 'http://api.cmvip.cn/API/ysxl.php'
  //   let resp = await fetch(urls)
  //   console.log(resp.url)
  //   await e.reply(segment.video(resp.url))
  // }

  // 慢摇视频
  async mysp (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=manyao'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // Cos系列
  async cosxl (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=cos'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 纯情女高
  async cqng (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=nvgao'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
    } catch (error) {
      e.reply('报错：' + error)
    }
  }

  // 吊带系列
  async ddxl (e) {
    try {
      if (!Config.enableVideo) { return }
      let urls = 'http://api.hanhanz.gq:4006?category=diaodai'
      let resp = await fetch(urls)
      console.log(resp.url)
      await e.reply(segment.video(resp.url))
      await is_MD(e)
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
