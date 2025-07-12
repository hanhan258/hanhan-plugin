import plugin from '../../../lib/plugins/plugin.js'
import axios from 'axios'
import { Config } from '../utils/config.js'


export class example extends plugin {
  constructor() {
    super({
      name: '高德地图搜索',
      dsc: '使用高德地图API进行地点和IP搜索',
      event: 'message',
      priority: 1,
      rule: [
        {
          reg: '^#?搜地点[ =]?(.*)$',
          fnc: 'searchAddress',
          dsc: '搜地点 + <内容>'
        },
        {
          reg: '^#?高德搜ip[ =]?(.*)$',
          fnc: 'searchIp',
          dsc: '高德搜IP + <内容>'
        }
      ]
    })

    this.apiKey = Config.gdkey
  }

  /**
   * 搜索地点的主函数
   */
  async searchAddress(e) {
    if (!this.apiKey) return e.reply('功能未启用：缺少高德API Key。')
    
    const keyword = e.msg.match(this.rule[0].reg)[1].trim()
    if (!keyword) {
      return e.reply('请输入要搜索的地点，例如：#搜地点 台北101')
    }
    
    try {
      const apiResult = await this.fetchLocationData(keyword)
      const replyMessage = await this.buildLocationReply(apiResult)
      await e.reply(replyMessage)
    } catch (error) {
      logger.error(`[高德地图搜索] 搜索地点时出错: ${error}`)
      await e.reply('搜索地点时发生意外错误，请稍后再试或联系管理员。')
    }
  }
  
  /**
   * 搜索IP地址的主函数
   */
  async searchIp(e) {
    if (!this.apiKey) return e.reply('功能未启用：缺少高德API Key。')

    const ip = e.msg.match(this.rule[1].reg)[1].trim()
    
    try {
      const url = `https://restapi.amap.com/v3/ip?key=${this.apiKey}&ip=${ip}`
      const response = await axios.get(url)
      
      if (response.data.status !== '1') {
        return e.reply(`IP查询失败：${response.data.info}`)
      }
      
      const { province, rectangle, city } = response.data
      const msg = `[高德IP查询结果]\n` +
                  `省份：${province || '未知'}\n` +
                  `城市：${city || '未知'}\n` +
                  `经纬度范围：${rectangle || '未知'}`
      
      await e.reply(msg)
      
    } catch (error) {
      logger.error(`[高德地图搜索] 查询IP时出错: ${error}`)
      await e.reply('查询IP时发生意外错误，请稍后再试或联系管理员。')
    }
  }

  /**
   * 从高德API获取地点数据
   */
  async fetchLocationData(keyword) {
    const url = `https://restapi.amap.com/v3/place/text?key=${this.apiKey}&extensions=all&keywords=${encodeURIComponent(keyword)}`
    const response = await axios.get(url)
    return response.data
  }

  /**
   * 构建地点搜索的回复消息
   */
  async buildLocationReply(apiResult) {
    if (apiResult.status !== '1' || apiResult.count === '0') {
      return '未找到匹配的地点。'
    }
    
    const poi = apiResult.pois[0]
    let imageSegment = null
    
    if (poi.photos && poi.photos.length > 0) {
      const photoUrl = poi.photos[0].url
      try {
        const imageBase64 = await this.fetchImageAsBase64(photoUrl)
        imageSegment = segment.image(`base64://${imageBase64}`)
      } catch (error) {
        logger.error(`[高德地图搜索] 获取图片Base64失败: ${error}`)
      }
    }
    
    const messageParts = []
    if (imageSegment) {
      messageParts.push(imageSegment)
    }
    
    const textInfo = [
      `[${poi.name}]`,
      `地址：${poi.address || '暂无'}`,
      `分类：${poi.type || '暂无'}`,
      `城市：${poi.cityname || '暂无'}`,
      `区域：${poi.adname || '暂无'}`,
      poi.tel && `电话：${poi.tel}`,
      poi.biz_ext.rating && `评分：${poi.biz_ext.rating}`,
    ].filter(Boolean).join('\n')
    
    messageParts.push(textInfo)
    
    return messageParts
  }

  /**
   * 获取图片的Base64编码
   * @param {string} url 图片URL
   * @returns {string} 图片的Base64编码字符串
   */
  async fetchImageAsBase64(url) {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer' // 获取二进制数据
    })
    
    // 将二进制Buffer转换为Base64字符串
    return Buffer.from(response.data).toString('base64')
  }
}