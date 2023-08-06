import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'icqq'
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
          reg: '^#?抖音变装$',
          fnc: 'dybz'
        },
        {
          reg: '^#?随机裙子$',
          fnc: 'sjqz'
        },
        {
          reg: '^#?甜妹$',
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
        }
      ]
    })
  }

  // 抖音变装
  async dybz (e) {
    let urls = 'http://api.yujn.cn/api/bianzhuang.php'
    let resp = await fetch(urls)
    console.log(resp.url)
    await e.reply(segment.video(resp.url))
  }

  // 随机裙子
  async sjqz (e) {
    let urls = 'http://api.yujn.cn/api/jksp.php?type=video'
    let resp = await fetch(urls)
    console.log(resp.url)
    await e.reply(segment.video(resp.url))
  }

  // 甜妹
  async tm (e) {
    let urls = 'http://api.yujn.cn/api/tianmei.php?type=video'
    let resp = await fetch(urls)
    console.log(resp.url)
    await e.reply(segment.video(resp.url))
  }

  // 随机小姐姐
  async sjxjj (e) {
    // http://shanhe.kim/api/tu/sp_xjj.php
    let urls = 'http://api.yujn.cn/api/xjj.php?'
    let resp = await fetch(urls)
    console.log(resp.url)
    await e.reply(segment.video(resp.url))
  }

  // 双倍快乐
  async sbkl (e) {
    let urls = 'http://api.yujn.cn/api/sbkl.php?type=video'
    let resp = await fetch(urls)
    console.log(resp.url)
    await e.reply(segment.video(resp.url))
  }

  // 萝莉
  async loli (e) {
    let urls = 'http://api.yujn.cn/api/luoli.php?type=video'
    let resp = await fetch(urls)
    console.log(resp.url)
    await e.reply(segment.video(resp.url))
  }

  // 玉足
  async yz (e) {
    let urls = 'http://api.yujn.cn/api/jpmt.php?type=video'
    let resp = await fetch(urls)
    console.log(resp.url)
    await e.reply(segment.video(resp.url))
  }
}
