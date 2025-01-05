import { DrawPosInImageClass } from '@/utils/utils/drawPosInImageClass'
import { isString, isPlainObject } from 'lodash'

export default {
  inserted(el, binding, vNode) {
    const { value, arg, modifiers } = binding
    const { disabled, firstTimeRender = false } = modifiers
    const option = {}
    if (arg === 'callback') {
      option.callback = value
    }
    const instance = new DrawPosInImageClass({
      container: el,
      disabled: !!disabled,
      ...option
    })
    instance.firstTimeRender = firstTimeRender
    if (arg !== 'callback') {
      if (isPlainObject(value)) {
        value.instance = instance
      } else if (isString(value)) {
        vNode.context[value] = instance
      }
    }
    el.drawPosInImageInstance = instance
  },

  componentUpdated(el) {
    //重置宽度高度
    // el.style.height = 'auto'
    setTimeout(() => {
      const { offsetWidth, offsetHeight, drawPosInImageInstance } = el
      if (offsetWidth !== drawPosInImageInstance.containerWidth || offsetHeight !== drawPosInImageInstance.containerHeight) {
        drawPosInImageInstance.containerWidth = offsetWidth
        drawPosInImageInstance.containerHeight = offsetHeight
        if(drawPosInImageInstance.firstTimeRender) {
          drawPosInImageInstance.toggleDrawBox()
        }
        drawPosInImageInstance.firstTimeRender = true
        drawPosInImageInstance.updateRange()
      }
    }, 20)
  },

  unbind(el) {
    //解绑事件
    el.drawPosInImageInstance.unbind()
    //清除实例
    el.drawPosInImageInstance = null
  }
}
