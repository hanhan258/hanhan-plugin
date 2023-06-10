import { Config } from './utils/config.js'
import path from 'path'

export function supportGuoba() {
  return {
    // 插件信息，将会显示在前端页面
    // 如果你的插件没有在插件库里，那么需要填上补充信息
    // 如果存在的话，那么填不填就无所谓了，填了就以你的信息为准
    pluginInfo: {
      name: 'hanhan-plugin',
      title: 'hanhan-Plugin',
      author: '@hanhan258 @ycxom',
      authorLink: 'https://github.com/hanhan258',
      link: 'https://github.com/hanhan258/hanhan-plugin',
      isV3: true,
      isV2: false,
      description: '基于hanhan娱乐',
      icon: "mdi:stove",
      iconColor: "#d19f56",
      iconPath: path.join(
        process.cwd() + "/plugins/hanhan-plugin/resources/readme/logo.jpg"
      ),
    },
    // 配置项信息
    configInfo: {
      // 配置项 schemas
      schemas: [
        {
          field: 'pingToken',
          label: 'ping',
          bottomHelpMessage: '填写后才能使用ping指令，请前往 https://ipinfo.io 注册账号并将获取到的token配置到这里，设置好之后请重启',
          component: 'Input'
        },
        {
          field: 'proxyUrl',
          label: '代理',
          bottomHelpMessage: '用于访问外网资源，例如：Google',
          component: 'Input'
        },
        {
          field: 'chromeF',
          label: '浏览器路径',
          bottomHelpMessage: '关闭无头模式时，用于真打开浏览器',
          component: 'Input'
        },
        {
          field: 'noie',
          label: '无头模式',
          bottomHelpMessage: '关闭无头模式会真打开浏览器进行截图',
          component: 'Switch'
        },
      ],
      // 获取配置数据方法（用于前端填充显示数据）
      getConfigData () {
        return Config
      },
      // 设置配置的方法（前端点确定后调用的方法）
      setConfigData (data, { Result }) {
        for (let [keyPath, value] of Object.entries(data)) {
          if (Config[keyPath] !== value) { Config[keyPath] = value }
        }
        return Result.ok({}, '保存成功~')
      }
    }
  }
}