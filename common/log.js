import { Config } from '../utils/config.js'

// ANSI 颜色代码，用于在终端中显示彩色文本
const colors = {
    reset: "\x1b[0m",
    magenta: "\x1b[35m",
};

// 日志前缀
const LOG_PREFIX = '[HANHAB_DEBUG]';

/**
 * 基础日志函数
 * @param {string} level 日志级别
 * @param {string} color ANSI 颜色代码
 * @param  {...any} args 日志内容
 */
function printLog(level, color, ...args) {
    const time = new Date().toLocaleTimeString('it-IT');
    return Config.debug ? console.log(`${color}[${time}][${level}]${colors.reset} ${LOG_PREFIX}`, ...args) : true;
}

// 只导出 debuglog 函数
export const debuglog = (...args) => printLog('DEBUG', colors.magenta, ...args);