import axios from "axios";
import puppeteer from "puppeteer";
import HttpsProxyAgent from 'https-proxy-agent';
import { Config } from '../utils/config.js';
import plugin from '../../../lib/plugins/plugin.js';
import UserAgent1 from 'user-agents';
import path from 'path';
import fs from 'fs';
const FALLBACK_IMAGE_PATH = path.join(process.cwd(), './plugins/hanhan-plugin/resources/img/966087819214df65e9ab52309cde7370.jpg');

export class whatslink_Api extends plugin {
    constructor() {
        super({
            name: '憨憨Torrent',
            dsc: '让我看看BT内容',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: '^#?查看(?:磁力|BT|Ed2k|torrent)内容',
                    fnc: 'torrent',
                    dsc: '查看磁力/种子'
                }
            ]
        })
        this.initConfig();

        this.fallbackImageBase64 = this.loadFallbackImageAsBase64();
    }

    initConfig() {
        this.linkbt = Config.linkbt ?? false;
        this.proxyUrl = Config.proxyUrl;
    }

    async torrent(e) {
        try {
            logger.info('收到命令:', e.msg);

            const link = e.msg.replace(/^#?查看(?:磁力|BT|Ed2k|torrent)内容/i, '').trim();

            if (!link) {
                await e.reply('请输入有效的磁力/Ed2k链接。');
                return true;
            }

            await e.reply('收到指令，正在查询链接内容，请稍候...');

            const axiosInstance = this.createAxiosInstance();
            const apiUrl = `https://whatslink.info/api/v1/link?url=${encodeURIComponent(link)}`;
            const response = await axiosInstance.get(apiUrl);
            const data = response.data;

            if (data.error || !data.name) { // 增加对!data.name的判断，API可能返回成功但无内容
                await e.reply('查询出错或链接无效，请检查链接或稍后重试。');
                logger.error('API 查询出错:', data.error || '返回数据为空');
                return true;
            }

            const htmlContent = this.constructHtmlContent(data);
            const screenshotBuffer = await this.captureScreenshot(htmlContent);

            await e.reply(segment.image(`base64://${screenshotBuffer}`), true, { recallMsg: this.linkbt ? 10 : 0 });

        } catch (error) {
            await e.reply('链接内容查询失败，请稍后重试；多次出现请尝试使用代理或切换代理。');
            logger.error('查询链接内容失败:', error);
        }
        return true;
    }

    createAxiosInstance() {
        const proxyOptions = this.proxyUrl;
        const randomUserAgent = new UserAgent1().toString();

        return axios.create({
            httpsAgent: proxyOptions ? new HttpsProxyAgent(proxyOptions) : null,
            headers: {
                'Host': 'whatslink.info',
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': randomUserAgent,
                'Referer': 'https://whatslink.info/',
            }
        });
    }

    loadFallbackImageAsBase64() {
        if (fs.existsSync(FALLBACK_IMAGE_PATH)) {
            const imgBuffer = fs.readFileSync(FALLBACK_IMAGE_PATH);
            return `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;
        }
        logger.warn(`[憨憨Torrent] 备用图片未找到: ${FALLBACK_IMAGE_PATH}`);
        return '';
    }

    constructHtmlContent(data) {
        const resourceInfo = `
        <div class="info-grid">
            <div class="info-item">
                <span class="label">资源名称:</span>
                <span class="value">${data.name}</span>
            </div>
            <div class="info-item">
                <span class="label">文件数量:</span>
                <span class="value">${data.count}</span>
            </div>
            <div class="info-item">
                <span class="label">文件总大小:</span>
                <span class="value">${this.formatBytes(data.size)}</span>
            </div>
            <div class="info-item">
                <span class="label">文件类型:</span>
                <span class="value">${data.file_type}</span>
            </div>
        </div>`;

        let htmlContent = `<html><head><style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f4f4f4; }
            .container { width: 800px; margin: 20px auto; padding: 30px; background: rgba(255, 255, 255, 0.95); border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }
            .info-grid { display: grid; gap: 15px; margin-bottom: 30px; }
            .info-item { display: flex; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 8px; }
            .label { font-weight: 500; color: #666; min-width: 100px; }
            .value { color: #333; word-break: break-all; }
            .img-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; padding: 10px; }
            img { width: 100%; height: 200px; object-fit: cover; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
            .background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: url('https://t.mwm.moe/pc'); background-size: cover; filter: blur(8px); opacity: 0.8; z-index: -1; }
        </style></head><body>
            <div class="background"></div>
            <div class="container">
                <div class="content">${resourceInfo}</div>
                <div class="img-container">`;

        if (data.screenshots && Array.isArray(data.screenshots)) {
            data.screenshots.forEach((screenshot, index) => {
                if (this.linkbt) {
                    htmlContent += `<img src="${screenshot.screenshot}" alt="image${index + 1}" />`;
                } else {
                    htmlContent += `<img src="${this.fallbackImageBase64}" alt="image${index + 1}" />`;
                }
            });
        } else {
            logger.warn('未找到图片数据');
        }

        htmlContent += `</div></div></body></html>`;
        return htmlContent;
    }

    async captureScreenshot(htmlContent) {
        const launchOptions = {
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        };
        if (this.proxyUrl) {
            launchOptions.args.push(`--proxy-server=${this.proxyUrl}`);
        }

        const browser = await puppeteer.launch(launchOptions);
        const htmlPage = await browser.newPage();
        await htmlPage.setContent(htmlContent, { waitUntil: 'networkidle0' });
        // 自动调整视口以适应内容，但设置一个最大宽度
        await htmlPage.setViewport({ width: 840, height: 1080 });
        const bodyHandle = await htmlPage.$('body');
        const { height } = await bodyHandle.boundingBox();
        await bodyHandle.dispose();
        await htmlPage.setViewport({ width: 840, height: Math.round(height) + 40 });

        const screenshotBuffer = await htmlPage.screenshot({ type: 'jpeg', quality: 80, encoding: 'base64' });
        await browser.close();
        return screenshotBuffer;
    }

    /**
     * @param {number} bytes 文件大小（字节）
     * @param {number} decimals 保留的小数位数
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}