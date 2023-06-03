import path from "path";

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
  }
}