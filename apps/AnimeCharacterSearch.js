import plugin from '../../../lib/plugins/plugin.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { debuglog } from '../common/log.js';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { getSourceImage } from '../common/image-source-handler.js';
import { Config } from '../utils/config.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function addRandomNoiseToBase64(base64String) {
    try {
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        return (base64String + randomSuffix).substring(0, base64String.length);
    } catch (error) {
        debuglog('添加噪点时出错:', error);
        return base64String;
    }
}

export class AnimeCharacterSearch extends plugin {
    constructor() {
        super({
            name: '憨憨识图',
            dsc: '使用AnimeTrace API识别动漫人物，可指定模型',
            event: 'message',
            priority: 5,
            rule: [
                {
                    reg: '^#识别动漫人物(?:\\s*(.*))?$',
                    fnc: 'searchCharacter',
                    dsc: '识别动漫人物 [模型(可选)]。模型可用：高级1/高级2/普通/Gal',
                },
            ],
        });
        this.browser = null;
        this.modelMap = new Map([
            [['高级动画识别模型①', '高级1', 'lovelive'], { name: 'anime_model_lovelive', friendlyName: '高级动画识别模型①' }],
            [['高级动画识别模型②', '高级2', 'stable', '默认'], { name: 'pre_stable', friendlyName: '高级动画识别模型② (默认)' }],
            [['普通动画识别模型', '普通', 'anime'], { name: 'anime', friendlyName: '普通动画识别模型' }],
            [['高级Gal识别模型', 'gal', 'galgame'], { name: 'full_game_model_kira', friendlyName: '高级Gal识别模型' }],
        ]);
        for (const [aliases, modelInfo] of this.modelMap.entries()) {
            if (aliases.includes('默认')) { this.defaultModel = modelInfo; break; }
        }
        this.backgrounds = Config.RandomPictureAPI;
    }

    getModel(userInput) {
        if (!userInput) return this.defaultModel;
        for (const [aliases, modelInfo] of this.modelMap.entries()) {
            if (aliases.includes(userInput)) return modelInfo;
        }
        return this.defaultModel;
    }

    async getBrowser() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-first-run', '--disable-extensions']
            });
        }
        return this.browser;
    }

    async searchCharacter(e) {
        debuglog('功能被触发。');
        const imageUrl = await getSourceImage(e);
        if (!imageUrl) {
            await e.reply('请发送一张图片、回复一张图片或@某人来识别动漫人物。');
            return;
        }
        const userInput = e.msg.replace(/#识别动漫人物/g, '').trim();
        const selectedModel = this.getModel(userInput);
        await e.reply(`正在使用 [${selectedModel.friendlyName}] 进行识别，请稍候...`);
        try {
            const response = await axios({ method: 'get', url: imageUrl, responseType: 'arraybuffer', timeout: 10000 });
            const imageBuffer = Buffer.from(response.data);
            const form = new FormData();
            form.append('file', imageBuffer, { filename: 'image.jpg' });
            if (selectedModel?.name) {
                form.append('model', selectedModel.name);
            }
            const apiResponse = await axios.post('https://api.animetrace.com/v1/search', form, {
                headers: form.getHeaders(),
                timeout: 15000,
            });
            await this.handleApiResponse(e, apiResponse.data, imageBuffer);
        } catch (error) {
            debuglog('识别过程中发生错误:', error);
            if (error.response) debuglog('API错误响应:', error.response.data);
            await e.reply(error.code === 'ECONNABORTED' ? '识别超时，请稍后再试。' : '识别失败，可能是服务器繁忙或图片无法处理。');
        }
    }

    async handleApiResponse(e, data, imageBuffer) {
        if (!data.data || data.data.length === 0 || data.data.every(block => !block.character?.length)) {
            await this.sendTextFallback(e, '未能识别出任何动漫人物。', data);
            return;
        }
        const detectionResults = [];
        for (const item of data.data) {
            if (item.character?.length && item.box) {
                const matchesForThisBox = [];
                const seenCharacters = new Set();
                for (const match of item.character) {
                    if (matchesForThisBox.length >= 3) break;
                    const characterName = match.character.replace(/（[^）]+）/g, '').trim();
                    if (!seenCharacters.has(characterName)) {
                        matchesForThisBox.push({ character: this.escapeHtml(characterName), work: this.escapeHtml(match.work) });
                        seenCharacters.add(characterName);
                    }
                }
                if (matchesForThisBox.length > 0) {
                    detectionResults.push({ box: item.box, matches: matchesForThisBox });
                }
            }
        }
        if (detectionResults.length === 0) {
            await this.sendTextFallback(e, '解析后未找到任何有效结果。', data);
            return;
        }
        await this.processAndRenderResults(e, imageBuffer, detectionResults);
    }

    // --- 核心修改点: 渲染逻辑重构 ---
    async processAndRenderResults(e, originalImageBuffer, detectionResults) {
        try {
            // 1. 使用 Sharp 绘制标记框
            const image = sharp(originalImageBuffer);
            const metadata = await image.metadata();
            const overlaySvgs = detectionResults.map((result, index) => {
                const [x1, y1, x2, y2] = result.box;
                const left = Math.round(x1 * metadata.width), top = Math.round(y1 * metadata.height);
                const width = Math.round((x2 - x1) * metadata.width), height = Math.round((y2 - y1) * metadata.height);
                const color = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#F0B8B8'][index % 5];
                return {
                    input: Buffer.from(`<svg width="${width}" height="${height}"><rect x="0" y="0" width="${width}" height="${height}" style="fill:none;stroke:${color};stroke-width:5; stroke-dasharray: 10 5;" /><text x="8" y="22" font-family="sans-serif" font-size="18" fill="white" style="stroke:${color};stroke-width:0.6px;paint-order:stroke; font-weight:bold;">${index + 1}</text></svg>`),
                    left, top,
                };
            });
            const markedImageBuffer = await image.composite(overlaySvgs).jpeg({ quality: 90 }).toBuffer();
            const markedImageSrc = `data:image/jpeg;base64,${markedImageBuffer.toString('base64')}`;

            // 2. 准备信息列表的 HTML
            let itemsHtml = '';
            detectionResults.forEach((result, index) => {
                const color = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#F0B8B8'][index % 5];
                let matchesHtml = '';
                result.matches.forEach((match, matchIndex) => {
                    const isTopMatch = (matchIndex === 0), fontWeight = isTopMatch ? 'bold' : 'normal', opacity = isTopMatch ? '1' : '0.85';
                    matchesHtml += `<div class="match-pair" style="opacity: ${opacity};"><p class="character-name" style="font-weight: ${fontWeight};">${match.character}</p><p class="work-title">《${match.work}》</p></div>`;
                });
                itemsHtml += `<li class="result-item"><div class="item-index" style="background-color: ${color};">${index + 1}</div><div class="item-content">${matchesHtml}</div></li>`;
            });

            // 3. 组装最终的完整 HTML
            const randomBg = this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
            const templatePath = path.resolve(__dirname, '../resources/search-result.html');
            const templateHtml = fs.readFileSync(templatePath, 'utf-8');
            const finalHtml = templateHtml
                .replace('{{RESULTS_PLACEHOLDER}}', itemsHtml)
                .replace('{{MARKED_IMAGE_SRC}}', markedImageSrc)
                .replace('{{BACKGROUND_URL}}', randomBg);

            // 4. 使用 Puppeteer 渲染这一个完整的 HTML
            const finalImageBase64 = await this.renderHTMLToPicBase64(finalHtml);
            const noisyBase64 = await addRandomNoiseToBase64(finalImageBase64);

            await e.reply(segment.image(`base64://${noisyBase64}`));
            debuglog('已发送统一背景的合成结果图片。');

        } catch (error) {
            debuglog('处理和渲染结果时出错:', error);
            const fallbackData = { data: detectionResults.map(res => ({ character: res.matches })) };
            await this.sendTextFallback(e, '处理图片并标记区域失败，已降级为文字结果。', fallbackData);
        }
    }

    async sendTextFallback(e, reason, apiData) {
        let textResult = `🎭 动漫人物识别结果\n${reason}\n`;
        if (apiData?.code && apiData.code !== 0) {
            const codeMap = {};
            textResult += `(错误: ${codeMap[apiData.code] || apiData.code})\n`;
        }
        if (apiData?.data?.length > 0) {
            apiData.data.forEach((block, index) => {
                textResult += `\n--- 识别区域 ${index + 1} ---\n`;
                if (block.character?.length) {
                    block.character.forEach((char, charIndex) => {
                        const prefix = charIndex === 0 ? '▶' : '•';
                        textResult += `${prefix} ${this.escapeHtml(char.character)} (《${this.escapeHtml(char.work)}》)\n`;
                    });
                } else { textResult += '未匹配到结果。\n'; }
            });
        }
        await e.reply(textResult);
    }

    async renderHTMLToPicBase64(html) {
        let page = null;
        try {
            const browser = await this.getBrowser();
            page = await browser.newPage();
            // 视口需要足够宽以容纳左右两个面板
            await page.setViewport({ width: 1000, height: 800, deviceScaleFactor: 1.5 });
            await page.setContent(html, { waitUntil: 'networkidle0', timeout: 20000 });
            await new Promise(resolve => setTimeout(resolve, 500));
            const containerElement = await page.$('.main-container');
            if (!containerElement) throw new Error('无法找到渲染的 .main-container 元素');
            const imageBase64 = await containerElement.screenshot({ type: 'png', omitBackground: true, encoding: 'base64' });
            if (!imageBase64) throw new Error('截图失败，未能获取有效的base64数据');
            return imageBase64;
        } catch (error) {
            debuglog('渲染HTML到图片时出错:', error);
            throw error;
        } finally {
            if (page) await page.close();
        }
    }

    escapeHtml(unsafe) {
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    async destroy() {
        if (this.browser) { await this.browser.close(); this.browser = null; }
    }
}
