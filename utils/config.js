import fs from 'fs'
import lodash from 'lodash'
import chokidar from 'chokidar'
const defaultConfig = {
  pingToken: '',
  proxyUrl: '',
  chromeF: '',
  noie: true,
  tmdbkey: '',
  sysecho: '搜索中...',
  sysecho0: '30000ms erorr',
  sysgqjt: 1,
  gdkey: '',
  tmdb_r18: false,
  studyGroups: '',
  buttonWhiteGroups: '',
  enableButton: false,
  enableVideo: true,
  version: '1.6.1'
}
const _path = process.cwd()
let config = {}
if (fs.existsSync(`${_path}/plugins/hanhan-plugin/config/config.json`)) {
  const fullPath = fs.realpathSync(`${_path}/plugins/hanhan-plugin/config/config.json`)
  const data = fs.readFileSync(fullPath)
  if (data) {
    try {
      config = JSON.parse(data)
    } catch (e) {
      logger.error('hanhan-plugin读取配置文件出错，请检查config/config.json格式，将忽略用户配置转为使用默认配置', e)
      logger.warn('hanhan-plugin即将使用默认配置')
    }
  }
} else if (fs.existsSync(`${_path}/plugins/hanhan-plugin/config/config.js`)) {
  // 旧版本的config.js，读取其内容，生成config.json，然后删掉config.js
  const fullPath = fs.realpathSync(`${_path}/plugins/hanhan-plugin/config/config.js`)
  config = (await import(`file://${fullPath}`)).default
  try {
    logger.warn('[hanhan-Plugin]发现旧版本config.js文件，正在读取其内容并转换为新版本config.json文件')
    // 读取其内容，生成config.json
    fs.writeFileSync(`${_path}/plugins/hanhan-plugin/config/config.json`, JSON.stringify(config, null, 2))
    // 删掉config.js
    fs.unlinkSync(`${_path}/plugins/hanhan-plugin/config/config.js`)
    logger.info('[hanhan-Plugin]配置文件转换处理完成')
  } catch (err) {
    logger.error('[hanhan-Plugin]转换旧版配置文件失败，建议手动清理旧版config.js文件，并转为使用新版config.json格式', err)
  }
} else if (fs.existsSync(`${_path}/plugins/hanhan-plugin/config/index.js`)) {
  // 兼容旧版本
  const fullPath = fs.realpathSync(`${_path}/plugins/hanhan-plugin/config/index.js`)
  config = (await import(`file://${fullPath}`)).Config
  try {
    logger.warn('[hanhan-Plugin]发现旧版本config.js文件，正在读取其内容并转换为新版本config.json文件')
    // 读取其内容，生成config.json
    fs.writeFileSync(`${_path}/plugins/hanhan-plugin/config/config.json`, JSON.stringify(config, null, 2))
    // index.js
    fs.unlinkSync(`${_path}/plugins/hanhan-plugin/config/index.js`)
    logger.info('[hanhan-Plugin]配置文件转换处理完成')
  } catch (err) {
    logger.error('[hanhan-Plugin]转换旧版配置文件失败，建议手动清理旧版index.js文件，并转为使用新版config.json格式', err)
  }
}
config = Object.assign({}, defaultConfig, config)
config.version = defaultConfig.version
// const latestTag = execSync(`cd ${_path}/plugins/chatgpt-plugin && git describe --tags --abbrev=0`).toString().trim()
// config.version = latestTag

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 初始化currentConfig引用
let currentConfig = config

// 创建一个Chokidar实例来监视config.json
const configWatcher = chokidar.watch(`${_path}/plugins/hanhan-plugin/config/config.json`, {
  persistent: true,
  ignoreInitial: true
})

configWatcher.on('change', async (filePath) => {
  try {
    await sleep(1500)
    const data = fs.readFileSync(filePath, 'utf8')
    const updatedConfig = JSON.parse(data)
    currentConfig = Object.assign({}, defaultConfig, updatedConfig)

    Config = new Proxy(currentConfig, {
      set (target, property, value) {
        target[property] = value
        const change = lodash.transform(target, function (result, value, key) {
          if (!lodash.isEqual(value, defaultConfig[key])) {
            result[key] = value
          }
        })
        try {
          fs.writeFileSync(`${_path}/plugins/hanhan-plugin/config/config.json`, JSON.stringify(change, null, 2), { flag: 'w' })
        } catch (err) {
          logger.error(err)
          return false
        }
        return true
      }
    })

    logger.info('[hanhan-Plugin]检测到config.json变更，并成功重新加载配置')
  } catch (err) {
    logger.error('[hanhan-Plugin]重新加载config.json时出错：', err)
  }
})

export let Config = new Proxy(currentConfig, {
  set (target, property, value) {
    target[property] = value
    const change = lodash.transform(target, function (result, value, key) {
      if (!lodash.isEqual(value, defaultConfig[key])) {
        result[key] = value
      }
    })
    try {
      fs.writeFileSync(`${_path}/plugins/hanhan-plugin/config/config.json`, JSON.stringify(change, null, 2), { flag: 'w' })
    } catch (err) {
      logger.error(err)
      return false
    }
    return true
  }
})
