/* eslint-disable */
import { get } from 'lodash'

// v-infinite-scroll是否出现滚动条
export function isScroll(scrollEle) {
  const container = get(scrollEle, '$el.ElInfiniteScroll.container') || get(scrollEle, 'ElInfiniteScroll.container') || container
  if (!container) return null
  
  const { offsetHeight, scrollHeight } = container
  return offsetHeight < scrollHeight
}