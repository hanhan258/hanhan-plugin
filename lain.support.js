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
          reg: '^#?(美女类菜单|cos|黑丝|hs|白丝|bs|JK|jk|ak|国风|汉服|夏日女友|小性感|小姐姐|xjj|waifu|yht|买家秀|mt|随机ai)$',
          fnc: 'girl'
        },
        {
          reg: '^#?(图片类菜单|mc酱|兽猫酱|每日英语|萌宠|可爱萌宠|随机acg|集原美)$',
          fnc: 'photo'
        },
        {
          reg: '^#?(表情包菜单|废柴|狐狐|咖波|龙图|库洛米|小恐龙|蘑菇头|派大星|熊猫头|小黄鸡|小灰灰|甘城|小黑子|哆啦A梦|一二布布|随机柴郡)$',
          fnc: 'face'
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
          reg: '^#?(视频类菜单|(抖音|快手)变装|随机裙子|甜妹视频|随机小姐姐|sjxjj|双倍快乐|萝莉|loli|玉足|(黑|白)丝视频|慢摇视频|cos系列|纯情女高|吊带系列)$',
          fnc: 'video'
        },
        {
          reg: '^#?(语音类菜单|随机唱鸭|随机坤坤|随机网易云|随机绿茶|骂我)$',
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
        },
        {
          reg: '^#?(开启俄罗斯轮盘|开盘|开启轮盘|开启转盘|俄罗斯轮盘|结束游戏|当前子弹|开枪)$',
          fnc: 'els'
        },
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
      { label: 'mt', data: '/mt' },

      { label: 'ai', data: '/随机ai' },
      { label: 'ak', data: '/ak' },
      { label: 'jk', data: '/jk' },

      { label: 'cos', data: '/cos' },
      { label: 'xjj', data: '/xjj' },
      { label: 'yht', data: '/yht' },

      { label: '汉服', data: '/汉服' },
      { label: '国风', data: '/国风' },
      { label: 'waifu', data: '/waifu' },

      { label: '小性感', data: '/小性感' },
      { label: '夏日女友', data: '/夏日女友' },
      { label: '买家秀', data: '/买家秀' }
    ]
    return toButton(list, 4)
  }

  photo (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: 'acg', data: '/随机acg' },
      { label: '萌宠', data: '/萌宠' },
      { label: 'mc酱', data: '/mc酱' },

      { label: '兽猫酱', data: '/兽猫酱' },
      { label: '每日英语', data: '/每日英语' },
      { label: '集原美', data: '/集原美' }
    ]
    return toButton(list, 3)
  }

  face (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: '狐狐', data: '/狐狐' },
      { label: '咖波', data: '/咖波' },
      { label: '龙图', data: '/龙图' },
      { label: '甘城', data: '/甘城' },

      { label: 'A梦', data: '/哆啦A梦' },
      { label: '柴郡', data: '/随机柴郡' },
      { label: '布布', data: '/一二布布' },
      { label: '废柴', data: '/废柴' },

      { label: '小恐龙', data: '/小恐龙' },
      { label: '库洛米', data: '/库洛米' },
      { label: '派大星', data: '/派大星' },
      { label: '小灰灰', data: '/小灰灰' },

      { label: '小黄鸡', data: '/小黄鸡' },
      { label: '小黑子', data: '/小黑子' },
      { label: '蘑菇头', data: '/蘑菇头' },
      { label: '熊猫头', data: '/熊猫头' }
    ]
    return toButton(list, 4)
  }

  text (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    button = []
    list = [
      { label: '发癫', data: `/发癫 可爱的<@${e.sender.user_openid}>酱`, enter: false },
      { label: '油价', data: '/油价', enter: false },
      
      { label: 'kfc', data: '/kfc' },
      { label: '污句子', data: '/污句子' },

      { label: '随机日记', data: '/随机日记' },
      { label: '舔狗日记', data: '/舔狗日记' },

      { label: '新春祝福', data: '/新春祝福' },
      { label: '网易云热评', data: '/网易云热评' }
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
      { label: '甜妹', data: '/甜妹视频' },
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
      { label: '骂我', data: '/骂我' },
      { label: '绿茶', data: '/随机绿茶' },

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

      { label: '表情包', data: '/表情包菜单' },
      { label: '美女类', data: '/美女类菜单' },

      { label: '视频类', data: '/视频类菜单' },
      { label: '语音类', data: '/语音类菜单' },

      { label: '管理类', data: '/管理类菜单' },
      { label: '憨憨帮助', data: '/憨憨帮助' }
    ]
    return toButton(list, 2, false)
  }

  els (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: '轮到我了吗', data: '/开枪' },
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
        enter: i.enter !== undefined ? i.enter : true,
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
