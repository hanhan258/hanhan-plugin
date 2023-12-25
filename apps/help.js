import lodash from 'lodash'
import { Data } from '../components/index.js'
import HelpTheme from './help/HelpTheme.js'
import runtimeRender from '../common/runtimeRender.js'

export class help extends plugin {
  constructor () {
    super({
      name: '憨憨帮助',
      dsc: '憨憨帮助',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^#?(nav|憨憨帮助)$',
          fnc: 'help'
        },
        {
          reg: '^#?搜一搜帮助$',
          fnc: 'so_help'
        },
        {
          reg: '^#?video$',
          fnc: 'video'
        },
        {
          reg: '^#?voice$',
          fnc: 'voice'
        }
      ]
    })
  }

  async voice (e) {
    e.reply('随机唱鸭\n随机坤坤\n随机网易云') 
  }

  async video (e) {
    e.reply('loli 甜妹 玉足\ncos系列 慢摇视频\n抖音变装 快手变装\n双倍快乐 随机裙子\n黑丝视频 白丝视频\n纯情女高 吊带系列') 
  }

  async help (e) {
    let custom = {}
    let help = {}
    let { diyCfg, sysCfg } = await Data.importCfg('help')

    // 兼容一下旧字段
    if (lodash.isArray(help.helpCfg)) {
      custom = {
        helpList: help.helpCfg,
        helpCfg: {}
      }
    } else {
      custom = help
    }

    let helpConfig = lodash.defaults(diyCfg.helpCfg || {}, custom.helpCfg, sysCfg.helpCfg)
    let helpList = diyCfg.helpList || custom.helpList || sysCfg.helpList

    let helpGroup = []

    lodash.forEach(helpList, (group) => {
      if (group.auth && group.auth === 'master' && !e.isMaster) {
        return true
      }

      lodash.forEach(group.list, (help) => {
        let icon = help.icon * 1
        if (!icon) {
          help.css = 'display:none'
        } else {
          let x = (icon - 1) % 10
          let y = (icon - x - 1) / 10
          help.css = `background-position:-${x * 50}px -${y * 50}px`
        }
      })

      helpGroup.push(group)
    })
    let themeData = await HelpTheme.getThemeData(diyCfg.helpCfg || {}, sysCfg.helpCfg || {})
    return await runtimeRender(e, 'help/index', {
      helpCfg: helpConfig,
      helpGroup,
      ...themeData,
      element: 'default'
    }, {
      scale: 1.6
    })
  }

  async so_help (e) {
    /** e.msg 用户的命令消息 */
    logger.info('[用户命令]', e.msg)
    await e.runtime.render('hanhan-plugin', '/help/sys.html')
  }
}
