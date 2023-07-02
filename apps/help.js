import plugin from '../../../lib/plugins/plugin.js'

export class help extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨Help',
      /** 功能描述 */
      dsc: '憨憨Help',
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
        },
        {
          /** 命令正则匹配 */
          reg: '^#搜一搜帮助$',
          /** 执行方法 */
          fnc: 'so_help'
        }
      ]
    })
  }

  // 憨憨帮助
  async hanhanHelp (e) {
    await e.runtime.render('hanhan-plugin', '/help/help.html')
  }

  async so_help (e) {
  /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)
    await e.runtime.render('hanhan-plugin', '/help/sys.html')
  }
}
