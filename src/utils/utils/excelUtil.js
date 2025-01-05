export function formatExcel(data, option) {
  let keyObj = {}
  for (const sysKey in option) {
    keyObj[sysKey] = typeof option[sysKey] === 'string' ? option[sysKey] : option[sysKey].label
  }
  return changeArrKey(data, keyObj)
}

/**
 * 将dataObj的键名替换为keyObj里的对应值
 * @param {Object} dataObj
 * @param {Object} keyObj
 * @param {Boolean} isKeyObj // true为{oldKey: newKey}, false为{newKey: oldKey}
 * @returns {Object}
 * @example see @/views/order/orderImport
 * @description 改变Obj数据的key
 */
export function changeObjKey(dataObj, keyObj, isKeyObj = false) {
  let nObj = {}
  
  if (isKeyObj){
    Object.keys(dataObj).forEach(key => {
      let nKey = keyObj[key]
      nKey && (nObj[nKey] = dataObj[key])
    })
  } else {
    // 旧键名数组
    let dataKeys = Object.keys(dataObj)
    Object.entries(keyObj).forEach(entry => {
      // keyObj旧键名允许类型是数组
      let oKeys = Array.isArray(entry[1]) ? entry[1] : [entry[1]]
      // 获取旧键名，即dataKeys的某一个子项
      let oKey = dataKeys.find(dataKey => {
        return oKeys.find(oKey => {
          // 表格标题名（即旧键名）允许含有*和空格
          return dataKey.replace(/[* ]/g, '') === oKey
        })
      })
      
      nObj[entry[0]] = dataObj[oKey] || ''
    })
  }
  
  return nObj
}
/**
 * 将dataArr的键名替换为keyObj里的对应值
 * @param {Array} dataArr
 * @param {Object} keyObj
 * @param {Boolean} isKeyObj
 * @returns {Array}
 * @example see @/views/order/orderImport
 * @description 改变Obj数据的key
 */
export function changeArrKey(dataArr, keyObj, isKeyObj = false) {
  return dataArr.map(item => {
    return changeObjKey(item, keyObj, isKeyObj)
  })
}