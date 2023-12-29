import { Config } from '../hanhan-plugin/utils/config.js'

let list
let button

export default class Button {
  constructor () {
    this.plugin = {
      name: '憨憨插件按钮',
      dsc: '憨憨插件按钮',
      priority: 100,
      rule: [
        {
          reg: '^#?(美女类菜单|黑丝|hs|白丝|bs|JK|jk|写真|xz|小姐姐|xjj|waifu|Girl|girl|买家秀|mt)$',
          fnc: 'girl'
        },
        {
          reg: '^#?(图片类菜单|mc酱|小c酱|兽猫酱|随机AI|每日英语|随机柴郡|一二布布|可爱猫猫)$',
          fnc: 'photo'
        },
        {
          reg: '^#?(文本类菜单|随机日记|新春祝福|污句子|kfc|v50|舔狗日记|网易云热评)$',
          fnc: 'text'
        },
        {
          reg: '^#?发癫(.*)',
          fnc: 'text'
        },
        {
          reg: '^#?油价(.*)',
          fnc: 'text'
        },
        {
          reg: '^#?视频类菜单$',
          fnc: 'video'
        },
        {
          reg: '^#?语音类菜单$',
          fnc: 'voice'
        },
        {
          reg: '^#?管理类菜单$',
          fnc: 'manage'
        },
        {
          reg: '^#?(数字类菜单|408|50033|75946|36518|5670)$',
          fnc: 'number'
        },
        {
          reg: '^#?(nav|憨憨帮助)$',
          fnc: 'help'
        }
      ]
    }
  }

  girl (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: 'hs', data: '/hs' },
      { label: 'bs', data: '/bs' },
      { label: 'jk', data: '/jk' },

      { label: 'xz', data: '/xz' },
      { label: 'mt', data: '/mt' },
      { label: 'xjj', data: '/xjj' },

      { label: 'girl', data: '/girl' },
      { label: 'waifu', data: '/waifu' },
      { label: '买家秀', data: '/买家秀' }
    ]
    return toButton(list, 3)
  }

  photo (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: 'mc酱', data: '/mc酱' },
      { label: '小c酱', data: '/小c酱' },
      { label: '兽猫酱', data: '/兽猫酱' },

      { label: '每日英语', data: '/每日英语' },
      { label: '随机柴郡', data: '/随机柴郡' },
      { label: '一二布布', data: '/一二布布' },

      { label: '随机AI', data: '/随机AI' },
      { label: '可爱猫猫', data: '/可爱猫猫' }
    ]
    return toButton(list, 3)
  }

  text (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: 'kfc', data: '/kfc' },
      { label: '污句子', data: '/污句子' },

      { label: '随机日记', data: '/随机日记' },
      { label: '舔狗日记', data: '/舔狗日记' },

      { label: '新春祝福', data: '/新春祝福' },
      { label: '网易云热评', data: '/网易云热评' }
    ]
    button = [
      {
        type: 'button',
        buttons: [
          {
            id: '1',
            render_data: {
              label: '发癫',
              style: 1
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/发癫',
              at_bot_show_channel_list: false
            }
          }, {
            id: '1',
            render_data: {
              label: '油价',
              style: 1
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/油价',
              at_bot_show_channel_list: false
            }
          }
        ]
      }
    ]
    button.push(...toButton(list, 2))
    return button
  }

  video (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: 'loli', data: '/loli' },
      { label: '甜妹', data: '/甜妹' },
      { label: '玉足', data: '/玉足' },

      { label: 'cos系列', data: '/cos系列' },
      { label: '慢摇视频', data: '/慢摇视频' },
      { label: '吊带系列', data: '/吊带系列' },

      { label: '双倍快乐', data: '/双倍快乐' },
      { label: '纯情女高', data: '/纯情女高' },
      { label: '随机裙子', data: '/随机裙子' },

      { label: '抖音变装', data: '/抖音变装' },
      { label: '快手变装', data: '/快手变装' }
    ]
    return toButton(list, 3)
  }

  voice (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: '随机唱鸭', data: '/随机唱鸭' },
      { label: '随机坤坤', data: '/随机坤坤' },

      { label: '随机网易云', data: '/随机网易云' }
    ]
    return toButton(list, 2)
  }

  manage (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: '设置按钮白名单', data: '/憨憨设置按钮白名单' },
      { label: '删除按钮白名单', data: '/憨憨删除按钮白名单' },

      { label: '憨憨更新', data: '/憨憨更新' },
      { label: '强制更新', data: '/憨憨强制更新' }
    ]
    return toButton(list, 2, false)
  }

  number (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: '5670', data: '/5670' },
      { label: '50033', data: '/50033' },

      { label: '36518', data: '/36518' },
      { label: '75946', data: '/75946' }
    ]
    return toButton(list, 2)
  }

  help (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: '文本类', data: '/文本类菜单' },
      { label: '图片类', data: '/图片类菜单' },

      { label: '美女类', data: '/美女类菜单' },
      { label: '视频类', data: '/视频类菜单' },

      { label: '语音类', data: '/语音类菜单' },
      { label: '管理类', data: '/管理类菜单' },

      { label: '憨憨帮助', data: '/憨憨帮助' }
    ]
    return toButton(list, 2, false)
  }
}
function toButton (list, line = 2, allow_random = true) {
  let button = []
  let arr = []
  let index = 1
  for (const i of list) {
    arr.push({
      id: String(Date.now()),
      render_data: {
        label: i.label,
        style: 1
      },
      action: {
        type: 2,
        permission: { type: 2 },
        data: i.data,
        enter: true,
        unsupport_tips: 'code: 45'
      }
    })
    if (index % line == 0 || index == list.length) {
      button.push({
        type: 'button',
        buttons: arr
      })
      arr = []
    }
    index++
  }
  if (allow_random) {
    button.push({
      type: 'button',
      buttons: [{
        id: String(Date.now()),
        render_data: {
          label: '交给憨憨',
          style: 1
        },
        action: {
          type: 2,
          permission: { type: 2 },
          data: list[Math.floor(Math.random() * list.length)].data,
          enter: true,
          unsupport_tips: 'code: 45'
        }
      }]
    })
  }
  return button
}
