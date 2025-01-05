/* eslint-disable */
import { validatenull } from '@/components/avue/utils/validate'
import { SYS_YES } from '@/utils/constant'
import Big from 'big.js'

/**
 * 数字相加
 * @param {Array} nums
 * @returns {Number}
 * @example see @/views/order/module/pushGroup.vue
 */
export function numberAdd(nums) {
  return accAdd(...nums)
}

// 两位小数
export function toFixed(num, precision) {
  return new Big(num).toFixed(precision)
}

// 数据换算率
export const conversionRate = {
  cm: {
    in: 0.39370078740157
  },
  in: {
    cm: 2.54
  },
  g: {
    lb: 0.00220462262184
  }
}
export function conversionData(data, dataType, resultType) {
  // console.log('numberAdd', nums)
  if (validatenull(data)) return 0
  if (!conversionRate[dataType] || !conversionRate[dataType][resultType]) return data
  return data * conversionRate[dataType][resultType]
}
export function conversionCMToIN(data) {
  return conversionData(data, 'cm', 'in').toFixed(4)
}
export function conversionGToLB(data) {
  return conversionData(data, 'g', 'lb').toFixed(4)
}

/**
 *  获取运费
 * @param {string|number} weight
 * @param {string|number} length
 * @param {string|number} width
 * @param {string|number} height
 * @param {array} templateConfigList 运费模板列表
 * @param {number} compareWeightMultiple 抛重大于实重多少倍时计泡
 * @param {number} isByCompareWeightMultiple 是否抛重与实重倍数比较
 * @param {number} calculateMode 运费计算模式
 * @param {number} isByActualWeight 是否计算实际重量
 * @param {number} isByVolumetricWeight 是否计算计泡重量
 * @param {number} volumeDivisor 材积除数
 * @param {number} count 购买数量
 * @returns
 */
export function getExpressCost(
  { weight, length, width, height },
  templateConfigList,
  {
    compareWeightMultiple,
    isByCompareWeightMultiple,
    calculateMode,
    isByActualWeight,
    isByVolumetricWeight,
    volumeDivisor
  },
  count = 1
) {
  let actualWeight = accMul(weight, count)
  let volumetricWeight = 0
  /*if (isByActualWeight === SYS_YES) {
    // weight * count
    actualWeight = accMul(weight, count)
    console.log(weight, count, actualWeight, weight * count)
    // console.log('actualWeight', weight * count, actualWeight)
  }*/
  if (isByVolumetricWeight === SYS_YES) {
    // (length * width * height / volumeDivisor) * count
    volumetricWeight = Math.floor(
      parseNumber(accMul(accDiv(accMul(length, width, height), accDiv(volumeDivisor, 1000)), count))
    )
    // console.log('volumetricWeight', (length * width * height / volumeDivisor) * count, volumetricWeight)
  }
  let $isByVolumetricWeight = volumetricWeight >= actualWeight
  let $chargedWeight = Math.max(actualWeight, volumetricWeight)
  if (isByCompareWeightMultiple) {
    if (accMul(actualWeight, compareWeightMultiple) > volumetricWeight) {
      $chargedWeight = actualWeight
      $isByVolumetricWeight = false
    } else {
      $chargedWeight = Math.floor(volumetricWeight)
      $isByVolumetricWeight = true
    }
  }

  let cost = 0
  let template = getExpressTemplate(templateConfigList, $chargedWeight)
  let $isOverflow = false
  if (template) {
    let { registrationFee, emergencySurcharge } = template
    switch (calculateMode) {
      case 1:
        let { firstFreight, firstWeight, continuedWeight, continuedFreight } = template
        // $chargedWeight - firstWeight
        let restWeight = accSub($chargedWeight, firstWeight)
        if (restWeight < 0) restWeight = 0
        // restWeight / continuedWeight
        let continuedTotalWeight = Math.ceil(accDiv(restWeight, continuedWeight))
        // (firstFreight + continuedTotalWeight * continuedFreight) + registrationFee + emergencySurcharge
        cost = accAdd(firstFreight, accMul(continuedTotalWeight, continuedFreight), registrationFee, emergencySurcharge)
        break
      case 2:
        let { freight } = template
        cost = accAdd(freight, registrationFee, emergencySurcharge)
        break
    }
  } else {
    $isOverflow = true
    template = {}
  }

  return {
    templateConfigList,
    template: {
      ...template,
      $isOverflow,
      $chargedWeight,
      $calculateMode: calculateMode,
      isByActualWeight,
      isByVolumetricWeight,
      $volumeDivisor: volumeDivisor,
      $actualWeight: actualWeight,
      $volumetricWeight: volumetricWeight,
      $isByVolumetricWeight
    },
    cost: cost || 0
  }
}
// 获取运费模板
export function getExpressTemplate(templateList, weight) {
  return templateList.find(({ startWeight, endWeight }) => weight >= startWeight && weight <= endWeight)
}

export function accFactory(method = 'add') {
  return function (...nums) {
    nums = nums.map(Number).filter((num) => num || num === 0)
    if (nums.length === 0) return 0
    return nums.reduce((total, num) => floatObj[method](total, num)) || 0
  }
}
// 浮点数求和
export const accAdd = accFactory('add')
// 浮点数相减
export const accSub = accFactory('subtract')
// 浮点数相除
export const accDiv = accFactory('divide')
// 浮点数相乘
export const accMul = accFactory('multiply')

/**
 * floatObj 包含加减乘除四个方法，能确保浮点数运算不丢失精度
 *
 * 我们知道计算机编程语言里浮点数计算会存在精度丢失问题（或称舍入误差），其根本原因是二进制和实现位数限制有些数无法有限表示
 * 以下是十进制小数对应的二进制表示
 *      0.1 >> 0.0001 1001 1001 1001…（1001无限循环）
 *      0.2 >> 0.0011 0011 0011 0011…（0011无限循环）
 * 计算机里每种数据类型的存储是一个有限宽度，比如 JavaScript 使用 64 位存储数字类型，因此超出的会舍去。舍去的部分就是精度丢失的部分。
 *
 * ** method **
 *  add / subtract / multiply /divide
 *
 * ** explame **
 *  0.1 + 0.2 == 0.30000000000000004 （多了 0.00000000000004）
 *  0.2 + 0.4 == 0.6000000000000001  （多了 0.0000000000001）
 *  19.9 * 100 == 1989.9999999999998 （少了 0.0000000000002）
 *
 * floatObj.add(0.1, 0.2) >> 0.3
 * floatObj.multiply(19.9, 100) >> 1990
 *
 */
export var floatObj = (function () {
  /*
   * 判断obj是否为一个整数
   */
  function isInteger(obj) {
    return Math.floor(obj) === obj
  }

  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  function toInteger(floatNum) {
    var ret = { times: 1, num: 0 }
    var isNegative = floatNum < 0
    if (isInteger(floatNum)) {
      ret.num = floatNum
      return ret
    }
    var strfi = floatNum + ''
    var dotPos = strfi.indexOf('.')
    var len = strfi.substr(dotPos + 1).length
    var times = Math.pow(10, len)
    var intNum = parseInt(Math.abs(floatNum) * times + 0.5, 10)
    ret.times = times
    if (isNegative) {
      intNum = -intNum
    }
    ret.num = intNum
    return ret
  }

  /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  function operation(a, b, digits, op) {
    var o1 = toInteger(a)
    var o2 = toInteger(b)
    var n1 = o1.num
    var n2 = o2.num
    var t1 = o1.times
    var t2 = o2.times
    var max = t1 > t2 ? t1 : t2
    var result = null
    switch (op) {
      case 'add':
        if (t1 === t2) {
          // 两个小数位数相同
          result = n1 + n2
        } else if (t1 > t2) {
          // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2)
        } else {
          // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2
        }
        return result / max
      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2)
        } else {
          result = n1 * (t2 / t1) - n2
        }
        return result / max
      case 'multiply':
        result = (n1 * n2) / (t1 * t2)
        return result
      case 'divide':
        result = (n1 / n2) * (t2 / t1)
        return result
    }
  }

  // 加减乘除的四个接口
  function add(a, b, digits) {
    return Number(operation(a, b, digits, 'add'))
  }
  function subtract(a, b, digits) {
    return Number(operation(a, b, digits, 'subtract'))
  }
  function multiply(a, b, digits) {
    return Number(operation(a, b, digits, 'multiply'))
  }
  function divide(a, b, digits) {
    return Number(operation(a, b, digits, 'divide'))
  }

  // exports
  return {
    add,
    subtract,
    multiply,
    divide
  }
})()

export function getTextWidth(text, font) {
  if (typeof text !== 'string') return 0
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas')),
    context = canvas.getContext('2d')

  font && (context.font = font)
  var metrics = context.measureText(text)

  return metrics.width
}

export const scale100Number = createScaleNumber(0.01) //缩小100
export const amplify100Number = createScaleNumber(100) //放大100

export function createScaleNumber(scale) {
  return function (number) {
    const calcNum = accMul(number, scale)
    return isNaN(calcNum) ? number : calcNum
  }
}
