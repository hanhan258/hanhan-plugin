import puppeteer from 'puppeteer'
import fs from 'fs'

export async function sleep (ms = 1000) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

export async function downloadImage (coverUrl) {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(coverUrl, { waitUntil: 'networkidle0' })
  const imageSrc = await page.$eval('img', img => img.src)
  const viewSource = await page.goto(imageSrc)
  const buffer = await viewSource.buffer()
  const folderPath = './plugins/hanhan-plugin/resources/tmdb_posters/' // 替换为你想要保存图片的文件夹路径
  const filePath = `${folderPath}/image_${Date.now()}.png` // 修改文件路径
  await fs.promises.writeFile(filePath, buffer)
  console.log('----图片下载完成----')
  await page.close()
  await browser.close()
  return filePath
}

export async function makeForwardMsg (e, msg = [], dec = '') {
  let nickname = Bot.nickname
  if (e.isGroup) {
    let info = await Bot.getGroupMemberInfo(e.group_id, Bot.uin)
    nickname = info.card || info.nickname
  }
  let userInfo = {
    user_id: Bot.uin,
    nickname
  }

  let forwardMsg = []
  msg.forEach(v => {
    forwardMsg.push({
      ...userInfo,
      message: v
    })
  })

  /** 制作转发内容 */
  if (e.isGroup) {
    forwardMsg = await e.group.makeForwardMsg(forwardMsg)
  } else if (e.friend) {
    forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
  } else {
    return false
  }

  if (dec) {
    /** 处理描述 */
    forwardMsg.data = forwardMsg.data
      .replace(/\n/g, '')
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
      .replace(/___+/, `<title color="#777777" size="26">${dec}</title>`)
  }

  return forwardMsg
}
