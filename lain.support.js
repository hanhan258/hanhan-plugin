export default class Button {
  constructor() {
    this.plugin = {
      // 插件名称
      name: '憨憨插件按钮',
      dsc: '憨憨插件按钮',
      priority: 100,
      rule: [
        {
          reg: '^#?(黑丝|hs|白丝|bs|JK|jk|写真|xz|小姐姐|xjj|waifu|Girl|girl|买家秀|mt)$',
          fnc: 'girl'
        },
        {
          reg: '^#?(mc酱|小c酱|兽猫酱|随机AI|每日英语|随机柴郡|一二布布|可爱猫猫)$',
          fnc: 'photo'
        },
        {
          reg: '^#?(随机日记|新春祝福|污句子|kfc|v50|舔狗日记|网易云热评|发癫|油价)$',
          fnc: 'text'
        },
        {
          reg: '^#?video$',
          fnc: 'video'
        },
        {
          reg: '^#?voice$',
          fnc: 'voice'
        },
        {
          reg: '^#?(nav|憨憨帮助)$',
          fnc: 'help'
        }
      ]
    }
  }

  girl(e) {
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

  photo(e) {
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

  text(e) {
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
          },{
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
          },{
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

  video(e) {
    
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
              label: '黑丝视频',
              visited_label: '黑丝视频'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/黑丝视频',
              at_bot_show_channel_list: false
            }
          },
          {
            id: '5',
            render_data: {
              label: '白丝视频',
              visited_label: '白丝视频'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/白丝视频',
              at_bot_show_channel_list: false
            }
          }
        ]
      },
      {
        type: 'button',
        buttons: [
          {
            id: '6',
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
            id: '6',
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

  voice(e) {
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

  help(e) {
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
          }, {
            id: '2',
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
            id: '3',
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
            id: '3',
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
            id: '4',
            render_data: {
              label: '视频菜单',
              visited_label: '视频菜单'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/video',
              at_bot_show_channel_list: false
            }
          }, {
            id: '4',
            render_data: {
              label: '语音菜单',
              visited_label: '语音菜单'
            },
            action: {
              type: 2,
              permission: {
                type: 2
              },
              data: '/voice',
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
