import { Config } from './utils/config.js'

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
          reg: '^#?(美女类菜单|cos|黑丝|hs|白丝|bs|JK|jk|ak|国风|汉服|夏日女友|小性感|小姐姐|xjj|waifu|yht|买家秀|mt|ai)$',
          fnc: 'girl'
        },
        {
          reg: '^#?随机(.*)吧',
          fnc: 'text'
        },
        {
          reg: '^#?(图片类菜单|甘城|mc酱|兽猫酱|每日英语|萌宠|可爱萌宠|acg|集原美|情侣头像)$',
          fnc: 'photo'
        },
        {
          reg: '^#?(表情包菜单|废柴|狐狐|咖波|龙图|库洛米|小恐龙|蘑菇头|派大星|熊猫头|小黄鸡|小灰灰|小豆泥|小黑子|哆啦A梦|一二布布|柴郡|随机柴郡)$',
          fnc: 'face'
        },
        {
          reg: '^#?(文本类菜单|日记|新春祝福|污句子|kfc|v50|舔狗日记|网易云热评|英雄联盟台词)$',
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
          reg: '^#?(视频类菜单|卡哇伊|学姐系列|汉服系列|清纯系列|(抖音|快手)变装|裙子|甜妹视频|小姐姐视频|sjxjj|双倍快乐|萝莉|loli|玉足|(黑|白)丝视频|慢摇视频|cos系列|纯情女高|吊带系列|完美身材|穿搭系列|热舞视频)$',
          fnc: 'video'
        },
        {
          reg: '^#?(语音类菜单|(随机)?唱鸭|坤坤语音|网易云|绿茶|骂我)$',
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
        }
      ]
    }
    this.enableButton = Config.enableButton || false
  }

  girl (e) {
    if (this.enableButton && e.bot?.adapter == 'QQBot') {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: 'hs', callback: 'hs' },
      { label: 'bs', callback: 'bs' },
      { label: 'mt', callback: 'mt' },

      { label: 'ai', callback: 'ai' },
      { label: 'ak', callback: 'ak' },
      { label: 'jk', callback: 'jk' },

      { label: 'cos', callback: 'cos' },
      { label: 'xjj', callback: 'xjj' },
      { label: 'yht', callback: 'yht' },

      { label: '汉服', callback: '汉服' },
      { label: '国风', callback: '国风' },
      { label: 'waifu', callback: 'waifu' },

      { label: '小性感', callback: '小性感' },
      { label: '夏日女友', callback: '夏日女友' },
      { label: '买家秀', callback: '买家秀' }
    ]
    return toButton(list, 4)
  }

  photo (e) {
    if (this.enableButton && e.bot?.adapter == 'QQBot') {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: 'acg', callback: 'acg' },
      { label: '甘城', callback: '甘城' },
      { label: '萌宠', callback: '萌宠' },

      { label: 'mc酱', callback: 'mc酱' },
      { label: '兽猫酱', callback: '兽猫酱' },
      { label: '集原美', callback: '集原美' },

      { label: '情侣头像', callback: '情侣头像' },
      { label: '每日英语', callback: '每日英语' }
    ]
    return toButton(list, 3)
  }

  face (e) {
    if (this.enableButton && e.bot?.adapter == 'QQBot') {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: '狐狐', callback: '狐狐' },
      { label: '咖波', callback: '咖波' },
      { label: '龙图', callback: '龙图' },
      { label: '豆泥', callback: '小豆泥' },

      { label: 'A梦', callback: '哆啦A梦' },
      { label: '柴郡', callback: '柴郡' },
      { label: '布布', callback: '一二布布' },
      { label: '废柴', callback: '废柴' },

      { label: '小恐龙', callback: '小恐龙' },
      { label: '库洛米', callback: '库洛米' },
      { label: '派大星', callback: '派大星' },
      { label: '小灰灰', callback: '小灰灰' },

      { label: '小黄鸡', callback: '小黄鸡' },
      { label: '小黑子', callback: '小黑子' },
      { label: '蘑菇头', callback: '蘑菇头' },
      { label: '熊猫头', callback: '熊猫头' }
    ]
    return toButton(list, 4)
  }

  text (e) {
    if (this.enableButton && e.bot?.adapter == 'QQBot') {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    button = []
    const nickname = (e.user_id == e.sender.card) ? `可爱的<@${e.sender.user_openid}>酱` : e.sender.card
    list = [
      { label: '发癫', data: '发癫' },
      { label: 'at发癫', data: `发癫 ${nickname}` },
      { label: 'kfc', callback: 'kfc' },

      { label: '油价', data: '油价' },
      { label: '污句子', callback: '污句子' },
      { label: '随机日记', callback: '日记' },

      { label: '舔狗日记', callback: '舔狗日记' },
      { label: '新春祝福', callback: '新春祝福' },
      { label: '随机贴吧', data: '随机 吧' },

      { label: '英雄联盟台词', callback: '英雄联盟台词' },
      { label: '网易云热评', callback: '网易云热评' }
    ]
    button.push(...toButton(list, 3))
    return button
  }

  video (e) {
    if (this.enableButton && e.bot?.adapter == 'QQBot') {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: 'cos', callback: 'cos系列' },
      { label: 'loli', callback: 'loli' },
      { label: '甜妹', callback: '甜妹视频' },
      { label: '玉足', callback: '玉足' },
      { label: '慢摇', callback: '慢摇视频' },

      { label: '黑丝', callback: '黑丝视频' },
      { label: '白丝', callback: '白丝视频' },
      { label: '吊带', callback: '吊带系列' },
      { label: '裙子', callback: '裙子' },
      { label: '汉服', callback: '汉服系列' },

      { label: '女高', callback: '纯情女高' },
      { label: '双倍', callback: '双倍快乐' },
      { label: '热舞', callback: '热舞视频' },
      { label: '身材', callback: '完美身材' },
      { label: '穿搭', callback: '穿搭系列' },

      { label: '学姐', callback: '学姐系列' },
      { label: '清纯', callback: '清纯系列' },
      { label: '卡哇', callback: '卡哇伊' },
      { label: '抖音', callback: '抖音变装' },
      { label: '快手', callback: '快手变装' }
    ]
    return toButton(list, 5)
  }

  voice (e) {
    if (this.enableButton && e.bot?.adapter == 'QQBot') {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: '骂我', callback: '骂我' },
      { label: '绿茶', callback: '绿茶' },

      { label: '随机唱鸭', callback: '唱鸭' },
      { label: '随机坤坤', callback: '坤坤语音' },

      { label: '随机网易云', callback: '网易云' }
    ]
    return toButton(list, 2)
  }

  manage (e) {
    if (this.enableButton && e.bot?.adapter == 'QQBot') {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: '设置按钮白名单', data: '#憨憨设置按钮白名单' },
      { label: '删除按钮白名单', data: '#憨憨删除按钮白名单' },

      { label: '憨憨更新', data: '#憨憨更新' },
      { label: '强制更新', data: '#憨憨强制更新' }
    ]
    return toButton(list, 2, false)
  }

  number (e) {
    if (this.enableButton && e.bot?.adapter == 'QQBot') {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: '5670', callback: '5670' },
      { label: '50033', callback: '50033' },

      { label: '36518', callback: '36518' },
      { label: '75946', callback: '75946' }
    ]
    return toButton(list, 2)
  }

  help (e) {
    if (this.enableButton && e.bot?.adapter == 'QQBot') {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: '文本类', callback: '文本类菜单' },
      { label: '图片类', callback: '图片类菜单' },

      { label: '表情包', callback: '表情包菜单' },
      { label: '美女类', callback: '美女类菜单' },

      { label: '视频类', callback: '视频类菜单' },
      { label: '语音类', callback: '语音类菜单' },

      { label: '管理类', callback: '管理类菜单' },
      { label: '憨憨帮助', callback: '憨憨帮助' }
    ]
    return toButton(list, 2, false)
  }

  els (e) {
    if (this.enableButton && e.bot?.adapter == 'QQBot') {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    list = [
      { label: '轮到我了吗', callback: '开枪' }
    ]
    return toButton(list, 2, false)
  }
}
function toButton (list, line = 2, allow_random = true) {
  let button = []
  let arr = []
  let index = 0
  let random_callback = []
  for (const i of list) {
    arr.push(i)
    index++
    if (index == line) { // 转化为二维数组
      index = 0
      button.push(arr)
      arr = []
    }
    if (allow_random && i.callback) { random_callback.push(i.callback) } // 仅添加enter: true的
  }
  if (random_callback.length > 0) { // 处理随机
    random_callback = random_callback[Math.floor(Math.random() * random_callback.length)]
    // 说明有五行，随机应追加在第五行末尾以节约空间
    if (arr.length > 0 && button.length >= 4) {
      arr.push({ label: '随机', callback: `${random_callback}` })
    } else {
      if (arr.length > 0) { // 如果有剩下尾巴，处理尾巴
        button.push(arr)
        arr = []
      }
      button.push([{ label: '随机一个', callback: `${random_callback}` }]) // 添加一行随机
    }
  }
  if (arr.length > 0) { // 如果有剩下尾巴，处理尾巴
    button.push(arr)
    arr = []
  }
  return Bot.Button(button)
}
