import plugin from '../../../lib/plugins/plugin.js'
import { segment } from "oicq";
import fs from "fs";
const path = process.cwd()

const tp_bq = '/plugins/hanhan-plugin/resources/tp-bq/pictures/'           
const tp_qldt = '/plugins/hanhan-plugin/resources/tp-bq/qldt/'             
const tp_dt = '/plugins/hanhan-plugin/resources/tp-bq/dt/'
const tpgml = '/plugins/hanhan-plugin/resources/tp-bq/'

export class diaotu extends plugin {
    constructor() {
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
                    reg: '^#?原神(，|,)启动(！|!)',
                    fnc: 'ysqd'
                },
            ]
        })
    }

    async qydiaotu(e) {
        logger.info('[用户命令]'); {
            //读取文件夹里面的所有图片文件名
            let photo_list = fs.readdirSync(path + tp_qldt)
            //随机选择一个文件名
            let photo_number = Math.floor(Math.random() * photo_list.length)
            //发送图片
            e.reply(segment.image('file:///' + path + tp_qldt + photo_list[photo_number]))
        }
    }
    async bq(e) {
        logger.info('[用户命令]'); {
            //读取文件夹里面的所有图片文件名
            let photo_list = fs.readdirSync(path + tp_bq)
            //随机选择一个文件名
            let photo_number = Math.floor(Math.random() * photo_list.length)
            //发送图片
            e.reply(segment.image('file:///' + path + tp_bq + photo_list[photo_number]))
        }
    }
    async diaotu(e) {
        logger.info('[用户命令]'); {
            //读取文件夹里面的所有图片文件名
            let photo_list = fs.readdirSync(path + tp_dt)
            //随机选择一个文件名
            let photo_number = Math.floor(Math.random() * photo_list.length)
            //发送图片
            e.reply(segment.image('file:///' + path + tp_dt + photo_list[photo_number]))
        }
    }
    async ysqd(e) {
        logger.info('[用户命令]'); {
            e.reply(segment.video('file:///' + path + tpgml + 'ysqd.mp4'))
        }

    }
}