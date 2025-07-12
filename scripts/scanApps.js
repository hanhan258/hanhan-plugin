import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import {
    fileURLToPath
} from 'url';
import crypto from 'crypto';
import { debuglog } from '../common/log.js';

const pluginRoot = './plugins/hanhan-plugin';
const appsDir = path.join(pluginRoot, 'apps');
const dataDir = path.join(pluginRoot, 'data');
const helpOutputFile = path.join(dataDir, 'help.json');
const md5OutputFile = path.join(dataDir, 'md5.json');

/**
 * [FINAL FULL-FEATURED VERSION] Parses a regular expression to generate a clean, complete, and informative command.
 * This version handles complex separators and content placeholders robustly.
 * @param {RegExp} reg The regular expression rule.
 * @returns {string} The parsed title string.
 */
function parseRuleToTitle(reg) {
    let title = reg.toString().replace(/^\/|\/[a-z]*$/g, '');

    // 1. A new, robust rule to replace various separators and content placeholders with '<内容>'.
    // This handles separators like \s*, [ =]?, etc., and content placeholders like (.*), ([\s\S]+), etc.
    title = title.replace(/(?:\\s\*|\[\s*=\s*\]\??)?\s*\((?:\.|\[\\s\\S\])[\*\+]\)\s*\$?$/, ' <内容>');

    // 2. Remove anchors (^, $).
    title = title.replace(/[\^$]/g, '');

    // 3. Simplify character classes, e.g., [pP] -> p.
    title = title.replace(/\[([a-zA-Z0-9])([^\]]*)\]/g, '$1');

    // 4. Handle alternations: format them as 'option1/option2' to show all possibilities.
    title = title.replace(/\|/g, '/');

    // 5. Clean up remaining unnecessary regex syntax.
    title = title.replace(/[?\\]/g, '');

    // 6. Final formatting: consolidate whitespace and ensure a single leading '#'.
    title = title.trim().replace(/\s+/g, ' ');
    if (!title.startsWith('#')) {
        title = '#' + title;
    }
    // Handle cases like '#?' where the '#' itself is optional.
    title = '#' + title.replace(/#/g, '');

    return title;
}


/**
 * Calculates the MD5 hash of a file.
 * @param {string} filePath The path to the file.
 * @returns {string} The MD5 hash.
 */
function calculateFileMd5(filePath) {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(buffer).digest('hex');
}

/**
 * The core function to scan apps and generate help files.
 * @returns {Promise<'UPDATED' | 'NO_CHANGE' | 'ERROR'>} The operation status.
 */
export async function scanAndGenerateHelp() {
    debuglog('[hanhan-plugin] 正在检查菜单更新...');

    // 1. MD5 check.
    if (fs.existsSync(helpOutputFile) && fs.existsSync(md5OutputFile)) {
        const oldMd5s = JSON.parse(fs.readFileSync(md5OutputFile, 'utf-8'));
        try {
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
                    debuglog('[hanhan-plugin] 插件无变化，跳过菜单生成。');
                    return 'NO_CHANGE';
                }
            }
        } catch (error) {
            debuglog('[hanhan-plugin] ⚠ 警告：读取apps目录失败，将强制更新菜单。');
        }
    }

    debuglog('[hanhan-plugin] 检测到插件变动，开始执行菜单扫描...');

    try {
        const jsFiles = fs.readdirSync(appsDir).filter(file => file.endsWith('.js'));
        const newMd5s = {};

        if (jsFiles.length === 0) {
            debuglog('[hanhan-plugin] ⚠ 警告：apps目录为空，生成空菜单。');
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
            fs.writeFileSync(helpOutputFile, JSON.stringify([], null, 2), 'utf-8');
            fs.writeFileSync(md5OutputFile, JSON.stringify({}, null, 2), 'utf-8');
            return 'UPDATED';
        }

        debuglog(`[hanhan-plugin] 发现 ${jsFiles.length} 个 .js 文件，正在处理...`);

        const helpList = [];
        for (const file of jsFiles) {
            const filePath = path.resolve(appsDir, file);
            newMd5s[file] = calculateFileMd5(filePath);

            let pluginModule;
            try {
                pluginModule = await import(`file://${filePath}?t=${Date.now()}`);
            } catch (error) {
                debuglog(`[hanhan-plugin] ✗ 导入模块失败: ${file}`, error);
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
                if (rule.dsc && rule.reg) {
                    const title = parseRuleToTitle(rule.reg);
                    if (title) group.list.push({ title: title, desc: rule.dsc });
                }
            });

            if (group.list.length > 0) helpList.push(group);
        }

        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

        fs.writeFileSync(helpOutputFile, JSON.stringify(helpList, null, 2), 'utf-8');
        fs.writeFileSync(md5OutputFile, JSON.stringify(newMd5s, null, 2), 'utf-8');

        debuglog(chalk.green.bold(`\n[hanhan-plugin] 🎉 菜单及MD5校验文件已成功更新！`));
        return 'UPDATED';

    } catch (error) {
        debuglog('[hanhan-plugin] 扫描过程中发生严重错误:', error);
        return 'ERROR';
    }
}

// Allow running the script directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    (async () => {
        const status = await scanAndGenerateHelp();
        if (status !== 'ERROR') {
            console.log(chalk.bgGreen.black('\n 手动操作完成 '));
        } else {
            console.log(chalk.bgRed.white('\n 手动操作失败，请检查上面的错误日志。 '));
            process.exit(1);
        }
    })();
}