import fetch from 'node-fetch';
import { Config } from './config.js'

/**
 * 获取随机背景图片的Data URI
 * @returns {Promise<string>} 返回图片的Data URI，失败则返回空字符串
 */
export async function getRandomBgImage() {
    try {
        const response = await fetch(Config.RandomPictureAPI || 'https://ai.ycxom.top:3002/api/v1/wallpaper/by-ratio/square', { timeout: 15000 });
        if (response.ok) {
            const imageBuffer = await response.arrayBuffer();
            const base64 = Buffer.from(imageBuffer).toString('base64');
            const mimeType = response.headers.get('content-type') || 'image/jpeg';
            return `data:${mimeType};base64,${base64}`;
        }
        if (global.logger) {
            logger.warn(`[background] 获取随机背景图API响应失败: ${response.status}`);
        } else {
            console.warn(`[background] 获取随机背景图API响应失败: ${response.status}`);
        }
        return '';
    } catch (error) {
        if (global.logger) {
            logger.warn('[background] 获取随机背景图片时发生网络错误:', error);
        } else {
            console.warn('[background] 获取随机背景图片时发生网络错误:', error);
        }
        return '';
    }
}