import { isPlainObject } from 'lodash'

export default {
  inserted(el, binding) {
    let {value, arg } = binding
    if (arg === 'disabled') return
    value = normalizeOption(value)
    if (value.className) el.classList.add(value.className)
    createSticky(el, binding)
  },

  componentUpdated(el, binding) {
    createSticky(el, binding)
  },

  unbind(el, binding) {
    let {value, arg } = binding
    if (arg === 'disabled') return
    value = normalizeOption(value)
    if (value.className) el.classList.remove(value.className)
  }
}

function createSticky(el, binding) {
  let { arg } = binding
  if (arg === 'disabled') return
  let overflowDom = el.parentNode
  while (overflowDom && !hasScrolled(overflowDom)) {
    const overflow = window.getComputedStyle(overflowDom).overflow
    if (overflow) overflowDom.style.overflow = 'initial'
    // 相对于谁滚动，就把谁和粘性定位之间的各个父级元素overflow设置为initial
    if (overflowDom.className.includes('app-container') || overflowDom.className.includes('hook:sticky-container')) {
      overflowDom = null
      break
    }
    overflowDom = overflowDom.parentNode
  }
}

function normalizeOption(option) {
  if (!option) return {}
  if (!isPlainObject(option)) return { className: option }
  return option
}

function hasScrolled(ele, dir = 'vertical') {
  // 判断的方向是否设置了overflow: hidden
  let style = window.getComputedStyle(ele)
  if ((dir == 'vertical' && style.overflowY == 'hidden')
    ||
    (dir == 'horizontal' && style.overflowX == 'hidden')
  ) return false

  // 在判断完overflow不为hidden后，再通过两个属性来判断。
  if (dir == 'vertical') {
    return (ele.scrollHeight > ele.clientHeight)
  } else {
    return (ele.scrollWidth > ele.clientWidth)
  }
}
