import lodash from 'lodash';
import fs from 'fs';
import { Data } from '../components/index.js';
import HelpTheme from './help/HelpTheme.js';
import runtimeRender from '../common/runtimeRender.js';
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
          dsc: '帮助菜单'
        }
      ]
    });
  }

  async help(e) {
    const status = await scanAndGenerateHelp();

    if (status === 'ERROR') {
      return e.reply('菜单生成过程出错，请联系管理员查看日志。');
    }

    if (status === 'UPDATED') {
      logger.info('检测到插件更新，已为您自动刷新菜单~');
    }

    const helpFilePath = './plugins/hanhan-plugin/data/help.json';

    if (!fs.existsSync(helpFilePath)) {
      return e.reply('帮助菜单为空，请检查/plugins/hanhan-plugin/apps/目录下是否存在插件。');
    }

    let helpList = [];
    try {
      const helpData = fs.readFileSync(helpFilePath, 'utf8');
      helpList = JSON.parse(helpData);
    } catch (error) {
      logger.error('[hanhan-plugin] 读取或解析 help.json 失败', error);
      return e.reply('帮助信息渲染失败，请联系管理员检查日志。');
    }

    let { diyCfg, sysCfg } = await Data.importCfg('help');
    let helpConfig = lodash.defaults(diyCfg.helpCfg || {}, sysCfg.helpCfg);
    let helpGroup = [];

    lodash.forEach(helpList, (group) => {
      if (group.auth && group.auth === 'master' && !e.isMaster) {
        return true;
      }

      const commandCount = group.list.length;
      if (commandCount <= 2) {
        group.sizeClass = 'small';
      } else if (commandCount <= 4) {
        group.sizeClass = 'medium';
      } else {
        group.sizeClass = 'wide';
      }

      helpGroup.push(group);
    });

    let themeData = await HelpTheme.getThemeData(diyCfg.helpCfg || {}, sysCfg.helpCfg || {});

    return await runtimeRender(e, 'help/help-v2', {
      helpCfg: helpConfig,
      helpGroup,
      theme: themeData,
      element: 'default'
    }, {
      scale: 1.2
    });
  }
}
