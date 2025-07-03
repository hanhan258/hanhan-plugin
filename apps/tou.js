import plugin from '../../../lib/plugins/plugin.js'
import common from '../../../lib/common/common.js'

let gailv = 0.4 // 初始概率

export class example extends plugin {
  constructor() {
    super({
      name: '憨憨-透',
      dsc: '憨憨-透',
      event: 'message',
      priority: 40,
      rule: [
        { reg: '^#?透$', fnc: 'tou', dsc: '透' }
      ]
    })
  }

  async c(e) {
    let randomType = Math.random()
    let at = e.message[1].qq
    let name
    if (e.message[1].name) {
      name = e.message[1].name.replace('@', '')
    } else if (e.message[1].text) {
      name = e.message[1].text.replace('@', '')
    }
    let name2 = e.sender.nickname
    let url2 = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${at}`
    let url3 = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.user_id}`
    let image = segment.image(url2)
    let image2 = segment.image(url3)
    let cao = `你与${name}发起pk，你长枪一挺，精准一枪洞穿${name}。。。${name}飞出几十米远撞在远处的崖壁上，晕了1分钟在晕的60秒内整整被你透了60次，${name}卒。`
    let cao2 = `你刚想透${name}的时候，被${name}猛然一个转身擒拿住了，对你使用疯狂乱透将你反杀，皮燕子都被${name}橄榄了。之后，${name}提上枪潇洒离去，你躺在地上足足有1分钟动弹不得，${name2}卒。`
    if (randomType < gailv) {
      e.reply(cao2)
      await common.sleep(3000)
      let msg2 = [image2, '我还没能,没能.......啊！ ']
      e.reply(msg2)
    } else {
      e.reply(cao)
      await common.sleep(3000)
      let msg3 = [image, '......细🐶，你，你就是不行！']
      e.reply(msg3)
    }
  }
}
