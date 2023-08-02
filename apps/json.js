import fs from 'fs'
import { segment } from 'icqq'

const RootPath = process.cwd() + '/plugins/hanhan-plugin/'
export default class json extends plugin {
    constructor() {
        super({
            name: '憨憨卡片',
            priority: 50,
            rule: [
                {
                    reg: '#发红包$',
                    fnc: 'hb'
                },
                {
                    reg: '#fuck$',
                    fnc: 'fuck'
                },
                {
                    reg: '#卡片黑丝$',
                    fnc: 'mv'
                },
                {
                    reg: `#发送(.*)到`,
                    fnc: 'sendMsdTOTargetGroup'
                },
                {
                    reg: "^#(发送)json(消息|信息)?([\\s\\S]*)$",
                    fnc: 'sendJson'
                }
            ],
        })
    }

    async sendJson(e) {
        let messag = e.msg;
        messag = messag.replace('#发送json', '')
        messag = messag.replace('消息', '')
        messag = messag.replace('信息', '')
        if (!messag) return;
        logger.info(messag)
        let msg = [{ type: 'json', data: `${messag}` }]
        this.reply(msg)
        return true;
    }

    async hb(e) {
        let json = this.getFileDataToJson('/resources/json/QQjson.json')['红包']
        e.reply(segment.json(JSON.stringify(json)))
    }

    async mv(e) {
        let json = this.getFileDataToJson('/resources/json/QQjson.json')['卡片黑丝']
        e.reply(segment.json(JSON.stringify(json)))
    }

    async fuck(e) {
        let json = this.getFileDataToJson('/resources/json/QQjson.json')['fuck']
        let msg = segment.json(JSON.stringify(json))
        e.reply(msg)
    }

    //获取Json数据
    getFileDataToJson(fileName, type = 'utf-8') {
        return JSON.parse(fs.readFileSync(RootPath + fileName, { encoding: type }) || null)
    }

    //指定群发消息
    async sendMsdTOTargetGroup(e) {
        let target = e.msg.replace(/#发送(.*)到/, '').trim()
        let key
        if (e.msg.includes('红包')) {
            key = '红包'
        } else if (e.msg.includes('黑丝')) {
            key = '卡片黑丝'
        } else if (e.msg.includes('fuck')) {
            key = 'fuck'
        }
        console.log(target)
        if (!target) return e.reply('你没有输入要发送的群聊')
        let groupList = await Bot.getGroupList()
        // console.log(groupList)
        console.log(groupList.get(target))
        try {
            if (!groupList.has(target)) {
                let group = await Bot.pickGroup(target)
                let msg = segment.json(JSON.stringify(this.getFileDataToJson('/resources/json/QQjson.json')[`${key}`]))
                console.log(msg)
                await group.sendMsg(msg)
                e.reply('发送成功')
            }
        } catch (err) {
            return e.reply(`failed to send msg, error: ${JSON.stringify(err)}`)
        }
    }
}
