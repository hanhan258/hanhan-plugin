/* eslint-disable camelcase */
/* eslint-disable no-undef */
import puppeteer from 'puppeteer'
import fs from 'fs'
import _ from 'lodash'

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
  await page.close()
  await browser.close()
  console.log('----图片下载完成----')
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

// Extracted from Coconut Yenai-Plugin
/**
   * 转发消息并根据权限撤回
   * @async
   * @param {Object} e - 反馈的对象
   * @param {string|Object} msg - 要发送的消息字符串或对象
   * @param {Object} [data={}] - 附加的数据对象
   * @param {number} [data.recallMsg] - 消息撤回时间
   * @param {Object} [data.info] - 附加消息信息
   * @param {string} [data.info.nickname] - 用户昵称
   * @param {number} [data.info.user_id] - 用户ID
   * @param {boolean} [data.isxml=true] - 是否特殊处理转发消息
   * @param {string} [data.xmlTitle] - XML 标题
   * @param {Object} [data.anony] - 附加的匿名数据对象
   * @returns {Promise<any>} - Promise 对象，返回函数 `getforwardMsg()` 的返回值
   */
export async function recallSendForwardMsg (e, msg, data = {}, dec) {
  return await getforwardMsg(e, msg, {
    info: {
      nickname: '小冰',
      user_id: 2854196306
    },
    isxml: true,
    xmlTitle: dec,
    ...data
  })
}

/**
   * 发送转发消息
   * @async
   * @param {object} e - 发送消息的目标对象
   * @param {array<any[]>} message - 发送的消息数组，数组每一项为转发消息的一条消息
   * @param {object} [options] - 发送消息的配置项
   * @param {number} [options.recallMsg=0] - 撤回时间，单位秒，默认为0表示不撤回
   * @param {object} [options.info] - 转发发送人信息
   * @param {string} [options.info.nickname] - 转发人昵称
   * @param {number} [options.info.user_id] - 转发人QQ
   * @param {string|array} [options.fkmsg] - 风控消息，不传则默认消息
   * @param {Boolean} [options.isxml] - 处理卡片
   * @param {Boolean} [options.xmlTitle] - XML 标题
   * @param {Boolean} [options.oneMsg] - 用于只有一条消息，不用再转成二维数组
   * @param {Boolean|import('icqq').Anonymous} [options.anony] - 匿名消息，若为true则发送匿名消息
   * @param {Boolean} [options.shouldSendMsg=true] - 是否直接发送消息，true为直接发送，否则返回需要发送的消息
   * @returns {Promise<import('icqq').MessageRet|import('icqq').XmlElem|import('icqq').JsonElem>} 消息发送结果的Promise对象
   */
export async function getforwardMsg (e, message, {
  info,
  fkmsg,
  isxml,
  xmlTitle,
  oneMsg,
  shouldSendMsg = false
} = {}) {
  let forwardMsg = []
  if (_.isEmpty(message)) throw Error('[hanhan-plugin][sendforwardMsg][Error]发送的转发消息不能为空')
  let add = (msg) => forwardMsg.push(
    {
      message: msg,
      nickname: info?.nickname ?? (e.bot ?? Bot).nickname,
      user_id: info?.user_id ?? (e.bot ?? Bot).uin
    }
  )
  oneMsg ? add(message) : message.forEach(item => add(item))
  // 发送
  if (e.isGroup) {
    forwardMsg = await e.group.makeForwardMsg(forwardMsg)
  } else {
    forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
  }

  if (isxml && typeof (forwardMsg.data) !== 'object') {
    // 处理转发卡片
    forwardMsg.data = forwardMsg.data.replace('<?xml version="1.0" encoding="utf-8"?>', '<?xml version="1.0" encoding="utf-8" ?>')
  }

  if (xmlTitle) {
    if (typeof (forwardMsg.data) === 'object') {
      let detail = forwardMsg.data?.meta?.detail
      if (detail) {
        detail.news = [{ text: xmlTitle }]
      }
    } else {
      forwardMsg.data = forwardMsg.data
        .replace(/\n/g, '')
        .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
        .replace(/___+/, `<title color="#777777" size="26">${xmlTitle}</title>`)
    }
  }
  return forwardMsg
}
