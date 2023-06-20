import plugin from '../../../lib/plugins/plugin.js';
import { Config } from '../utils/config.js';
import { segment } from "oicq";
import puppeteer from 'puppeteer';

const folderPath = './plugins/hanhan-plugin/resources/ls/';

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
          reg: '^#?台风路径$',
          fnc: 'so_tf'
        },
      ]
    });
    this.proxyUrl = Config.proxyUrl;
    this.chromeF = Config.chromeF;
    this.echo = Config.sysecho;
    this.noie = Config.noie;
    this.echo1 = Config.sysecho0;
    this.gqjt = Config.sysgqjt
  }

  async so_google(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?google(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://www.google.com/search?q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_baidu(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?(百度|baidu)(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let Timeout = 5000;
      let coverUrl = `https://www.baidu.com/s?wd=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", "");
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_bing(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?必应(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://www.bing.com/search?q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_360(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?360(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let Timeout = 5000;
      let coverUrl = `https://www.so.com/s?q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", "");
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_twzr(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?推特找人(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://www.twitter.com/${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_ytb(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?youtube(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://www.youtube.com/results?search_query=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_sg(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?搜狗(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let Timeout = 5000;
      let coverUrl = `https://www.sogou.com/web?query=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", "");
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_duckduckgo(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?duckduckgo(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://duckduckgo.com/?q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_wiki(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?wiki(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://zh.wikipedia.org/wiki/${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_ecosia(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?ecosia(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://www.ecosia.org/search?q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_fqopenwebui(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?科学打开网页(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_openwebui(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?打开网页(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let Timeout = 5000;
      let coverUrl = `${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", "");
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_blbl(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?bilibili(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let Timeout = 5000;
      let coverUrl = `https://search.bilibili.com/all?keyword=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", "");
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_github(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?github(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://github.org/search?q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_acg(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?动漫资源(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://acg.rip/?term=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_ping(e) {
    try {
      await this.reply(`ping中....请等待30秒`);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?cnping(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let Timeout = 33000;
      let coverUrl = `https://acg.rip/?term=${msg}`
      await this.downloadImage(e, coverUrl, 1380, "", Timeout, "", "");
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_webcrawler(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?webcrawler(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://www.webcrawler.com/serp?q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_aol(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?aol(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://search.aol.com/aol/search?q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_ask(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?ask(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://www.ask.com/web?q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_yahoo(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?yahoo(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://search.yahoo.com/search?p=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_ph(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?pornhub(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://cn.pornhub.com/video/search?search=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_pixiv(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?pixiv(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://www.pixiv.net/tags/${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_sankaku(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?sankaku(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://sankaku.app/zh-CN?tags=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_amz(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?亚马逊(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://www.amazon.cn/s?k=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_niconico(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?niconico(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://www.nicovideo.jp/search/${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_syosetu(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?syosetu(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://yomou.syosetu.com/search.php?word=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_dmm(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?dmm(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://www.dmm.com/search/=/searchstr=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_cpuz(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://valid.x86.fr/bench/1`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_cpu(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?cpu(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://browser.geekbench.com/search?utf8=%E2%9C%93&q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_gpuz(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://technical.city/zh/video/rating`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_gpu(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?cpu(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://technical.city/zh/search?q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_imdb(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?IMDB(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://www.imdb.com/find/?q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_cip(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?查ip(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://ip.hao86.com/${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }
  async so_ckip(e) {await e.reply(`请输入正确的命令，如：#查ip=www.baidu.com`)}

  async so_wallhere(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?wallhere(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://wallhere.com/zh/wallpapers?q=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_tyc(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?天眼查(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let Timeout = 5000;
      let coverUrl = `https://www.tianyancha.com/search?key=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", "");
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_steam(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?steam(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://store.steampowered.com/search/?term=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_yandex(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]", e.msg);
      let msg = e.msg.replace(/^#?yandex(=|＝)?/, "").trim();
      msg = msg.split(" ");
      let proxyUrl0 = this.proxyUrl
      let Timeout = 5000;
      let coverUrl = `https://yandex.com/search/?text=${msg}`
      await this.downloadImage(e, coverUrl, "", "", Timeout, "", proxyUrl0);
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async so_tf(e) {
    try {
      await this.reply(this.echo);
      logger.info("[用户命令]");
      let Timeout = 6000;
      let coverUrl = `https://typhoon.slt.zj.gov.cn/`
      await this.downloadImage(e, coverUrl, 1280, 1279, Timeout, false, "");
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }

  async downloadImage(e, coverUrl, width0, height0, Timeout, fullPage0, proxyUrl0) {
    try {
      const browser = await puppeteer.launch({
        headless: this.noie,
        executablePath: this.chromeF,
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-first-run',
          '--no-sandbox',
          '--no-zygote',
          '--disable-web-security',
          '--single-process',
          `--proxy-server=${proxyUrl0}`
        ]
      });
      const page = await browser.newPage();
      await page.setViewport({ width: width0 || 740, height: height0 || 300, deviceScaleFactor: this.gqjt });
      await page.goto(coverUrl, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, Timeout));
      const screenshotPath = `${folderPath}/screenshot.png`;
      await page.screenshot({ path: screenshotPath, fullPage: fullPage0 || true })
      await browser.close();
      const imageSegment = segment.image(`file://${screenshotPath}`);
      await e.reply(imageSegment)
    } catch (error) {
      console.error(error);
      await this.reply(this.echo1);
    }
  }
}
