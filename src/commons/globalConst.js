/* eslint-disable */
import store from '@/store'
import { Message, Loading } from 'element-ui'
import { OSS_DIR_MAP_WITH_TYPE, uploadOSSPics } from '@/commons/oss'
import { checkPermission, getDiscountPrice, parseImgSrc, getIP, parsePrice } from '@/utils'
import lodopPrintPdf from '@/components/lodopPrint/lodopPrintPdf.js'
import { isNumber } from '@/components/avue/utils/validate'
import { get } from 'lodash'
import {
  COMPANY_NAME,
  KEEP_ON_RECORD_CODE,
  KEEP_ON_RECORD_CODE2,
  Value_Added_Number,
  FILE_PREFIX,
  SYSTEM_NAME
} from '@/utils/constant/systemConst'
import { aLiCompressPicByUrl } from '@/utils/constant/imageConst'
import { accAdd, accSub, accDiv, accMul } from '@/utils/calculate'
import { encode, decode } from '@/utils/hashids'
import { hasOwnProperty, validData } from '@/components/avue/utils/util'

//获取公网和内网ip
getIP()

export default {
  install(Vue) {
    Vue.prototype.FILE_PREFIX = FILE_PREFIX
    Vue.prototype.COMPANY_NAME = COMPANY_NAME
    Vue.prototype.SYSTEM_NAME = SYSTEM_NAME
    Vue.prototype.KEEP_ON_RECORD_CODE = KEEP_ON_RECORD_CODE
    Vue.prototype.KEEP_ON_RECORD_CODE2 = KEEP_ON_RECORD_CODE2
    Vue.prototype.Value_Added_Number = Value_Added_Number
    Vue.prototype.$console = console.log
    Vue.prototype.parseImgSrc = parseImgSrc
    Vue.prototype.$lodopPrintPdf = lodopPrintPdf //lodop打印pdf
    Vue.prototype.checkPermission = checkPermission
    Vue.prototype.goback = function (defaultRoute) {
      let timer
      this.$router.beforeEach((to, from, next) => {
        clearTimeout(timer)
        // console.log('beforeEach', to, from)
        next()
      })
      timer = setTimeout(() => {
        this.$router.push(defaultRoute)
      }, 200)

      this.$router.back()
    }
    Vue.prototype.$math = {
      // 浮点数求和
      add: accAdd,
      // 浮点数相减
      subtract: accSub,
      // 浮点数相除
      divide: accDiv,
      // 浮点数相乘
      multiply: accMul
    }
    window.aLiCompressPicByUrl = Vue.prototype.aLiCompressPicByUrl = aLiCompressPicByUrl
    Vue.prototype.parseAmount = window.parseAmount = parsePrice
    Vue.prototype.getDiscountPrice = getDiscountPrice
    Vue.prototype.bindListeners = (listeners, ...args) => {
      return !listeners
        ? ''
        : (Array.isArray(listeners) ? listeners : [listeners]).forEach(listener => listener(...args))
    }
  
    //获取名称
    window.$getProductName = Vue.prototype.$getProductName = function (data, lang = 'en') {
      const propList = {
        en: 'productEnName',
        cn: 'productCnName',
        default: 'productEnName'
      }
      return $defaultPlaceholder($GET(data, validData(propList[lang], propList.default), ''))
    }

    window.$SUC = (res) => {
      if (!res) return false
      const { code } = res
      return code == 0 || (code >= 200 && code < 300)
    }
    /*
     * 处理promise，方便await使用
     * @param {promise}
     * @return {array}
     * */
    window.awaitWrap = (promise) => {
      if (!(promise instanceof Promise)) return [null, promise]
      return promise.then((data) => [null, data]).catch((err) => [err, null])
    }
    window.awaitLoading = async (promise, option = '请稍候') => {
      typeof option === 'string' && (option = { lock: true, text: option })
      option.customClass = (option.customClass || '') + 'zIndexMax'
      const loading = Loading.service(option)
      await awaitWrap(promise)
      loading.close()
      return promise
    }
    window.awaitLoadingOnly = async (promise) => {
      const loading = Loading.service()
      try {
        return await promise
      } finally {
        loading.close()
      }
    }
    window.awaitFormResolve = async (promise) => {
      return (await awaitWrap(promise))[1]
    }
    window.awaitResolve = async (promise, option = false, callbacks = {}) => {
      typeof option === 'boolean' && (option = { isMsg: option })
      typeof option === 'string' && (option = { isMsg: true, sucMsg: option })
      let { isMsg, sucMsg = '操作成功', errMsg, mustCheckCode = true } = option

      callbacks = callbacks || option.callbacks
      typeof callbacks === 'function' && (callbacks = { success: callbacks })
      let { success, error } = callbacks

      let [err, res] = await awaitWrap(promise)
      if ((mustCheckCode || hasOwnProperty(res, 'code')) && !$SUC(res)) {
        if (err && /1001000/.test(err.code) && err.message) {
          Message.warning(err.message)
        }
        res = false
      }

      if (res) {
        isMsg && sucMsg && Message.success(sucMsg)
        typeof success === 'function' && success()
      } else {
        isMsg && errMsg && Message.warning(errMsg)
        typeof error === 'function' && error()
      }

      return res
    }
    window.awaitResolveLoading = async (promise, option, callbacks) => {
      return awaitLoading(awaitResolve(promise, option, callbacks), option?.loadingOption)
    }
    window.awaitResolveDetail = async (promise) => {
      let res = await awaitResolve(promise)
      return res ? res?.detail : undefined
    }
    window.awaitResolveDetailLoading = async (promise, option) => {
      return awaitLoading(awaitResolveDetail(promise, option))
    }
    window.awaitCallback = (promise, option) => {
      typeof option === 'function' && (option = { success: option })
      let { success, error, ...restOption } = option || {}

      return awaitResolve(
        promise,
        restOption,
        { success, error }
      )
    }
    window.promiseAll = (promises) => {
      return new Promise((resolve) => {
        let res = []
        if (!Array.isArray(promises) || promises.length === 0) return resolve(res)
        let resLen = 0
        promises.map((promise, index) => {
          if (!(promise instanceof Promise)) {
            res[index] = promise
            if (++resLen === promises.length) resolve(res)
            return
          }
          return promise
            .then((data) => {
              res[index] = data
            })
            .catch(() => {
              res[index] = false
            })
            .finally(() => {
              if (++resLen === promises.length) resolve(res)
            })
        })
      })
    }
    /**
     * 深度遍历调用promise
     * @param promises
     * @returns {Promise<unknown>}
     */
    window.promiseDeepAll = (promises) => {
      return new Promise((resolve) => {
        if (!Array.isArray(promises) || promises.length === 0) return resolve(promises)
        let res = []
        let resLen = 0
        promises.map((promise, index) => {
          return promiseDeepAll(promise).then((data) => {
            res[index] = data
          })
          .catch(() => {
            res[index] = false
          })
          .finally(() => {
            if (++resLen === promises.length) resolve(res)
          })
        })
      })
    }

    window.refreshDic = async (promise, dicName) => {
      await awaitWrap(promise)
      store.dispatch('RefreshDic', dicName)
      return promise
    }
    window.doSomethingAfterRequest = async (promise, fn) => {
      await awaitWrap(promise)
      fn()
      return promise
    }
    window.validate = (target, option, defaultVal = true) => {
      if (target === undefined) return defaultVal
      if (typeof target === 'function') {
        option = option || {}
        return awaitResolve(target(option.params), { mustCheckCode: false, ...option })
      }
    }

    //oss图片上传公共方法
    window.$uploadOSSPics = uploadOSSPics
    //oss图片上传对应的目录映射
    window.$ossDirMapWithType = OSS_DIR_MAP_WITH_TYPE

    window.$DEFAULT_PIC = Vue.prototype.$DEFAULT_PIC = require('@/assets/images/default.png')

    Vue.prototype.$GET = window.$GET = (object, path, defaultValue) => {
      return validData(get(object, path, defaultValue), defaultValue)
    }

    Vue.prototype.$encode = window.$encode = (data) => encode(data)

    Vue.prototype.$decode = window.$decode = (data) => decode(data)
    window.isDev = Vue.prototype.isDev = process.env.NODE_ENV === 'development'
    window.getRoutePathByMode = Vue.prototype.getRoutePathByMode = function (url) {
      if(!url) return ''
      if(window.isDev) {
        return url.replace(/^(\/?#\/|\/)/, '/#/')
      }
      return url.replace(/^(\/?#\/)/, '/')
    }

    /**
     * 计算文本在页面所占px宽度 -- 扩展String原型方法pxWidth
     * 获取文本px宽度
     * @param font{String}: 字体样式
     **/
    String.prototype.pxWidth = function (font) {
      // re-use canvas object for better performance
      var canvas =
          String.prototype.pxWidth.canvas || (String.prototype.pxWidth.canvas = document.createElement('canvas')),
        context = canvas.getContext('2d')

      font && (context.font = font)
      var metrics = context.measureText(this)

      return metrics.width
    }

    /**
     * 格式化数字
     * @param num <String|Number>
     * @param fixed
     **/
    Vue.prototype.parseNumber = window.parseNumber = function (num = this, fixed = 2) {
      if (!isNumber(num)) return 0
      return Number(parseFloat(num || 0).toFixed(fixed))
    }
    Number.prototype.parseNumber = String.prototype.parseNumber = function (fixed) {
      return parseNumber(this, fixed)
    }


    window.$defaultPlaceholder = Vue.prototype.$defaultPlaceholder = function (val = '') {
      return validData(val, '---')
    }
  }
}
