import plugin from '../../../lib/plugins/plugin.js'
import { recallSendForwardMsg } from '../utils/common.js'
import { Config } from '../utils/config.js'
import fs from 'fs'
import path from 'path'

let mediaInstance = null

// API配置
const API_CONFIG = {
    BASE_URL: 'https://ai.ycxom.top:3002',
    LIST_API: 'https://ai.ycxom.top:3002/api/list',
    PICTURE_API: 'https://ai.ycxom.top:3002/picture',
    VIDEO_API: 'https://ai.ycxom.top:3002/video',
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
                {
                    reg: '^#?表情包(帮助|菜单)$',
                    fnc: 'showExpressionHelp'
                },
                {
                    reg: '^#?憨憨图片(帮助|菜单)$',
                    fnc: 'showPictureHelp'
                },
                {
                    reg: '^#?小姐姐(帮助|菜单)$',
                    fnc: 'showGirlHelp'
                },
                {
                    reg: '^#?视频(帮助|菜单)$',
                    fnc: 'showVideoHelp'
                },
                {
                    reg: '^#?美女视频(帮助|菜单)$',
                    fnc: 'showBeautyVideoHelp'
                },
                // 更新API列表
                {
                    reg: '^#?憨憨?更新(表情包|图片|视频)?API列表$',
                    fnc: 'updateApiList'
                },
                // 分类随机获取 - 图片
                {
                    reg: '^#?憨憨?随机(表情包|图片|壁纸|二次元|三次元|基础分类)$',
                    fnc: 'getRandomByCategory'
                },
                // 分类随机获取 - 视频
                {
                    reg: '^#?憨憨?随机(美女视频|舞蹈视频|其他视频|视频)$',
                    fnc: 'getRandomVideoByCategory'
                }
            ]
        })
        
        // 初始化
        this.apiData = null
        this.init()
        mediaInstance = this
    }

    /**
     * 插件初始化
     */
    async init() {
        try {
            // 确保数据目录存在
            this.ensureDataDir()
            
            // 加载API数据
            await this.loadApiData()
            
            // 动态注册命令
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
            // 检查文件是否存在且未过期
            if (this.isApiDataValid()) {
                const data = fs.readFileSync(FILE_CONFIG.API_DATA_FILE, 'utf8')
                this.apiData = JSON.parse(data)
                logger.info('[憨憨富媒体] 从缓存加载API数据')
                return
            }
            
            // 文件不存在或已过期，重新获取
            await this.fetchAndSaveApiData()
        } catch (error) {
            logger.error('[憨憨富媒体] 加载API数据失败:', error)
            
            // 如果获取失败，尝试使用旧的缓存数据
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
        if (!fs.existsSync(FILE_CONFIG.API_DATA_FILE)) {
            return false
        }
        
        const stats = fs.statSync(FILE_CONFIG.API_DATA_FILE)
        const fileAge = Date.now() - stats.mtime.getTime()
        
        return fileAge < FILE_CONFIG.UPDATE_INTERVAL
    }

    /**
     * 获取并保存API数据
     */
    async fetchAndSaveApiData() {
        try {
            logger.info('[憨憨富媒体] 开始获取API数据...')
            
            const response = await this.fetchWithTimeout(API_CONFIG.LIST_API)
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`)
            }
            
            const apiData = await response.json()
            
            // 添加更新时间戳
            apiData.lastUpdate = Date.now()
            
            // 保存到文件
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
            // 获取所有图片目录
            const allPicDirs = this.apiData.pictureDirs || []
            // 获取所有视频目录
            const allVideoDirs = this.apiData.videoDirs || []
            
            if (allPicDirs.length === 0 && allVideoDirs.length === 0) {
                logger.warn('[憨憨富媒体] 没有可用的媒体目录')
                return
            }

            // 创建图片动态正则表达式
            if (allPicDirs.length > 0) {
                const picDirsRegex = allPicDirs.map(dir => this.escapeRegExp(dir)).join('|')
                this.rule.push({
                    reg: new RegExp(`^#?(${picDirsRegex})$`),
                    fnc: 'getPictureByDirName'
                })
            }

            // 创建视频动态正则表达式
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

    /**
     * 转义正则表达式特殊字符
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    /**
     * 更新API列表
     */
    async updateApiList(e) {
        try {
            await this.reply('正在更新API列表，请稍候...')
            
            // 强制重新获取API数据
            await this.fetchAndSaveApiData()
            
            // 重新注册动态规则
            // 清除旧的动态规则
            this.rule = this.rule.filter(rule => 
                rule.fnc !== 'getPictureByDirName' && rule.fnc !== 'getVideoByDirName'
            )
            
            // 重新注册
            this.registerDynamicRules()
            
            const updateTime = new Date().toLocaleString()
            const totalPicDirs = this.apiData?.pictureDirs?.length || 0
            const totalVideoDirs = this.apiData?.videoDirs?.length || 0
            
            const successMsg = [
                '✅ API列表更新成功！',
                `📅 更新时间: ${updateTime}`,
                `📁 可用图片目录: ${totalPicDirs} 个`,
                `🎬 可用视频目录: ${totalVideoDirs} 个`,
                `🔄 下次自动更新: ${Math.ceil(FILE_CONFIG.UPDATE_INTERVAL / (24 * 60 * 60 * 1000))} 天后`
            ].join('\n')
            
            return await this.reply(successMsg)
        } catch (error) {
            logger.error('[更新API列表] 失败:', error)
            return await this.reply('❌ API列表更新失败，请稍后重试')
        }
    }

    /**
     * 根据目录名称获取图片
     */
    async getPictureByDirName(e) {
        try {
            const dirName = e.msg.replace(/^#/, '')
            
            // 验证目录是否存在
            if (!this.apiData?.pictureDirs?.includes(dirName)) {
                return await this.reply(`❌ 未找到图片目录 "${dirName}"`)
            }
            
            logger.info(`[获取图片] 目录: ${dirName}`)
            
            const imageUrl = `${API_CONFIG.PICTURE_API}/${encodeURIComponent(dirName)}`
            await this.reply(segment.image(imageUrl))
            
            return true
        } catch (error) {
            logger.error('[获取图片] 失败:', error)
            return await this.reply('❌ 图片获取失败，请稍后重试')
        }
    }

    /**
     * 根据目录名称获取视频
     */
    async getVideoByDirName(e) {
        try {
            const dirName = e.msg.replace(/^#/, '').replace(/视频$/, '')
            
            // 验证目录是否存在
            if (!this.apiData?.videoDirs?.includes(dirName)) {
                return await this.reply(`❌ 未找到视频目录 "${dirName}"`)
            }
            
            logger.info(`[获取视频] 目录: ${dirName}`)
            
            const videoUrl = `${API_CONFIG.VIDEO_API}/${encodeURIComponent(dirName)}`
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
            const categoryName = e.msg.replace(/^#?憨憨?随机/, '')
            
            // 分类映射
            const categoryMap = {
                '表情包': 'pictureCategories.表情包',
                '图片': 'pictureDirs', // 使用所有目录
                '壁纸': ['wallpaper'],
                '二次元': 'pictureCategories.二次元',
                '三次元': 'pictureCategories.三次元',
                '基础分类': 'pictureCategories.基础分类'
            }
            
            const categoryPath = categoryMap[categoryName]
            if (!categoryPath) {
                return await this.reply('❌ 不支持的分类类型')
            }
            
            let targetDirs = []
            
            if (Array.isArray(categoryPath)) {
                targetDirs = categoryPath
            } else if (categoryPath === 'pictureDirs') {
                targetDirs = this.apiData?.pictureDirs || []
            } else if (categoryPath.startsWith('pictureCategories.')) {
                const catName = categoryPath.split('.')[1]
                targetDirs = this.apiData?.pictureCategories?.[catName] || []
            }
            
            if (targetDirs.length === 0) {
                return await this.reply(`❌ ${categoryName} 分类暂无可用图片`)
            }
            
            // 随机选择一个目录
            const randomDir = targetDirs[Math.floor(Math.random() * targetDirs.length)]
            
            logger.info(`[随机图片] 分类: ${categoryName}, 目录: ${randomDir}`)
            
            const imageUrl = `${API_CONFIG.PICTURE_API}/${encodeURIComponent(randomDir)}`
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
            const categoryName = e.msg.replace(/^#?憨憨?随机/, '')
            
            // 视频分类映射
            const categoryMap = {
                '美女视频': 'videoCategories.美女视频',
                '舞蹈视频': 'videoCategories.舞蹈视频',
                '其他视频': 'videoCategories.其他分类',
                '视频': 'videoDirs' // 使用所有视频目录
            }
            
            const categoryPath = categoryMap[categoryName]
            if (!categoryPath) {
                return await this.reply('❌ 不支持的视频分类类型')
            }
            
            let targetDirs = []
            
            if (categoryPath === 'videoDirs') {
                targetDirs = this.apiData?.videoDirs || []
            } else if (categoryPath.startsWith('videoCategories.')) {
                const catName = categoryPath.split('.')[1]
                targetDirs = this.apiData?.videoCategories?.[catName] || []
            }
            
            if (targetDirs.length === 0) {
                return await this.reply(`❌ ${categoryName} 分类暂无可用视频`)
            }
            
            // 随机选择一个目录
            const randomDir = targetDirs[Math.floor(Math.random() * targetDirs.length)]
            
            logger.info(`[随机视频] 分类: ${categoryName}, 目录: ${randomDir}`)
            
            const videoUrl = `${API_CONFIG.VIDEO_API}/${encodeURIComponent(randomDir)}`
            await this.reply(segment.video(videoUrl))
            
            return true
        } catch (error) {
            logger.error('[随机视频] 获取失败:', error)
            return await this.reply('❌ 随机视频获取失败，请稍后重试')
        }
    }

    /**
     * 显示表情包帮助
     */
    async showExpressionHelp(e) {
        try {
            if (!this.apiData) {
                return await this.reply('❌ API数据未加载，请尝试 #更新表情包API列表')
            }
            
            const expressionList = this.apiData.pictureCategories?.['表情包'] || []
            
            if (expressionList.length === 0) {
                return await this.reply('❌ 暂无可用表情包')
            }
            
            const helpText = [
                '=== 📦 表情包菜单 ===',
                `📊 共 ${expressionList.length} 种表情包`,
                '',
                '📝 可用表情包：',
                ...this.formatList(expressionList),
                '',
                '🎯 使用方法：',
                '• 直接发送表情包名称',
                '• #憨憨随机表情包 - 获取随机表情包',
                '',
                `⏰ 数据更新: ${this.getUpdateTime()}`
            ].join('\n')
            
            return await this.reply(helpText)
        } catch (error) {
            logger.error('[表情包帮助] 获取失败:', error)
            return await this.reply('❌ 表情包菜单获取失败')
        }
    }

    /**
     * 显示图片帮助
     */
    async showPictureHelp(e) {
        try {
            if (!this.apiData) {
                return await this.reply('❌ API数据未加载，请尝试 #更新图片API列表')
            }
            
            const categories = this.apiData.pictureCategories || {}
            
            let helpText = ['=== 🖼️ 憨憨图片菜单 ===']
            
            Object.entries(categories).forEach(([categoryName, items]) => {
                helpText.push(`\n📁 ${categoryName} (${items.length}个):`)
                helpText.push(...this.formatList(items, '  '))
            })
            
            helpText.push('\n🎯 使用方法：')
            helpText.push('• 直接发送图片名称')
            helpText.push('• #随机+分类名 获取随机图片')
            helpText.push(`\n⏰ 数据更新: ${this.getUpdateTime()}`)
            
            return await this.reply(helpText.join('\n'))
        } catch (error) {
            logger.error('[图片帮助] 获取失败:', error)
            return await this.reply('❌ 图片菜单获取失败')
        }
    }

    /**
     * 显示小姐姐帮助
     */
    async showGirlHelp(e) {
        try {
            if (!this.apiData) {
                return await this.reply('❌ API数据未加载，请尝试 #更新图片API列表')
            }
            
            const girlList = this.apiData.pictureCategories?.['三次元'] || []
            
            if (girlList.length === 0) {
                return await this.reply('❌ 暂无可用小姐姐类型')
            }
            
            const helpText = [
                '=== 👧 小姐姐菜单 ===',
                `📊 共 ${girlList.length} 种类型`,
                '',
                '💕 可用类型：',
                ...this.formatList(girlList),
                '',
                '🎯 使用方法：',
                '• 直接发送类型名称',
                '• #随机三次元 - 获取随机小姐姐',
                '',
                `⏰ 数据更新: ${this.getUpdateTime()}`
            ].join('\n')
            
            return await this.reply(helpText)
        } catch (error) {
            logger.error('[小姐姐帮助] 获取失败:', error)
            return await this.reply('❌ 小姐姐菜单获取失败')
        }
    }

    /**
     * 显示视频帮助
     */
    async showVideoHelp(e) {
        try {
            if (!this.apiData) {
                return await this.reply('❌ API数据未加载，请尝试 #更新视频API列表')
            }
            
            const categories = this.apiData.videoCategories || {}
            
            let helpText = ['=== 🎬 视频菜单 ===']
            
            Object.entries(categories).forEach(([categoryName, items]) => {
                helpText.push(`\n📁 ${categoryName} (${items.length}个):`)
                helpText.push(...this.formatList(items, '  '))
            })
            
            helpText.push('\n🎯 使用方法：')
            helpText.push('• 发送 目录名+视频，如：baisi视频')
            helpText.push('• #随机+分类名 获取随机视频')
            helpText.push(`\n⏰ 数据更新: ${this.getUpdateTime()}`)
            
            return await this.reply(helpText.join('\n'))
        } catch (error) {
            logger.error('[视频帮助] 获取失败:', error)
            return await this.reply('❌ 视频菜单获取失败')
        }
    }

    /**
     * 显示美女视频帮助
     */
    async showBeautyVideoHelp(e) {
        try {
            if (!this.apiData) {
                return await this.reply('❌ API数据未加载，请尝试 #更新视频API列表')
            }
            
            const beautyVideoList = this.apiData.videoCategories?.['美女视频'] || []
            
            if (beautyVideoList.length === 0) {
                return await this.reply('❌ 暂无可用美女视频类型')
            }
            
            const helpText = [
                '=== 💃 美女视频菜单 ===',
                `📊 共 ${beautyVideoList.length} 种类型`,
                '',
                '💕 可用类型：',
                ...this.formatList(beautyVideoList),
                '',
                '🎯 使用方法：',
                '• 发送 类型名+视频，如：baisi视频',
                '• #随机美女视频 - 获取随机美女视频',
                '',
                `⏰ 数据更新: ${this.getUpdateTime()}`
            ].join('\n')
            
            return await this.reply(helpText)
        } catch (error) {
            logger.error('[美女视频帮助] 获取失败:', error)
            return await this.reply('❌ 美女视频菜单获取失败')
        }
    }

    /**
     * 格式化列表显示
     */
    formatList(items, prefix = '• ') {
        const result = []
        for (let i = 0; i < items.length; i += 3) {
            const row = items.slice(i, i + 3).map(item => `${prefix}${item}`).join('  ')
            result.push(row)
        }
        return result
    }

    /**
     * 获取更新时间字符串
     */
    getUpdateTime() {
        if (!this.apiData?.lastUpdate) {
            return '未知'
        }
        return new Date(this.apiData.lastUpdate).toLocaleString()
    }

    /**
     * 带超时的fetch请求
     */
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    ...options.headers
                }
            })
            clearTimeout(timeoutId)
            return response
        } catch (error) {
            clearTimeout(timeoutId)
            if (error.name === 'AbortError') {
                throw new Error('请求超时')
            }
            throw error
        }
    }

    /**
     * 统一回复方法
     */
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