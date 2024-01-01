import plugin from '../../../lib/plugins/plugin.js'

import fs from 'fs'
const path = process.cwd()

const TPBQ = '/plugins/hanhan-plugin/resources/tp-bq/pictures/'
const tpQLDT = '/plugins/hanhan-plugin/resources/tp-bq/qldt/'
const TPDT = '/plugins/hanhan-plugin/resources/tp-bq/dt/'
const TPGML = '/plugins/hanhan-plugin/resources/tp-bq/'

export class diaotu extends plugin {
  constructor () {
    super({
      name: '憨憨叼图',
      dsc: '憨憨叼图',
      event: 'message',
      priority: 49,
      rule: [
        {
          reg: '^#?来张(表情图|表情)$',
          fnc: 'bq'
        },
        {
          reg: '^#?(叼|吊|屌|沙雕)发言$',
          fnc: 'qydiaotu'
        },
        {
          reg: '^#?来张(叼|雕|吊)图$',
          fnc: 'diaotu'
        },
        {
          reg: '^#?原神(，|,)启动(！|!)$',
          fnc: 'ysqd'
        }
      ]
    })
  }

  async qydiaotu (e) {
    logger.info('[用户命令]'); {
      // 读取文件夹里面的所有图片文件名
      let photoList = fs.readdirSync(path + tpQLDT)
      // 随机选择一个文件名
      let photoNumber = Math.floor(Math.random() * photoList.length)
      // 发送图片
      e.reply(segment.image('file:///' + path + tpQLDT + photoList[photoNumber]))
    }
  }

  async bq (e) {
    logger.info('[用户命令]'); {
      // 读取文件夹里面的所有图片文件名
      let photoList = fs.readdirSync(path + TPBQ)
      // 随机选择一个文件名
      let photoNumber = Math.floor(Math.random() * photoList.length)
      // 发送图片
      e.reply(segment.image('file:///' + path + TPBQ + photoList[photoNumber]))
    }
  }

  async diaotu (e) {
    logger.info('[用户命令]'); {
      // 读取文件夹里面的所有图片文件名
      let photoList = fs.readdirSync(path + TPDT)
      // 随机选择一个文件名
      let photoNumber = Math.floor(Math.random() * photoList.length)
      // 发送图片
      e.reply(segment.image('file:///' + path + TPDT + photoList[photoNumber]))
    }
  }

  async ysqd (e) {
    logger.info('[用户命令]')
    e.reply(segment.video('file:///' + path + TPGML + 'ysqd.mp4'))
  }
}
