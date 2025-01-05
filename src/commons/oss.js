/* eslint-disable */
import axios from 'axios'
import store from '../store'
import { analysisFileByAxios, getFileName, getFileSuffix, getFillFileName, getUUID } from '@/utils'
import { Notification } from 'element-ui'
import { getXMenuType, PERMISSION_PREFIX } from '@/utils/constant/menuConst'
import { validData } from '@/components/avue/utils/util'
import { formatDate } from 'element-ui/src/utils/date-util'
import { isPlainObject, isArray, uniq } from 'lodash'

//oss图片上传对应的目录映射
export const OSS_DIR_MAP_WITH_TYPE = {
  default: 'media/common',
  0: 'media/product_image/public',
  1: 'media/size_psd/',
  2: 'media/coordinate_image/',
  3: 'media/white_board_image/',
  4: 'media/shadow_image/',
  5: 'media/mask_image/',
  6: 'media/size_layer_image',
  // 款式展示图
  7: 'media/display_image',
  //区域选择图
  8: 'media/area_choose_image',
  //定制定制产品效果图缩略图
  9: 'media/show_image',
  // 位置psd
  positionPsd: 'media/position_psd',
  private: 'media/product_image/private',
  productTemplateImage: 'media/product_template/image',
  productTemplateExcel: 'media/product_template/excel',
  businessLicence: 'media/business_licence',
  bottomBoardPreviewImage: 'media/bottom_board_preview_image',
  bottomBoardShowImage: 'media/bottom_board_preview_image',
  watermarkImage: 'media/watermark_image',
  declared: 'media/declared_image',
  invoice: 'media/invoice',
  colorImgExcel:'media/colorImgExcel',
  crmQrCode: 'media/crm_qr_code'
}

export function isOSSPath(path) {
  return path.includes?.('media/')
}

const serverUrl = `/${PERMISSION_PREFIX}/fileService/file/getUploadSignature`

const OSS_OK = '200'

const txt = {
  error: '发生错误',
  fileAbnormal: '上传文件类型异常',
  failedSignature: '获取签名失败',
  imageFailed: '图像上传失败',
  picNameError: '图片名称异常,存在“$1”特殊字符。',
  default: '图像上传失败'
}

//ossUploadObj的字段
// host: '',
// policy: '',
// accessid: '',
// signature: '',
// callback: '',
// key: ''

class UploadPicToOss {
  constructor() {
    this.cacheTime = 3
    this.debounceR = null
    this.timer = null
    this.char = '@@@@@' //分隔符
    this.normalDirPrefixList = [OSS_DIR_MAP_WITH_TYPE.private]
    this.encodeNameDirPrefixList = []
    this.ossUploadObj = null
    this.unusualCharsReg = /#|\$|\+/ig //异常字符
  }

  static formatDirNameByTime() {
    return formatDate(new Date(), 'yyyy/MM/dd')
  }

  static getFileSuffix(filename) {
    return getFileSuffix(filename) || 'png'
  }

  static getFileName(filename) {
    return getFileName(filename)
  }

  static getFormatUUID() {
    return getUUID().replace(/-/g, '')
  }

  static requestIsSuccess(res) {
    const { status } = res
    return status == OSS_OK
  }

  static getError(err) {
    if (!err) return txt.default
    err = err.toString().replace('Error: ', '')
    return validData(err, txt.default)
  }

  sendRequest(params) {
    if (this.debounceR) return this.debounceR
    return (this.debounceR = axios({
      baseURL,
      headers: getXMenuType(),
      url: serverUrl,
      method: 'post',
      params
    }).finally(() => (this.debounceR = undefined)))
  }

  sendOss(url, data = {}, config = {}) {
    return axios({
      headers: getXMenuType(),
      url,
      method: 'POST',
      data,
      ...config
    })
  }

  clearTimer() {
    this.timer && clearTimeout(this.timer)
  }

  async getSignature() {
    if (this.timer) {
      if (this.debounceR) return this.debounceR
      if (this.ossUploadObj) return this.ossUploadObj
      this.clearTimer()
    }
    this.ossUploadObj = null //清除oss上传数据
    this.timer = setTimeout(() => {
      this.timer = null
    }, this.cacheTime * 1000)
    try {
      let res = await this.sendRequest()
      const isSuccess = UploadPicToOss.requestIsSuccess(res)
      if (isSuccess) this.ossUploadObj = res?.data?.data
      return isSuccess
    } catch (err) {
      return false
    }
  }

  isExistNotFile(list) {
    return list.every(({ files }) => {
      return files.some((file) => file instanceof File || file instanceof Blob)
    })
  }

  isExistUnusualChar(list) {
    let errList = [], errStr = ''
    list.map((arg) => {
      const { dirPrefix, files } = arg
      if (this.isEncodeFileName(dirPrefix)) return //文件名称编码后，可以支持所有字符，所以不做特殊字符校验。
      return files.some((file) => {
        const fileName = file.name || ''
        const matchData = fileName.match(this.unusualCharsReg)
        if (matchData) errList.push(...matchData)
      })
    })
    errStr = txt ? txt.picNameError.replace('$1', uniq(errList).join('、')) : ''
    return [!!errList.length, errStr]
  }

  /**
   * 文件名称进行编码，支持所有字符。
   * @param dirPrefix
   * @returns {*}
   */
  isEncodeFileName(dirPrefix) {
    return this.encodeNameDirPrefixList.includes(dirPrefix)
  }

  isNormalFileName(dirPrefix) {
    return this.normalDirPrefixList.includes(dirPrefix)
  }

  allIsNormalFileName(args) {
    return args.every(item => {
      return this.isNormalFileName(item.dirPrefix)
    })
  }

  getOssName(file, arg, options) {
    const { uuidSuffix, dirPrefix } = arg
    const { name } = file
    const { localName, customLocalName } = options
    if (localName) return name
    if(customLocalName) return customLocalName
    const suffix = UploadPicToOss.getFileSuffix(file.name)
    const fileName = UploadPicToOss.getFileName(file.name)
    const isNormal = this.isNormalFileName(dirPrefix)
    const normalName = UploadPicToOss.getFormatUUID() + validData(uuidSuffix, '') + '.' + suffix
    if (isNormal) return normalName
    const char = fileName.indexOf(this.char) >= 0 ? '' : this.char
    const charName = fileName + char + normalName
    if (!this.isEncodeFileName(dirPrefix)) return charName
    return {
      encodeName: this.encodeFileName(fileName) + char + normalName,
      name: charName
    }
  }

  /**
   * 给非中文字符转码
   * @param fileName
   * @returns {*}
   */
  encodeFileName(fileName) {
    if (!fileName) return
    const reg = /[\u4e00-\u9fa5]/
    const splitData = fileName.split('')
    const formatData = splitData.map(item => {
      if (reg.test(item)) return item
      return encodeURIComponent(item)
    })
    return formatData.join('')
  }

  /**
   * 处理特殊字符
   * @param args
   * @returns {{encodeName: (*|string|{encodeName, name}), name: (*|string|{encodeName, name})}|*|string|{encodeName, name}}
   */
  getEncodeNameAndName(...args) {
    const nameList = this.getOssName(...args)
    if (isPlainObject(nameList)) return nameList
    return {
      encodeName: nameList,
      name: nameList
    }
  }

  getOssKey(arg, name) {
    const { dirPrefix, dirPrefixType, uuidPrefix, withoutTime } = arg
    let dir = dirPrefix
    if (dirPrefixType) dir = dirPrefixType
    if(withoutTime) {
      return `${dir}/${name}`.replace(
        /\/\//g,
        '/'
      )
    }
    return `${dir}/${UploadPicToOss.formatDirNameByTime()}/${store.getters.id}/${uuidPrefix || ''}/${name}`.replace(
      /\/\//g,
      '/'
    )
  }

  getOssFormData(file, name, key) {
    const { policy, accessid, callback, signature } = validData(this.ossUploadObj, {})
    const params = {
      name,
      key,
      policy: policy,
      OSSAccessKeyId: accessid,
      success_action_status: OSS_OK, //让服务端返回200,不然，默认会返回204
      callback: callback,
      signature: signature
    }
    const formData = new FormData()
    for (let key in params) {
      formData.append(key, params[key])
    }
    //file文件必须是最后一个append到formData中
    formData.append('file', file)
    return formData
  }

  async action(args, options = { localName: false }) {
    try {
      return await this.uploadHandler(args, options)
    } catch (err) {
      console.log('err', err.toString())
      Notification({
        type: 'error',
        title: txt.error,
        message: UploadPicToOss.getError(err)
      })
      return false
    }
  }

  async uploadHandler(args, options = { localName: false }) {
    if (!isPlainObject(options)) options = { localName: options }
    if (!isArray(args)) args = [args]
    const existNotFile = this.isExistNotFile(args)
    if (!existNotFile) throw new Error(txt.fileAbnormal)
    const notValidChar = this.allIsNormalFileName(args)
    if(!notValidChar) {
      const [charErr, charErrStr] = this.isExistUnusualChar(args)
      if (charErr) throw new Error(charErrStr)
    }
    const signatureSuccess = await this.getSignature()
    if (!signatureSuccess) throw new Error(txt.failedSignature)
    const { host } = validData(this.ossUploadObj, {})
    const tmpObj = args.reduce((cur, arg, index) => {
      const {
        files,
        prop,
        errCallBack,
        sucCallBack,
        config = {}
      } = arg
      cur[prop] = files.map(async (file) => {
        const { name, encodeName } = this.getEncodeNameAndName(file, arg, options)
        const key = this.getOssKey(arg, name)
        const encodeKey = this.getOssKey(arg, encodeName)
        const formData = this.getOssFormData(file, name, key)
        const res = await this.sendOss(host, formData, config)
        const isSuccess = UploadPicToOss.requestIsSuccess(res)
        if (!isSuccess) {
          //失败的回调
          if (errCallBack) {
            errCallBack()
            return false
          }
          throw new Error(`${file.name || ''}${txt.imageFailed}`)
        }
        sucCallBack && sucCallBack(`${encodeKey}`)
        return `${encodeKey}`
      })
      return cur
    }, {})
    const resultKeys = [],
      resultValues = []
    const tmpResultObj = {}
    Object.entries(tmpObj).map(([key, val]) => {
      resultKeys.push(key)
      resultValues.push(val)
    })
    const result = resultValues.map(async (p) => {
      return await Promise.all(await p)
    })
    const resData = await Promise.all(result)
    resData.map((item, index) => {
      const key = resultKeys[index]
      if (isArray(item) && item.length == 1) {
        tmpResultObj[key] = item[0]
      } else {
        tmpResultObj[key] = item
      }
    })
    const success = Object.values(tmpResultObj).every((data) => data)
    if (success) return tmpResultObj
    return false
  }
}

const ossInstance = new UploadPicToOss()


export async function uploadOSSPics(args, options = {}) {
  const isUrl = typeof args === 'string'

  if (typeof options === 'string') options = { prefixType: options }
  if (isUrl) {
    const blob = await analysisFileByAxios(args, { passFileReader: true })
    if (!blob) {
      Notification({
        type: 'error',
        title: '提示',
        message: '图片上传失败'
      })
      throw blob
    }
    if (!blob.name) blob.name = options.name || getFillFileName(args, options.fileName)
    args = [
      {
        files: [blob],
        prefixType: options.prefixType
      }
    ]
  }

  args.forEach((arg, index) => {
    if (arg.prefixType) {
      arg.dirPrefix = OSS_DIR_MAP_WITH_TYPE[arg.prefixType]
    }
    if (!arg.hasOwnProperty('prop')) {
      arg.prop = index
    }
  })

  if (isUrl) {
    const res = await ossInstance.action(args, options)
    if (!res || !res[0]) throw res

    return res[0]
  }
  return ossInstance.action(args, options)
}

export async function uploadOSSList(list, options, isRetry = true) {
  let p = []
  list.forEach((item) => {
    p = p.concat(
      options.map(async (option) => {
        const { pathProp } = option
        if (!item[pathProp] || item[`$${pathProp}`]) return

        if (!option.fileName && option.fileNameProp) {
          option.fileName = item[option.fileNameProp]
        }

        try {
          return item[pathProp] = item[`$${pathProp}`] = await uploadOSSPics(item[pathProp], option)
        } catch (e) {
          if (isRetry) {
            throw e
          } else {
            item[pathProp] = ''
          }
        }
      })
    )
  })
  try {
    await Promise.all(p)
    return true
  } catch (e) {
  }
  return false
}

uploadOSSPics.list = uploadOSSList
uploadOSSPics.ossInstance = ossInstance
