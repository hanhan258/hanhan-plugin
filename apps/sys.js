import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
import { segment } from "oicq"
import puppeteer from 'puppeteer'

const folderPath = './plugins/hanhan-plugin/resources/ls/'




export class sys extends plugin {
  constructor() {
    super({
      name: '憨憨-全网一下',
      dsc: '憨憨-全网一下',
      event: 'message',
      priority: 50,
      rule: [
        {
          reg: '^#?(百度|baidu)(=|＝)?(.*)$',
          fnc: 'so_baidu'
        },
        {
          reg: '^#?搜狗(=|＝)?(.*)$',
          fnc: 'so_sg'
        },
        {
          reg: '^#?duckduckgo(=|＝)?(.*)$',
          fnc: 'so_duckduckgo'
        },
        {
          reg: '^#?必应(=|＝)?(.*)$',
          fnc: 'so_bing'
        },
        {
          reg: '^#?google(=|＝)?(.*)$',
          fnc: 'so_google'
        },
        {
          reg: '^#?wiki(=|＝)?(.*)$',
          fnc: 'so_wiki'
        },
        {
          reg: '^#?ecosia(=|＝)?(.*)$',
          fnc: 'so_ecosia'
        },
        {
          reg: '^#?360(=|＝)?(.*)$',
          fnc: 'so_360'
        },
        {
          reg: '^#?2345(=|＝)?(.*)$',
          fnc: 'so_2345'
        },
        {
          reg: '^#?youtube(=|＝)?(.*)$',
          fnc: 'so_ytb'
        },
        {
          reg: '^#?推特找人(=|＝)?(.*)$',
          fnc: 'so_twzr'
        },
        {
          reg: '^#?科学打开网页(=|＝)?(.*)$',
          fnc: 'so_fqopenwebui'
        },
        {
          reg: '^#?打开网页(=|＝)?(.*)$',
          fnc: 'so_openwebui'
        },
        {
          reg: '^#?bilibili(=|＝)?(.*)$',
          fnc: 'so_blbl'
        },
        {
          reg: '^#?github(=|＝)?(.*)$',
          fnc: 'so_github'
        },
        {
          reg: '^#?动漫资源(=|＝)?(.*)$',
          fnc: 'so_acg'
        },
        {
          reg: '^#?cnping(=|＝)?(.*)$',
          fnc: 'so_ping'
        },
        {
          reg: '^#?webcrawler(=|＝)?(.*)$',
          fnc: 'so_webcrawler'
        },
        {
          reg: '^#?aol(=|＝)?(.*)$',
          fnc: 'so_aol'
        },
        {
          reg: '^#?ask(=|＝)?(.*)$',
          fnc: 'so_ask'
        },
        {
          reg: '^#?yahoo(=|＝)?(.*)$',
          fnc: 'so_yahoo'
        },
        {
          reg: '^#?pornhub(=|＝)?(.*)$',
          fnc: 'so_ph'
        },
        {
          reg: '^#?pixiv(=|＝)?(.*)$',
          fnc: 'so_pixiv'
        },
        {
          reg: '^#?sankaku(=|＝)?(.*)$',
          fnc: 'so_sankaku'
        },
        {
          reg: '^#?亚马逊(=|＝)?(.*)$',
          fnc: 'so_amz'
        },
        {
          reg: '^#?niconico(=|＝)?(.*)$',
          fnc: 'so_niconico'
        },
        {
          reg: '^#?syosetu(=|＝)?(.*)$',
          fnc: 'so_syosetu'
        },
        {
          reg: '^#?dmm(=|＝)?(.*)$',
          fnc: 'so_dmm'
        },
        {
          reg: '^#?cpu排行(.*)$',
          fnc: 'so_cpuz'
        },
        {
          reg: '^#?cpu(=|＝)?(.*)$',
          fnc: 'so_cpu'
        },
        {
          reg: '^#?gpu排行',
          fnc: 'so_gpuz'
        },
        {
          reg: '^#?gpu(=|＝)?(.*)$',
          fnc: 'so_gpu'
        },
       /* {
          reg: '^#?TMDB(=|＝)?(.*)$',
          fnc: 'so_tmdb'
        },*/
        {
          reg: '^#?IMDB(=|＝)?(.*)$',
          fnc: 'so_imdb'
        },
        {
          reg: '^#?查ip=$',
          fnc: 'so_ckip'
        },
        {
          reg: '^#?查ip(=|＝)?(.*)$',
          fnc: 'so_cip'
        },
        {
          reg: '^#?wallhere(=|＝)?(.*)$',
          fnc: 'so_wallhere'
        },
        {
          reg: '^#?天眼查(=|＝)?(.*)$',
          fnc: 'so_tyc'
        },
        {
          reg: '^#?steam(=|＝)?(.*)$',
          fnc: 'so_steam'
        },
        {
          reg: '^#?yandex(=|＝)?(.*)$',
          fnc: 'so_yandex'
        },
        {
          reg: '^#?msn天气(=|＝)?(.*)$',
          fnc: 'so_bingtq'
        },
        {
          reg: '^#?msn天气=$',
          fnc: 'so_bingtqo'
        },
        {
          reg: '^#?台风路径$',
          fnc: 'so_tf'
        },
      ]
    })
    this.proxyUrl = Config.proxyUrl
    this.chromeF = Config.chromeF
    this.echo = Config.sysecho
    this.noie = Config.noie 
    this.echo0 = Config.sysecho0
  }
  //
  /** e.msg 用户的命令消息 */
  async so_google(e) {
    let proxyUrl = this.proxyUrl
    let chromeF = this.chromeF
    let echo = this.echo
    let echo0 = this.echo0
    let noie = this.noie   
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?google(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo/*+`你所搜索的内容的直链:https://www.google.com/search?q=`+msg*/) //提示词    
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();    //启动一个新的页面
      await page.setViewport({ width: 740, height: 300 }); //截图大小（页面大小）
      await page.goto('https://www.google.com/search?q=' + msg, { waitUntil: 'networkidle2' });   //打开的网址，后面一段是等待页面加载完成
      const screenshotPath = `${folderPath}/screenshot.png`;   //保存的文件名
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }

  /** e.msg 用户的命令消息 */
  async so_bing(e) {
    let proxyUrl = this.proxyUrl
    let chromeF = this.chromeF
    let echo = this.echo
    let echo0 = this.echo0
    let noie = this.noie   
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?必应(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词        
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 900, height: 300 }); //截图大小（页面大小）
      await page.goto('https://www.bing.com/search?q=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  
  

  /** e.msg 用户的命令消息 */
  async so_baidu(e) {
    let chromeF = this.chromeF
    let echo = this.echo
    let echo0 = this.echo0
    let noie = this.noie
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?(百度|baidu)(=|＝)?/, '').trim()
      msg = msg.split(" ");
      await e.reply(echo) //提示词    
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 300 }); //截图大小（页面大小）
      await page.goto('https://www.baidu.com/s?wd=' + msg[0], { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_360(e) {
    let chromeF = this.chromeF
    let echo = this.echo
    let echo0 = this.echo0
    let noie = this.noie
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?360(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词 
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage()
      await page.setViewport({ width: 1200, height: 300 }); //截图大小（页面大小）
      await page.goto('https://www.so.com/s?q=' + msg, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 5000));
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_twzr(e) {
    let proxyUrl = this.proxyUrl
    let chromeF = this.chromeF
    let echo = this.echo
    let echo0 = this.echo0
    let noie = this.noie
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?推特找人(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词      
     const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 770, height: 4300 }); //截图大小（页面大小）
      await page.goto('https://www.twitter.com/' + msg, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 5000));
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }

  /** e.msg 用户的命令消息 */
  async so_ytb(e) {
    let proxyUrl = this.proxyUrl
    let chromeF = this.chromeF
    let echo = this.echo
    let echo0 = this.echo0
    let noie = this.noie
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?youtube(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词      
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 2300 }); //截图大小（页面大小）
      await page.goto('https://www.youtube.com/results?search_query=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_sg(e) {
    let chromeF = this.chromeF
    let echo = this.echo
    let echo0 = this.echo0
    let noie = this.noie
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?搜狗(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词      
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 300 }); //截图大小（页面大小）
      await page.goto('https://www.sogou.com/web?query=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_duckduckgo(e) {
    let proxyUrl = this.proxyUrl
    let chromeF = this.chromeF
    let echo = this.echo
    let echo0 = this.echo0
    let noie = this.noie
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?duckduckgo(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词      
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 200 }); //截图大小（页面大小）
      await page.goto('https://duckduckgo.com/?q=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_wiki(e) {
    let proxyUrl = this.proxyUrl
    let chromeF = this.chromeF
    let echo = this.echo
    let echo0 = this.echo0
    let noie = this.noie
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?wiki(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词      
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 800, height: 100 }); //截图大小（页面大小）
      await page.goto('https://zh.wikipedia.org/wiki/' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_ecosia(e) {
    let chromeF = this.chromeF
    let echo = this.echo
    let echo0 = this.echo0
    let noie = this.noie
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?ecosia(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词    
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 199 }); //截图大小（页面大小）
      await page.goto('https://www.ecosia.org/search?q=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_fqopenwebui(e) {
    let proxyUrl = this.proxyUrl
    let chromeF = this.chromeF
    let echo0 = this.echo0
    let noie = this.noie
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?科学打开网页(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(`打开中...请骚等`) //提示词    
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 199 }); //截图大小（页面大小）
      await page.goto('' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = 'screenshot.png';
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await browser.close();
      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment);
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_openwebui(e) {
    let chromeF = this.chromeF
    let echo0 = this.echo0
    let noie = this.noie
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?打开网页(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(`打开中...请骚等`) //提示词    
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 199 }); //截图大小（页面大小）
      await page.goto('' + msg, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 5000));
      const screenshotPath = 'screenshot.png';
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await browser.close();
      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment);
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_blbl(e) {
    let chromeF = this.chromeF
    let echo = this.echo
    let echo0 = this.echo0
    let noie = this.noie
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?bilibili(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词    
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 199 }); //截图大小（页面大小）
      await page.goto('https://search.bilibili.com/all?keyword=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_github(e) {
    let proxyUrl = this.proxyUrl
    let chromeF = this.chromeF
    let echo = this.echo
    let echo0 = this.echo0
    let noie = this.noie
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?github(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词    
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 199 }); //截图大小（页面大小）
      await page.goto('https://github.com/search?q=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_acg(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?动漫资源(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 199 }); //截图大小（页面大小）
      await page.goto('https://acg.rip/?term=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  async so_ping(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?cnping(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(`ping中....请等待30秒`)
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1380, height: 400 }); //截图大小（页面大小）
      await page.goto('https://www.ping.cn/http/' + msg);
      await new Promise((r) => setTimeout(r, 33000));
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_webcrawler(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?webcrawler(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 199 }); //截图大小（页面大小）
      await page.goto('https://www.webcrawler.com/serp?q=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_aol(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?aol(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1290, height: 199 }); //截图大小（页面大小）
      await page.goto('https://search.aol.com/aol/search?q=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_ask(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?ask(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1290, height: 199 }); //截图大小（页面大小）
      await page.goto('https://www.ask.com/web?q=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_yahoo(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?yahoo(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1290, height: 199 }); //截图大小（页面大小）
      await page.goto('https://search.yahoo.com/search?p=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_ph(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?pornhub(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1290, height: 300 }); //截图大小（页面大小）
      await page.goto('https://cn.pornhub.com/video/search?search=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_pixiv(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?pixiv(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1290, height: 399 }); //截图大小（页面大小）
      await page.goto('https://www.pixiv.net/tags/' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_sankaku(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?sankaku(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo + '请烧等30秒') //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1500, height: 199 }); //截图大小（页面大小）
      await page.goto('https://sankaku.app/zh-CN?tags=' + msg, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 23000));
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_amz(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?亚马逊(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1260, height: 299 }); //截图大小（页面大小）
      await page.goto('https://www.amazon.cn/s?k=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_niconico(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?niconico(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1045, height: 299 }); //截图大小（页面大小）
      await page.goto('https://www.nicovideo.jp/search/' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_syosetu(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?syosetu(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1065, height: 300 }); //截图大小（页面大小）
      await page.goto('https://yomou.syosetu.com/search.php?word=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_dmm(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?dmm(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1065, height: 300 }); //截图大小（页面大小）
      await page.goto('https://www.dmm.com/search/=/searchstr=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_cpuz(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1275, height: 300 }); //截图大小（页面大小）
      await page.goto('https://valid.x86.fr/bench/1', { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_cpu(e) {
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?cpu(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 1275, height: 365 }); //截图大小（页面大小）
      await page.goto('https://browser.geekbench.com/search?utf8=%E2%9C%93&q=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_gpuz(e) {
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 1275, height: 300 }); //截图大小（页面大小）
      await page.goto('https://technical.city/zh/video/rating', { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_gpu(e) {
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?gpu(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 1275, height: 109 }); //截图大小（页面大小）
      await page.goto('https://technical.city/zh/search?q=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
/*  async so_tmdb(e) {
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace("#TMDB=", "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await puppeteer.launch({
        headless: noie,
        executablePath: chromeF,
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1275, height: 109 }); //截图大小（页面大小）
      await page.goto('https://www.themoviedb.org/search?query=' + msg, { waitUntil: 'networkidle2' });
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_imdb(e) {
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?IMDB(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 1275, height: 300 }); //截图大小（页面大小）
      await page.goto('https://www.imdb.com/find/?q=' + msg, { waitUntil: 'networkidle2' });
      //await new Promise((r) => setTimeout(r, 50000));
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_cip(e) {
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?查ip(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 840, height: 109 }); //截图大小（页面大小）
      await page.goto('https://ip.hao86.com/' + msg[0], { waitUntil: 'networkidle2' });
      //await new Promise((r) => setTimeout(r, 50000));
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_ckip(e) {
    await e.reply(`请输入正确的命令，如：#查ip=www.baidu.com`)

  }
  /** e.msg 用户的命令消息 */
  async so_wallhere(e) {
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?wallhere(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 309 }); //截图大小（页面大小）
      await page.goto('https://wallhere.com/zh/wallpapers?q=' + msg, { waitUntil: 'networkidle2' });
      //await new Promise((r) => setTimeout(r, 50000));
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_tyc(e) {
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?天眼查(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 309 }); //截图大小（页面大小）
      await page.goto('https://www.tianyancha.com/search?key=' + msg, { waitUntil: 'networkidle2' });
      //await new Promise((r) => setTimeout(r, 50000));
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_steam(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?steam(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 300 }); //截图大小（页面大小）
      await page.goto('https://store.steampowered.com/search/?term=' + msg, { waitUntil: 'networkidle2' });
      //await new Promise((r) => setTimeout(r, 50000));
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  /** e.msg 用户的命令消息 */
  async so_yandex(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?yandex(=|＝)?/, "").trim();
      msg = msg.split(" ");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 300 }); //截图大小（页面大小）
      await page.goto('https://yandex.com/search/?text=' + msg, { waitUntil: 'networkidle2' });
      //await new Promise((r) => setTimeout(r, 50000));
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  async so_bingtq(e) {
    let proxyUrl = Config.proxyUrl
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      try {
        logger.info("[用户命令]", e.msg);
        let msg = e.msg.replace(/^#?msn天气(=|＝)?/, "").trim();
        msg = msg.split(" ");
        await e.reply(echo) //提示词
        const browser = await this.launchBrowserProxy(noie,chromeF,proxyUrl)
        const page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 1509 }); //截图大小（页面大小）
        await page.goto('https://www.msn.cn/zh-cn/weather/forecast/in-' + msg, { waitUntil: 'networkidle2' });
        //await new Promise((r) => setTimeout(r, 50000));
        const screenshotPath = `${folderPath}/screenshot.png`;
        await page.screenshot({ path: screenshotPath })
        await browser.close();

        const imageSegment = segment.image(`file://${screenshotPath}`);
        await e.reply(imageSegment)
      } catch (error) {
        console.error(error);
        await this.reply(echo0);
      }
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }
  async so_bingtqo(e) {

    await e.reply(`请输入城市`)
  }

  async so_tf(e) {
    let chromeF = Config.chromeF
    let echo = Config.sysecho
    let noie = Config.noie 
    let echo0 = Config.sysecho0
    try {
      logger.info("[用户命令]");
      await e.reply(echo) //提示词
      const browser = await this.launchBrowser(noie,chromeF)
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 1279 }); //截图大小（页面大小）
      await page.goto('https://typhoon.slt.zj.gov.cn/', { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 6000));
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath })
      await browser.close();

      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(echo0);
    }
  }

  /*
  async so_mcjavapf(e) {
    try {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#mcjava找人=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      //args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1509 }); //截图大小（页面大小）
    const url = 'https://namemc.com/profile/' + msg; // 根据你的需求构建 URL
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitFor(10000);
    const screenshotPath = `${folderPath}/screenshot.png`;
    await page.screenshot({ path: screenshotPath , fullPage: true })
    await browser.close();
  
    const imageSegment = segment.image(`file://${screenshotPath}`);
    await e.reply(imageSegment)
  } catch (error) {
    console.error(error);
    await this.reply(echo0);
  }}*/
  //💩山堆屎, wallhere....
  async  launchBrowser(noie, chromeF) {
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--disable-web-security',
        '--proxy-bypass-list=*',
        '--single-process'
      ]
    }); 
    return browser;
  }
  async  launchBrowserProxy(noie, chromeF,proxyUrl) {
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
        '--disable-web-security',
        `--proxy-server=${proxyUrl}`
      ]
    }); 
    return browser;
  }

}
