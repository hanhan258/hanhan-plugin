import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'icqq'
import fetch from 'node-fetch'

export class voice extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨视频类',
      /** 功能描述 */
      dsc: '憨憨视频类',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?抖音变装$',
          /** 执行方法 */
          fnc: 'dybz'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?随机裙子$',
          /** 执行方法 */
          fnc: 'sjqz'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?甜妹$',
          /** 执行方法 */
          fnc: 'tm'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(随机小姐姐|sjxjj)$',
          /** 执行方法 */
          fnc: 'sjxjj'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?双倍快乐$',
          /** 执行方法 */
          fnc: 'sbkl'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?(萝莉|loli)$',
          /** 执行方法 */
          fnc: 'loli'
        },
        {
          /** 命令正则匹配 */
          reg: '^#?玉足$',
          /** 执行方法 */
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
    let urls = 'http://api.yujn.cn/api/yuzu.php?type=video'
    let resp = await fetch(urls)
    console.log(resp.url)
    await e.reply(segment.video(resp.url))
  }
}
