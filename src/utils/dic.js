/* eslint-disable */
import { cloneDeep } from 'lodash'
import { validatenull } from '@/components/avue/utils/validate'

const DEFAULT_PROPS = {
  label: 'label',
  value: 'value',
  children: 'children'
}
export function formatDic(dic, props, isClone) {
  if (validatenull(dic)) return []
  
  dic = isClone ? cloneDeep(dic) : dic
  const { label, value, children } = Object.assign({}, DEFAULT_PROPS, props || {})
  function format(dic) {
    for (const item of dic) {
      item.label = item[label]
      item.value = item[value]
      item.children = item[children]
      item.leaf = validatenull(item.children)
      if (item.children) {
        item.children = format(item.children)
      }
    }
    return dic
  }
  format(dic)
  return dic
}