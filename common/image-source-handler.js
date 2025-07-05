import { debuglog } from './log.js';

/**
 * 从消息事件对象(e)中提取图片URL
 * 逻辑优先级：
 * 1. 当前消息中直接包含的图片 (e.img)
 * 2. 回复的消息中包含的图片 (e.source)
 * 3. @某人时，获取其头像 (e.at)
 * @param {object} e 消息事件对象
 * @returns {string|null} - 返回找到的第一个图片URL，未找到则返回null
 */
export async function getSourceImage(e) {
    if (e.img && e.img.length > 0) {
        debuglog('从 e.img 中获取到图片');
        return e.img[0];
    }

    if (e.source) {
        debuglog('尝试从回复消息中获取图片...');
        let reply;
        const seq = e.isGroup ? e.source.seq : e.source.time;
        try {
            if (e.isGroup) {
                const chatHistory = await e.group.getChatHistory(seq, 1);
                reply = chatHistory.pop()?.message;
            } else {
                const chatHistory = await e.friend.getChatHistory(seq, 1);
                reply = chatHistory.pop()?.message;
            }
        } catch (error) {
            debuglog('获取历史消息失败:', error);
        }

        if (reply) {
            for (const val of reply) {
                if (val.type === 'image') {
                    debuglog('从回复消息中获取到图片');
                    return val.url;
                }
            }
        }
    }

    if (e.at) {
        debuglog('从 @ 对象中获取头像作为图片');
        return `https://q1.qlogo.cn/g?b=qq&s=0&nk=${e.at}`;
    }

    debuglog('在消息中未找到任何可用图片');
    return null;
}