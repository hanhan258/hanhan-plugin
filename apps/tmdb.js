import { recallSendForwardMsg } from '../utils/common.js'
import plugin from '../../../lib/plugins/plugin.js'
import HttpsProxyAgent from 'https-proxy-agent'
import { Config } from '../utils/config.js'
import fetch from 'node-fetch'

const MESSAGES = {
  SEARCHING: '查询中',
  NO_KEY: '未检测到key！请前往 https://developer.themoviedb.org/docs 注册账号，使用 #憨憨设置tmdb key= 命令进行设置',
  NO_RESULTS: '未找到相关结果',
  TITLE: '查询结果'
}

const API_ENDPOINTS = {
  TV_SEARCH: 'search/tv',
  MOVIE_SEARCH: 'search/movie',
  PERSON_SEARCH: 'search/person',
  UPCOMING_MOVIES: 'movie/upcoming',
  NOW_PLAYING: 'movie/now_playing',
  TRENDING_MOVIE: 'trending/movie/week',
  TRENDING_TV: 'trending/tv/week'
}

export class TMDBApi extends plugin {
  constructor() {
    super({
      name: 'tmdb',
      dsc: 'tmdb',
      event: 'message',
      priority: 6,
      rule: [
        { reg: '^#?搜(番|tv|TV|电视剧|电视)(.*)$', fnc: 'soTv', dsc: '搜剧' },
        { reg: '^#?电影未来视$', fnc: 'futureMovie', dsc: '电影未来视' },
        { reg: '^#?搜电影(.*)$', fnc: 'soMovie', dsc: '搜电影' },
        { reg: '^#?搜(导演|编导|演员)(.*)$', fnc: 'soPerson', dsc: '搜影人' },
        { reg: '^#?正在放映的电影$', fnc: 'nowPlaying', dsc: '正在放映' },
        { reg: '^#?本周电影排行$', fnc: 'movieRank', dsc: '本周电影排行' },
        { reg: '^#?本周tv排行$', fnc: 'tvRank', dsc: '本周TV排行' }
      ]
    })
    this.initConfig()
  }

  initConfig() {
    this.key = Config.tmdbkey
    this.proxyUrl = Config.proxyUrl
    this.r18 = Config.tmdb_r18 || false
    this.baseUrl = 'https://api.themoviedb.org/3'
    this.imageBaseUrl = 'https://image.tmdb.org/t/p/w500'
  }

  /**
   * 调用 TMDB API
   * @param {string} endpoint - TMDB API 的终端路径 (例如 "/movie/popular")。
   * @param {object} params - 附加的查询参数 (默认值为空对象 {})。
   * @returns {Promise<object>} API 返回的 JSON 数据或错误信息。
   */
  async fetchTMDBApi(endpoint, params = {}) {
    if (!this.key) {
      return { error: MESSAGES.NO_KEY }
    }

    try {
      const queryString = new URLSearchParams({
        language: 'zh-CN',
        page: '1',
        include_adult: this.r18,
        ...params
      }).toString()

      const url = `${this.baseUrl}/${endpoint}?${queryString}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.key}`
        },
        agent: this.proxyUrl ? new HttpsProxyAgent(this.proxyUrl) : null
      })

      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      return { error: 'API请求失败' }
    }
  }

  /**
   * 格式化对象为消息内容 (例如电影、电视剧或人物)
   * @param {object} item - 要格式化的内容对象。
   * @param {number} index - 对象的索引。
   * @param {string} type - 对象类型 ("tv", "movie", "person")。
   * @returns {object} 一个对象，包含拼接的文本信息和图片链接。
   */
  formatMessage(item, index, type) {
    const common = {
      language: `使用语言: ${item.original_language}`,
      score: `评分: ${item.vote_average}`,
      overview: `剧情简介: \n${item.overview}`,
      index: `-----第${index + 1}部-------`
    }

    const formats = {
      tv: {
        title: `中文名: ${item.name}`,
        originalTitle: `原著名称: ${item.original_name}`,
        region: `发行地区: ${item.origin_country}`,
        adult: `是否R-18: ${item.adult}`,
        date: `发行日期: ${item.first_air_date}`,
        poster: item.poster_path
      },
      movie: {
        title: `中文名: ${item.title}`,
        originalTitle: `原著名称: ${item.original_title}`,
        date: `上映日期: ${item.release_date}`,
        adult: `是否R-18: ${item.adult}`,
        poster: item.poster_path
      },
      person: {
        name: `人员名: ${item.name}`,
        birthday: `出生日期: ${item.birthday || '未知'}`,
        birthplace: `出生地: ${item.place_of_birth || '未知'}`,
        profile: item.profile_path,
        works: this.formatWorks(item.known_for)
      }
    }

    const format = formats[type]
    return {
      text: Object.entries({ ...common, ...format })
        .filter(([key, val]) => key !== 'poster' && key !== 'profile' && key !== 'works')
        .map(([_, val]) => val)
        .join('\n') + '\n---------------------------\n',
      images: this.getImages(item, type)
    }
  }

  /**
   * 获取内容的图片 (如人物头像或电影海报)
   * @param {object} item - 数据对象 (如电影、电视剧或人物)。
   * @param {string} type - 数据类型 ("tv", "movie", "person")。
   * @returns {string[]} 图片链接数组。
   */
  getImages(item, type) {
    const images = []

    // 添加主图片
    if (type === 'person') {
      if (item.profile_path) {
        images.push(`${this.imageBaseUrl}${item.profile_path}`)
      }
    } else {
      if (item.poster_path) {
        images.push(`${this.imageBaseUrl}${item.poster_path}`)
      }
    }

    // 添加作品图片
    if (type === 'person' && item.known_for) {
      item.known_for.forEach(work => {
        if (work.poster_path) {
          images.push(`${this.imageBaseUrl}${work.poster_path}`)
        }
      })
    }

    return images
  }

  /**
   * 格式化人物的作品列表
   * @param {object[]} works - 作品信息数组。
   * @returns {string} 格式化后的作品信息。
   */
  formatWorks(works = []) {
    if (!works.length) return ''
    return '作品列表:\n' + works.map((work, index) =>
      `-----代表作${index + 1}-----\n` +
      `译名: ${work.title || work.name}\n` +
      `原著名称：${work.original_title || work.original_name}\n` +
      `发行日期：${work.release_date || work.first_air_date}`
    ).join('\n')
  }

  /**
   * 处理 API 查询结果并回复
   * @param {object} e - 消息事件对象。
   * @param {object[]} results - TMDB API 返回的结果数组。
   * @param {string} type - 数据类型 ("tv", "movie", "person")。
   * @returns {Promise<boolean>} 处理是否成功的标志。
   */
  async handleResults(e, results, type) {
    if (!results || results.error) {
      await this.reply(results?.error || MESSAGES.NO_RESULTS)
      return false
    }
    if (results.length === 0) {
      await this.reply(MESSAGES.NO_RESULTS)
      return false
    }

    await this.reply(`共找到${results.length}条信息，资源获取中...`, true)

    const forwardMsgs = []
    for (let i = 0; i < results.length; i++) {
      const { text, images } = this.formatMessage(results[i], i, type)

      // 添加所有图片
      images.forEach(img => {
        forwardMsgs.push(segment.image(img))
      })

      // 添加文本信息
      forwardMsgs.push(text)
    }

    return this.reply(await recallSendForwardMsg(e, forwardMsgs, false, MESSAGES.TITLE))
  }
  async execSearch(e, endpoint, params = {}, type) {
    await this.reply(MESSAGES.SEARCHING, true, { recallMsg: e.isGroup ? 3 : 0 })
    const data = await this.fetchTMDBApi(endpoint, params)
    return this.handleResults(e, data.results, type)
  }

  // 各个功能实现
  async soTv(e) {
    const query = e.msg.replace(/^#?搜(番|tv|TV|电视剧|电视)/, '').trim()
    return this.execSearch(e, API_ENDPOINTS.TV_SEARCH, { query }, 'tv')
  }

  async soMovie(e) {
    const query = e.msg.replace(/^#?搜电影/, '').trim()
    return this.execSearch(e, API_ENDPOINTS.MOVIE_SEARCH, { query }, 'movie')
  }

  async soPerson(e) {
    const query = e.msg.replace(/^#?搜(导演|编导|演员)/, '').trim()
    return this.execSearch(e, API_ENDPOINTS.PERSON_SEARCH, { query }, 'person')
  }

  async futureMovie(e) {
    return this.execSearch(e, API_ENDPOINTS.UPCOMING_MOVIES, { region: 'CN' }, 'movie')
  }

  async nowPlaying(e) {
    return this.execSearch(e, API_ENDPOINTS.NOW_PLAYING, { region: 'CN' }, 'movie')
  }

  async movieRank(e) {
    return this.execSearch(e, API_ENDPOINTS.TRENDING_MOVIE, {}, 'movie')
  }

  async tvRank(e) {
    return this.execSearch(e, API_ENDPOINTS.TRENDING_TV, {}, 'tv')
  }
}