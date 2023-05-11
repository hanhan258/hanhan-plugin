import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import fs from 'fs'
import https from 'https'
import path from 'node:path'
if (!global.segment) {
    global.segment = (await import('oicq')).segment
}

/**
 * 可有可无的，没啥意义的功能，像极了人生。
 * 视频下载在resources/videoRealUrl，一般来说会自动删除，除非主线程被关闭，比如关机、重启、宕机等。
 */

/**
 * 抖音视频解析接口。直接用接口吧，懒得研究那啥签名了。不知道抖音有没有小程序，没见有人发过，也懒得下载抖音了。
 * 解析服务的项目地址：https://github.com/Evil0ctal/Douyin_TikTok_Download_API
 */
const baseUrl = 'https://douyin.vme50.vip'

export class example extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '视频解析',
            /** 功能描述 */
            dsc: '简单开发示例',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message'
        })
    }

    /**
     * 视频解析
     * @param e icqq传递的事件参数e
     */
    async accept(e) {
        //检查消息类型,text为文本消息类型，json为小程序或者卡片消息类型。如果是图片等其他消息，则不处理。
        //console.log('debugTop', e.message)
        let msg
        e.message.forEach(element => {
            if (element.type == 'text') {
                msg = element.text
            } else if (element.type == 'json') {
                try {
                    let jsonObject = JSON.parse(element.data)
                    msg = jsonObject.meta.detail_1 ? jsonObject.meta.detail_1.qqdocurl : jsonObject.meta.data.feedInfo.jumpUrl
                } catch (err) {
                    console.log(err, '似乎解析不到需要的json对象的属性。注意json的属性名是否正确哦')
                    return false
                }
            } else {
                return false
            }
        })
        //console.log('debugMidddle', msg)
        let matchUrl = msg?.match(/(https?:\/\/[^\s]+)/)
        if (matchUrl) {
            matchUrl = matchUrl[0]
        } else {
            return false
        }
        let filePath
        const bilibilUrls = ['b23.tv', 'www.bilibili.com', 'm.bilibili.com']
        const littleWorldUrls = ['xsj.qq.com']
        const douyinUrls = ['www.douyin.com', 'v.douyin.com', 'www.tiktok.com']
        if (bilibilUrls.some(url => matchUrl.includes(url))) {
            filePath = await bilibili(e, matchUrl)
        } else if (littleWorldUrls.some(url => matchUrl.includes(url))) {
            filePath = await littleWorld(e, matchUrl)
        } else if (douyinUrls.some(url => matchUrl.includes(url))) {
            filePath = await douyin(e, matchUrl)
        } else {
            return false
        }
        // //发送视频
        // await sendVideo(e, filePath)
        // return true

        // 停1秒再发送
        setTimeout(async () => {
            await e.reply(segment.video(filePath))
            // 停10秒再删除
            setTimeout(async () => {
                delFile(filePath)
                return true
            }, 10000)
        }, 1000)
    }
}
/**
 * 哔哩哔哩视频处理
 * @param e icqq传递的事件参数e
 * @param matchUrl 从消息中匹配到的Url
 * @returns 布尔值或者文件下载路径
 */
async function bilibili(e, matchUrl) {
    const bvid = matchUrl.match(/BV\w{10}/)
    //兼容小程序
    let againRes
    if (!bvid) {
        againRes = (await fetch(matchUrl)).url
        againRes = againRes.match(/BV\w{10}/)
    }
    const resUrl = 'https://api.bilibili.com/x/web-interface/view?bvid=' + (bvid ? bvid : againRes)
    let res = await bilibiliRes(resUrl)
    if (!res) {
        return false
    }
    const { pic, title, desc, owner, tname } = res.response.data
    const { like, coin, favorite, share, view, danmaku, reply } = res.response.data.stat
    const titleStr = `标题：${title}\n`
    const descStr = `简介：${desc == '-' ? '空' : desc || '空'}\n`
    const authorStr = `作者：${owner.name}${' '.repeat(25 - owner.name.toString().length)}上传时间：${res.formattedDate}\n`
    const likeStr = `点赞：${like}${' '.repeat(32 - like.toString().length)}投币：${coin}\n`
    const favoriteStr = `收藏：${favorite}${' '.repeat(32 - favorite.toString().length)}分享：${share}\n`
    const viewStr = `播放量：${view}${' '.repeat(29 - view.toString().length)}弹幕：${danmaku}\n`
    const replyStr = `评论数量：${reply}${' '.repeat(25 - reply.toString().length)}频道：${tname}`
    e.reply([
        segment.image(pic),
        '\n',
        '哔哩哔哩视频\n',
        titleStr,
        descStr,
        authorStr,
        likeStr,
        favoriteStr,
        viewStr,
        replyStr
    ])
    // e.reply([
    //     segment.image(pic),
    //     '哔哩哔哩视频' + '\n',
    //     '标题：' + title + '\n',
    //     '简介' + desc + '\n',
    //     '作者：' + owner, '上传时间：' + res.formattedDate + '\n\n',
    //     '点赞：' + like, '投币：' + coin + '\n',
    //     '收藏：' + favorite, '分享：' + share + '\n',
    //     '播放量' + view, '弹幕：' + danmaku + '\n',
    //     '评论数量：' + reply
    // ])
    const dirPath = 'resources/videoRealUrl/bilibili'
    const referer = 'https://www.bilibili.com/'
    let filePath = await download(res.realUrl, bvid, dirPath, referer)
    if (!filePath) {
        return false
    }
    return filePath
}

/**
 * 哔哩哔哩视频解析
 * @param resUrl 拼接后得到的哔哩哔哩API
 * @returns 布尔值或者对象字面量
 */
async function bilibiliRes(resUrl) {
    console.log('[哔哩哔哩视频处理]', resUrl)
    let response
    try {
        response = await fetch(resUrl)
    } catch (err) {
        console.log(err)
        return false
    }
    response = await response.json()
    //转换时间戳
    const pubdate = response.data.pubdate
    const dateObj = new Date(pubdate * 1000); // 将时间戳转换为日期对象
    const year = dateObj.getFullYear(); // 获取年份
    const month = dateObj.getMonth() + 1; // 获取月份（需要加1，因为月份从0开始计数）
    const day = dateObj.getDate(); // 获取日期
    const hours = dateObj.getHours(); // 获取小时
    const minutes = dateObj.getMinutes(); // 获取分钟
    const seconds = dateObj.getSeconds(); // 获取秒数
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` // 将时间转换为字符串格式
    //get API
    const aid = response.data.aid
    const cid = response.data.cid
    const newUrl = `https://api.bilibili.com/x/player/playurl?avid=${aid}&cid=${cid}&qn=16&type=mp4&platform=html5`
    let res
    try {
        res = await fetch(newUrl)
    } catch (err) {
        return false
    }
    res = await res.json()
    const realUrl = res.data.durl[0].url
    return {
        response,
        realUrl,
        formattedDate
    }
}

/**
 * 微视视频处理
 * @param {Event} e icqq传递的事件参数e
 * @param {string} matchUrl 从消息中匹配到的Url
 * @returns 布尔值或者文件的下载路径
 */
async function littleWorld(e, matchUrl) {
    let initialState = await littleWorldRes(matchUrl)
    if (initialState) {
        e.reply([
            segment.image(initialState.feeds[0].cover.picUrl),
            '\n',
            '微视视频' + '\n',
            '标题：' + initialState.feeds[0].content.match(/^[^#\n]+/) + '\n',
            '作者：' + initialState.feeds[0].poster.nick
        ])
    } else {
        return false
    }
    const realUrl = initialState.feeds[0].video.playUrl
    const videoID = initialState.feeds[0].id
    const dirPath = 'resources/videoRealUrl/littleWorld'
    const referer = 'https://xsj.qq.com/'
    let filePath = await download(realUrl, videoID, dirPath, referer)
    if (!filePath) {
        return false
    }
    return filePath
}

/**
 * 微视视频解析
 * @param {string} resUrl 请求的视频网站Url
 * @returns 请求得到的json数据
 */
async function littleWorldRes(resUrl) {
    console.log('[微视视频解析]', resUrl)
    let response
    try {
        response = await fetch(resUrl)
    } catch (err) {
        console.log(err, '[视频解析]请求微视视频HTML资源失败')
        return false
    }
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${resUrl}. Status: ${response.status}`)
    }
    let textData = await response.text()
    const regex = /<script>window\.__INITIAL_STATE__=(.+?)<\/script>/s
    const match = regex.exec(textData)
    if (!match) {
        throw new Error('Failed to find the initial state data in the response')
    }
    let initialState = JSON.parse(match[1])
    return initialState
}

/**
 * 抖音视频处理
 * @param e icqq传递的事件参数e
 * @param {string} matchUrl 从消息中匹配到的Url
 * @returns 布尔值或者文件的下载路径
 */
async function douyin(e, matchUrl) {
    let resUrl = baseUrl + '/api?url=' + matchUrl + '&minimal=false'
    let data = await douyinRes(resUrl)
    if (data) {
        e.reply([
            segment.image(data.image),
            '\n',
            '抖音视频' + '\n',
            '标题：' + data.desc.match(/^[^#\n]+/) + '\n',
            '作者：' + data.nickname
        ])
    } else {
        //console.log('抖音解析出错，啥原因咱也不知道，可能是接口寄了吧~', err)
        return false
    }
    const dirPath = 'resources/videoRealUrl/douyin'
    const realUrl = data.nwm_video_url_HQ
    const videoID = data.videoID
    const referer = 'https://www.douyin.com/'
    let filePath = await download(realUrl, videoID, dirPath, referer)
    if (!filePath) {
        //console.log('[视频解析]抖音视频下载出错：', filePath)
        return false
    }
    return filePath
}

/**
 * 抖音视频解析
 * @param resUrl 发出请求的url
 */
async function douyinRes(resUrl) {
    console.log('[抖音视频解析]', resUrl)
    try {
        let response = await fetch(resUrl)
        if (response.status == 200) {
            response = await response.json()
            let nwm_video_url_HQ = response.video_data.nwm_video_url_HQ //高清无水印视频链接
            let desc = response.desc    //视频描述
            let nickname = response.author.nickname //创作者昵称
            let image = response.cover_data.cover.url_list[0]    //封面
            let videoID = response.aweme_id   //视频ID
            console.log('抖音解析直链', nwm_video_url_HQ)
            return {
                nwm_video_url_HQ,
                desc,
                nickname,
                image,
                videoID
            }
        } else {
            console.log('[抖音解析]解析失败，错误代码：', response.status)
            return false
        }
    } catch (err) {
        console.error(err)
        return false
    }
}

/**
 * 下载视频
 * @param realUrl 视频下载直链
 * @param videoID 视频的文件名，只在存储路径用到，可常量可变量
 * @param dirPath 文件夹路径
 * @param referer 请求头
 * @returns 布尔值或者文件的下载路径
 */
let redirectCount = 0
async function download(realUrl, videoID, dirPath, referer) {
    console.log('[视频解析]下载视频', realUrl)
    mkdirs(dirPath)
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            'referer': referer
        }
    }
    return new Promise((resolve, reject) => {
        https
            .get(realUrl, options, (res) => {
                if (res.statusCode == 302) {
                    if (redirectCount >= 5) {
                        console.error('重定向次数过多，下载失败');
                        reject(new Error('重定向次数过多，下载失败'));
                        return false;
                    }
                    redirectCount++;
                    const redirectUrl = res.headers.location;
                    resolve(download(redirectUrl, videoID, dirPath, referer));
                } else if (res.statusCode == 200) {
                    const fileType = res.headers['content-type'].split('/')[1]; //文件类型
                    if (fileType == 'json') {
                        console.log('解析到一个json文件。这种情况测试的时候出现过1次。');
                        reject(new Error('解析到一个json文件'));
                        return false;
                    }
                    const filePath = path.join(dirPath, `${videoID}.${fileType}`);
                    // 创建可写流并写入文件
                    const fileStream = fs.createWriteStream(filePath);
                    res.pipe(fileStream);
                    fileStream
                        .on('finish', () => {
                            console.log('文件下载完成');
                            resolve(filePath);
                        })
                        .on('error', (err) => {
                            console.error(`下载发生错误：${err.message}`);
                            reject(err);
                        });
                } else {
                    console.log('[下载]下载失败，错误代码：', res.statusCode);
                    reject(new Error(`下载失败，错误代码：${res.statusCode}`));
                }
            })
            .on('error', (err) => {
                console.error(`下载发生错误：${err.message}`);
                reject(err);
            });
    });

    // let videoResponse = await fetch(realUrl, {
    //     headers: {
    //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
    //         referer: 'https://www.douyin.com/',
    //         bodySize: 104857600,
    //         timeout: 180000
    //     }
    // })
    // const fileType = videoResponse.headers.get('Content-Type').split('/')[1] //文件类型
    // const fileLength = videoResponse.headers.get('Content-Length') //文件大小
    // if (fileLength > 104857600) {
    //     console.log('[视频解析]文件大小超过100M，拒绝下载。防止出现死锁等问题。')
    //     return false
    // }
    // const resultBlob = await videoResponse.blob()
    // const resultArrayBuffer = await resultBlob.arrayBuffer()
    // const resultBuffer = Buffer.from(resultArrayBuffer)
    // fs.writeFileSync(path.join(dirPath, videoID + '.' + fileType), resultBuffer)
    // return fileType
}

/**
 * 创建文件夹
 * @param dirPath 创建文件夹 
 * @returns 布尔值
 */
function mkdirs(dirPath) {
    if (fs.existsSync(dirPath)) {
        return true
    } else {
        if (mkdirs(path.dirname(dirPath))) {
            fs.mkdirSync(dirPath)
            return true
        }
    }
}

/**
 * 删除文件
 * @param filePath 文件路径
 * @returns 布尔值
 */
function delFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        return true
    } else {
        return true
    }
}

// /**
//  * 发送视频
//  * @param e icqq传递的事件参数e
//  * @param filePath 文件的下载路径
//  * @returns 布尔值
//  */
// async function sendVideo(e, filePath) {
//     await e.reply(segment.video(filePath))
//     await delay(30000)
//     delFile(filePath)
//     return true
// }

// /**
//  * 延迟函数
//  * @param ms 毫秒
//  * @returns 布尔值
//  */
// function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms))
// }