import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch' // 确保你已安装node-fetch

let mediaInstance = null

// API配置
const API_CONFIG = {
    BASE_URL: 'https://ai.ycxom.top:3002',
    LIST_API: 'https://ai.ycxom.top:3002/api/v1/info/lists',
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
                { reg: '^#?表情包(帮助|菜单)$', fnc: 'showExpressionHelp' },
                { reg: '^#?憨憨图片(帮助|菜单)$', fnc: 'showPictureHelp' },
                { reg: '^#?小姐姐(帮助|菜单)$', fnc: 'showGirlHelp' },
                { reg: '^#?视频(帮助|菜单)$', fnc: 'showVideoHelp' },
                { reg: '^#?美女视频(帮助|菜单)$', fnc: 'showBeautyVideoHelp' },
                { reg: '^#?憨憨?更新(表情包|图片|视频)?API列表$', fnc: 'updateApiList' },
                { reg: '^#?憨憨?随机(表情包|图片|壁纸|二次元|三次元|基础分类|叼图)$', fnc: 'getRandomByCategory' },
                { reg: '^#?憨憨?随机(美女视频|舞蹈视频|其他视频|视频)$', fnc: 'getRandomVideoByCategory' }
            ]
        })

        this.apiData = null
        this.reversedAliasMaps = { picture: {}, video: {} }; // 用于存储反向别名
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
     * 创建反向别名映射，方便查找
     */
    _createReversedAliasMaps() {
        const reversedPicture = {};
        const reversedVideo = {};

        for (const [alias, original] of Object.entries(this.apiData?.pictureDirAliases || {})) {
            if (!reversedPicture[original]) reversedPicture[original] = [];
            reversedPicture[original].push(alias);
        }

        for (const [alias, original] of Object.entries(this.apiData?.videoDirAliases || {})) {
            if (!reversedVideo[original]) reversedVideo[original] = [];
            reversedVideo[original].push(alias);
        }

        this.reversedAliasMaps = { picture: reversedPicture, video: reversedVideo };
    }

    /**
     * 加载API数据
     */
    async loadApiData() {
        try {
            if (this.isApiDataValid()) {
                const data = fs.readFileSync(FILE_CONFIG.API_DATA_FILE, 'utf8')
                this.apiData = JSON.parse(data)
                this._createReversedAliasMaps(); // 加载后创建反向别名
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
                    this._createReversedAliasMaps(); // 加载后创建反向别名
                    logger.warn('[憨憨富媒体] 使用过期缓存数据')
                } catch (cacheError) {
                    logger.error('[憨憨富媒体] 缓存数据也无法使用:', cacheError)
                }
            }
        }
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
            this._createReversedAliasMaps(); // 获取后创建反向别名
            logger.info('[憨憨富媒体] API数据获取并保存成功')
            return apiData
        } catch (error) {
            logger.error('[憨憨富媒体] 获取API数据失败:', error)
            throw error
        }
    }

    /**
     * 格式化带别名的列表项
     */
    formatItemsWithAliases(items, aliasMap) {
        if (!items || items.length === 0) return [];
        return items.map(item => {
            const aliases = aliasMap[item];
            if (aliases && aliases.length > 0) {
                return `${item} (${aliases.join('、')})`;
            }
            return item;
        });
    }

    // --- 帮助菜单 (已全部更新) ---

    async showExpressionHelp(e) {
        if (!this.apiData) return this.reply('❌ API数据未加载，请尝试 #憨憨更新API列表')
        const expressionList = this.apiData.pictureCategories?.['表情包'] || []
        const formattedList = this.formatItemsWithAliases(expressionList, this.reversedAliasMaps.picture);

        const helpText = [
            '=== 📦 表情包菜单 ===',
            '🎯 使用方法：',
            '• 直接发送表情包名称 (如: #小黑猫)',
            '• #憨憨随机表情包',
            '',
            `📝 可用表情包 (${formattedList.length}种)：`,
            ...this.formatList(formattedList),
        ].join('\n')
        return await this.reply(helpText)
    }

    async showPictureHelp(e) {
        if (!this.apiData) return this.reply('❌ API数据未加载，请尝试 #憨憨更新API列表')
        const categories = this.apiData.pictureCategories || {}
        let helpText = ['=== 🖼️ 憨憨图片菜单 ===']

        for (const [categoryName, items] of Object.entries(categories)) {
            const formattedItems = this.formatItemsWithAliases(items, this.reversedAliasMaps.picture);
            helpText.push(`\n📁 ${categoryName} (${formattedItems.length}个):`)
            helpText.push(...this.formatList(formattedItems, '  '))
        }

        helpText.push('\n🎯 使用方法：')
        helpText.push('• 直接发送图片名称或别名 (如: #bs)')
        helpText.push('• #憨憨随机+分类名 (如: #憨憨随机二次元)')

        return await this.reply(helpText.join('\n'))
    }

    async showGirlHelp(e) {
        if (!this.apiData) return this.reply('❌ API数据未加载，请尝试 #憨憨更新API列表')
        const girlList = this.apiData.pictureCategories?.['三次元'] || []
        const formattedList = this.formatItemsWithAliases(girlList, this.reversedAliasMaps.picture);

        const helpText = [
            '=== 👧 小姐姐菜单 ===',
            '🎯 使用方法：',
            '• 直接发送类型名称或别名 (如: #JK)',
            '• #憨憨随机三次元',
            '',
            `💕 可用类型 (${formattedList.length}种)：`,
            ...this.formatList(formattedList),
        ].join('\n')
        return await this.reply(helpText)
    }

    async showVideoHelp(e) {
        if (!this.apiData) return this.reply('❌ API数据未加载，请尝试 #憨憨更新API列表')
        const categories = this.apiData.videoCategories || {}
        let helpText = ['=== 🎬 视频菜单 ===']

        for (const [categoryName, items] of Object.entries(categories)) {
            const formattedItems = this.formatItemsWithAliases(items, this.reversedAliasMaps.video);
            helpText.push(`\n📁 ${categoryName} (${formattedItems.length}个):`)
            helpText.push(...this.formatList(formattedItems, '  '))
        }

        helpText.push('\n🎯 使用方法：')
        helpText.push('• 发送 目录名/别名+视频 (如: #白丝视频)')
        helpText.push('• #憨憨随机+分类名 (如: #憨憨随机舞蹈视频)')

        return await this.reply(helpText.join('\n'))
    }

    async showBeautyVideoHelp(e) {
        if (!this.apiData) return this.reply('❌ API数据未加载，请尝试 #憨憨更新API列表')
        const beautyVideoList = this.apiData.videoCategories?.['美女视频'] || []
        const formattedList = this.formatItemsWithAliases(beautyVideoList, this.reversedAliasMaps.video);

        const helpText = [
            '=== 💃 美女视频菜单 ===',
            '🎯 使用方法：',
            '• 发送 类型名/别名+视频 (如: #汉服视频)',
            '• #憨憨随机美女视频',
            '',
            `💕 可用类型 (${formattedList.length}种)：`,
            ...this.formatList(formattedList),
        ].join('\n')
        return await this.reply(helpText)
    }

    // --- 以下是未修改的函数，保持原样 ---

    ensureDataDir() { if (!fs.existsSync(FILE_CONFIG.DATA_DIR)) fs.mkdirSync(FILE_CONFIG.DATA_DIR, { recursive: true }) }
    isApiDataValid() { if (!fs.existsSync(FILE_CONFIG.API_DATA_FILE)) return false; const s = fs.statSync(FILE_CONFIG.API_DATA_FILE); return (Date.now() - s.mtime.getTime()) < FILE_CONFIG.UPDATE_INTERVAL }
    registerDynamicRules() {
        if (!this.apiData) { logger.warn('[憨憨富媒体] API数据为空，跳过动态规则注册'); return }
        try {
            const allPicDirs = [...(this.apiData.pictureDirs || []), ...Object.keys(this.apiData.pictureDirAliases || {})];
            const allVideoDirs = [...(this.apiData.videoDirs || []), ...Object.keys(this.apiData.videoDirAliases || {})];
            if (allPicDirs.length > 0) {
                const picDirsRegex = allPicDirs.map(d => this.escapeRegExp(d)).join('|');
                this.rule.push({ reg: new RegExp(`^#?(${picDirsRegex})$`), fnc: 'getPictureByDirName' });
            }
            if (allVideoDirs.length > 0) {
                const videoDirsRegex = allVideoDirs.map(d => this.escapeRegExp(d)).join('|');
                this.rule.push({ reg: new RegExp(`^#?(${videoDirsRegex})视频$`), fnc: 'getVideoByDirName' });
            }
            logger.info(`[憨憨富媒体] 动态注册 ${allPicDirs.length} 个图片命令，${allVideoDirs.length} 个视频命令`);
        } catch (error) { logger.error('[憨憨富媒体] 动态规则注册失败:', error) }
    }
    escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
    async updateApiList(e) {
        try {
            await this.reply('正在更新API列表，请稍候...'); await this.fetchAndSaveApiData();
            this.rule = this.rule.filter(r => r.fnc !== 'getPictureByDirName' && r.fnc !== 'getVideoByDirName'); this.registerDynamicRules();
            const totalPicDirs = (this.apiData?.pictureDirs?.length || 0) + Object.keys(this.apiData?.pictureDirAliases || {}).length;
            const totalVideoDirs = (this.apiData?.videoDirs?.length || 0) + Object.keys(this.apiData?.videoDirAliases || {}).length;
            const msg = `✅ API列表更新成功！\n📅 更新时间: ${new Date().toLocaleString()}\n📁 可用图片目录/别名: ${totalPicDirs} 个\n🎬 可用视频目录/别名: ${totalVideoDirs} 个`;
            return await this.reply(msg);
        } catch (error) { logger.error('[更新API列表] 失败:', error); return await this.reply('❌ API列表更新失败') }
    }
    async getPictureByDirName(e) { try { const d = e.msg.replace(/^#/, '').trim(); const u = `${API_CONFIG.BASE_URL}/api/v1/media/picture/by-dir/${encodeURIComponent(d)}`; await this.reply(segment.image(u)); return true } catch (err) { return this.reply('❌ 图片获取失败') } }
    async getVideoByDirName(e) { try { const d = e.msg.replace(/^#/, '').replace(/视频$/, '').trim(); const u = `${API_CONFIG.BASE_URL}/api/v1/media/video/by-dir/${encodeURIComponent(d)}`; await this.reply(segment.video(u)); return true } catch (err) { return this.reply('❌ 视频获取失败') } }
    async getRandomByCategory(e) { try { const c = e.msg.replace(/^#?憨憨?随机/, '').trim(); const u = c === '图片' ? `${API_CONFIG.BASE_URL}/api/v1/media/picture/random` : `${API_CONFIG.BASE_URL}/api/v1/media/picture/by-category/${encodeURIComponent(c)}`; await this.reply(segment.image(u)); return true } catch (err) { return this.reply('❌ 随机图片获取失败') } }
    async getRandomVideoByCategory(e) { try { const c = e.msg.replace(/^#?憨憨?随机/, '').trim(); const u = c === '视频' ? `${API_CONFIG.BASE_URL}/api/v1/media/video/random` : `${API_CONFIG.BASE_URL}/api/v1/media/video/by-category/${encodeURIComponent(c)}`; await this.reply(segment.video(u)); return true } catch (err) { return this.reply('❌ 随机视频获取失败') } }
    formatList(items, prefix = '• ') { const r = []; for (let i = 0; i < items.length; i += 3) r.push(items.slice(i, i + 3).map(item => `${prefix}${item}`).join('  ')); return r }
    getUpdateTime() { return this.apiData?.lastUpdate ? new Date(this.apiData.lastUpdate).toLocaleString() : '未知' }
    async fetchWithTimeout(url, options = {}) { const c = new AbortController(); const t = setTimeout(() => c.abort(), API_CONFIG.TIMEOUT); try { const r = await fetch(url, { ...options, signal: c.signal, headers: { 'User-Agent': 'yunzai/hanhan-plugin', ...options.headers } }); clearTimeout(t); return r } catch (e) { clearTimeout(t); if (e.name === 'AbortError') throw new Error('请求超时'); throw e } }
    async reply(message) { try { return await this.e.reply(message, false, { recallMsg: Config.recall_s || 0 }) } catch (e) { logger.error('[憨憨富媒体] 回复消息失败:', e); return false } }
}