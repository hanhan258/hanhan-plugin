import { Config } from '../hanhan-plugin/utils/config.js'

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
    return [
      {
        type: 'button',
        buttons: [
          {
            id: '1',
            render_data: {
              label: 'hs',
              visited_label: 'hs'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/hs',
              at_bot_show_channel_list: false
            }
          }, {
            id: '1',
            render_data: {
              label: 'bs',
              visited_label: 'bs'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/bs',
              at_bot_show_channel_list: false
            }
          }, {
            id: '1',
            render_data: {
              label: 'jk',
              visited_label: 'jk'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/jk',
              at_bot_show_channel_list: false
            }
          }, {
            id: '1',
            render_data: {
              label: 'xz',
              visited_label: 'xz'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/xz',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '2',
            render_data: {
              label: 'xjj',
              visited_label: 'xjj'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/xjj',
              at_bot_show_channel_list: false
            }
          }, {
            id: '2',
            render_data: {
              label: 'waifu',
              visited_label: 'waifu'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/waifu',
              at_bot_show_channel_list: false
            }
          }, {
            id: '2',
            render_data: {
              label: 'girl',
              visited_label: 'girl'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/girl',
              at_bot_show_channel_list: false
            }
          }, {
            id: '2',
            render_data: {
              label: 'mt',
              visited_label: 'mt'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/mt',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '3',
            render_data: {
              label: '买家秀',
              visited_label: '买家秀'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/买家秀',
              at_bot_show_channel_list: false
            }
          }
        ]
      }
    ]
  }

  photo (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    return [
      {
        type: 'button',
        buttons: [
          {
            id: '1',
            render_data: {
              label: 'mc酱',
              visited_label: 'mc酱'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/mc酱',
              at_bot_show_channel_list: false
            }
          }, {
            id: '1',
            render_data: {
              label: '小c酱',
              visited_label: '小c酱'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/小c酱',
              at_bot_show_channel_list: false
            }
          }, {
            id: '1',
            render_data: {
              label: '兽猫酱',
              visited_label: '兽猫酱'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/兽猫酱',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '2',
            render_data: {
              label: '每日英语',
              visited_label: '每日英语'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/每日英语',
              at_bot_show_channel_list: false
            }
          }, {
            id: '2',
            render_data: {
              label: '随机柴郡',
              visited_label: '随机柴郡'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/随机柴郡',
              at_bot_show_channel_list: false
            }
          }, {
            id: '2',
            render_data: {
              label: '一二布布',
              visited_label: '一二布布'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/一二布布',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '3',
            render_data: {
              label: '随机AI',
              visited_label: '随机AI'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/随机AI',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '3',
            render_data: {
              label: '可爱猫猫',
              visited_label: '可爱猫猫'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/可爱猫猫',
              at_bot_show_channel_list: false
            }
          }
        ]
      }
    ]
  }

  text (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    return [
      {
        type: 'button',
        buttons: [
          {
            id: '1',
            render_data: {
              label: '发癫',
              visited_label: '发癫'
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
              visited_label: '油价'
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
      },
      {
        type: 'button',
        buttons: [
          {
            id: '2',
            render_data: {
              label: 'kfc',
              visited_label: 'kfc'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/kfc',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '2',
            render_data: {
              label: '污句子',
              visited_label: '污句子'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/污句子',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '3',
            render_data: {
              label: '随机日记',
              visited_label: '随机日记'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/随机日记',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '3',
            render_data: {
              label: '舔狗日记',
              visited_label: '舔狗日记'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/舔狗日记',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '4',
            render_data: {
              label: '新春祝福',
              visited_label: '新春祝福'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/新春祝福',
              at_bot_show_channel_list: false
            }
          }, {
            id: '4',
            render_data: {
              label: '网易云热评',
              visited_label: '网易云热评'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/网易云热评',
              at_bot_show_channel_list: false
            }
          }
        ]
      }
    ]
  }

  video (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    return [
      {
        type: 'button',
        buttons: [
          {
            id: '1',
            render_data: {
              label: 'loli',
              visited_label: 'loli'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/loli',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '1',
            render_data: {
              label: '甜妹',
              visited_label: '甜妹'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/甜妹',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '1',
            render_data: {
              label: '玉足',
              visited_label: '玉足'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/玉足',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '2',
            render_data: {
              label: 'cos系列',
              visited_label: 'cos系列'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/cos系列',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '2',
            render_data: {
              label: '慢摇视频',
              visited_label: '慢摇视频'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/慢摇视频',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '3',
            render_data: {
              label: '抖音变装',
              visited_label: '抖音变装'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/抖音变装',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '3',
            render_data: {
              label: '快手变装',
              visited_label: '快手变装'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/快手变装',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '4',
            render_data: {
              label: '双倍快乐',
              visited_label: '双倍快乐'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/双倍快乐',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '4',
            render_data: {
              label: '随机裙子',
              visited_label: '随机裙子'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/随机裙子',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '5',
            render_data: {
              label: '纯情女高',
              visited_label: '纯情女高'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/纯情女高',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '5',
            render_data: {
              label: '吊带系列',
              visited_label: '吊带系列'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/吊带系列',
              at_bot_show_channel_list: false
            }
          }
        ]
      }
    ]
  }

  voice (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    return [
      {
        type: 'button',
        buttons: [
          {
            id: '1',
            render_data: {
              label: '随机唱鸭',
              visited_label: '随机唱鸭'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/随机唱鸭',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '1',
            render_data: {
              label: '随机坤坤',
              visited_label: '随机坤坤'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/随机坤坤',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '2',
            render_data: {
              label: '随机网易云',
              visited_label: '随机网易云'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/随机网易云',
              at_bot_show_channel_list: false
            }
          }
        ]
      }
    ]
  }

  manage (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    return [
      {
        type: 'button',
        buttons: [
          {
            id: '1',
            render_data: {
              label: '设置按钮白名单',
              visited_label: '设置按钮白名单'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/憨憨设置按钮白名单',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '1',
            render_data: {
              label: '删除按钮白名单',
              visited_label: '删除按钮白名单'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/憨憨删除按钮白名单',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '2',
            render_data: {
              label: '憨憨更新',
              visited_label: '憨憨更新'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/憨憨更新',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '2',
            render_data: {
              label: '憨憨强制更新',
              visited_label: '憨憨强制更新'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/憨憨强制更新',
              at_bot_show_channel_list: false
            }
          }
        ]
      }
    ]
  }

  number (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    return [
      {
        type: 'button',
        buttons: [
          {
            id: '1',
            render_data: {
              label: '5670',
              visited_label: '5670'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/5670',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '1',
            render_data: {
              label: '50033',
              visited_label: '50033'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/50033',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '2',
            render_data: {
              label: '36518',
              visited_label: '36518'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/36518',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '2',
            render_data: {
              label: '75946',
              visited_label: '75946'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/75946',
              at_bot_show_channel_list: false
            }
          }
        ]
      }
    ]
  }

  help (e) {
    if (Config.enableButton || false) {
      if (!(Config.buttonWhiteGroups.includes(e.group_id))) { return false }
    }
    return [
      {
        type: 'button',
        buttons: [
          {
            id: '1',
            render_data: {
              label: '文本类',
              visited_label: '文本类'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/文本类菜单',
              at_bot_show_channel_list: false
            }
          }, {
            id: '1',
            render_data: {
              label: '图片类',
              visited_label: '图片类'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/图片类菜单',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '2',
            render_data: {
              label: '美女类',
              visited_label: '美女类'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/美女类菜单',
              at_bot_show_channel_list: false
            }
          }, {
            id: '2',
            render_data: {
              label: '视频类',
              visited_label: '视频类'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/视频类菜单',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '3',
            render_data: {
              label: '语音类',
              visited_label: '语音类'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/语音类菜单',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '3',
            render_data: {
              label: '管理类',
              visited_label: '管理类'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/管理类菜单',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '3',
            render_data: {
              label: '憨憨帮助',
              visited_label: '憨憨帮助'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/憨憨帮助',
              at_bot_show_channel_list: false
            }
          }
        ]
      }
    ]
  }
}
