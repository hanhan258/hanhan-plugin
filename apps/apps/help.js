import plugin from '../../../lib/plugins/plugin.js'
import {segment} from "oicq";

export class help extends plugin {
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
          reg: '#(nav|憨憨帮助)',
          /** 执行方法 */
          fnc: 'hanhanHelp'
        },
        {
          /** 命令正则匹配 */
          reg: '^#搜一搜帮助$',
          /** 执行方法 */
          fnc: 'so_help'
        },
        {
          reg: '^#其他网站$',
          fnc: 'so_help2'
        },
      ]
    })
  }

  // 憨憨帮助
  async hanhanHelp (e) {
    e.reply('憨憨小功能：\n(#)mt\n(#)mc酱\n(#)小c酱\n(#)兽猫酱\n(#)买家秀\n(#)随机ai\n(#)兽语帮助\n(#)发癫(名字)\n(#)今天是几号\n(#)url编(解)码\n(#)天气+城市名\n(#)摩斯加(解)密\n(#)历史上的今天\n(#)ping (ip/域名)\n(#)base64编(解)码\n(#)(兽语|猫语|喵语|狗语|动物语)加(解)密')
  }
async so_help(e) {
  /** e.msg 用户的命令消息 */
  logger.info("[用户命令]", e.msg);
  /*await this.reply(
    `- 输入【#搜一搜帮助】获得列表\n- 输入【#百度=】百度一下
    \n- 例如：【#百度=114514】\n- 支持网页浏览 【#打开网页=输入网址】
    \n- 支持ping 【#ping=baidu.com】，查ip= ，
    \n- 支持的搜索引擎 百度，必应，google，360，搜狗，推特找人，youtube，duckduckgo，wiki，ecosia, bilibili, github, 动漫资源, webcrawler, aol, ask, yahoo
    \n- 支持其他 pornhub,pixiv,sankaku，wallhere
    \n- 购物网 亚马逊，dmm（日本）
    \n- 动漫网 niconico（日本）
    \n- 小说网站 syosetu（日本）
    \n- 电脑硬件 cpu=，gpu=,cpu排行，gpu排行
    \n- 搜影评 TMDB= ，IMDB=`
  );*/
  const helppng = `./plugins/hanhan-plugin/resources/syshelp.png`;   //图片地址
  const imagehelp = segment.image(`file:///${helppng}`);
  await e.reply(imagehelp)
}
async so_help2(e) {
  /** e.msg 用户的命令消息 */
  logger.info("[用户命令]", e.msg);
  await this.reply(
      `--其他网站--\n- 天眼查= ,查ip= ,ping= ,#打开网页= ,#科学打开网页=\n- 电脑硬件 cpu=，gpu=,cpu排行，gpu排行`
  );
  }
}