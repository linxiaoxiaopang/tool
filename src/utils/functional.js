/* eslint-disable */
import { set, get } from 'lodash'

export function correctExecute(firstFn, ...args) {
  return args.reduce(async (prev, next, index, arr) => {
    let { success, error } = getExecuteFn(next)
    try {
      if (await prev) {
        return success()
      }
    } catch (e) {}
    
    if (typeof error === 'function') return error()
    arr.splice(index)
    
  }, firstFn())
}
export function getExecuteFn(param) {
  if (typeof param === 'function') {
    return {
      success: param
    }
  }
  return param
}

export function firstToUpperCase(str) {
  return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase())
}

export function setCacheFactory(fnName, api) {
  let cacheName = `${fnName}Cache`
  let lastRequest
  return async function (postData, key = '$own') {
    if (!this[cacheName]) this[cacheName] = {}
    if (this[cacheName][key]) return this[cacheName][key]
    
    let promise = this[cacheName][key] = lastRequest = awaitResolve(api(postData))
  
    this[cacheName][key] = await promise
    return lastRequest === promise && promise
  }
}


export async function promisePipe(promises, isBreak = true) {
  if (validatenull(promises)) return {}
  promises = Array.isArray(promises) ? promises : [promises]
  if (promises.length === 1) {
    let lastRes = await validateWrapper(promises[0])
    return {
      lastRes,
      res: [lastRes]
    }
  }
  
  let tempArr = []
  let lastRes = await promises.reduce(async (a, b) => {
    const [success, error = null] = Array.isArray(b) ? b : [b]
    try {
      const res = await validateWrapper(a)
      if (isBreak && !res) return validateWrapper(error)
      
      tempArr.push(res)
      
      return validateWrapper(success)
    } catch (e) {}
  })
  
  tempArr.push(lastRes)
  
  return {
    lastRes,
    res: tempArr
  }
}
export async function validateWrapper(validates = true, isSync) {
  if (Array.isArray(validates)) {
    return isSync
      ? (await promiseAll(
        validates.map(validate => validateWrapper(validate))
      )).every(Boolean)
      : (await promisePipe(validates))?.lastRes
  }
  
  let result = validates
  if (typeof validates === 'function') result = validates()
  if (result instanceof Promise) result = awaitFormResolve(result)
  return result
}


export function getResult(res, ...args) {
  if (typeof res === 'function') res = res.apply(this, args)
  return res
}
export function curryObj(fn, obj, keys) {
  if (keys.some(key => obj[key] === undefined)) {
    return (obj2) => {
      return curryObj(fn, { ...obj, ...obj2 }, keys)
    }
  }
  return fn(obj)
}

export function eventInvoker(event, ...args) {
  if (!event) return
  
  if (typeof event === 'function') event(...args)
  
  if (Array.isArray(event)) event.forEach(fn => fn(...args))
}

export function transformKey(keys, data, form = {}) {
  const p = []
  for (const key in keys) {
    const option = keys[key]
    try {
      switch (typeof option) {
        case 'string':
          set(form, key, get(data, option))
          break
        case 'function':
          set(form, key, option(form, data))
          break
        case 'object':
          if (option.$isHandler) {
            option.handler(form, data)
          }
          if (option.$isAsync) {
            p.push(
              option.handler(form, data)
            )
          }
          break
      }
    } catch (e) {}
  }
  if (p.length) {
    return new Promise(async resolve => {
      await Promise.all(p)
      resolve(form)
    })
  }
  return form
}

export const getStyle = (function () {
  if (window.document.currentStyle) {
    return (dom, attr) => dom.currentStyle[attr]
  } else {
    return (dom, attr) => getComputedStyle(dom, false)[attr]
  }
})()
export function getStyleNumber(dom, attr) {
  const value = getStyle(dom, attr)
  if (value.includes('%')) {
    return +value.replace(/%/g, '') / 100
  } else {
    return +value.replace(/px/g, '')
  }
}

/*  String  */
// 获取字符串中匹配字符串之前的值
export function getBeforeStr(str, matchStr) {
  const mediaIndex = str.indexOf(matchStr)
  if (mediaIndex < 0) return str
  return str.substr(0, mediaIndex)
}
// 获取字符串中匹配字符串之前的值
export function getAfterStr(str, matchStr) {
  const mediaIndex = str.indexOf(matchStr)
  if (mediaIndex < 0) return str
  return str.substr(mediaIndex)
}

export function concat(...items) {
  return [].concat(...items.filter(Boolean))
}