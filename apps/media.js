import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch' // 确保你已安装node-fetch

let mediaInstance = null

// API配置 (已更新)
const API_CONFIG = {
    BASE_URL: 'https://ai.ycxom.top:3002', // 您的API服务器地址
    LIST_API: 'https://ai.ycxom.top:3002/api/v1/info/lists', // 新的列表API
    TIMEOUT: 15000 // 15秒超时
}

// 文件路径配置
const FILE_CONFIG = {
    DATA_DIR: './data/hanhan-pics',
    API_DATA_FILE: './data/hanhan-pics/api-data.json',
    UPDATE_INTERVAL: 5 * 24 * 60 * 60 * 1000 // 5天
}

export class media extends plugin {
    constructor() {
        if (mediaInstance) return mediaInstance

        super({
            name: '憨憨富媒体',
            dsc: '憨憨富媒体插件，支持多种表情包、随机图片和视频',
            event: 'message',
            priority: 6,
            rule: [
                // 基础帮助菜单
                { reg: '^#?表情包(帮助|菜单)$', fnc: 'showExpressionHelp' },
                { reg: '^#?憨憨图片(帮助|菜单)$', fnc: 'showPictureHelp' },
                { reg: '^#?小姐姐(帮助|菜单)$', fnc: 'showGirlHelp' },
                { reg: '^#?视频(帮助|菜单)$', fnc: 'showVideoHelp' },
                { reg: '^#?美女视频(帮助|菜单)$', fnc: 'showBeautyVideoHelp' },
                // 更新API列表
                { reg: '^#?憨憨?更新(表情包|图片|视频)?API列表$', fnc: 'updateApiList' },
                // 分类随机获取
                { reg: '^#?憨憨?随机(表情包|图片|壁纸|二次元|三次元|基础分类|叼图)$', fnc: 'getRandomByCategory' },
                { reg: '^#?憨憨?随机(美女视频|舞蹈视频|其他视频|视频)$', fnc: 'getRandomVideoByCategory' }
            ]
        })

        this.apiData = null
        this.init()
        mediaInstance = this
    }

    /**
     * 插件初始化
     */
    async init() {
        try {
            this.ensureDataDir()
            await this.loadApiData()
            this.registerDynamicRules()
            logger.info('[憨憨富媒体] 插件初始化成功')
        } catch (error) {
            logger.error('[憨憨富媒体] 插件初始化失败:', error)
        }
    }

    /**
     * 确保数据目录存在
     */
    ensureDataDir() {
        if (!fs.existsSync(FILE_CONFIG.DATA_DIR)) {
            fs.mkdirSync(FILE_CONFIG.DATA_DIR, { recursive: true })
            logger.info('[憨憨富媒体] 创建数据目录')
        }
    }

    /**
     * 加载API数据
     */
    async loadApiData() {
        try {
            if (this.isApiDataValid()) {
                const data = fs.readFileSync(FILE_CONFIG.API_DATA_FILE, 'utf8')
                this.apiData = JSON.parse(data)
                logger.info('[憨憨富媒体] 从缓存加载API数据')
                return
            }
            await this.fetchAndSaveApiData()
        } catch (error) {
            logger.error('[憨憨富媒体] 加载API数据失败:', error)
            if (fs.existsSync(FILE_CONFIG.API_DATA_FILE)) {
                try {
                    const data = fs.readFileSync(FILE_CONFIG.API_DATA_FILE, 'utf8')
                    this.apiData = JSON.parse(data)
                    logger.warn('[憨憨富媒体] 使用过期缓存数据')
                } catch (cacheError) {
                    logger.error('[憨憨富媒体] 缓存数据也无法使用:', cacheError)
                }
            }
        }
    }

    /**
     * 检查API数据是否有效
     */
    isApiDataValid() {
        if (!fs.existsSync(FILE_CONFIG.API_DATA_FILE)) return false
        const stats = fs.statSync(FILE_CONFIG.API_DATA_FILE)
        return (Date.now() - stats.mtime.getTime()) < FILE_CONFIG.UPDATE_INTERVAL
    }

    /**
     * 获取并保存API数据
     */
    async fetchAndSaveApiData() {
        try {
            logger.info('[憨憨富媒体] 开始获取API数据...')
            const response = await this.fetchWithTimeout(API_CONFIG.LIST_API)
            if (!response.ok) throw new Error(`API请求失败: ${response.status}`)

            const apiData = await response.json()
            apiData.lastUpdate = Date.now()

            fs.writeFileSync(FILE_CONFIG.API_DATA_FILE, JSON.stringify(apiData, null, 2), 'utf8')
            this.apiData = apiData
            logger.info('[憨憨富媒体] API数据获取并保存成功')
            return apiData
        } catch (error) {
            logger.error('[憨憨富媒体] 获取API数据失败:', error)
            throw error
        }
    }

    /**
     * 动态注册命令规则
     */
    registerDynamicRules() {
        if (!this.apiData) {
            logger.warn('[憨憨富媒体] API数据为空，跳过动态规则注册')
            return
        }
        try {
            const allPicDirs = [...(this.apiData.pictureDirs || []), ...Object.keys(this.apiData.pictureDirAliases || {})];
            const allVideoDirs = [...(this.apiData.videoDirs || []), ...Object.keys(this.apiData.videoDirAliases || {})];

            if (allPicDirs.length === 0 && allVideoDirs.length === 0) {
                logger.warn('[憨憨富媒体] 没有可用的媒体目录')
                return
            }

            if (allPicDirs.length > 0) {
                const picDirsRegex = allPicDirs.map(dir => this.escapeRegExp(dir)).join('|')
                this.rule.push({
                    reg: new RegExp(`^#?(${picDirsRegex})$`),
                    fnc: 'getPictureByDirName'
                })
            }
            if (allVideoDirs.length > 0) {
                const videoDirsRegex = allVideoDirs.map(dir => this.escapeRegExp(dir)).join('|')
                this.rule.push({
                    reg: new RegExp(`^#?(${videoDirsRegex})视频$`),
                    fnc: 'getVideoByDirName'
                })
            }
            logger.info(`[憨憨富媒体] 动态注册 ${allPicDirs.length} 个图片命令，${allVideoDirs.length} 个视频命令`)
        } catch (error) {
            logger.error('[憨憨富媒体] 动态规则注册失败:', error)
        }
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    /**
     * 更新API列表
     */
    async updateApiList(e) {
        try {
            await this.reply('正在更新API列表，请稍候...')
            await this.fetchAndSaveApiData()

            this.rule = this.rule.filter(rule => rule.fnc !== 'getPictureByDirName' && rule.fnc !== 'getVideoByDirName')
            this.registerDynamicRules()

            const totalPicDirs = (this.apiData?.pictureDirs?.length || 0) + Object.keys(this.apiData?.pictureDirAliases || {}).length;
            const totalVideoDirs = (this.apiData?.videoDirs?.length || 0) + Object.keys(this.apiData?.videoDirAliases || {}).length;

            const successMsg = [
                '✅ API列表更新成功！',
                `📅 更新时间: ${new Date().toLocaleString()}`,
                `📁 可用图片目录/别名: ${totalPicDirs} 个`,
                `🎬 可用视频目录/别名: ${totalVideoDirs} 个`,
            ].join('\n')

            return await this.reply(successMsg)
        } catch (error) {
            logger.error('[更新API列表] 失败:', error)
            return await this.reply('❌ API列表更新失败，请稍后重试')
        }
    }

    /**
     * 根据目录或别名获取图片
     */
    async getPictureByDirName(e) {
        try {
            const dirName = e.msg.replace(/^#/, '').trim()
            logger.info(`[获取图片] 目录/别名: ${dirName}`)

            // 使用新的API路径
            const imageUrl = `${API_CONFIG.BASE_URL}/api/v1/media/picture/by-dir/${encodeURIComponent(dirName)}`
            await this.reply(segment.image(imageUrl))

            return true
        } catch (error) {
            logger.error('[获取图片] 失败:', error)
            return await this.reply('❌ 图片获取失败，请稍后重试')
        }
    }

    /**
     * 根据目录或别名获取视频
     */
    async getVideoByDirName(e) {
        try {
            const dirName = e.msg.replace(/^#/, '').replace(/视频$/, '').trim()
            logger.info(`[获取视频] 目录/别名: ${dirName}`)

            // 使用新的API路径
            const videoUrl = `${API_CONFIG.BASE_URL}/api/v1/media/video/by-dir/${encodeURIComponent(dirName)}`
            await this.reply(segment.video(videoUrl))

            return true
        } catch (error) {
            logger.error('[获取视频] 失败:', error)
            return await this.reply('❌ 视频获取失败，请稍后重试')
        }
    }

    /**
     * 根据分类获取随机图片
     */
    async getRandomByCategory(e) {
        try {
            const categoryName = e.msg.replace(/^#?憨憨?随机/, '').trim()

            // "图片" 是一个特殊情况，代表完全随机
            if (categoryName === '图片') {
                const imageUrl = `${API_CONFIG.BASE_URL}/api/v1/media/picture/random`
                await this.reply(segment.image(imageUrl))
                return true
            }

            logger.info(`[随机图片] 分类: ${categoryName}`)
            const imageUrl = `${API_CONFIG.BASE_URL}/api/v1/media/picture/by-category/${encodeURIComponent(categoryName)}`
            await this.reply(segment.image(imageUrl))

            return true
        } catch (error) {
            logger.error('[随机图片] 获取失败:', error)
            return await this.reply('❌ 随机图片获取失败，请稍后重试')
        }
    }

    /**
     * 根据分类获取随机视频
     */
    async getRandomVideoByCategory(e) {
        try {
            const categoryName = e.msg.replace(/^#?憨憨?随机/, '').trim()

            // "视频" 是特殊情况
            if (categoryName === '视频') {
                const videoUrl = `${API_CONFIG.BASE_URL}/api/v1/media/video/random`
                await this.reply(segment.video(videoUrl))
                return true
            }

            logger.info(`[随机视频] 分类: ${categoryName}`)
            const videoUrl = `${API_CONFIG.BASE_URL}/api/v1/media/video/by-category/${encodeURIComponent(categoryName)}`
            await this.reply(segment.video(videoUrl))

            return true
        } catch (error) {
            logger.error('[随机视频] 获取失败:', error)
            return await this.reply('❌ 随机视频获取失败，请稍后重试')
        }
    }

    // --- 帮助菜单 ---

    async showExpressionHelp(e) {
        if (!this.apiData) return this.reply('❌ API数据未加载，请尝试 #憨憨更新API列表')
        const expressionList = this.apiData.pictureCategories?.['表情包'] || []
        if (expressionList.length === 0) return this.reply('❌ 暂无可用表情包')

        const helpText = [
            '=== 📦 表情包菜单 ===',
            '🎯 使用方法：',
            '• 直接发送表情包名称 (如: #小黑猫)',
            '• #憨憨随机表情包',
            '',
            '📝 可用表情包：',
            ...this.formatList(expressionList),
        ].join('\n')

        return await this.reply(helpText)
    }

    async showPictureHelp(e) {
        if (!this.apiData) return this.reply('❌ API数据未加载，请尝试 #憨憨更新API列表')
        const categories = this.apiData.pictureCategories || {}
        let helpText = ['=== 🖼️ 憨憨图片菜单 ===']

        Object.entries(categories).forEach(([categoryName, items]) => {
            helpText.push(`\n📁 ${categoryName} (${items.length}个):`)
            helpText.push(...this.formatList(items, '  '))
        })

        helpText.push('\n🎯 使用方法：')
        helpText.push('• 直接发送图片名称 (如: #baisi)')
        helpText.push('• #憨憨随机+分类名 (如: #憨憨随机二次元)')

        return await this.reply(helpText.join('\n'))
    }

    async showGirlHelp(e) {
        if (!this.apiData) return this.reply('❌ API数据未加载，请尝试 #憨憨更新API列表')
        const girlList = this.apiData.pictureCategories?.['三次元'] || []
        const helpText = [
            '=== 👧 小姐姐菜单 ===',
            '🎯 使用方法：',
            '• 直接发送类型名称 (如: #JK)',
            '• #憨憨随机三次元',
            '',
            '💕 可用类型：',
            ...this.formatList(girlList),
        ].join('\n')
        return await this.reply(helpText)
    }

    async showVideoHelp(e) {
        if (!this.apiData) return this.reply('❌ API数据未加载，请尝试 #憨憨更新API列表')
        const categories = this.apiData.videoCategories || {}
        let helpText = ['=== 🎬 视频菜单 ===']

        Object.entries(categories).forEach(([categoryName, items]) => {
            helpText.push(`\n📁 ${categoryName} (${items.length}个):`)
            helpText.push(...this.formatList(items, '  '))
        })

        helpText.push('\n🎯 使用方法：')
        helpText.push('• 发送 目录名+视频 (如: #白丝视频)')
        helpText.push('• #憨憨随机+分类名 (如: #憨憨随机舞蹈视频)')

        return await this.reply(helpText.join('\n'))
    }

    async showBeautyVideoHelp(e) {
        if (!this.apiData) return this.reply('❌ API数据未加载，请尝试 #憨憨更新API列表')
        const beautyVideoList = this.apiData.videoCategories?.['美女视频'] || []
        const helpText = [
            '=== 💃 美女视频菜单 ===',
            '🎯 使用方法：',
            '• 发送 类型名+视频 (如: #汉服视频)',
            '• #憨憨随机美女视频',
            '',
            '💕 可用类型：',
            ...this.formatList(beautyVideoList),
        ].join('\n')
        return await this.reply(helpText)
    }

    // --- 辅助函数 ---

    formatList(items, prefix = '• ') {
        const result = []
        for (let i = 0; i < items.length; i += 3) {
            result.push(items.slice(i, i + 3).map(item => `${prefix}${item}`).join('  '))
        }
        return result
    }

    getUpdateTime() {
        return this.apiData?.lastUpdate ? new Date(this.apiData.lastUpdate).toLocaleString() : '未知'
    }

    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: { 'User-Agent': 'yunzai/hanhan-plugin', ...options.headers }
            })
            clearTimeout(timeoutId)
            return response
        } catch (error) {
            clearTimeout(timeoutId)
            if (error.name === 'AbortError') throw new Error('请求超时')
            throw error
        }
    }

    async reply(message) {
        try {
            return await this.e.reply(message, false, {
                recallMsg: Config.recall_s || 0
            })
        } catch (error) {
            logger.error('[憨憨富媒体] 回复消息失败:', error)
            return false
        }
    }
}