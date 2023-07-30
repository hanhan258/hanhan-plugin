import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'icqq'
import fs from 'fs'
const path = process.cwd()

const TPBQ = '/plugins/hanhan-plugin/resources/tp-bq/pictures/'
const tpQLDT = '/plugins/hanhan-plugin/resources/tp-bq/qldt/'
const TPDT = '/plugins/hanhan-plugin/resources/tp-bq/dt/'
const TPGML = '/plugins/hanhan-plugin/resources/tp-bq/'

export class diaotu extends plugin {
  constructor () {
    super({
      /** 功能名称 */
      name: '憨憨叼图',
      /** 功能描述 */
      dsc: '憨憨叼图',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 49,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#?来张(表情图|表情)$',
          /** 执行方法 */
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
        },
        {
          reg: '^#?(坤坤|小黑子|鸡|cxk|鸡脚|鸽鸽|哥哥)$',
          fnc: 'cxk'
        },
        {
          reg: '^#?随机表情$',
          fnc: 'sjbq'
        }
      ]
    })
  }

  // 随机表情
  async sjbq (e) {
    // 发送消息
    let resp = await fetch('http://api.yujn.cn/api/emo.php')
    let result = await resp.text()
    await this.reply(segment.image(result))
    return true // 返回true 阻挡消息不再往下
  }

  // 随机坤坤
  async cxk (e) {
    // 发送消息
    await this.reply(segment.image('http://api.yujn.cn/api/cxk.php'))
    return true // 返回true 阻挡消息不再往下
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
