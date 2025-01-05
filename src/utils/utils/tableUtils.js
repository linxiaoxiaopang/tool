import { isPlainObject, isNumber, flatten, isArray } from 'lodash'
//[{a: [b]}, {c: [d], e: [f]}] [[{a: []}], []]
/**
 * @description: 创建row 合并
 * @param {*} row table row
 * @param {*} column table  column
 * @param {*} rowIndex table rowIndex
 * @param {Array} data 列表页渲染的数据
 * @param {Object} option {
 *  props： [
    [
      { id: ['combinedInfo', 'createByName', 'createTime', 'done'] },
      { combinedColorName: ['combinedColorName'] }]
    ]
  ]
    二维数组 描述row property 中之间的映射关系

  closSpan:{
    combinedInfo: 5 //重置对应键值合并的clo
  }

 * }
 * @return {Array} span 合并的数组
 */

//示例
/** createSpanMethod(
 { row, column, rowIndex },
 this.finalData,
 {
  props: [
    [{ id: ['combinedInfo', 'createByName', 'createTime', 'done'] }, { combinedColorName: ['combinedColorName'] }]
  ],
  closSpan:{
    combinedInfo: 5
  }
})
 **/


export function createSpanMethod({ row, column, rowIndex, columnIndex }, data = [], option) {
  const cacheProp = `span_${rowIndex}_${columnIndex}`
  //使用缓存关系，缓存存储在$markSpanMethodObj对象中
  // const spanList = $GET(row, `$markSpanMethodObj.${cacheProp}.spanList`, null)
  // if (spanList) return spanList

  if (isArray(option)) option.props = option
  if (!option.rowHeaderOption) option.rowHeaderOption = {}
  const {
    props = [],
    emptyProp = 'done',
    closSpan = {},
    rowHeaderOption: {
      columnList = [],
      mergeProp = '$selection',
      hasSelection = true,
      hasMenu = true
    }
  } = option
  let { property = 'done' } = column
  if (!property) property = emptyProp
  //当存在头部的情况
  if (existHeader(row)) return dealWithIsHeaderProps(data, columnList, hasMenu, { row, column, rowIndex, columnIndex })
  const headerCount = data.slice(0, rowIndex + 1).filter(row => existHeader(row)).length
  data = data.filter(row => !existHeader(row))
  if (headerCount > 0) {
    if (property === mergeProp) return [0, 1]
    const findIndex = columnList.findIndex(({ prop }) => prop === mergeProp)
    let nextIndex = findIndex + 1
    if (findIndex === -1 && hasSelection) nextIndex = 1
    if (nextIndex === columnIndex) return [1, 2]
  }
  //获取要合并的propert映射的筛选条件
  const filterProps = getMappingFilterPorp(property, props)
  //未匹配，表示未合并的单元格
  if (!filterProps.length) return [1, 1]
  //将符合筛选条件的连续数据分组
  const splitData = getSplitData(data, row, filterProps)
  //获取到要合并的条数
  const mergeCount = getMergeCount(splitData, rowIndex - headerCount)

  let cloCount = 1
  //重置column方向合并的条数
  // if (isPlainObject(closSpan) && isNumber(closSpan[property])) cloCount = closSpan[property]
  // if (!row.$markSpanMethodObj) row.$markSpanMethodObj = {}
  // if (!row.$markSpanMethodObj[cacheProp]) row.$markSpanMethodObj[cacheProp] = {}
  // row.$markSpanMethodObj[cacheProp].spanList = [mergeCount, cloCount]
  return [mergeCount, cloCount]
}

export function dealWithIsHeaderProps(data, columnList, hasMenu, { row, column, rowIndex, columnIndex }) {
  if (columnIndex == 0) {
    return [1, 1]
  }
  if (columnIndex == 1) {
    return [1, columnList.length + (hasMenu ? 1 : 0)]
  }
  return [0, 0]
}

/**
 * @description: 获取筛选条件
 * @param {String} property
 * @param {Array} props 二维数组 筛选所有属性的交集
 * @return {Array}
 */

export function getMappingFilterPorp(property, props) {
  let filterProps = []
  ;(() => {
    const len = props.length
    for (let i = 0; i < len; i++) {
      let arr = props[i]
      const len1 = arr.length
      for (let j = 0; j < len1; j++) {
        let item = arr[j]
        const isFind = flatten(Object.values(item)).includes(property)
        if (!isFind) filterProps.push(...Object.keys(item))
        if (isFind) {
          for (let key in item) {
            if (item[key].includes(property)) return filterProps.push(key)
          }
        }
      }
    }
    filterProps = []
  })()
  return filterProps
}

/**
 * @description: 按照索引值拆分数组
 * @param {Array} data 列表数据
 * @param {Object} row
 * @param {Array} filterProps 筛选列表
 * @return {Array}
 */
export function getSplitData(data, row, filterProps) {
  let preIndex = -1
  let splitData = []
  data.map((item, index) => {
    const isSame = filterProps.every((prop) => $GET(item, prop, undefined) == $GET(row, prop, undefined))
    if (!isSame) return
    if (preIndex == -1 || preIndex != index - 1) {
      splitData.push([])
    }
    preIndex = index
    splitData.slice(-1)[0].push(index)
  })
  return splitData
}

/**
 * @description: 获取row合并的数值
 * @param {Array} splitData
 * @param {Number} rowIndex
 * @return {Number}
 */
export function getMergeCount(splitData, rowIndex) {
  const findData = splitData.find((indexData) => indexData.includes(rowIndex))
  if (!findData) return 1
  if (findData[0] == rowIndex) return findData.length
  return 0
}

/**
 * 是否存在header的Cols
 * @param row
 * @returns {boolean}
 */
export function existHeader(row) {
  const headerColKeys = ['isHeader', '$isHeader', 'isTitle', '$isTitle']
  return headerColKeys.some(prop => row[prop])
}
