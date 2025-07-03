import lodash from 'lodash';
import { Data } from '../components/index.js';
import HelpTheme from './help/HelpTheme.js';
import runtimeRender from '../common/runtimeRender.js';
import fs from 'fs';
// 导入我们改造后的扫描函数
import { scanAndGenerateHelp } from '../scripts/scanApps.js';

export class help extends plugin {
  constructor() {
    super({
      name: '憨憨帮助',
      dsc: '查看憨憨帮助菜单',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^#?(nav|憨憨帮助)$',
          fnc: 'help',
          dsc: '#憨憨帮助'
        }
      ]
    });
  }

  async help(e) {
    // 1. 将检查和更新逻辑完全交给 scanAndGenerateHelp 脚本处理
    const status = await scanAndGenerateHelp();

    if (status === 'ERROR') {
      return e.reply('菜单生成过程出错，请联系管理员查看日志。');
    }

    if (status === 'UPDATED') {
      e.reply('检测到插件更新，已为您自动刷新菜单~');
    }

    const helpFilePath = './plugins/hanhan-plugin/data/help.json';

    // 如果文件依然不存在（例如apps目录为空），则提示
    if (!fs.existsSync(helpFilePath)) {
      return e.reply('帮助菜单为空，请检查/plugins/hanhan-plugin/apps/目录下是否存在插件。');
    }

    // 2. 无论状态如何（除非是ERROR），都读取并渲染最新的帮助文件
    let helpList = [];
    try {
      const helpData = fs.readFileSync(helpFilePath, 'utf8');
      helpList = JSON.parse(helpData);
    } catch (error) {
      logger.error('[hanhan-plugin] 读取或解析 help.json 失败', error);
      return e.reply('帮助信息渲染失败，请联系管理员检查日志。');
    }

    let custom = {};
    let { diyCfg, sysCfg } = await Data.importCfg('help');
    let helpConfig = lodash.defaults(diyCfg.helpCfg || {}, custom.helpCfg, sysCfg.helpCfg);
    let helpGroup = [];

    lodash.forEach(helpList, (group) => {
      if (group.auth && group.auth === 'master' && !e.isMaster) {
        return true;
      }
      lodash.forEach(group.list, (help) => {
        let icon = help.icon * 1;
        if (!icon) {
          help.css = 'display:none';
        } else {
          let x = (icon - 1) % 10;
          let y = (icon - x - 1) / 10;
          help.css = `background-position:-${x * 50}px -${y * 50}px`;
        }
      });
      helpGroup.push(group);
    });

    let themeData = await HelpTheme.getThemeData(diyCfg.helpCfg || {}, sysCfg.helpCfg || {});
    return await runtimeRender(e, 'help/index', {
      helpCfg: helpConfig,
      helpGroup,
      ...themeData,
      element: 'default'
    }, {
      scale: 1.6
    });
  }
}