import { isPlainObject, isNumber } from 'lodash'
import { WATERMARK_PICTURE_SYNTAX } from '@/utils/constant/productTemplateConst'

/**
 *
 * @param underlayUrl 底图url
 * @param watermarkPath 水印图url
 * @param option 水印配置
 * @returns {string}
 */
export function encodeWatermarkPicture(...args) {
  const defaultOption = {
    width: 300,
    height: 300,
    splitChar: '$char',
    syntax: WATERMARK_PICTURE_SYNTAX
  }
  if (!args.length) return ''
  let underlayUrl = ''
  let watermarkPath = ''
  let option = {}
  if (args.length == 1) {
    [watermarkPath] = args
  }
  if (args.length == 2) {
    if (isNumber(args[1])) {
      [watermarkPath, option] = args
    } else {
      [underlayUrl, watermarkPath] = args
    }
  }
  if (args.length == 3) {
    [underlayUrl, watermarkPath, option] = args
  }
  if (!isPlainObject(option)) {
    option = {
      width: option,
      height: option
    }
  }
  option = Object.assign(defaultOption, option)
  if (!watermarkPath) return ''
  const { syntax, splitChar, width, height } = option
  const [sizeSyntax, posSyntax] = syntax.split(splitChar)
  const encodeFillWatermarkPath = watermarkBase64Encode(`${watermarkPath}${sizeSyntax.replace('$pW', width).replace('$pH', height)}`) + posSyntax
  if (!underlayUrl) return encodeFillWatermarkPath
  const isSyntaxUrl = underlayUrl.indexOf('?') >= 0
  if (!isSyntaxUrl) return `${underlayUrl}?x-oss-process=image/resize,h_${height},w_${width},limit_0,x-oss-process=image/watermark,image_${encodeFillWatermarkPath}`
  underlayUrl = underlayUrl.replace(/(w_)\d+/i, `$1${width}`).replace(/(h_)\d+/i, `$1${height}`)
  return `${underlayUrl},x-oss-process=image/watermark,image_${encodeFillWatermarkPath}`
}

export function watermarkBase64Encode(str) {
  return window.btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function watermarkBase64Decode(encodeStr) {
  return window.atob(encodeStr.replace(/-/g, '+').replace(/_/g, '/'))
}
