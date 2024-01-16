import { recallSendForwardMsg } from '../utils/common.js'
import plugin from '../../../lib/plugins/plugin.js'
import HttpsProxyAgent from 'https-proxy-agent'
import { Config } from '../utils/config.js'
import fetch from 'node-fetch'

let dec = '查询结果'
let No_proxy = '未检测到代理！没有代理憨憨做不到啊'
let No_key = '未检测到key！请前往 https://developer.themoviedb.org/docs 注册账号，使用 #憨憨设置tmdb key= 命令进行设置'


export class Photo extends plugin {
  constructor () {
    super({
      name: 'tmdb',
      dsc: 'tmdb',
      event: 'message',
      priority: 6,
      rule: [
        {
          reg: '^#?搜番(.*)$',
          fnc: 'Searchoperas'
        },
        {
          reg: '^#?电影未来视$',
          fnc: 'Futuremovies'
        },
        {
          reg: '^#?搜电影(.*)$',
          fnc: 'Searchmovies'
        },
        {
          reg: '^#?搜导演(.*)$',
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
    this.r18 = Config.tmdb_r18
    if(!this.r18){
      this.r18 = false
    }
  }
async Searchoperas (e) {
  let key = this.key
  let proxyUrl = this.proxyUrl
  if (!key) {
    e.reply(No_key)
    return false
  }
  if (!proxyUrl) {
    e.reply(No_proxy)
    return false
  }
  let msg0 = ['查询中']
  await this.reply(msg0, true, { recallMsg: e.isGroup ? 3 : 0 })
  console.log('[用户命令]', e.msg)
  let msg = e.msg.replace(/^#?搜番/, ' ').trim()
  msg = msg.split(' ').join('+')

  const url = `https://api.themoviedb.org/3/search/tv?query=${msg}&include_adult=${this.r18}&language=zh-CN&page=1`

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
      if(results.length == 0)
      {
        await this.reply("未找到相关结果")
        return;
      }
      await this.reply(`共找到${results.length}信息，资源下寨中`, true)
      let forwardMsgs = []      
      for (let i = 0; i < results.length; i++) {
        let show = results[i]
        let coverUrl = `https://image.tmdb.org/t/p/w500${show.poster_path}`
        console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)

        let msg = [
          segment.image(coverUrl),
          `-----第${1 + i}部-------\n中文名:${show.name}\n原著名称: ${show.original_name}\n发行地区: ${show.origin_country}\n发行日期: ${show.first_air_date}\n使用语言: ${show.original_language} \n评分: ${show.vote_average}\n剧情简介: \n${show.overview}\n---------------------------\n`
        ]
        forwardMsgs.push(...msg)
      }
      // 发送转发消息
      return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
    })
    .catch(err => console.error('Error:' + err))
}

async Futuremovies (e) {
  let key = this.key
  let proxyUrl = this.proxyUrl
  if (!key) {
    e.reply(No_key)
    return false
  }
  if (!proxyUrl) {
    e.reply(No_proxy)
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
      if(results.length == 0)
      {
        await this.reply("未找到相关结果")
        return;
      }
      await this.reply(`共找到${results.length}电影`, true)
      let forwardMsgs = []      
      for (let i = 0; i < results.length; i++) {
        let movie = results[i]
        console.log(`[进度${i + 1}/${results.length}]`)

        let msg = [
          segment.image(`https://image.tmdb.org/t/p/w500${movie.poster_path}`),
          `-----第${1 + i}部-------\n中文名: ${movie.title}\n原著名称: ${movie.original_title}\n计划上映日期: ${movie.release_date}\n使用语言: ${movie.original_language} \n评分: ${movie.vote_average}\n剧情简介: \n${movie.overview}\n--------------------------\n`
        ]
        forwardMsgs.push(...msg)
      }
      // 发送转发消息
      return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
    })
    .catch(err => console.error('Error:' + err))
}

async trending_movies (e) {
  let key = this.key
  let proxyUrl = this.proxyUrl
  if (!key) {
    e.reply(No_key)
    return false
  }
  if (!proxyUrl) {
    e.reply(No_proxy)
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
      if(results.length == 0)
      {
        await this.reply("未找到相关结果")
        return;
      }
      await this.reply(`共找到${results.length}电影，资源下寨中，排名由第一部依次向下`, true)
      let forwardMsgs = []      
      for (let i = 0; i < results.length; i++) {
        let movie = results[i]
        let coverUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)

        let msg = [
          segment.image(coverUrl),
          `-----第${1 + i}部-------\n中文名:${movie.title}\n原著名称: ${movie.original_title}\n上映日期: ${movie.release_date}\n使用语言: ${movie.original_language} \n评分: ${movie.vote_average}\n剧情简介: \n${movie.overview}\n---------------------------\n`
        ]
        forwardMsgs.push(...msg)
      }
      // 发送转发消息
      return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
    })
    .catch(err => console.error('Error:' + err))
}

async trending_tv (e) {
  let key = this.key
  let proxyUrl = this.proxyUrl
  if (!key) {
    e.reply(No_key)
    return false
  }
  if (!proxyUrl) {
    e.reply(No_proxy)
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
      if(results.length == 0)
      {
        await this.reply("未找到相关结果")
        return;
      }
      await this.reply(`共找到${results.length}电影，资源下寨中，排名由第一部依次向下`, true)

      let forwardMsgs = []      
      for (let i = 0; i < results.length; i++) {
        let movie = results[i]
        let coverUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)

        let msg = [
          segment.image(coverUrl),
          `-----第${1 + i}部-------\n中文名:${movie.name}\n原著名称: ${movie.original_name}\n计划上映日期: ${movie.release_date}\n使用语言: ${movie.original_language} \n评分: ${movie.vote_average}\n剧情简介: \n${movie.overview}\n---------------------------\n`
        ]
        forwardMsgs.push(...msg)
      }
      // 发送转发消息
      return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
    })
    .catch(err => console.error('Error:' + err))
}

async now_movies (e) {
  let key = this.key
  let proxyUrl = this.proxyUrl
  if (!key) {
    e.reply(No_key)
    return false
  }
  if (!proxyUrl) {
    e.reply(No_proxy)
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
      if(results.length == 0)
      {
        await this.reply("未找到相关结果")
        return;
      }
      await this.reply(`共找到${results.length}电影，资源下寨中`, true)

      let forwardMsgs = []      
      for (let i = 0; i < results.length; i++) {
        let movie = results[i]
        let coverUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)

        let msg = [
          segment.image(coverUrl),
          `-----第${1 + i}部-------\n中文名:${movie.title}\n原著名称: ${movie.original_title}\n上映日期: ${movie.release_date}\n使用语言: ${movie.original_language} \n评分: ${movie.vote_average}\n剧情简介: \n${movie.overview}\n---------------------------\n`
        ]
        forwardMsgs.push(...msg)
      }
      // 发送转发消息
      return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
    })
    .catch(err => console.error('Error:' + err))
}
async Searchmovies (e) {
  let key = this.key
  let proxyUrl = this.proxyUrl
  if (!key) {
    e.reply(No_key)
    return false
  }
  if (!proxyUrl) {
    e.reply(No_proxy)
    return false
  }
  let msg0 = ['查询中']
  await this.reply(msg0, true, { recallMsg: e.isGroup ? 3 : 0 })
  console.log('[用户命令]', e.msg)
  let msg = e.msg.replace(/^#?搜电影/, '').trim()
  msg = msg.split(' ').join('+')

  const url = `https://api.themoviedb.org/3/search/movie?query=${msg}&include_adult=${this.r18}&language=zh-CN&page=1`

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
      if(results.length == 0)
      {
        await this.reply("未找到相关结果")
        return;
      }
      await this.reply(`共找到${results.length}信息，资源下寨中`, true)

      let forwardMsgs = []      
      for (let i = 0; i < results.length; i++) {
        let show = results[i]
        let coverUrl = `https://image.tmdb.org/t/p/w500${show.poster_path}`
        console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)

        let msg = [
          segment.image(coverUrl),
          `-----第${1 + i}部-------\n中文名:${show.title}\n原著名称: ${show.original_title}\n是否R-18: ${show.adult}\n发行日期: ${show.release_date}\n使用语言: ${show.original_language} \n评分: ${show.vote_average}\n剧情简介: \n${show.overview}\n---------------------------\n`
        ]
        forwardMsgs.push(...msg)
      }
      // 发送转发消息
      return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
    })
    .catch(err => console.error('Error:' + err))
}

async person (e) {
  let key = this.key
  let proxyUrl = this.proxyUrl
  if (!key) {
    e.reply(No_key)
    return false
  }
  if (!proxyUrl) {
    e.reply(No_proxy)
    return false
  }
  let msg0 = ['查询中']
  await this.reply(msg0, true, { recallMsg: e.isGroup ? 3 : 0 })
  console.log('[用户命令]', e.msg)
  let msg = e.msg.replace(/^#?搜导演/, '').trim()
  msg = msg.split(' ').join('+')

  const url = `https://api.themoviedb.org/3/search/person?query=${msg}&include_adult=${this.r18}&language=zh-CN&page=1`

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
      if(results.length == 0)
      {
        await this.reply("未找到相关结果")
        return;
      }
      await this.reply(`共找到${results.length}个导演信息，资源下寨中`, true)
      let forwardMsgs = []
      for (let i = 0; i < results.length; i++) {
        let director = results[i]
        let coverUrl = `https://image.tmdb.org/t/p/w500${director.profile_path}`
        console.log(`[进度${i + 1}/${results.length}]----开始下载图片----`)
        //const filePath = await downloadImage(coverUrl)

        let works = []
        for (let j = 0; j < director.known_for.length; j++) {
          let work = director.known_for[j]
          //let workCoverUrl = `https://image.tmdb.org/t/p/w500${work.poster_path}`;
          // const workFilePath = await downloadImage(workCoverUrl);
          works.push(
            `-----代表作${j + 1}-----`,
             //segment.image(workCoverUrl),
            `译名: ${work.title}`,
            `原著名称：${work.original_title}`,
            `发行日期：${work.release_date}`,
            `---------------------------\n`
          )
        }

        let msg = [
          segment.image(coverUrl),
          `导演名: ${director.name}\n出生日期: ${director.birthday}\n出生地: ${director.place_of_birth}\n作品列表:\n${works.join('\n')}`
        ]
        forwardMsgs.push(...msg)
      }
      // 发送转发消息
      return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, dec))
    })
    .catch(err => console.error('Error:' + err))
}
}