import plugin from '../../../lib/plugins/plugin.js'
import { segment } from "oicq";
import puppeteer, { connect } from 'puppeteer';
const proxyChain = import('proxy-chain');
//代码小白。。。能用就行哈，求大佬指点
//打开市面上几乎...（我的功能非常简单...）
//启动时记得先修改下面的代理地址和浏览器地址，以防出现错误

//千万不要忘记pnpm i puppeteer - w 和pnpm i proxy-chain -w，安装依赖！！！


//代理设置
const proxyUrl = "http://127.0.0.1:7890"
//chrome地址，edge也可以
const chromeF = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
//搜索提示词，个别网站访问较慢可以适当修改提示增加提示时间
const echo = `搜索中...`
//关闭无头模式，即真打开浏览器,(后台就会有个浏览器闪现出来),linux有桌面板可以打开, 无桌面版建议关闭
const noie = false  //现在为关闭无头模式




export class sys extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '憨憨-全网一下',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 50,
      rule: [
        {
          reg: '^#?#baidu=(.*)$',
          fnc: 'so_baidu'
        },
        {
          reg: '^#?#百度=(.*)$',
          fnc: 'so_baidu'
        },
        {
          reg: '^#?#搜狗=(.*)$',
          fnc: 'so_sg'
        },
        {
          reg: '^#?#duckduckgo=(.*)$',
          fnc: 'so_duckduckgo'
        },
        {
          reg: '^#?#必应=(.*)$',
          fnc: 'so_bing'
        },
        {
          reg: '^#?#google=(.*)$',
          fnc: 'so_google'
        },
        {
          reg: '^#?#wiki=(.*)$',
          fnc: 'so_wiki'
        },
        {
          reg: '^#?#ecosia=(.*)$',
          fnc: 'so_ecosia'
        },
        {
          reg: '^#?#360=(.*)$',
          fnc: 'so_360'
        },
        {
          reg: '^#?#2345=(.*)$',
          fnc: 'so_2345'
        },
        {
          reg: '^#?#youtube=(.*)$',
          fnc: 'so_ytb'
        },
        {
          reg: '^#?#推特找人=(.*)$',
          fnc: 'so_twzr'
        },
        {
          reg: '^#?#科学打开网页=(.*)$',
          fnc: 'so_fqopenwebui'
        },
        {
          reg: '^#?#打开网页=(.*)$',
          fnc: 'so_openwebui'
        },
        {
          reg: '^#?#bilibili=(.*)$',
          fnc: 'so_blbl'
        },
        {
          reg: '^#?#github=(.*)$',
          fnc: 'so_github'
        },
        {
          reg: '^#?#动漫资源=(.*)$',
          fnc: 'so_acg'
        },
        {
          reg: '^#?#ping=(.*)$',
          fnc: 'so_ping'
        },
        {
          reg: '^#?#webcrawler=(.*)$',
          fnc: 'so_webcrawler'
        },
        {
          reg: '^#?#aol=(.*)$',
          fnc: 'so_aol'
        },
        {
          reg: '^#?#ask=(.*)$',
          fnc: 'so_ask'
        },
        {
          reg: '^#?#yahoo=(.*)$',
          fnc: 'so_yahoo'
        },
        {
          reg: '^#?#pornhub=(.*)$',
          fnc: 'so_ph'
        },
        {
          reg: '^#?#pixiv=(.*)$',
          fnc: 'so_pixiv'
        },
        {
          reg: '^#?#sankaku=(.*)$',
          fnc: 'so_sankaku'
        },
        {
          reg: '^#?#亚马逊=(.*)$',
          fnc: 'so_amz'
        },
        {
          reg: '^#?#niconico=(.*)$',
          fnc: 'so_niconico'
        },
        {
          reg: '^#?#syosetu=(.*)$',
          fnc: 'so_syosetu'
        },
        {
          reg: '^#?#dmm=(.*)$',
          fnc: 'so_dmm'
        },
        {
          reg: '^#?#cpu排行(.*)$',
          fnc: 'so_cpuz'
        },
        {
          reg: '^#?#cpu=(.*)$',
          fnc: 'so_cpu'
        },
        {
          reg: '^#?#gpu排行',
          fnc: 'so_gpuz'
        },
        {
          reg: '^#?#gpu=(.*)$',
          fnc: 'so_gpu'
        },
        {
          reg: '^#?#TMDB=(.*)$',
          fnc: 'so_tmdb'
        },
        {
          reg: '^#?#IMDB=(.*)$',
          fnc: 'so_imdb'
        },
        {
          reg: '^#?#查ip=$',
          fnc: 'so_ckip'
        },
        {
          reg: '^#?#查ip=(.*)$',
          fnc: 'so_cip'
        },
        {
          reg: '^#?#wallhere=(.*)$',
          fnc: 'so_wallhere'
        },
        {
          reg: '^#?#天眼查=(.*)$',
          fnc: 'so_tyc'
        },
        {
          reg: '^#?#steam=(.*)$',
          fnc: 'so_steam'
        },
        {
          reg: '^#?#yandex=(.*)$',
          fnc: 'so_yandex'
        },
      ]
    })
  }

  /** e.msg 用户的命令消息 */
  async so_google(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#google=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo/*+`你所搜索的内容的直链:https://www.google.com/search?q=`+msg*/) //提示词    
    const browser = await puppeteer.launch({
      headless: noie,          //关闭无头模式
      executablePath: chromeF,  //自定义浏览器位置
      args: [`--proxy-server=${proxyUrl}`],  //代理设置
    });
    const page = await browser.newPage();    //启动一个新的页面
    await page.setViewport({ width: 740, height: 2400 }); //截图大小（页面大小）
    await page.goto('https://www.google.com/search?q=' + msg, { waitUntil: 'networkidle2' });   //打开的网址，后面一段是等待页面加载完成
    const screenshotPath = `screenshot.png`;   //保存的文件名
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }

  /** e.msg 用户的命令消息 */
  async so_bing(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#必应=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词        
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 3000 }); //截图大小（页面大小）
    await page.goto('https://www.bing.com/search?q=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }

  /** e.msg 用户的命令消息 */
  async so_baidu(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#百度=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词    
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 2300 }); //截图大小（页面大小）
    await page.goto('https://www.baidu.com/s?wd=' + msg[0], { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_360(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#360=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词 
    const page = await browser.newPage();
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
    });
    await page.setViewport({ width: 1200, height: 2300 }); //截图大小（页面大小）
    await page.goto('https://www.so.com/s?q=' + msg, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 5000));
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_twzr(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#推特找人=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词      
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 770, height: 2900 }); //截图大小（页面大小）
    await page.goto('https://www.twitter.com/' + msg, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 5000));
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }

  /** e.msg 用户的命令消息 */
  async so_ytb(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#youtube=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词      
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: ['--disable-web-security',
        `--proxy-server=${proxyUrl}`
      ],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 2400 }); //截图大小（页面大小）
    await page.goto('https://www.youtube.com/results?search_query=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_sg(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#搜狗=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词      
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: ['--disable-web-security'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 2300 }); //截图大小（页面大小）
    await page.goto('https://www.sogou.com/web?query=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_duckduckgo(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#duckduckgo=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词      
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 2400 }); //截图大小（页面大小）
    await page.goto('https://duckduckgo.com/?q=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_wiki(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#wiki=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词      
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 1300 }); //截图大小（页面大小）
    await page.goto('https://zh.wikipedia.org/wiki/' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_ecosia(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#ecosia=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词    
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1599 }); //截图大小（页面大小）
    await page.goto('https://www.ecosia.org/search?q=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_fqopenwebui(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#科学打开网页=", "").trim();
    msg = msg.split(" ");
    await e.reply(`打开中...请骚等`) //提示词    
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`,
        '--disable-web-security', // 允许跨域
      ],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1599 }); //截图大小（页面大小）
    await page.goto('' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_openwebui(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#打开网页=", "").trim();
    msg = msg.split(" ");
    await e.reply(`打开中...请骚等`) //提示词    
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: ['--proxy-bypass-list=*'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1599 }); //截图大小（页面大小）
    await page.goto('' + msg, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 5000));
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_blbl(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#bilibili=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词    
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: ['--proxy-bypass-list=*'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1599 }); //截图大小（页面大小）
    await page.goto('https://search.bilibili.com/all?keyword=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_github(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#github=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词    
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`,
        '--disable-web-security', // 允许跨域
      ],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1599 }); //截图大小（页面大小）
    await page.goto('https://github.com/search?q=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_acg(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#动漫资源=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1599 }); //截图大小（页面大小）
    await page.goto('https://acg.rip/?term=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  async so_ping(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#ping=", "").trim();
    msg = msg.split(" ");
    await e.reply(`ping中....请等待30秒`)
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1380, height: 4200 }); //截图大小（页面大小）
    await page.goto('https://www.ping.cn/http/' + msg);
    await new Promise((r) => setTimeout(r, 33000));
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_webcrawler(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#webcrawler=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1399 }); //截图大小（页面大小）
    await page.goto('https://www.webcrawler.com/serp?q=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_aol(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#aol=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1290, height: 1599 }); //截图大小（页面大小）
    await page.goto('https://search.aol.com/aol/search?q=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_ask(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#ask=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1290, height: 1599 }); //截图大小（页面大小）
    await page.goto('https://www.ask.com/web?q=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_yahoo(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#yahoo=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1290, height: 1599 }); //截图大小（页面大小）
    await page.goto('https://search.yahoo.com/search?p=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_ph(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#pornhub=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1290, height: 1599 }); //截图大小（页面大小）
    await page.goto('https://cn.pornhub.com/video/search?search=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_pixiv(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#pixiv=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1290, height: 3599 }); //截图大小（页面大小）
    await page.goto('https://www.pixiv.net/tags/' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_sankaku(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#sankaku=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo + '请烧等30秒') //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1500, height: 1699 }); //截图大小（页面大小）
    await page.goto('https://sankaku.app/zh-CN?tags=' + msg, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 23000));
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_amz(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#亚马逊=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1260, height: 2499 }); //截图大小（页面大小）
    await page.goto('https://www.amazon.cn/s?k=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_niconico(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#niconico=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1045, height: 2499 }); //截图大小（页面大小）
    await page.goto('https://www.nicovideo.jp/search/' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_syosetu(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#syosetu=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1065, height: 2499 }); //截图大小（页面大小）
    await page.goto('https://yomou.syosetu.com/search.php?word=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_dmm(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#dmm=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1065, height: 2499 }); //截图大小（页面大小）
    await page.goto('https://www.dmm.com/search/=/searchstr=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_cpuz(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#cpu排行").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1275, height: 5999 }); //截图大小（页面大小）
    await page.goto('https://valid.x86.fr/bench/1', { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_cpu(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#cpu=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1275, height: 3465 }); //截图大小（页面大小）
    await page.goto('https://browser.geekbench.com/search?utf8=%E2%9C%93&q=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_gpuz(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#gpu排行").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1275, height: 4499 }); //截图大小（页面大小）
    await page.goto('https://technical.city/zh/video/rating', { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_gpu(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#gpu=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1275, height: 1109 }); //截图大小（页面大小）
    await page.goto('https://technical.city/zh/search?q=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_tmdb(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#TMDB=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1275, height: 1109 }); //截图大小（页面大小）
    await page.goto('https://www.themoviedb.org/search?query=' + msg, { waitUntil: 'networkidle2' });
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_imdb(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#IMDB=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      //args: [`--proxy-server=${proxyUrl}`], 
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1275, height: 1109 }); //截图大小（页面大小）
    await page.goto('https://www.imdb.com/find/?q=' + msg, { waitUntil: 'networkidle2' });
    //await new Promise((r) => setTimeout(r, 50000));
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_cip(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#查ip=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      //args: [`--proxy-server=${proxyUrl}`], 
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 840, height: 1309 }); //截图大小（页面大小）
    await page.goto('https://ip.hao86.com/' + msg[0], { waitUntil: 'networkidle2' });
    //await new Promise((r) => setTimeout(r, 50000));
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_ckip(e) {
    await e.reply(`请输入正确的命令，如：#查ip=www.baidu.com`)

  }
  /** e.msg 用户的命令消息 */
  async so_wallhere(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#wallhere=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      //args: [`--proxy-server=${proxyUrl}`], 
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 3009 }); //截图大小（页面大小）
    await page.goto('https://wallhere.com/zh/wallpapers?q=' + msg, { waitUntil: 'networkidle2' });
    //await new Promise((r) => setTimeout(r, 50000));
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_tyc(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#天眼查=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      //args: [`--proxy-server=${proxyUrl}`], 
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 3009 }); //截图大小（页面大小）
    await page.goto('https://www.tianyancha.com/search?key=' + msg, { waitUntil: 'networkidle2' });
    //await new Promise((r) => setTimeout(r, 50000));
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_steam(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#steam=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 3009 }); //截图大小（页面大小）
    await page.goto('https://store.steampowered.com/search/?term=' + msg, { waitUntil: 'networkidle2' });
    //await new Promise((r) => setTimeout(r, 50000));
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  /** e.msg 用户的命令消息 */
  async so_yandex(e) {
    logger.info("[用户命令]", e.msg);
    let msg = e.msg.replace("#yandex=", "").trim();
    msg = msg.split(" ");
    await e.reply(echo) //提示词
    const browser = await puppeteer.launch({
      headless: noie,
      executablePath: chromeF,
      args: [`--proxy-server=${proxyUrl}`],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 3009 }); //截图大小（页面大小）
    await page.goto('https://yandex.com/search/?text=' + msg, { waitUntil: 'networkidle2' });
    //await new Promise((r) => setTimeout(r, 50000));
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    const imageSegment = segment.image(`file:///${screenshotPath}`);
    await e.reply(imageSegment)
  }
  //💩山堆屎, wallhere
}