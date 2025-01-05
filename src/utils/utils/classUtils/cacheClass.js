import { isPlainObject, uniqBy } from 'lodash'
import { validData } from '@/components/avue/utils/util'

export default class CacheClass {
  constructor(maxNum) {
    this.cacheKeys = []
    this.cache = Object.create(null)
    this.maxNum = validData(maxNum, 100)
  }

  timeToStamp(time) {
    return time ? +new Date(time) : null
  }

  pushCache(key, item, time) {
    time = this.timeToStamp(time)
    this.adjustment(key, time)
    this.cache[key] = item
    return item
  }

  removeCache(data) {
    if (!isPlainObject(data)) data = { key: data }
    const fIndex = this.cacheKeys.findIndex(item => {
      return item.key == data.key
    })
    if (fIndex >= 0) this.cacheKeys.splice(fIndex, 1)
    delete this.cache[data.key]
  }

  updateCache(key, item, time) {
    time = this.timeToStamp(time)
    this.cache[key] = item
    if (!time) return
    const fItem = this.findCacheKeyItem(key)
    if (!fItem) return
    fItem.time = time
  }

  findCacheKeyItem(key) {
    return this.cacheKeys.find(item => item.key == key)
  }

  hasCache(key, time) {
    if (!time) return !!this.cache[key]
    time = this.timeToStamp(time)
    const fItem = this.findCacheKeyItem(key)
    if (!fItem) return false
    return fItem.time == time
  }

  getCacheItemByKey(key, time) {
    time = this.timeToStamp(time)
    if (!this.hasCache(key, time)) return null
    this.adjustment(key, time)
    return this.cache[key]
  }

  /**
   * 调整缓存的key值
   * @param key
   */
  adjustment(key, time) {
    this.cacheKeys = this.adjustmentPosToFirst(this.cacheKeys, key, time)
    const len = this.cacheKeys.length
    if (len > this.maxNum) {
      //删除最后一个位置的key
      this.removeCache(this.cacheKeys.pop())
    }
  }

  /**
   * 调整位置到第一个
   * @param data
   * @param item
   */
  adjustmentPosToFirst(data, item, time) {
    const shiftItem = {
      key: item,
      time
    }
    data.unshift(shiftItem)
    return uniqBy(data, 'key')
  }

  clearAllCache() {
    this.cache = Object.create(null)
    this.cacheKeys = []
  }
}

/**
 * 创建缓存实例
 * @param cacheInstance
 * @param cacheKey
 * @param time
 * @param callback
 * @returns {*}
 */

export function createBaseCacheInstance(cacheInstance, cacheKey, time, callback) {
  if (cacheInstance.hasCache(cacheKey, time)) {
    return cacheInstance.getCacheItemByKey(cacheKey, time)
  }
  const p = callback(cacheKey, time)
  if(!p) return p
  if (p instanceof Promise) {
    p.then((res) => {
      if(res) {
        cacheInstance.pushCache(cacheKey, res, time)
      }
      return res
    }, () => {
      // cacheInstance.pushCache(cacheKey, null, time)
      return null
    })
  }
  console.log('join', cacheKey)
  cacheInstance.pushCache(cacheKey, p, time)
  return p
}


export function setStaticComputed(target, computedOption) {
  let cacheData = {}
  for (const key in computedOption) {
    Object.defineProperty(target, key, {
      get: () => {
        const value = cacheData[key]
        if (value) return value
        
        return cacheData[key] = computedOption[key]()
      }
    })
  }
  
  target.clearStaticComputed = (key) => {
    if (key) {
      delete cacheData[key]
    } else {
      cacheData = {}
    }
  }
}