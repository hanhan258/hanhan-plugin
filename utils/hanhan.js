import ffi from '@makeomatic/ffi-napi'
import os from 'os'
import fetch from 'node-fetch'

let hanhanSign
const _path = process.cwd()
const libPath = `${_path}/plugins/hanhan-plugin/resources/lib/`
console.log(os.arch(), os.platform())
if (os.platform() === 'win32' && os.arch() === 'x64') {
  hanhanSign = ffi.Library(libPath + 'hankit.dll', {
    get_sign: ['string', ['string', 'string']]
  })
} else if (os.platform() === 'win32' && os.arch() === 'arm') {
  hanhanSign = ffi.Library(libPath + 'hankitarm64.dll', {
    get_sign: ['string', ['string', 'string']]
  })
} else if (os.platform() === 'linux' && os.arch() === 'x64') {
  hanhanSign = ffi.Library(libPath + 'libhankitamd64.so', {
    get_sign: ['string', ['string', 'string']]
  })
} else if (os.platform() === 'linux' && os.arch() === 'arm') {
  hanhanSign = ffi.Library(libPath + 'libhankitaarch64.so', {
    get_sign: ['string', ['string', 'string']]
  })
} else if (os.platform() === 'darwin' && os.arch() === 'x64') {
  hanhanSign = ffi.Library(libPath + 'libhankitamd64.dylib', {
    get_sign: ['string', ['string', 'string']]
  })
} else if (os.platform() === 'darwin' && os.arch() === 'arm') {
  hanhanSign = ffi.Library(libPath + 'libhankitaarc64.dylib', {
    get_sign: ['string', ['string', 'string']]
  })
} else {
  console.error('Unsupported platform or architecture')
}

export function getSign (query = '', timestamp = new Date().getTime()) {
  let signature = ''
  try {
    signature = hanhanSign.get_sign(timestamp + '', query)
  } catch (err) {
    logger.error(err)
  }
  return {
    signature,
    timestamp
  }
}

export async function downloadImageAndConvert2Base64 (url, headers) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      headers
    }).then(res => {
      let source = res.headers.get('Hanhan')
      logger.info(source)
      return res.arrayBuffer()
    }).then(buffer => {
      resolve(`base64://${Buffer.from(buffer).toString('base64')}`)
    }).catch(err => {
      reject(err)
    })
  })
}

export async function getImage (name) {
  const query = `/?${name}`
  let url = `http://hanhan.avocado.wiki${query}`
  const { signature, timestamp } = getSign(query)
  if (!signature) {
    url = `https://api.hanhan.icu${query}`
  }
  logger.debug({ signature, timestamp, query })
  const headers = {
    'x-req-lib': 'hanhan-plugin',
    'x-req-sign': signature,
    'x-req-ts': timestamp,
    'user-agent': 'hanhan-plugin/1.0.0 node-fetch'
  }
  return await downloadImageAndConvert2Base64(url, headers)
}
//
// (async () => {
//   console.log(await getImage('jk'))
// })()
