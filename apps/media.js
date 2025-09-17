import { getRandomBgImage } from '../utils/background.js';
import plugin from '../../../lib/plugins/plugin.js'
import { Config } from '../utils/config.js'
import fs from 'fs'
import fetch from 'node-fetch'
import puppeteer from 'puppeteer'
import path from 'path'

let isInitialized = false
let cachedApiData = null
let cachedReversedAliasMaps = null

// --- 配置常量 ---
const API_CONFIG = {
    BASE_URL: 'https://ai.ycxom.top:3002',
    LIST_API: 'https://ai.ycxom.top:3002/api/v1/info/lists',
    TIMEOUT: 15000
}

const FILE_CONFIG = {
    DATA_DIR: './plugins/hanhan-plugin/data/hanhan-pics',
    API_DATA_FILE: './plugins/hanhan-plugin/data/hanhan-pics/api-data.json',
    UPDATE_INTERVAL: 5 * 24 * 60 * 60 * 1000 // 5天
}

export class media extends plugin {
    constructor() {
        super({
            name: '憨憨富媒体',
            dsc: '憨憨富媒体插件，支持多种表情包、随机图片和视频',
            event: 'message',
            priority: 6,
            rule: [
                { reg: '^#?表情包(帮助|菜单)$', fnc: 'showExpressionHelp', dsc: '#表情包帮助' },
                { reg: '^#?憨憨图片(帮助|菜单)$', fnc: 'showPictureHelp', dsc: '#憨憨图片帮助' },
                { reg: '^#?小姐姐(帮助|菜单)$', fnc: 'showGirlHelp', dsc: '#小姐姐帮助' },
                { reg: '^#?视频(帮助|菜单)$', fnc: 'showVideoHelp', dsc: '#视频帮助' },
                { reg: '^#?美女视频(帮助|菜单)$', fnc: 'showBeautyVideoHelp', dsc: '#美女视频帮助' },
                { reg: '^#?憨憨?更新(表情包|图片|视频)?(API|api)列表$', fnc: 'updateApiList', dsc: '#憨憨更新API列表' },
                { reg: '^#?憨憨?随机(表情包|图片|壁纸|二次元|三次元|基础分类|叼图)$', fnc: 'getRandomByCategory', dsc: '#憨憨随机图片' },
                { reg: '^#?憨憨?随机(美女视频|舞蹈视频|其他视频|视频)$', fnc: 'getRandomVideoByCategory', dsc: '#憨憨随机视频' }
            ]
        })

        this.apiData = null
        this.reversedAliasMaps = { picture: {}, video: {} }
        this.initPromise = this.init()
    }

    async init() {
        if (isInitialized) {
            this.apiData = cachedApiData
            this.reversedAliasMaps = cachedReversedAliasMaps
            this.registerDynamicRules()
            return
        }

        try {
            this.ensureDataDir()
            await this.loadApiData()
            this.registerDynamicRules()

            // 将首次加载的数据缓存到全局变量中
            cachedApiData = this.apiData
            cachedReversedAliasMaps = this.reversedAliasMaps

            // 设置初始化完成标志
            isInitialized = true
            logger.info('[憨憨富媒体] 插件首次初始化成功，后续将不再打印此日志。')

        } catch (error) {
            logger.error('[憨憨富媒体] 插件初始化失败:', error)
        }
    }

    async loadApiData() {
        try {
            if (this.isApiDataValid()) {
                const data = fs.readFileSync(FILE_CONFIG.API_DATA_FILE, 'utf8')
                this.apiData = JSON.parse(data)
                this._createReversedAliasMaps()
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
                    this._createReversedAliasMaps()
                    logger.warn('[憨憨富媒体] API更新失败，使用过期缓存数据')
                } catch (cacheError) {
                    logger.error('[憨憨富媒体] 缓存数据也无法使用:', cacheError)
                    this.apiData = null
                }
            }
        }
    }

    async fetchAndSaveApiData() {
        try {
            logger.info('[憨憨富媒体] 开始获取API数据...')
            const response = await this.fetchWithTimeout(API_CONFIG.LIST_API)
            if (!response.ok) throw new Error(`API请求失败: ${response.status}`)
            const apiData = await response.json()
            apiData.lastUpdate = Date.now()
            fs.writeFileSync(FILE_CONFIG.API_DATA_FILE, JSON.stringify(apiData, null, 2), 'utf8')
            this.apiData = apiData
            this._createReversedAliasMaps()
            logger.info('[憨憨富媒体] API数据获取并保存成功')
            return apiData
        } catch (error) {
            logger.error('[憨憨富媒体] 获取API数据失败:', error)
            throw error
        }
    }

    async showExpressionHelp(e) {
        await this.initPromise;
        if (!this.checkApiData(e)) return;
        const items = this.apiData.pictureCategories?.['表情包'] || [];
        const groups = [{ groupName: `📝 可用表情包 (${items.length}种)：`, items: this.formatItemsWithAliases(items, 'picture') }];
        return this.renderHelp({ title: '📦 表情包菜单', usage: ['• 直接发送表情包名称 (如: #小黑猫)', '• #憨憨随机表情包'], groups });
    }
    async showPictureHelp(e) {
        await this.initPromise;
        if (!this.checkApiData(e)) return;
        const categories = this.apiData.pictureCategories || {};
        const groups = Object.entries(categories).reduce((acc, [categoryName, items]) => {
            const formattedItems = this.formatItemsWithAliases(items, 'picture');
            if (formattedItems.length > 0) {
                acc.push({ groupName: `📁 ${categoryName} (${items.length}个):`, items: formattedItems });
            } return acc;
        }, []);
        return this.renderHelp({ title: '🖼️ 憨憨图片菜单', usage: ['• 直接发送图片名称或别名 (如: #bs)', '• #憨憨随机+分类名 (如: #憨憨随机二次元)'], groups });
    }
    async showGirlHelp(e) {
        await this.initPromise;
        if (!this.checkApiData(e)) return;
        const items = this.apiData.pictureCategories?.['三次元'] || [];
        const groups = [{ groupName: `💕 可用类型 (${items.length}种)：`, items: this.formatItemsWithAliases(items, 'picture') }];
        return this.renderHelp({ title: '👧 小姐姐菜单', usage: ['• 直接发送类型名称或别名 (如: #JK)', '• #憨憨随机三次元'], groups });
    }
    async showVideoHelp(e) {
        await this.initPromise;
        if (!this.checkApiData(e)) return;
        const categories = this.apiData.videoCategories || {};
        const groups = Object.entries(categories).reduce((acc, [categoryName, items]) => {
            const formattedItems = this.formatItemsWithAliases(items, 'video');
            if (formattedItems.length > 0) {
                acc.push({ groupName: `📁 ${categoryName} (${items.length}个):`, items: formattedItems });
            } return acc;
        }, []);
        return this.renderHelp({ title: '🎬 视频菜单', usage: ['• 发送 目录名/别名+视频 (如: #白丝视频)', '• #憨憨随机+分类名 (如: #憨憨随机舞蹈视频)'], groups });
    }
    async showBeautyVideoHelp(e) {
        await this.initPromise;
        if (!this.checkApiData(e)) return;
        const items = this.apiData.videoCategories?.['美女视频'] || [];
        const groups = [{ groupName: `💕 可用类型 (${items.length}种)：`, items: this.formatItemsWithAliases(items, 'video') }];
        return this.renderHelp({ title: '💃 美女视频菜单', usage: ['• 发送 类型名/别名+视频 (如: #汉服视频)', '• #憨憨随机美女视频'], groups });
    }

    async renderHelp(data = {}) {
        await this.initPromise
        if (!data.groups || !Array.isArray(data.groups)) {
            logger.error('[憨憨富媒体] 渲染失败：groups 数据结构不正确。', data.groups)
            return this.reply('❌ 菜单渲染失败：内部数据结构错误。')
        }

        const tplPath = './plugins/hanhan-plugin/resources/media/help.html'
        if (!fs.existsSync(tplPath)) {
            logger.error(`[憨憨富媒体] 渲染失败：帮助模板文件未找到，路径: ${tplPath}`)
            return this.reply('❌ 菜单渲染失败：帮助模板文件丢失。')
        }

        let browser
        let tempFilePath = null

        try {
            const bgImageDataUri = await getRandomBgImage();
            const renderData = { ...data, updateTime: this.getUpdateTime() }
            let tpl = fs.readFileSync(tplPath, 'utf8')

            const containerStyle = bgImageDataUri ? `style="background-image: url('${bgImageDataUri}');"` : ''
            tpl = tpl.replace('<div class="container">', `<div class="container" ${containerStyle}>`)
            tpl = tpl.replace('<h1>{{ title }}</h1>', `<h1>${renderData.title || '憨憨富媒体帮助'}</h1>`)
            tpl = tpl.replace('<span>API数据更新于：{{ updateTime }}</span>', `<span>API数据更新于：${renderData.updateTime}</span>`)

            const usageHtml = renderData.usage && renderData.usage.length > 0
                ? `<h2>🎯 使用方法</h2>${renderData.usage.map(line => `<p>${line}</p>`).join('')}`
                : ''
            tpl = tpl.replace(/<div class="usage-section">.*?<\/div>/s, `<div class="usage-section">${usageHtml}</div>`)

            const groupsHtml = renderData.groups.map(group => `
                <div class="group">
                    <h2 class="group-name">${group.groupName}</h2>
                    <ul class="item-list">${group.items.map(item => `<li class="item">${item}</li>`).join('')}</ul>
                </div>`).join('')
            tpl = tpl.replace(/<div class="group">.*?<\/div>/s, groupsHtml)

            browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
            const page = await browser.newPage()
            await page.setViewport({ width: 800, height: 100 })
            await page.setContent(tpl, { waitUntil: 'networkidle0' })
            const bodyElement = await page.$('.container')
            if (!bodyElement) throw new Error('在页面中找不到 .container 元素')
            const imageBuffer = await bodyElement.screenshot({ type: 'png' })

            const tempDir = path.join(FILE_CONFIG.DATA_DIR, 'temp')
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true })
            }
            tempFilePath = path.join(tempDir, `${Date.now()}.png`)
            fs.writeFileSync(tempFilePath, imageBuffer)

            await this.reply(segment.image(tempFilePath))

        } catch (error) {
            logger.error('[憨憨富媒体] Puppeteer 渲染帮助图片失败:', error)
            return this.reply('❌ 生成帮助菜单图片时遇到严重错误，请查看后台日志。')
        } finally {
            if (browser) {
                await browser.close()
            }
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                try {
                    fs.unlinkSync(tempFilePath)
                } catch (unlinkErr) {
                    logger.error(`[憨憨富媒体] 删除临时文件失败: ${tempFilePath}`, unlinkErr)
                }
            }
        }
    }

    async updateApiList(e) {
        try {
            await this.reply('正在更新API列表，请稍候...');
            await this.fetchAndSaveApiData();
            cachedApiData = this.apiData;
            cachedReversedAliasMaps = this.reversedAliasMaps;
            this.registerDynamicRules();
            const totalPicDirs = new Set([...(this.apiData?.pictureDirs || []), ...Object.keys(this.apiData?.pictureDirAliases || {})]).size;
            const totalVideoDirs = new Set([...(this.apiData?.videoDirs || []), ...Object.keys(this.apiData?.videoDirAliases || {})]).size;
            const msg = `✅ API列表更新成功！\n📅 更新时间: ${this.getUpdateTime()}\n📁 图片命令: ${totalPicDirs} 个\n🎬 视频命令: ${totalVideoDirs} 个`;
            return await this.reply(msg);
        } catch (error) {
            logger.error('[更新API列表] 失败:', error);
            return await this.reply('❌ API列表更新失败，请检查后台日志。');
        }
    }
    async getPictureByDirName(e) {
        await this.initPromise;
        try {
            const d = e.msg.replace(/^#/, '').trim();
            const u = `${API_CONFIG.BASE_URL}/api/v1/media/picture/by-dir/${encodeURIComponent(d)}`;
            await this.reply(segment.image(u));
            return true
        } catch (err) { return this.reply('❌ 图片获取失败') }
    }
    async getVideoByDirName(e) {
        await this.initPromise;
        if (!Config.enableVideo) return await this.reply('视频功能已关闭');
        try {
            const d = e.msg.replace(/^#/, '').replace(/视频$/, '').trim();
            const u = `${API_CONFIG.BASE_URL}/api/v1/media/video/by-dir/${encodeURIComponent(d)}`;
            await this.reply(segment.video(u));
            return true
        } catch (err) { return this.reply('❌ 视频获取失败') }
    }
    async getRandomByCategory(e) {
        await this.initPromise;
        try {
            const c = e.msg.replace(/^#?憨憨?随机/, '').trim();
            const u = c === '图片' ? `${API_CONFIG.BASE_URL}/api/v1/media/picture/random` : `${API_CONFIG.BASE_URL}/api/v1/media/picture/by-category/${encodeURIComponent(c)}`;
            await this.reply(segment.image(u));
            return true
        } catch (err) { return this.reply('❌ 随机图片获取失败') }
    }
    async getRandomVideoByCategory(e) {
        await this.initPromise;
        if (!Config.enableVideo) return await this.reply('视频功能已关闭');
        try {
            const c = e.msg.replace(/^#?憨憨?随机/, '').trim();
            const u = c === '视频' ? `${API_CONFIG.BASE_URL}/api/v1/media/video/random` : `${API_CONFIG.BASE_URL}/api/v1/media/video/by-category/${encodeURIComponent(c)}`;
            await this.reply(segment.video(u));
            return true
        } catch (err) { return this.reply('❌ 随机视频获取失败') }
    }
    ensureDataDir() { if (!fs.existsSync(FILE_CONFIG.DATA_DIR)) fs.mkdirSync(FILE_CONFIG.DATA_DIR, { recursive: true }) }
    isApiDataValid() {
        if (!fs.existsSync(FILE_CONFIG.API_DATA_FILE)) return false;
        const s = fs.statSync(FILE_CONFIG.API_DATA_FILE);
        return (Date.now() - s.mtime.getTime()) < FILE_CONFIG.UPDATE_INTERVAL
    }
    getUpdateTime() { return this.apiData?.lastUpdate ? new Date(this.apiData.lastUpdate).toLocaleString() : '未知' }
    checkApiData(e) {
        if (this.apiData) return true;
        e.reply('❌ API数据为空，无法生成菜单。\n请先发送 #憨憨更新API列表 来获取数据。');
        return false;
    }
    _createReversedAliasMaps() {
        this.reversedAliasMaps.picture = Object.entries(this.apiData?.pictureDirAliases || {}).reduce((acc, [alias, original]) => {
            if (!acc[original]) acc[original] = [];
            acc[original].push(alias);
            return acc;
        }, {});
        this.reversedAliasMaps.video = Object.entries(this.apiData?.videoDirAliases || {}).reduce((acc, [alias, original]) => {
            if (!acc[original]) acc[original] = [];
            acc[original].push(alias);
            return acc;
        }, {});
    }
    registerDynamicRules() {
        if (!this.apiData) {
            logger.warn('[憨憨富媒体] API数据为空，无法注册动态规则');
            return;
        }
        this.rule = this.rule.filter(r => !r.isDynamic);
        try {
            const allPicDirs = [...new Set([...(this.apiData.pictureDirs || []), ...Object.keys(this.apiData.pictureDirAliases || {})])];
            const allVideoDirs = [...new Set([...(this.apiData.videoDirs || []), ...Object.keys(this.apiData.videoDirAliases || {})])];
            if (allPicDirs.length > 0) this.rule.push({ reg: new RegExp(`^#?(${allPicDirs.map(d => this.escapeRegExp(d)).join('|')})$`), fnc: 'getPictureByDirName', dsc: '#[图片名]', isDynamic: true });
            if (allVideoDirs.length > 0) this.rule.push({ reg: new RegExp(`^#?(${allVideoDirs.map(d => this.escapeRegExp(d)).join('|')})视频$`), fnc: 'getVideoByDirName', dsc: '#[视频名]视频', isDynamic: true });
        } catch (error) {
            logger.error('[憨憨富媒体] 动态规则注册失败:', error)
        }
    }
    formatItemsWithAliases(items, type) {
        if (!items || items.length === 0) return [];
        const aliasMap = this.reversedAliasMaps[type] || {};
        return items.map(item => {
            const aliases = aliasMap[item];
            return aliases && aliases.length > 0 ? `${item}(${aliases.join('/')})` : item;
        });
    }
    escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
    async fetchWithTimeout(url, options = {}) {
        const c = new AbortController();
        const t = setTimeout(() => c.abort(), API_CONFIG.TIMEOUT);
        try {
            const r = await fetch(url, { ...options, signal: c.signal, headers: { 'User-agent': 'yunzai/hanhan-plugin', ...options.headers } });
            clearTimeout(t);
            return r
        } catch (e) {
            clearTimeout(t);
            if (e.name === 'AbortError') throw new Error('请求超时');
            throw e
        }
    }
    async reply(message, quote = false) {
        try { return await this.e.reply(message, quote, { recallMsg: Config.recall_s || 0 }) } catch (e) {
            logger.error('[憨憨富媒体] 回复消息失败:', e);
            return false
        }
    }
}
