import { isElement } from 'lodash'
import { setPx, validData } from '@/components/avue/utils/util'

export const DrawPosInImageClass = class {
  constructor(
    {
      container,
      callback,
      disabled,
      drawBoxStyle = {}
    }
  ) {
    this.container = container
    this.drawBoxStyle = validData(drawBoxStyle, {})
    this.drawBox = this.createDrawBox()
    this.drawBoxShow = false
    this.containerWidth = this.container.offsetWidth
    this.containerHeight = this.container.offsetHeight
    this.width = 0
    this.height = 0
    this.isMoving = false
    this.callback = callback
    this.range = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
    this.anchorPos = {
      x: 0,
      y: 0
    }
    this.startPos = {
      x: 0,
      y: 0
    }
    this.endPos = {
      x: 0,
      y: 0
    }

    //重置this无法解绑，保存bind返回的新函数引用,方便解绑
    this.hanlder = {
      mousedown: this.mousedown.bind(this),
      mouseup: this.mouseup.bind(this),
      mousemove: this.mousemove.bind(this)
    }
    this.disabled = disabled
    this.init()
    this.callback && this.callback(this)
  }

  updateCursor(cursor = 'crosshair') {
    this.container.style.cursor = cursor
  }

  get disabled() {
    return !!this.cacheDisabled
  }

  set disabled(newVal) {
    if (newVal) {
      this.unbind()
      this.updateCursor('default')
    } else {
      this.bind()
      this.updateCursor()
    }
    this.cacheDisabled = newVal
  }

  init() {
    if (!this.disabled) this.bind()
    this.updateRange()
    this.toggleDrawBox()
  }

  createDrawBox() {
    const drawBox = document.createElement('div')
    const fillStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 2000,
      display: 'none',
      border: '2px solid red',
      boxSizing: 'border-box'
    }
    Object.assign(drawBox.style, fillStyle, this.drawBoxStyle)
    this.container.append(drawBox)
    return drawBox
  }

  //延迟设置
  waitUpdateDrawBoxPos(...args) {
    setTimeout(() => {
      this.updateDrawBoxPos(...args)
    }, 40)
  }

  /**
   * 更新位置
   * @param x
   * @param y
   * @param width
   * @param height
   */
  updateDrawBoxPos(
    {
      x,
      y,
      width,
      height,
      display = 'block'
    }) {
    this.width = width
    this.height = height
    this.anchorPos = {
      x,
      y
    }
    this.startPos = {
      x,
      y
    }
    this.endPos = {
      x: width,
      y: height
    }
    Object.assign(this.drawBox.style, {
      left: setPx(this.anchorPos.x),
      top: setPx(this.anchorPos.y),
      width: setPx(width),
      height: setPx(height)
    })
    this.toggleDrawBox(display)
  }

  updateRange() {
    if (!isElement(this.container)) new Error('container必须是dom')
    const { offsetWidth, offsetHeight } = this.container
    const { left, top } = this.range
    this.range.right = left + offsetWidth
    this.range.bottom = top + offsetHeight
  }

  toggleDrawBox(display = 'none') {
    if (!this.drawBox) return new Error('container必须是dom')
    this.drawBox.style.display = display
    this.drawBoxShow = !(display === 'none')
  }

  bind() {
    this.container.addEventListener('mousedown', this.hanlder.mousedown)
    document.addEventListener('mouseup', this.hanlder.mouseup)
  }

  unbind() {
    this.container.removeEventListener('mousedown', this.hanlder.mousedown)
    document.removeEventListener('mouseup', this.hanlder.mouseup)
  }

  mousedown(evt) {
    const { pageX, pageY } = this.formatPageXAndY(evt)
    this.startPos = {
      x: pageX,
      y: pageY
    }
    this.anchorPos = {
      x: pageX,
      y: pageY
    }
    this.isMoving = true
    this.width = 0
    this.height = 0
    this.toggleDrawBox('block')
    Object.assign(this.drawBox.style, {
      left: setPx(pageX),
      top: setPx(pageY),
      width: 0,
      height: 0
    })
    document.addEventListener('mousemove', this.hanlder.mousemove)
  }

  mousemove(evt) {
    //阻止默认行为
    evt.preventDefault()
    const { min, max, abs } = Math
    const { pageX, pageY } = this.formatPageXAndY(evt)
    if (pageX < 0 || pageY < 0) return
    const { range, startPos, endPos, anchorPos } = this
    const diffStyle = {}
    if (pageX <= anchorPos.x) {
      startPos.x = pageX
      diffStyle.left = setPx(startPos.x)
    } else {
      //重置left
      if (this.drawBox.style.left != anchorPos.x) {
        startPos.x = anchorPos.x
        diffStyle.left = setPx(anchorPos.x)
      }
      endPos.x = pageX
    }
    if (pageY <= anchorPos.y) {
      startPos.y = pageY
      diffStyle.top = setPx(startPos.y)
    } else {
      //重置top
      if (this.drawBox.style.top != anchorPos.y) {
        startPos.x = anchorPos.x
        diffStyle.top = setPx(anchorPos.y)
      }
      endPos.y = pageY
    }
    this.width = abs(max(min(max(pageX, 0), range.right), range.left) - anchorPos.x)
    this.height = abs(max(min(max(pageY, 0), range.bottom), range.top) - anchorPos.y)
    Object.assign(this.drawBox.style, {
      width: setPx(this.width),
      height: setPx(this.height),
      ...diffStyle
    })
  }

  mouseup() {
    this.isMoving = false
    document.removeEventListener('mousemove', this.hanlder.mousemove)
  }

  formatPageXAndY(evt) {
    const { pageX, pageY } = evt
    const { left, top } = this.getOffset()
    return {
      pageX: pageX - left,
      pageY: pageY - top
    }
  }

  getOffset() {
    const box = this.container.getBoundingClientRect()
    return {
      left: box.left + (window.scrollX - document.documentElement.clientLeft),
      top: box.top + (window.scrollY - document.documentElement.clientTop)
    }
  }
}
