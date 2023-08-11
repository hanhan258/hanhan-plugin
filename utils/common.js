/* eslint-disable camelcase */
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
    try {
      let info = await Bot.getGroupMemberInfo(e.group_id, Bot.uin)
      nickname = info.card || info.nickname
    } catch (err) {
      console.error(`Failed to get group member info: ${err}`)
    }
  }
  let userInfo = {
    user_id: Bot.uin,
    nickname
  }

  let forwardMsg = []
  msg.forEach((v) => {
    forwardMsg.push({
      ...userInfo,
      message: v
    })
  })
  let is_sign = true
  /** 制作转发内容 */
  if (e.isGroup) {
    forwardMsg = await e.group.makeForwardMsg(forwardMsg)
  } else if (e.friend) {
    forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
  } else {
    return false
  }
  let forwardMsg_json = forwardMsg.data
  if (typeof (forwardMsg_json) === 'object') {
    if (forwardMsg_json.app === 'com.tencent.multimsg' && forwardMsg_json.meta?.detail) {
      let detail = forwardMsg_json.meta.detail
      let resid = detail.resid
      let fileName = detail.uniseq
      let preview = ''
      for (let val of detail.news) {
        preview += `<title color="#777777" size="26">${val.text}</title>`
      }
      forwardMsg.data = `<?xml version="1.0" encoding="utf-8"?><msg brief="[聊天记录]" m_fileName="${fileName}" action="viewMultiMsg" tSum="1" flag="3" m_resid="${resid}" serviceID="35" m_fileSize="0"><item layout="1"><title color="#000000" size="34">转发的聊天记录</title>${preview}<hr></hr><summary color="#808080" size="26">${detail.summary}</summary></item><source name="聊天记录"></source></msg>`
      forwardMsg.type = 'xml'
      forwardMsg.id = 35
    }
  }
  forwardMsg.data = forwardMsg.data
    .replace(/\n/g, '')
    .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
    .replace(/___+/, `<title color="#777777" size="26">${dec}</title>`)
  if (!is_sign) {
    forwardMsg.data = forwardMsg.data
      .replace('转发的', '不可转发的')
  }
  return forwardMsg
}
