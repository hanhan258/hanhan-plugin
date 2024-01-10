import plugin from '../../../lib/plugins/plugin.js'

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
        }
      ]
    })
  }

  // 穿搭系列
  async cdxl (e) {
    try {
      let urls = 'http://api.yujn.cn/api/chuanda.php?type=video'
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
      let urls = 'http://api.yujn.cn/api/rewu.php?type=video'
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
      let urls = 'http://api.yujn.cn/api/wmsc.php?type=video'
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
      let urls
      if (e.msg.includes('抖音')) {
        urls = 'http://api.yujn.cn/api/bianzhuang.php'
      } else if (e.msg.includes('快手')) {
        urls = 'http://api.yujn.cn/api/ksbianzhuang.php?type=video'
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
    try {
      let urls = 'http://api.yujn.cn/api/jksp.php?type=video'
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
      let urls = 'http://api.yujn.cn/api/tianmei.php?type=video'
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
      // http://shanhe.kim/api/tu/sp_xjj.php
      let urls = 'http://api.yujn.cn/api/xjj.php?'
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
      let urls = 'http://api.yujn.cn/api/sbkl.php?type=video'
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
      let urls = 'http://api.yujn.cn/api/luoli.php?type=video'
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
      let urls = 'http://api.yujn.cn/api/jpmt.php?type=video'
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
      let urls
      if (e.msg.includes('黑丝视频')) {
        urls = ' http://api.yujn.cn/api/heisis.php'
      } else if (e.msg.includes('白丝视频')) {
        urls = ' http://api.yujn.cn/api/baisis.php'
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
      let urls = 'http://api.yujn.cn/api/manyao.php?type=video'
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
      let urls = 'http://api.yujn.cn/api/COS.php?type=video'
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
      let urls = 'http://api.yujn.cn/api/nvgao.php?type=video'
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
      let urls = 'http://api.yujn.cn/api/diaodai.php?type=video'
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
  if (e.bot.config?.markdown) { await e.reply('视频类菜单') }
}
