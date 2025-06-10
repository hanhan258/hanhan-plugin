import axios from "axios";
import puppeteer from "puppeteer";
import HttpsProxyAgent from 'https-proxy-agent';
import { Config } from '../utils/config.js';
import plugin from '../../../lib/plugins/plugin.js';
import UserAgent1 from 'user-agents';
import path from 'path';
import fs from 'fs';

export class whatslink_Api extends plugin {
    constructor() {
        super({
            name: '憨憨Torrent',
            dsc: '让我看看BT内容',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: '^#?(看|查看)(?:磁力|BT|bt|ed2k|Ed2k|torrent|Torrent)内容\\s*(.+)$',
                    fnc: 'whatslink'
                }
            ]

        })
        this.initConfig()
    }
    initConfig() {
        this.linkbt = Config.linkbt ?? false
        this.proxyUrl = Config.proxyUrl
    }
    async whatslink(e) {
        try {
            logger.info('收到命令:', e.msg);
            const linkMatch = e.msg.match(/^#?(看|查看)(?:磁力|BT|bt|ed2k|Ed2k|torrent|Torrent)内容\s*(.+)$/);

            if (!linkMatch) {
                await e.reply('未找到有效的链接，请检查你的输入。');
                return true;
            }

            const link = linkMatch[2];
            await e.reply('收到指令，正在查询链接内容...');

            const axiosInstance = this.createAxiosInstance();
            const apiUrl = `https://whatslink.info/api/v1/link?url=${encodeURIComponent(link)}`;
            const response = await axiosInstance.get(apiUrl);
            const data = response.data;

            if (data.error) {
                await e.reply('查询出错，请稍后重试。');
                logger.error('API 查询出错:', data.error);
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
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://whatslink.info/',
                'Accept-Encoding': 'gzip, deflate, br',
                'Priority': 'u=1, i',
                'Connection': 'keep-alive'
            }
        });
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
                <span class="value">${(data.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
            <div class="info-item">
                <span class="label">文件类型:</span>
                <span class="value">${data.file_type}</span>
            </div>
        </div>`;

        let htmlContent = `<html>
        <head>
            <style>
                body { 
                    margin: 0; 
                    padding: 0; 
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                    background: #f4f4f4; 
                    line-height: 1.6;
                }
                .container { 
                    width: 800px; 
                    margin: 20px auto; 
                    padding: 30px; 
                    background: rgba(255, 255, 255, 0.95); 
                    border-radius: 16px; 
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); 
                }
                .info-grid {
                    display: grid;
                    gap: 15px;
                    margin-bottom: 30px;
                }
                .info-item {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                .label {
                    font-weight: 500;
                    color: #666;
                    min-width: 100px;
                }
                .value {
                    color: #333;
                }
                .img-container { 
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 10px;
                }
                img { 
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 12px;
                    transition: transform 0.2s;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                img:hover {
                    transform: scale(1.03);
                }
                .background { 
                    position: fixed; 
                    top: 0; 
                    left: 0; 
                    width: 100%; 
                    height: 100%; 
                    background-image: url('https://t.mwm.moe/pc'); 
                    background-size: cover; 
                    filter: blur(8px);
                    opacity: 0.8; 
                    z-index: -1; 
                }
            </style>
        </head>
        <body>
            <div class="background"></div>
            <div class="container">
                <div class="content">${resourceInfo}</div>
                <div class="img-container">`;

        if (data.screenshots && Array.isArray(data.screenshots)) {
            data.screenshots.forEach((screenshot, index) => {
                if (this.linkbt) {
                    htmlContent += `<img src="${screenshot.screenshot}" alt="image${index + 1}" />`;
                } else {
                    const imgPath = path.join(process.cwd(), './plugins/hanhan-plugin/resources/tp-bq/124925716_p0_master1200.jpg');
                    const imgBuffer = fs.readFileSync(imgPath);
                    const base64Img = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;
                    htmlContent += `<img src="${base64Img}" alt="image${index + 1}" />`;
                }
            });
        } else {
            logger.warn('未找到图片数据');
        }

        htmlContent += `</div></div></body></html>`;
        return htmlContent;
    }

    async captureScreenshot(htmlContent) {
        const browser = await puppeteer.launch({
            args: this.proxyUrl ? [`--proxy-server=${this.proxyUrl}`] : null
        });
        const htmlPage = await browser.newPage();
        await htmlPage.setContent(htmlContent);
        await htmlPage.setViewport({ width: 720, height: 1 }); // 高度自动调整
        const screenshotBuffer = await htmlPage.screenshot({ encoding: 'base64', fullPage: true });
        await browser.close();
        return screenshotBuffer;
    }
}