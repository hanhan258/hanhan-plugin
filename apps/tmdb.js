import fetch from 'node-fetch'
import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { segment } from 'icqq'
import puppeteer from 'puppeteer'
import fs from 'fs'
// const downloadedImages = new Map(); // 用于保存已下载的图片

let r18 = true

async function makeForwardMsg (e, msgs = [], dec = '') {
  let nickname = Bot.nickname
  if (e.isGroup) {
    let info = await Bot.getGroupMemberInfo(e.group_id, Bot.uin)
    nickname = info.card || info.nickname
  }
  let userInfo = {
    user_id: Bot.uin,
    nickname
  }

  let forwardMsg = []
  msgs.forEach(msg => {
    forwardMsg.push({
      ...userInfo,
      message: msg
    })
  })

  /** 制作转发内容 */
  if (e.isGroup) {
    forwardMsg = await e.group.makeForwardMsg(forwardMsg)
  } else if (e.friend) {
    forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
  } else {
    return false
  }

  if (dec) {
    /** 处理描述 */
    forwardMsg.data = forwardMsg.data
      .replace(/\n/g, '')
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
      .replace(/___+/, `<title color="#777777" size="26">${dec}</title>`)
  }

  return forwardMsg
}

export class Photo extends plugin {
  constructor () {
    super({
      name: 'tmdb',
      dsc: 'tmdb',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?搜番=(.*)$',
          fnc: 'Searchoperas'
        },
        {
          reg: '^#?电影未来视$',
          fnc: 'Futuremovies'
        },
        {
          reg: '^#?搜电影=(.*)$',
          fnc: 'Searchmovies'
        },
        {
          reg: '^#?搜导演=(.*)$',
          fnc: 'person'
        },
        {
          reg: '^#?正在放映的电影$',
          fnc: 'now_movies'
        },
        {
          reg: '^#?本周电影排行$',
          fnc: 'trending_movies'
        },
        {
          reg: '^#?本周tv排行$',
          fnc: 'trending_tv'
        }

      ]
    })
    this.key = Config.tmdbkey
    this.proxyUrl = Config.proxyUrl
  }

  async Searchoperas (e) {
    let key = this.key
    let proxyUrl = this.proxyUrl
    if (!key) {
      e.reply('未检测到key！请前往 https://developer.themoviedb.org/docs 注册账号，使用 #憨憨设置tmdb key= 命令进行设置')
      return false
    }
    let msg0 = ['查询中']
    await this.reply(msg0, true, { recallMsg: e.isGroup ? 3 : 0 })
    console.log('[用户命令]', e.msg)
    let msg = e.msg.replace('#搜番=', '').trim()
    msg = msg.split(' ').join('+')

    const url = `https://api.themoviedb.org/3/search/tv?query=${msg}&include_adult=${r18}&language=zh-CN&page=1`

    const proxyAgent = new HttpsProxyAgent(proxyUrl)

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${key}`
      },
      agent: proxyAgent
    }

    fetch(url, options)
      .then(res => res.json())
      .then(async json => {
        let results = json.results
        await this.reply(`共找到${results.length}信息，资源下寨中`, true)

        let forwardMsgs = []
        for (let i = 0; i < results.length; i++) {
          let show = results[i]
          let coverUrl = `https://image.tmdb.org/t/p/w500${show.poster_path}`
          console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)
          const filePath = await this.downloadImage(coverUrl)

          let msg = [
            segment.image(`file:///${filePath}`),
            `中文名: ${show.name}\n原著名称: ${show.original_name}\n发行地区: ${show.origin_country}\n发行日期: ${show.first_air_date}\n使用语言: ${show.original_language} \n评分: ${show.vote_average}\n剧情简介: \n${show.overview}`
          ]
          forwardMsgs.push(...msg)
        }

        // 发送转发消息到群组
        if (e.isGroup) {
          let dec = 'TV信息'
          let forwardMsg = await makeForwardMsg(e, forwardMsgs, dec)
          if (forwardMsg) {
            await Bot.sendGroupMsg(e.group_id, forwardMsg)
          }
        }
      })
  }

  async Futuremovies (e) {
    let key = this.key
    let proxyUrl = this.proxyUrl
    if (!key) {
      e.reply('未检测到key！请前往 https://developer.themoviedb.org/docs 注册账号，使用 #憨憨设置tmdb key= 命令进行设置')
      return false
    }
    let msg0 = ['查询中']
    await this.reply(msg0, true, { recallMsg: e.isGroup ? 3 : 0 })
    const url = 'https://api.themoviedb.org/3/movie/upcoming?language=zh-CN&page=1&region=CN'
    // 创建代理
    const proxyAgent = new HttpsProxyAgent(proxyUrl)

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${key}`
      },
      agent: proxyAgent // 设置代理
    }

    fetch(url, options)
      .then(res => res.json())
      .then(async json => {
        let results = json.results
        await this.reply(`共找到${results.length}电影，资源下寨中`, true)

        let forwardMsgs = []
        for (let i = 0; i < results.length; i++) {
          let movie = results[i]
          let coverUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)

          const filePath = await this.downloadImage(coverUrl)

          let msg = [
            segment.image(`file:///${filePath}`),
            `中文名: ${movie.title}\n原著名称: ${movie.original_title}\n计划上映日期: ${movie.release_date}\n使用语言: ${movie.original_language} \n评分: ${movie.vote_average}\n剧情简介: \n${movie.overview}`
          ]

          forwardMsgs.push(...msg)
        }

        // 发送转发消息到群组
        if (e.isGroup) {
          let dec = '电影信息'
          let forwardMsg = await makeForwardMsg(e, forwardMsgs, dec)
          if (forwardMsg) {
            await Bot.sendGroupMsg(e.group_id, forwardMsg)
          }
        }

        // let msgComplete = ['电影信息发送完成'];
        // await this.reply(msgComplete, true);
      })
      .catch(err => console.error('Error:' + err))
  }

  async trending_movies (e) {
    let key = this.key
    let proxyUrl = this.proxyUrl
    if (!key) {
      e.reply('未检测到key！请前往 https://developer.themoviedb.org/docs 注册账号，使用 #憨憨设置tmdb key= 命令进行设置')
      return false
    }
    let msg0 = ['查询中']
    await this.reply(msg0, true, { recallMsg: e.isGroup ? 3 : 0 })
    const url = 'https://api.themoviedb.org/3/trending/movie/week?language=zh'
    // 创建代理
    const proxyAgent = new HttpsProxyAgent(proxyUrl)

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${key}`
      },
      agent: proxyAgent // 设置代理
    }

    fetch(url, options)
      .then(res => res.json())
      .then(async json => {
        let results = json.results
        await this.reply(`共找到${results.length}电影，资源下寨中，排名由第一部依次向下`, true)

        let forwardMsgs = []
        for (let i = 0; i < results.length; i++) {
          let movie = results[i]
          let coverUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)

          const filePath = await this.downloadImage(coverUrl)

          let msg = [
            segment.image(`file:///${filePath}`),
            `中文名: ${movie.title}\n原著名称: ${movie.original_title}\n上映日期: ${movie.release_date}\n使用语言: ${movie.original_language} \n评分: ${movie.vote_average}\n剧情简介: \n${movie.overview}`
          ]

          forwardMsgs.push(...msg)
        }

        // 发送转发消息到群组
        if (e.isGroup) {
          let dec = '电影信息'
          let forwardMsg = await makeForwardMsg(e, forwardMsgs, dec)
          if (forwardMsg) {
            await Bot.sendGroupMsg(e.group_id, forwardMsg)
          }
        }

        // let msgComplete = ['电影信息发送完成'];
        // await this.reply(msgComplete, true);
      })
      .catch(err => console.error('Error:' + err))
  }

  async trending_tv (e) {
    let key = this.key
    let proxyUrl = this.proxyUrl
    if (!key) {
      e.reply('未检测到key！请前往 https://developer.themoviedb.org/docs 注册账号，使用 #憨憨设置tmdb key= 命令进行设置')
      return false
    }
    let msg0 = ['查询中']
    await this.reply(msg0, true, { recallMsg: e.isGroup ? 3 : 0 })
    const url = 'https://api.themoviedb.org/3/trending/tv/week?language=zh'
    // 创建代理
    const proxyAgent = new HttpsProxyAgent(proxyUrl)

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${key}`
      },
      agent: proxyAgent // 设置代理
    }

    fetch(url, options)
      .then(res => res.json())
      .then(async json => {
        let results = json.results
        await this.reply(`共找到${results.length}电影，资源下寨中，排名由第一部依次向下`, true)

        let forwardMsgs = []
        for (let i = 0; i < results.length; i++) {
          let movie = results[i]
          let coverUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)

          const filePath = await this.downloadImage(coverUrl)

          let msg = [
            segment.image(`file:///${filePath}`),
            `中文名: ${movie.name}\n原著名称: ${movie.original_name}\n计划上映日期: ${movie.release_date}\n使用语言: ${movie.original_language} \n评分: ${movie.vote_average}\n剧情简介: \n${movie.overview}`
          ]

          forwardMsgs.push(...msg)
        }

        // 发送转发消息到群组
        if (e.isGroup) {
          let dec = '电影信息'
          let forwardMsg = await makeForwardMsg(e, forwardMsgs, dec)
          if (forwardMsg) {
            await Bot.sendGroupMsg(e.group_id, forwardMsg)
          }
        }

        // let msgComplete = ['电影信息发送完成'];
        // await this.reply(msgComplete, true);
      })
      .catch(err => console.error('Error:' + err))
  }

  async now_movies (e) {
    let key = this.key
    let proxyUrl = this.proxyUrl
    if (!key) {
      e.reply('未检测到key！请前往 https://developer.themoviedb.org/docs 注册账号，使用 #憨憨设置tmdb key= 命令进行设置')
      return false
    }
    let msg0 = ['查询中']
    await this.reply(msg0, true, { recallMsg: e.isGroup ? 3 : 0 })
    const url = 'https://api.themoviedb.org/3/movie/now_playing?language=zh&page=1&region=CN'
    // 创建代理
    const proxyAgent = new HttpsProxyAgent(proxyUrl)

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${key}`
      },
      agent: proxyAgent // 设置代理
    }

    fetch(url, options)
      .then(res => res.json())
      .then(async json => {
        let results = json.results
        await this.reply(`共找到${results.length}电影，资源下寨中`, true)

        let forwardMsgs = []
        for (let i = 0; i < results.length; i++) {
          let movie = results[i]
          let coverUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)

          const filePath = await this.downloadImage(coverUrl)

          let msg = [
            segment.image(`file:///${filePath}`),
            `中文名: ${movie.title}\n原著名称: ${movie.original_title}\n上映日期: ${movie.release_date}\n使用语言: ${movie.original_language} \n评分: ${movie.vote_average}\n剧情简介: \n${movie.overview}`
          ]

          forwardMsgs.push(...msg)
        }

        // 发送转发消息到群组
        if (e.isGroup) {
          let dec = '电影信息'
          let forwardMsg = await makeForwardMsg(e, forwardMsgs, dec)
          if (forwardMsg) {
            await Bot.sendGroupMsg(e.group_id, forwardMsg)
          }
        }

        // let msgComplete = ['电影信息发送完成'];
        // await this.reply(msgComplete, true);
      })
      .catch(err => console.error('Error:' + err))
  }

  async Searchmovies (e) {
    let key = this.key
    let proxyUrl = this.proxyUrl
    if (!key) {
      e.reply('未检测到key！请前往 https://developer.themoviedb.org/docs 注册账号，使用 #憨憨设置tmdb key= 命令进行设置')
      return false
    }
    let msg0 = ['查询中']
    await this.reply(msg0, true, { recallMsg: e.isGroup ? 3 : 0 })
    console.log('[用户命令]', e.msg)
    let msg = e.msg.replace('#搜电影=', '').trim()
    msg = msg.split(' ').join('+')

    const url = `https://api.themoviedb.org/3/search/movie?query=${msg}&include_adult=${r18}&language=zh-CN&page=1`

    const proxyAgent = new HttpsProxyAgent(proxyUrl)

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${key}`
      },
      agent: proxyAgent
    }

    fetch(url, options)
      .then(res => res.json())
      .then(async json => {
        let results = json.results
        await this.reply(`共找到${results.length}信息，资源下寨中`, true)

        let forwardMsgs = []
        for (let i = 0; i < results.length; i++) {
          let show = results[i]
          let coverUrl = `https://image.tmdb.org/t/p/w500${show.poster_path}`
          console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)
          const filePath = await this.downloadImage(coverUrl)

          let msg = [
            segment.image(`file:///${filePath}`),
            `中文名: ${show.title}\n原著名称: ${show.original_title}\n是否R-18: ${show.adult}\n发行日期: ${show.release_date}\n使用语言: ${show.original_language} \n评分: ${show.vote_average}\n剧情简介: \n${show.overview}`
          ]
          forwardMsgs.push(...msg)
        }

        // 发送转发消息到群组
        if (e.isGroup) {
          let dec = '电影信息'
          let forwardMsg = await makeForwardMsg(e, forwardMsgs, dec)
          if (forwardMsg) {
            await Bot.sendGroupMsg(e.group_id, forwardMsg)
          }
        }
      })
  }

  async person (e) {
    let key = this.key
    let proxyUrl = this.proxyUrl
    if (!key) {
      e.reply('未检测到key！请前往 https://developer.themoviedb.org/docs 注册账号，使用 #憨憨设置tmdb key= 命令进行设置')
      return false
    }
    let msg0 = ['查询中']
    await this.reply(msg0, true, { recallMsg: e.isGroup ? 3 : 0 })
    console.log('[用户命令]', e.msg)
    let msg = e.msg.replace('#搜导演=', '').trim()
    msg = msg.split(' ').join('+')

    const url = `https://api.themoviedb.org/3/search/person?query=${msg}&include_adult=${r18}&language=zh-CN&page=1`

    const proxyAgent = new HttpsProxyAgent(proxyUrl)

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${key}`
      },
      agent: proxyAgent
    }

    fetch(url, options)
      .then(res => res.json())
      .then(async json => {
        let results = json.results
        await this.reply(`共找到${results.length}个导演信息，资源下寨中`, true)

        let forwardMsgs = []
        for (let i = 0; i < results.length; i++) {
          let director = results[i]
          let coverUrl = `https://image.tmdb.org/t/p/w500${director.profile_path}`
          console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)
          const filePath = await this.downloadImage(coverUrl)

          let works = []
          for (let j = 0; j < director.known_for.length; j++) {
            let work = director.known_for[j]
            // let workCoverUrl = `https://image.tmdb.org/t/p/w500${work.poster_path}`;
            // const workFilePath = await this.downloadImage(workCoverUrl);
            works.push(
              // segment.image(`file:///${workFilePath}`),
              `作品${j + 1}: ${work.title}`,
              `原著名称：${work.original_title}`,
              `发行日期：${work.release_date}`
            )
          }

          let msg = [
            segment.image(`file:///${filePath}`),
            `导演名: ${director.name}\n出生日期: ${director.birthday}\n出生地: ${director.place_of_birth}\n作品列表:\n${works.join('\n')}`
          ]
          forwardMsgs.push(...msg)
        }

        // 发送转发消息到群组
        if (e.isGroup) {
          let dec = '信息'
          let forwardMsg = await makeForwardMsg(e, forwardMsgs, dec)
          if (forwardMsg) {
            await Bot.sendGroupMsg(e.group_id, forwardMsg)
          }
        }
      })
      .catch(err => console.error('Error:' + err))
  }

  /* async downloadImage(coverUrl, id) {
    if (downloadedImages.has(id)) {
      console.log(`----图片已下载，跳过下载----`);
      return downloadedImages.get(id); // 返回已下载的图片路径
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(coverUrl, { waitUntil: 'networkidle0' });
    const imageSrc = await page.$eval('img', img => img.src);
    const viewSource = await page.goto(imageSrc);
    const buffer = await viewSource.buffer();
    const folderPath = './plugins/hanhan-plugin/resources/tmdb_posters/';
    const filePath = `${folderPath}/${id}.jpg`; // 使用电影ID或电视剧ID作为文件名
    await fs.promises.writeFile(filePath, buffer);
    console.log(`----图片下载完成----`);

    downloadedImages.set(id, filePath); // 将已下载的图片路径保存到Map中
    await page.close();
    await browser.close();
    return filePath;
  } */

  async downloadImage (coverUrl) {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(coverUrl, { waitUntil: 'networkidle0' })
    const imageSrc = await page.$eval('img', img => img.src)
    const viewSource = await page.goto(imageSrc)
    const buffer = await viewSource.buffer()
    const folderPath = './plugins/hanhan-plugin/resources/tmdb_posters/' // 替换为你想要保存图片的文件夹路径
    const filePath = `${folderPath}/image_${Date.now()}.png` // 修改文件路径
    await fs.promises.writeFile(filePath, buffer)
    console.log('----图片下载完成----')
    await page.close()
    await browser.close()
    return filePath
  }
}
