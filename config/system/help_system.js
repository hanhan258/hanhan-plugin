/**
* 请注意，系统不会读取help_default.js ！！！！
* 【请勿直接修改此文件，且可能导致后续冲突】
*
* 如需自定义可将文件【复制】一份，并重命名为 help.js
*
* */

export const helpCfg = {
  title: '憨憨帮助',
  subTitle: 'Yunzai-Bot & hanhan-plugin',
  columnCount: 3,
  colWidth: 275,
  theme: 'all',
  themeExclude: ['default'],
  style: {
    fontColor: '#ceb78b',
    descColor: '#eee',
    contBgColor: 'rgba(6, 21, 31, .5)',
    contBgBlur: 3,
    headerBgColor: 'rgba(6, 21, 31, .4)',
    rowBgColor1: 'rgba(6, 21, 31, .2)',
    rowBgColor2: 'rgba(6, 21, 31, .35)'
  }
}

export const helpList = [
  {
    group: 'Game',
    list: [{
      title: '#开启俄罗斯轮盘',
      desc: '俄罗斯转盘'
    }, {
      title: '#开枪',
      desc: '开枪'
    }
    ]
  }, {
    group: 'Text',
    list: [
      {
        title: '污句子',
        desc: '随机污句子'
      }, {
        title: '随机日记',
        desc: '返回各种日记'
      }, {
        title: '舔狗日记',
        desc: '返回舔狗日记'
      }, {
        title: '新春祝福',
        desc: '拜个早年'
      }, {
        title: '网易云热评',
        desc: '返回一条网易云热评'
      }, {
        title: '人生倒计时',
        desc: '看看过了多久'
      }, {
        title: '今天是几号',
        desc: '看看今天农历几号，是什么节气'
      }, {
        title: '历史上的今天',
        desc: '看看历史上的今天发生了什么'
      }, {
        title: '油价+省份',
        desc: '各省油价（只支持省份）'
      }
    ]
  }, {
    group: 'Photo',
    list: [{
      title: '手写+文字',
      desc: '手写字'
    }, {
      title: 'mc酱',
      desc: '随机返回mc酱'
    }, {
      title: '小c酱',
      desc: '随机返回小c酱'
    }, {
      title: '兽猫酱',
      desc: '随机返回兽猫酱'
    }, {
      title: '随机柴郡',
      desc: '可爱柴郡（超了）'
    }, {
      title: '一二布布',
      desc: '一二布布表情包'
    }, {
      title: '随机表情',
      desc: '随机表情包'
    }, {
      title: '随机东方',
      desc: '随机东方图片'
    }, {
      title: '每日英语',
      desc: '学习时间到'
    }, {
      title: '转二维码',
      desc: '转二维码'
    }, {
      title: '转两层二维码',
      desc: '二维码套娃'
    }
    ]
  }, {
    group: 'Girl',
    list: [{
      title: 'mt',
      desc: '腿子'
    }, {
      title: 'JK',
      desc: 'JK'
    }, {
      title: 'girl',
      desc: '一个girl'
    }, {
      title: 'waifu',
      desc: '嘿嘿嘿~老婆'
    }, {
      title: '黑丝',
      desc: '黑丝捏'
    }, {
      title: '白丝',
      desc: '白丝捏'
    }, {
      title: '写真',
      desc: '写真捏'
    }, {
      title: '小姐姐',
      desc: '小姐姐捏'
    }, {
      title: '随机ai',
      desc: '随机ai图片'
    }, {
      title: '随机acg',
      desc: '随机acg图片'
    }, {
      title: 'loli',
      desc: 'loli视频'
    }, {
      title: '甜妹',
      desc: '甜妹视频'
    }, {
      title: '抖音变装',
      desc: '抖音变装视频'
    }, {
      title: '随机小姐姐',
      desc: '甜妹视频'
    }, {
      title: '双倍快乐',
      desc: '分屏快乐'
    }, {
      title: '玉足',
      desc: '玉足、美腿视频'
    }, {
      title: '随机裙子',
      desc: 'JK、洛丽塔视频'
    }
    ]
  }, {
    group: 'Other',
    list: [{
      title: '小黑子',
      desc: '不要黑我家哥哥'
    }, {
      title: '叼发言',
      desc: '逆天'
    }, {
      title: '随机唱鸭',
      desc: '随机返回唱歌语音'
    }, {
      title: '随机坤坤',
      desc: '坤坤语音'
    }, {
      title: '来张表情',
      desc: '表情包'
    }, {
      title: '来张叼图',
      desc: '好叼'
    }, {
      title: '原神，启动！',
      desc: '原神，启动！'
    }
    ]
  }, {
    group: 'Tool',
    list: [{
      title: '#ping ip(域名)',
      desc: 'ping(不显示ip)'
    }, {
      title: '#Ping ip(域名)',
      desc: 'Ping(显示ip)'
    }, {
      title: '#憨憨设置pingtoken',
      desc: '设置pingtoken'
    }, {
      title: '#url编码+内容',
      desc: 'url编码'
    }, {
      title: '#url解码+内容',
      desc: 'url解码'
    }, {
      title: '#摩斯加密+内容',
      desc: '摩斯电码加密'
    }, {
      title: '#摩斯解密+内容',
      desc: '摩斯电码解密'
    }, {
      title: '#base64编码+内容',
      desc: 'base64编码'
    }, {
      title: '#base64解码+内容',
      desc: 'base64解码'
    }
    ]
  }, {
    group: 'Manage',
    list: [{
      title: '#憨憨更新',
      desc: '更新插件'
    }, {
      title: '#憨憨强制更新',
      desc: '强制更新'
    }
    ]
  }
]
