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
          reg: '^#?视频类菜单$',
          fnc: 'video'
        },
        {
          reg: '^#?美女类菜单$',
          fnc: 'girl'
        },
        {
          reg: '^#?语音类菜单$',
          fnc: 'voice'
        },
        {
          reg: '^#?文本类菜单$',
          fnc: 'text'
        },
        {
          reg: '^#?图片类菜单$',
          fnc: 'photo'
        },
        {
          reg: '^#?表情包菜单$',
          fnc: 'face'
        },
        {
          reg: '^#?管理类菜单$',
          fnc: 'set'
        },
        {
          reg: '^#(408|数字类菜单)$',
          fnc: '408'
        }
      ]
    })
  }

  async face (e) {
    e.reply('A梦 柴郡 布布\n狐狐 咖波 龙图 mc酱\n兽猫酱 库洛米 蘑菇头\n派大星 熊猫头 小黄鸡\n小灰灰 猫羽雫 小黑子')
  }

  async voice (e) {
    e.reply('随机网易云\n随机唱鸭 随机坤坤\n日语骂人 绿茶语音 ')
  }

  async girl (e) {
    e.reply('hs bs jk mt\nyht xjj waifu\n买家秀 随机ai')
  }

  async photo (e) {
    e.reply('每日英语 可爱萌宠')
  }

  async text (e) {
    e.reply('kfc 污句子\n随机日记 舔狗日记\n新春祝福 网易云热评\n发癫+昵称 油价+省份')
  }

  async set (e) {
    e.reply('#憨憨设置按钮白名单\n#憨憨删除按钮白名单\n#憨憨更新\n#憨憨强制更新')
  }

  async video (e) {
    e.reply('loli 甜妹 玉足\ncos系列 慢摇视频\n抖音变装 快手变装\n双倍快乐 随机裙子\n纯情女高 吊带系列')
  }

  async 408 (e) {
    e.reply('5670 36518\n50033 75946')
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
