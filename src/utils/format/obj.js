/* eslint-disable */
import { isArray, get, set } from 'lodash'
import { getObjType } from '@/components/avue/utils/util'

export class FormatData {
  constructor({ maps, key, toKey }) {
    this.maps = maps || {}
    this.key = key
    this.toKey = toKey
  }
  
  format = ({
    data,
    key = this.key,
    toKey = this.toKey,
    map = this.maps[key] || {},
    keyMap = this.maps[toKey] || {},
    reverse,
    toReverse
  }) => {
    map = FormatData.normalizeMap(map)
    keyMap = FormatData.normalizeMap(keyMap)
    return FormatData.formatHandler(data, map, keyMap)
  }
  
  static formatHandler(data, map = {}, keyMap = {}) {
    const tmpObj = isArray(data) ? [] : {}
    for (const key in map) {
      let v = getValue(data, map[key], tmpObj)
      let k = keyMap[key] && getValue(data, keyMap[key], tmpObj)
      if (k && k.$isEntry) {
        v = k.value ?? v
        k = k.key
      }
      if (v && v.$isEntry) {
        k = k ?? v.key
        v = v.value
      }
      set(tmpObj, k ?? key, v)
    }
    return tmpObj
  }
  static getValue(data, handler, result) {
    switch (getObjType(handler)) {
      case 'string':
        return get(data, handler)
      case 'function':
        return handler(data, result)
    }
  }
  static normalizeMap(map) {
    return map
  }
}