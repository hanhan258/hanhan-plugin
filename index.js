import fs from 'node:fs'
import chalk from 'chalk'
import { Config } from './utils/config.js'

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

logger.info(`${chalk.redBright.bold('********************[')}${chalk.cyan.bold('hanhan')}${chalk.redBright.bold(']********************')}`)
logger.info(`${chalk.blue.bold('han')}${chalk.redBright.bold('han')}${chalk.gray.bold('-')}${chalk.cyan.bold('plugin')}${chalk.whiteBright.bold('加载')}${chalk.greenBright.bold('成功')}`)
logger.info(chalk.green.bold('            ▃▆█▇▄▖'))
logger.info(chalk.green.bold('　 　 　 ▟◤▖      ◥█▎'))
logger.info(chalk.green.bold('   　 ◢◤　 ▐　　　  ▐▉'))
logger.info(chalk.green.bold('　 ▗◤　　　▂　▗▖　　▕█▎'))
logger.info(chalk.green.bold('　◤　▗▅▖◥▄　▀◣　　█▊'))
logger.info(chalk.green.bold('▐　▕▎◥▖◣◤　　　　◢██'))
logger.info(chalk.green.bold('█◣　◥▅█▀　　　　▐██◤'))
logger.info(chalk.green.bold('▐█▙▂　　     　◢██◤'))
logger.info(chalk.green.bold('◥██◣　　　　◢▄◤'))
logger.info(chalk.green.bold(' 　　▀██▅▇▀'))
logger.info(chalk.green.bold(`当前版本 v${Config.version}`))
logger.info(chalk.green.bold('插件群：461601720'))
logger.info(`${chalk.cyan.italic('仓库地址')} ${chalk.yellowBright.underline('https://github.com/hanhan258/hanhan-plugin')}`)
logger.info(`${chalk.redBright.bold('********************[')}${chalk.cyan.bold('///^///')}${chalk.redBright.bold(']********************')}`)
export { apps }
