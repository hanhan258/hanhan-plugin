import fs from 'node:fs'


if (!global.segment) {
  global.segment = (await import('oicq')).segment
}

const files = fs.readdirSync('./plugins/hanhan-plugin/apps').filter(file => file.endsWith('.js'))

let ret = []

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')

  if (ret[i].status !== 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}


logger.info('**************************************')
logger.info('hanhan-plugin加载成功')
logger.info('仓库地址 https://github.com/hanhan258/hanhan-plugin')
logger.info('**************************************')
export { apps }
