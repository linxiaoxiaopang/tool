import { debounce, isPlainObject, isString, isElement } from 'lodash'
import { setPx } from '@/components/avue/utils/util'

export default {
  inserted(el, binding, vNode) {
    let { value } = binding
    if (!value) return
    if (!isPlainObject(value)) value = { isOpen: true, scrollParentDom: value }
    let { isOpen, scrollParentDom } = value
    if (!isOpen) return
    if (!scrollParentDom) scrollParentDom = '.app-main'
    setTimeout(() => { //开启宏任务，等待dom渲染完成
      if (isString(scrollParentDom)) {
        scrollParentDom = document.querySelector(scrollParentDom)
      }
      if (!scrollParentDom) return
      const shakingHeight = getParentsSpacingNum(el, scrollParentDom)
      const { bottom: appMainBottom } = scrollParentDom.getBoundingClientRect()
      const debounceFunc = debounce(function () {
        const { top } = el.getBoundingClientRect()
        el.style.maxHeight = setPx(appMainBottom - top - shakingHeight)
      }, 40)
      debounceFunc() //第一次手动调用
      scrollParentDom.addEventListener('scroll', debounceFunc)
      vNode.context.$once('hook:beforeDestroy', () => {
        scrollParentDom.removeEventListener('scroll', debounceFunc)
      })
    })
  }
}

/**
 * 获取所有祖辈dom的间隔
 * @param el
 * @param scrollParentDom
 * @returns {*}
 */
function getParentsSpacingNum(el, scrollParentDom) {
  const parentDomList = []
  let parentDom = el.parentNode
  while (parentDom && parentDom != scrollParentDom) {
    parentDomList.push(parentDom)
    parentDom = parentDom.parentNode
  }
  parentDomList.push(scrollParentDom)
  return parentDomList.reduce((cur, next) => {
    const isScrollParentDom = next === scrollParentDom
    return cur += getSpacingNumByDom(next, isScrollParentDom ? ['margin'] : [])
  }, 0)
}

/**
 * 获取dom的间隔
 * @param dom
 * @param excludes 不计算的属性
 * @returns {number}
 */
function getSpacingNumByDom(dom, excludes = []) {
  if(!isElement(dom)) return 0
  const domStyle = window.getComputedStyle(dom)
  const propertyList = [
    'padding',
    'border',
    'margin'
  ].filter(property => !excludes.includes(property))

  const suffixList = [
    'top',
    'bottom'
  ]

  return propertyList.reduce((cur, next) => {
    suffixList.map(suffix => {
      const property = `${next}-${suffix}`
      cur += parseInt(domStyle[property])
    })
    return cur
  }, 0)
}
