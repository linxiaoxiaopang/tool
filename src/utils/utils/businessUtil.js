/* eslint-disable */
import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import { Loading, Message } from 'element-ui'
import { flatMapDeep, isPlainObject, isArray, upperFirst } from 'lodash'
import { validData } from '@/components/avue/utils/util'
import { formatDate } from 'element-ui/src/utils/date-util'


/**
 * @description: 创建打印的后掉列表
 * @param {Object} printData
 * @param {Function} callback 关闭打印发射事件
 * @return {Object} 回调列表
 */
export function createPrintCallbackParams(printData, startCallback, afterCallback) {
  const { documentTitle, name = '' } = printData
  let loadingInstance = null
  let historyDocumentTitle = null
  const defaultPrintData = {
    documentTitle,
    name,
    type: 'pdf',
    printable: require('@/assets/images/default.png'),
    scanStyles: false,
    onLoadingStart: () => {
      loadingInstance = Loading.service({
        lock: true,
        text: `生成${documentTitle}中`
      })
      startCallback && startCallback()
      //存储历史的网页标题
      //通过更改网页标题来更改保存时打印标题文件的标题
      historyDocumentTitle = document.title
      document.title = name
    },
    onLoadingEnd: () => {
      loadingInstance.close()
      afterCallback && afterCallback()
      document.title = historyDocumentTitle
    },
    onError: (err) => {
      Message.error('打印失败')
      loadingInstance.close()
    }
  }
  return {
    ...defaultPrintData,
    ...printData,
    documentTitle,
    name
  }
}

/**
 * @description: 扁平化数组或对象
 * @param Array | Object  被扁平化的数组|对象
 * @param Array 扁平化字段列表
 * @return {Array
 */
export function flatMapDeepByArray(data, mapArr = [], mapKeyArr = [], needFill = false) {
  let flatMapArr = []
  if (!mapArr.length) return []
  if (isPlainObject(data)) {
    const shiftData = data[mapArr.shift()]
    flatMapArr = Array.isArray(shiftData) ? shiftData : [shiftData]
  } else {
    flatMapArr = data
  }
  //重置mapKeyArr
  mapKeyArr = mapKeyArr.slice(0, flatMapArr.length)
  for (let i = 0; i < mapArr.length; i++) {
    flatMapArr = flatMapDeep(flatMapArr, (n) => {
      const arr = $GET(n, `${[mapArr[i]]}`, [])
      const sliceKeyArr = mapKeyArr.slice(0, i + 1)
      const sliceMapArr = mapArr.slice(0, i + 1)
      sliceKeyArr.map((key, k) => {
        arr.map((nItem, index) => {
          nItem.$index = index
          if (k == sliceMapArr.length - 1) {
            return (nItem[`$${key}`] = n)
          }
          nItem[`$${key}`] = n[`$${key}`]
        })
      })
      return arr
    })
  }
  //需要填充
  if (needFill) flatMapArr.map((item) => fillProps(item, mapKeyArr))
  return flatMapArr
}

/**
 * @description: 数组填充属性值
 * @param Array | Object  待处理的对象
 * @param Array 待填充的对象
 * @return
 */
export function fillProps(obj, props) {
  if (!isArray(props)) props = [props]
  props = props.map(prop => `$${prop}`)
  props.map(prop => {
    const val = obj[prop]
    if (!isPlainObject(val)) return
    for (let key in val) {
      const valKey = obj[key] ? `${prop}${upperFirst(key)}` : key
      obj[valKey] = val[key]
    }
  })
}


//设置setTimeout延迟
export async function waitTimeByNum(num) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, num)
  })
}

/**
 * .js文件监听store中的字段
 * @param prop
 * @param data
 * @param isGetters
 */
export function storeWatcher(prop, data, isGetters = true) {
  store.watch(
    (state, getters) => {
      if (!isGetters) return $GET(state, prop, [])
      return $GET(getters, prop, [])
    },
    (newVal) => {
      data.length = 0
      data.push(...validData(newVal, []))
    }
  )
}

/**
 * 获取格式化时间
 * @param date
 * @param format
 * @returns {string|*}
 */
export function getFormatData(date = new Date(), format = 'yyyy-MM-dd HH:mm:ss') {
  return formatDate(date, format)
}

/**
 * 错误包裹器
 * @param error
 * @returns {string|*}
 */
export function wrapperError(error) {
  if (error.message) return error.message
  if (error.detailMessage) return error.detailMessage
  const errStr = error.toString()
  return errStr.replace(/^.+?Error:/, '')
}

/**
 * 跳转页面的message
 * @param option
 */

export let linkPageMessage = function (option) {
  //第一次调用之后，重载linkPageMessage
  linkPageMessage = (function createLinkPageMessage() {
    const vm = new Vue({
      router
    })
    const h = vm.$createElement
    return function (option = {}) {
      const renderMessage = validData(option.renderMessage, '操作成功。')
      const routerToOption = validData(option.routerToOption, { path: '/' })
      const click = option.click
      const routerTxt = validData(option.routerTxt, '点击前往>>')
      const defaultOption = {
        type: 'success',
        message: h(
          'div',
          {
            staticClass: 'flex-center-between w100'
          },
          [
            h('span', renderMessage),
            h(
              'a',
              {
                style: { color: '#1f5fff', marginLeft: '10px' },
                on: {
                  click: (evt) => {
                    evt.preventDefault()
                    if (click) {
                      click()
                    } else {
                      vm.$router.replace(routerToOption)
                    }
                  }
                }
              },
              routerTxt
            )
          ])
      }
      vm.$message(Object.assign({}, defaultOption, option))
    }
  })()
  linkPageMessage(option)
}


