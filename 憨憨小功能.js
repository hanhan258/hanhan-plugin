import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import { segment } from 'oicq'


//const reply = true
export class jiami extends plugin {
  constructor () {	
	super({
			/** 功能名称 */
			name: '憨憨小功能',
			/** 功能描述 */
			dsc: '憨憨写的无用小功能',
			/** https://oicqjs.github.io/oicq/#events */
			event: 'message',
			/** 优先级，数字越小等级越高 */
			priority: 6000,
			rule: [
				{
					/** 命令正则匹配 */
          			reg: '^#?兽语加密',
          			/** 执行方法 */
          			fnc: 'shouyu'
				},
				{
					/** 命令正则匹配 */
          			reg: '^#?兽语帮助',
          			/** 执行方法 */
          			fnc: 'shouyuHelp'
				},
				{
					/** 命令正则匹配 */
          			reg: '^#?今天是几号',
          			/** 执行方法 */
          			fnc: 'today'
				},
				{
					/** 命令正则匹配 */
          			reg: '^#?历史上的今天',
          			/** 执行方法 */
          			fnc: 'history'
				},
				{
					/** 命令正则匹配 */
          			reg: '^#?ping ',
          			/** 执行方法 */
          			fnc: 'ping'
				},
			]
		});
  } 
  async shouyuHelp (e) {
    e.reply(`请发送：#兽语加密+要加密的文字\n或兽语加密+要加密的文字
    例如：#兽语加密你好、兽语加密你好`)
  }
 async getapi(url, data, suc, parms) {
        await geturldata({ url: url, data: data, parms: parms }, (res) => {
            suc(res.data)
        })
 }
 //兽语加密
  async shouyu(e) {
	let msg = e.msg.replace(/^#?兽语加密/, "").trim();
	let encode = encodeURIComponent(msg)//将文本转成url编码
	let url = `http://ovooa.muban.plus/API/sho_u/?type=text&msg=${encode}`
	let response = await fetch(url); //调用接口获取数据
     let res = await response.text();
     let sendmsg = []
     if (!this.e.isPrivate){
		sendmsg.push(segment.at(e.user_id))
		sendmsg.push(`\n`)
	}
     sendmsg.push(res)
     e.reply(sendmsg)
  }
  //今天是几号
  async today(e) {
	let url = `https://ovooa.muban.plus/API/rl/api.php?type=text`
	let response = await fetch(url); //调用接口获取数据
     let res = await response.text();
     let sendmsg = []
     if (!this.e.isPrivate){
		sendmsg.push(segment.at(e.user_id))
		sendmsg.push(`\n`)
	}
     sendmsg.push(res)
     e.reply(sendmsg)
  }
  //历史上的今天
  async history(e) {
	let url = `http://ovooa.muban.plus/API/lishi/api.php?n=10`
	let response = await fetch(url); //调用接口获取数据
     let res = await response.text();
     let sendmsg = []
     if (!this.e.isPrivate){
		sendmsg.push(segment.at(e.user_id))
		sendmsg.push(`\n`)
	}
     sendmsg.push(res)
     e.reply(sendmsg)
  }
  //ping网站或ip
  async ping(e) {
	let msg = e.msg.replace(/^#?ping/, "").trim();
	let encode = encodeURIComponent(msg)//将文本转成url编码
	let url = `https://xian.txma.cn/API/sping.php?url=${encode}`
	let response = await fetch(url); //调用接口获取数据
     let res = await response.text();
	 let sendmsg = []
     if (!this.e.isPrivate){
		sendmsg.push(segment.at(e.user_id))
		sendmsg.push(`\n`)
	}
     sendmsg.push(res)
     e.reply(sendmsg)
  }
}
