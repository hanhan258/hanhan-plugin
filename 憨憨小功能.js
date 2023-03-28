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
			priority: 6,
			rule: [
				{
					/** 命令正则匹配 */
          			reg: '^#?nav',
          			/** 执行方法 */
          			fnc: 'hanhanHelp'
				},
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
				{
					/** 命令正则匹配 */
          			reg: '^#?(摩斯|莫斯)加密',
          			/** 执行方法 */
          			fnc: 'morseEn'
				},
				{
					/** 命令正则匹配 */
          			reg: '^#?(摩斯|莫斯)解密',
          			/** 执行方法 */
          			fnc: 'morseDe'
				},
				{
					/** 命令正则匹配 */
          			reg: '^#?(url|URL)编码',
          			/** 执行方法 */
          			fnc: 'urlEn'
				},
				{
					/** 命令正则匹配 */
          			reg: '^#?(url|URL)解码',
          			/** 执行方法 */
          			fnc: 'urlDe'
				},
				{
					/** 命令正则匹配 */
          			reg: '^#?(base64|Base64)编码',
          			/** 执行方法 */
          			fnc: 'baseEn'
				},
				{
					/** 命令正则匹配 */
          			reg: '^#?(base64|Base64)解码',
          			/** 执行方法 */
          			fnc: 'baseDe'
				}
			]
		});
  } 
  //憨憨功能
  async hanhanHelp (e) {
	  e.reply(`憨憨小功能：\n(#)兽语加密\n(#)兽语帮助\n(#)今天是几号\n(#)历史上的今天\n(#)ping (ip/域名)\n(#)摩斯加(解)密\n(#)url编(解)码\n(#)base64编(解)码`)
  }
  //兽语帮助
  async shouyuHelp (e) {
    e.reply(`请发送：#兽语加密+要加密的文字\n或兽语加密+要加密的文字
    例如：#兽语加密你好、兽语加密你好`)
  }
 //兽语加密
  async shouyu(e) {
	 let msg = e.msg.replace(/^#?兽语加密/, "").trim();
	 let encode = encodeURIComponent(msg)//将文本转成url编码
	 let url = `http://ovooa.muban.plus/API/sho_u/?type=text&msg=${encode}`
	 let response = await fetch(url); //调用接口获取数据
     let res = await response.text();
     let sendmsg = []
     sendmsg.push(res)
     await this.reply(sendmsg, true)
  }
  //今天是几号
  async today(e) {
	 let url = `https://ovooa.muban.plus/API/rl/api.php?type=text`
	 let response = await fetch(url); //调用接口获取数据
     let res = await response.text();
     let sendmsg = []
     sendmsg.push(res)
     await this.reply(sendmsg, true)
  }
  //历史上的今天
  async history(e) {
	 let url = `http://ovooa.muban.plus/API/lishi/api.php?n=10`
	 let response = await fetch(url); //调用接口获取数据
     let res = await response.text();
     let sendmsg = []
     sendmsg.push(res)
     await this.reply(sendmsg, true)
  }
  //ping网站或ip
  async ping(e) {
	 let msg = e.msg.replace(/^#?ping/, "").trim();
	 let encode = encodeURIComponent(msg)//将文本转成url编码
	 let url = `https://xian.txma.cn/API/sping.php?url=${encode}`
	 let response = await fetch(url); //调用接口获取数据
     let res = await response.text();
	 let sendmsg = []
     sendmsg.push(res)
     await this.reply(sendmsg, true)
  }
   //莫斯加密
  async morseEn(e) {
	let sendmsg = [];
	let encode = e.msg.replace(/^#?(莫斯|摩斯)加密/, "").trim();
	let url = `https://xiaobapi.top/api/xb/api/mesdm.php?type=en&msg=${encode}`
	let response = await fetch(url); //调用接口获取数据
	let res = await response.text();
	sendmsg.push(res)
	await this.reply(sendmsg, true)
  }
  //莫斯解密
  async morseDe(e) {
	let sendmsg = [];
	let	encode = e.msg.replace(/^#?(莫斯|摩斯)解密/, "").trim();
	let	url = `https://xiaobapi.top/api/xb/api/mesdm.php?type=de&msg=${encode}`
	let response = await fetch(url); //调用接口获取数据
	let res = await response.text();
	sendmsg.push(res)
	await this.reply(sendmsg, true)
  }
 //url编码
  async urlEn(e) {
    let encode = e.msg.replace(/^#?(url|URL)编码/, "").trim();
    let result = encodeURI(encode)
    await this.reply(result,true)
  }

  // url解码
  async urlDe(e) {
    let encode = e.msg.replace(/^#?(url|URL)解码/, "").trim();
    let result = decodeURI(encode)
    await this.reply(result, true)
  }
  
  //base64编码
  async baseEn(e){
	let encode = e.msg.replace(/^#?(base64|Base64)编码/, "").trim();
	let result = Buffer.from(encode).toString('base64');
	await this.reply(result, true)
  }
  //base64解码
  async baseDe(e){
	let encode = e.msg.replace(/^#?(base64|Base64)解码/, "").trim();
	let result = Buffer.from(encode, 'base64').toString();
	await this.reply(result, true)
  }
}
