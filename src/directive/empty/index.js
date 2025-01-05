import Vue from 'vue'
import empty from '@/components/base/empty'
import { validatenull } from '@/components/avue/utils/validate'
import { isArray } from 'lodash'
import { validData } from '@/components/avue/utils/util'

const DEFAULT_ARG = 'data'

export default {
  bind(el, binding) {
    let { arg } = binding
    arg = validData(arg, DEFAULT_ARG)
    const EmptyConstructor = Vue.extend(empty)
    const emptyInstance = new EmptyConstructor({
      el: document.createElement('div'),
      propsData: {
        type: arg
      }
    })
    el.emptyInstance = emptyInstance
    el.emptyInstanceEl = emptyInstance.$el
  },

  inserted(...args) {
    renderEmptyDom(...args)
  },

  componentUpdated(...args) {
    renderEmptyDom(...args)
  },

  unbind(el) {
    if (el.emptyInstanceEl && el.emptyInstanceEl.parentNode) el.emptyInstanceEl.parentNode.removeChild(el.emptyInstanceEl)
    el.emptyInstance && el.emptyInstance.$destroy()
    el.emptyInstance = null
    el.emptyInstanceEl = null
  }
}

/**
 * 渲染空白占位
 * @param args
 * @returns {void|*|ActiveX.IXMLDOMNode}
 */
function renderEmptyDom(...args) {
  const [el, binding] = args
  let { value } = binding
  if (!isArray(value)) return
  const emptyEl = [...el.childNodes].find(node => node === el.emptyInstanceEl)
  if (validatenull(value)) {
    if (emptyEl) return
    return el.appendChild(el.emptyInstanceEl)
  }
  if (emptyEl) emptyEl.parentNode.removeChild(emptyEl)
}
