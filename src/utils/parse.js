/* eslint-disable */
import { isPrice } from '@/utils'
import moment from 'moment'

/**
 * 将数据转化为数字格式
 * @param {any} num
 * @returns {Number}
 * @example see parsePrice
 */
export function parseNumber(num) {
  return parseFloat(num || 0)
}
/**
 * 将数据转化为金额格式
 * @param {String|Number} price
 * @param {Number} fixed
 * @param {String} unit
 * @returns {String}
 * @example see @/views/order/module/orderGroupBasePage.vue
 */
export function parsePrice(price, fixed = 2, unit = '￥') {
  // console.log('parsePrice', price, fixed, unit)
  price = price || 0
  if (isPrice(price)) return unit + parseNumber(price).toFixed(fixed)
  return unit + price
}

/**
 * 将时间公司转化为时间展示格式
 * @param {time} time
 * @returns {String}
 */
export function parseTime(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return year + '年' + month + '月' + day + '日 ' + hours + ':' + minutes + ':' + seconds
  } else {
    return ''
  }
}

/**
 * 将时间公司转化为时间展示格式
 * @param {time} time
 * @returns {String}
 */
export function parseCharacterTime(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  } else {
    return ''
  }
}

export function parseDay(time) {
  return parseTime(time).split(' ')[0]
}

export function parseImgSrc(src) {
  return encodeURI(src).replace(/\+/g, '%2B')
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export const timeNum = () => {
  return parseTime(Date.now()).replace(/[^\d]/g, '')
}

//完成将 toChineseNum， 可以将数字转换成中文大写的表示，处理到万级别，例如 toChineseNum(12345)，返回 一万二千三百四十五。
export const toChinesNum = (num) => {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'] //changeNum[0] = "零"
  let unit = ['', '十', '百', '千', '万']
  num = parseInt(num)
  let getWan = (temp) => {
    let strArr = temp.toString().split('').reverse()
    let newNum = ''
    for (var i = 0; i < strArr.length; i++) {
      newNum =
        (i == 0 && strArr[i] == 0
          ? ''
          : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
          ? ''
          : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) + newNum
    }
    return newNum
  }
  let overWan = Math.floor(num / 10000)
  let noWan = num % 10000
  if (noWan.toString().length < 4) noWan = '0' + noWan
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}

// 获取n天前的数据
export const getNDaysBefore = (n = 1, format = 'YYYY-MM-DD HH:mm:ss') => {
  const yesterday = moment.subtract(n, 'days')
  yesterday.set({ hour: 12, minute: 0, second: 0, millisecond: 0 })
  return yesterday.format(format)
}

// 获取n天前开始的前m天数据(默认获取从昨天开始的前30天数据, 用于展示baseTable的默认搜索时间)
export const getMDaysBeforeNDays = (m = 30, n = 1, format = 'YYYY-MM-DD') => {
  const next = moment().subtract(n, 'day').endOf('day').format(format)
  const before = moment()
    .subtract(m + n, 'days')
    .startOf('day')
    .format(format)
  return [before, next]
}

// 获取本月的数据(用于展示baseTable的默认搜索时间)
export const getMonthData = (format = "'YYYY-MM'") => {
  return moment().format(format)
}
