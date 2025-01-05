/* eslint-disable */
import { isEqual as equal, curryRight } from 'lodash'
import { deleteObjKeys } from '@/components/avue/core/dataformat'

/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (val instanceof Date || ['boolean', 'number', 'function'].includes(typeof val)) return false
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    for (var o in val) {
      return false
    }
    return true
  } else {
    return val === 'null' ||
      val == null ||
      val === 'undefined' ||
      val === undefined ||
      val === ''
  }
  return false
}

// 是否是数字
export function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/ //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ //负浮点数
  return regPos.test(val) || regNeg.test(val)
}

export function isEqual(value, other, ignoreKeys) {
  if (!validatenull(ignoreKeys)) {
    value = deleteObjKeys(value, ignoreKeys)
    other = deleteObjKeys(other, ignoreKeys)
  }
  
  return equal(value, other)
}

export function validateList(list, validate) {
  list = Array.isArray(list) ? list : [list]
  return list.every(validate)
}
export function validateListCurry(validate) {
  validate.validateList = curryRight(validateList)(validate)
}

export async function validatePipe(...validates) {
  if (validatenull(validates)) return true
  
  for (let validate of validates) {
    validate = Array.isArray(validate) ? validate : [validate]
    validate = validate.filter(v => v !== undefined)
  
    try {
      const valid = await Promise.all(validate.map(v => typeof v === 'function' ? v() : v))
      if (!valid.every(Boolean)) return false
    } catch (e) {
      throw e
    }
  }
  
  return true
}

export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  
  if (funcs.length === 1) {
    return funcs[0]
  }
  
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}