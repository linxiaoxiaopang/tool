/* eslint-disable */

export function scrollView({ target, container = 'appMain', offset, ...option } = {}) {
  // console.log(target, container)
  const eleList = [target, container]
  let err
  const [targetEle, containerEle] = eleList.map(ele => {
    if (typeof ele === 'string') ele = document.getElementById(ele)
    if (ele instanceof Element) {
      return ele
    }
    err = 'target和container应为DOM元素id或者DOM元素'
  })
  // console.log(targetEle, containerEle)
  if (err) throw err
  
  // 无偏差时直接使用scrollIntoView
  if (!offset) return target.scrollIntoView({ alignToTop: true, behavior: 'smooth', block: 'start', inline: 'nearest', ...option })
  
  let offsetTop = 0
  let offsetParent = targetEle
  while (offsetParent && offsetParent !== containerEle && containerEle.contains(offsetParent)) {
    // console.log('offsetParent', offsetParent)
    offsetTop += offsetParent.offsetTop
    offsetParent = offsetParent.offsetParent
    // if (!offsetParent || offsetParent === containerEle) break
  }
  // console.log(offsetTop)
  // console.log(containerEle.scrollTop, targetEle.offsetTop)
  containerEle.scroll({ top: offsetTop + offset, behavior: 'smooth' })
}