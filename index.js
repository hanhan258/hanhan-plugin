import fs from 'node:fs'
import chalk from 'chalk'

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


logger.info('§f§4********************[§ah§ba§dn§eh§fa§5n§f§4]********************')
logger.info('§nh§ba§dn§eh§fa§5n§8-§7p§8l§4u§ag§5i§fsn加§k载§a成§c功')
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
logger.info('§f§b仓库地址 §e§nhttps://github.com/hanhan258/hanhan-plugin')
logger.info('§f§4********************[§b///^///§f§4]********************')
export { apps }
