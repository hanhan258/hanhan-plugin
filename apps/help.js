import plugin from '../../../lib/plugins/plugin.js'

export class help extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨小功能',
      /** 功能描述 */
      dsc: '憨憨写的无用小功能',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 6,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '#(nav|憨憨帮助)',
          /** 执行方法 */
          fnc: 'hanhanHelp'
        }
      ]
    })
  }

  // 憨憨帮助
  async hanhanHelp (e) {
    e.reply('憨憨小功能：\n(#)mt\n(#)mc酱\n(#)小c酱\n(#)兽猫酱\n(#)买家秀\n(#)随机ai\n(#)兽语帮助\n(#)发癫(名字)\n(#)今天是几号\n(#)url编(解)码\n(#)天气+城市名\n(#)摩斯加(解)密\n(#)历史上的今天\n(#)ping (ip/域名)\n(#)base64编(解)码\n(#)(兽语|猫语|喵语|狗语|动物语)加(解)密')
  }
}
