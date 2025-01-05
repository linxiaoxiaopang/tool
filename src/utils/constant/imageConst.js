import { createRandomNum, getImgDom, parseImgSrc, getUUID } from '@/utils'
import { isNumber } from '@/components/avue/utils/validate'

export const PICSIZE = {
  min: '?x-oss-process=image/resize,l_80,h_80',
  small: '?x-oss-process=image/resize,l_150,h_150',
  mid: '?x-oss-process=image/resize,l_350,h_350',
  large: '?x-oss-process=image/resize,l_750,h_750'
}
export const DESIGN_SHOW_LONG_NUM = 400

export const COMPRESS_MAX_LONG_STR = `?x-oss-process=image/resize,l_${DESIGN_SHOW_LONG_NUM},limit_0`

export const COMPRESS_ORIGIN_MAX_LONG_STR = `?x-oss-process=image/resize,l_${2000},limit_0`

export const KL_IMAGE_MAX_LONG_NUM = 1000

export const COMPRESS_KL_IMAGE_MAX_LONG_STR = `?x-oss-process=image/resize,l_${KL_IMAGE_MAX_LONG_NUM},limit_1`

export const PICBIGSIZE = 3 * 1024 * 1024

export const PIC_DISABLE = 1 //禁用
export const PIC_ENABLE = 0 //启用

export const IS_URL = 1 // url地址

export const UNUPLOADED = 2 // 图片未上传

//压缩图片最大宽度
export const COMPRESS_MAX_NUM = 800

//图片上传到oss的uuid和原本文件名称的分隔符
export const OSS_SEPARATOR = '@@@@@'

/**
 * 获取oss上缩略图
 * @param url
 * @param longNum 压缩长边值
 * @param noUseCache 是否使用缓存图片
 * @param validALiCompress 是否开启缩略图缩略图压缩判断
 * @returns {string|Promise<string|*|undefined>} 开启缩略图压缩返回的是promise,其他情况返回处理过后的路径
 */
export function aLiCompressPicByUrl(url, longNum, noUseCache = false, validALiCompress = false) {
  if (!longNum && longNum !== false) {
    longNum = url
    url = ''
  }
  if (!url) {
    return `?x-oss-process=image/resize,l_${longNum}`
  }
  try {
    const urlInstance = new URL(url)
    if (!validALiCompress) {
      return createForMatUrl(urlInstance)
    }
    return getPassValidALiCompress(urlInstance)
  } catch {
    return url
  }
  
  function createForMatUrl(urlInstance) {
    const searchParams = urlInstance.searchParams
    if (longNum !== false && !searchParams.has('x-oss-process')) {
      searchParams.set('x-oss-process', `image/resize,l_${longNum}`)
    }
    if (noUseCache && !searchParams.has('uid')) {
      searchParams.set('uid', getUUID().replace(/-/g, ''))
    }
    return decodeURIComponent(urlInstance.href)
  }
  
  async function getPassValidALiCompress(urlInstance) {
    let formatUrl
    try {
      formatUrl = createForMatUrl(urlInstance)
      const success = await loadImage(formatUrl)
      if (success) return formatUrl
      throw new Error('image cross the border')
    } catch {
      return replaceOssProcess(formatUrl)
    }
  }
  
  function replaceOssProcess(formatUrl = url) {
    return formatUrl.replace('x-oss-process', 'x-oss-process-error')
  }
  
  function loadImage(rawUrl) {
    const img = new Image()
    return new Promise(resolve => {
      function sucFn() {
        offFn()
        resolve(true)
      }
      
      function errFn() {
        offFn()
        resolve(false)
      }
      
      function offFn() {
        img.removeEventListener('load', sucFn)
        img.removeEventListener('error', errFn)
      }
      
      img.addEventListener('load', sucFn)
      img.addEventListener('error', errFn)
      img.src = rawUrl
    })
  }
}
export function getALiCompressUrl(src, size = 'min', noUseCache, validALiCompress = true) {
  // await new Promise(resolve => setTimeout(resolve, 1000))
  if (!src) return ''
  if (/^blob:/.test(src)) return src
  
  src = parseImgSrc(src) // 解决路径包含特殊字符的图片不显示问题
  if (!size) return aLiCompressPicByUrl(src, false, noUseCache)
  // size要在这之后判断：包含force__的size在这之后才会被取出正常size
  try {
    if (size.includes('force__')) {
      size = size.replace('force__', '')
      src = src
        .replace(/((x-oss-process=image)[^&]*&*)((uid=)[^&]*&*)?/g, '')
        .replace(/\?$/, '')
    }
  } catch {}
  if (size === 'origin') return aLiCompressPicByUrl(src, false, noUseCache)
  // size包含force__时，会去掉x-oss-process
  if (src.includes('x-oss-process')) return aLiCompressPicByUrl(src, false, noUseCache, validALiCompress)
  
  let picSize = PICSIZE[size]
  if (picSize) src = `${src}${src.includes('?') ? picSize.replace('?', '&') : picSize}`
  
  return aLiCompressPicByUrl(src, size, noUseCache, validALiCompress)
}

export async function getThumbnail(src, size = 'min', uid) {
  if (!src) return ''
  if (/^blob:/.test(src)) return src

  let picSize = isNumber(size) ? `?x-oss-process=image/resize,l_${size}` : PICSIZE[size]
  picSize = src.includes('?') ? picSize.replace('?', '&') : picSize
  
  uid = uid ? uid === 'none' ? '' : uid : createRandomNum()
  if (uid) uid = `&uid=${uid}`
  
  let img = await getImgDom(`${src}${picSize}${uid}`)
  if (img) return img.src
}
export async function getThumbnailSrc(src, size, uid = 'none') {
  // await new Promise(resolve => setTimeout(resolve, 1000))
  if (!src) return ''
  if (/^blob:/.test(src)) return src

  src = parseImgSrc(src) // 解决路径包含特殊字符的图片不显示问题
  if (!size) return src

  try {
    if (size.includes('force__')) {
      size = size.replace('force__', '')
      src = src.replace(/((x-oss-process=image)[^&]*&*)((uid=)[^&]*&*)?/g, '').replace(/\?$/, '')
    }
  } catch (e) {}
  if (size === 'origin') return src
  if (src.includes('x-oss-process=')) return src
  let res = await getThumbnail(src, size, uid)
  return res || src
}

export const UNSYNC = 0 // 不同步
export const SYNC = 1 // 同步
