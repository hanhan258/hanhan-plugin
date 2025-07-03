import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const log = {
    info: (msg) => (global.logger ? global.logger.info(msg) : console.log(msg)),
    warn: (msg) => (global.logger ? global.logger.warn(msg) : console.warn(msg)),
    error: (msg) => (global.logger ? global.logger.error(msg) : console.error(msg)),
};

const pluginRoot = './plugins/hanhan-plugin';
const appsDir = path.join(pluginRoot, 'apps');
const dataDir = path.join(pluginRoot, 'data');
const helpOutputFile = path.join(dataDir, 'help.json');
const md5OutputFile = path.join(dataDir, 'md5.json');

/**
 * 解析正则表达式规则，生成对应的标题
 * @param {RegExp} reg 正则表达式规则
 * @returns {string} 解析后的标题字符串
 */
function parseRuleToTitle(reg) {
    let rawStr = reg.toString().replace(/^\/|\/\w*$/g, '');
    const tempPlaceholder = '@@PIPE@@';
    let tempStr = rawStr.replace(/\((.*?)\)/g, (match, group1) => `(${group1.replace(/\|/g, tempPlaceholder)})`);
    const patterns = tempStr.split('|').map(p => p.replace(new RegExp(tempPlaceholder, 'g'), '|'));
    const allCommands = new Set();

    for (const pattern of patterns) {
        let current = pattern;
        const aliasMatch = current.match(/^(.*?)(\([^|)]+\|[^)]+\))(.*)$/);
        let expanded = [];
        if (aliasMatch) {
            const prefix = aliasMatch[1];
            const aliases = aliasMatch[2].replace(/[()]/g, '').split('|');
            const suffix = aliasMatch[3];
            expanded = aliases.map(alias => `${prefix}${alias}${suffix}`);
        } else {
            expanded = [current];
        }

        for (let command of expanded) {
            command = command.replace(/(\(\?:|\?#|\\)/g, '');
            command = command.replace(/(\.\*|\.\+)\??|\[\\s\\S\]\*|\\s\*|[\^\$\*\.\[\]\{\}\(\)]/g, '');
            command = command.replace(/[?]/g, '');
            command = command.trim();
            if (command.startsWith('#')) command = command.substring(1);
            if (command) allCommands.add(`#${command}`);
        }
    }
    return Array.from(allCommands).join(' | ');
}

/**
 * 计算文件的MD5哈希值
 * @param {string} filePath 文件路径
 * @returns {string} MD5哈希值
 */
function calculateFileMd5(filePath) {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(buffer).digest('hex');
}

/**
 * 核心扫描与生成函数
 * @returns {Promise<'UPDATED' | 'NO_CHANGE' | 'ERROR'>} 操作状态
 */
export async function scanAndGenerateHelp() {
    log.info(chalk.cyanBright.bold('[hanhan-plugin] 正在检查菜单更新...'));

    // 1. MD5校验，判断是否需要更新
    if (fs.existsSync(helpOutputFile) && fs.existsSync(md5OutputFile)) {
        const oldMd5s = JSON.parse(fs.readFileSync(md5OutputFile, 'utf-8'));
        const currentFiles = fs.readdirSync(appsDir).filter(f => f.endsWith('.js'));
        const oldFiles = Object.keys(oldMd5s);

        if (currentFiles.length === oldFiles.length) {
            let hasChanged = false;
            for (const file of currentFiles) {
                const filePath = path.join(appsDir, file);
                if (!oldMd5s[file] || calculateFileMd5(filePath) !== oldMd5s[file]) {
                    hasChanged = true;
                    break;
                }
            }
            if (!hasChanged) {
                log.info('[hanhan-plugin] 插件无变化，跳过菜单生成。');
                return 'NO_CHANGE';
            }
        }
    }

    log.info(chalk.cyanBright.bold('[hanhan-plugin] 检测到插件变动，开始执行菜单扫描...'));

    try {
        const jsFiles = fs.readdirSync(appsDir).filter(file => file.endsWith('.js'));
        const newMd5s = {};

        if (jsFiles.length === 0) {
            log.warn(chalk.yellow('[hanhan-plugin] ⚠ 警告：apps目录为空，生成空菜单。'));
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
            fs.writeFileSync(helpOutputFile, JSON.stringify([], null, 2), 'utf-8');
            fs.writeFileSync(md5OutputFile, JSON.stringify({}, null, 2), 'utf-8');
            return 'UPDATED';
        }

        log.info(`[hanhan-plugin] 发现 ${jsFiles.length} 个 .js 文件，正在处理...`);

        const helpList = [];
        for (const file of jsFiles) {
            const filePath = path.resolve(appsDir, file);
            newMd5s[file] = calculateFileMd5(filePath);

            let pluginModule;
            try {
                pluginModule = await import(`file://${filePath}?t=${Date.now()}`);
            } catch (error) {
                log.error(chalk.red(`[hanhan-plugin] ✗ 导入模块失败: ${file}`), error);
                continue;
            }
            const pluginKey = Object.keys(pluginModule).find(k => k !== 'default');
            const pluginClass = pluginModule.default || pluginModule[pluginKey];
            const fileName = file.replace('.js', '');
            if (typeof pluginClass !== 'function' || !pluginClass.prototype) continue;
            const pluginInstance = new pluginClass();
            const rules = pluginInstance.rule;
            const groupName = pluginInstance.name || fileName;
            if (!rules || !Array.isArray(rules) || rules.length === 0) continue;
            const group = { group: groupName, list: [] };
            rules.forEach(rule => {
                if (rule.dsc) {
                    const title = parseRuleToTitle(rule.reg);
                    if (title) group.list.push({ title: title, desc: rule.dsc });
                }
            });
            if (group.list.length > 0) helpList.push(group);
        }

        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

        fs.writeFileSync(helpOutputFile, JSON.stringify(helpList, null, 2), 'utf-8');
        fs.writeFileSync(md5OutputFile, JSON.stringify(newMd5s, null, 2), 'utf-8');

        log.info(chalk.green.bold(`\n[hanhan-plugin] 🎉 菜单及MD5校验文件已成功更新！`));
        return 'UPDATED';

    } catch (error) {
        log.error(chalk.red.bold('[hanhan-plugin] 扫描过程中发生严重错误:'), error);
        return 'ERROR';
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    (async () => {
        const success = await scanAndGenerateHelp();
        if (success !== 'ERROR') {
            console.log(chalk.bgGreen.black('\n 手动操作完成 '));
        } else {
            console.log(chalk.bgRed.white('\n 手动操作失败，请检查上面的错误日志。 '));
            process.exit(1);
        }
    })();
}