import { Message } from 'element-ui'
import { isString, isFunction, isNil, isPlainObject, isNumber } from 'lodash'
import { TileClass } from '@/components/fabric/tileClass'
import { createRandomNum } from '@/utils'

const txt = {
  canvasIsNull: 'canvas不能为null',
  layerIsNull: 'layer不能为空'
}

class Utils {
  registeObjectEvent(me, obj) {
    console.log('registeObjectEvent')
    obj.on('mousedown', function (options) {
      me.$emit('object:mousedown', obj, options)
    })
    obj.on('mouseup', function (options) {
      me.$emit('object:mouseup', obj, options)
    })
    obj.on('mousemove', function (options) {
      me.$emit('object:mousemove', obj, options)
    })
    obj.on('mouseover', function (options) {
      me.$emit('object:mouseover', obj, options)
    })
    obj.on('mouseout', function (options) {
      me.$emit('object:mouseout', obj, options)
    })
    obj.on('mousedblclick', function (options) {
      me.$emit('object:mousedblclick', obj, options)
    })
    obj.on('mousewheel', function (options) {
      me.$emit('object:mousewheel', obj, options)
    })
  }
}

const utils = new Utils()
export default utils

export const FabricUtils = class {
  constructor() {
    this.c = null
  }

  get canvas() {
    if (!this.c) {
      Message.error(txt.canvasIsNull)
      return new Error(txt.canvasIsNull)
    }
    return this.c
  }

  get activeObject() {
    return this.canvas.getActiveObject()
  }

  get layers() {
    return this.canvas.getObjects()
  }

  get cacheOpacity() {
    return this.activeObject?.cacheOpacity || 0
  }

  createLayerId(layer) {
    let { width, height, id } = layer
    id = (id || createRandomNum()).toString()
    if (id.indexOf('@') >= 0) {
      return id
    }
    return `${createRandomNum()}@${width}@${height}@_${id}`
  }

  setCanvas(canvas) {
    this.c = canvas
  }

  clearLayers() {
    if (!this.canvas) return
    const objects = this.canvas.getObjects()
    objects.map((o) => {
      this.canvas.remove(o)
    })
    this.renderAll()
  }

  renderAll() {
    this.canvas.renderAll()
  }

  setAngle(option = {}) {
    if (!isPlainObject(option)) option = { angle: option }
    if (!option.layer) option.layer = this.activeObject
    const { layer, angle } = option
    if (!layer) return
    layer.rotate(angle)
    this.renderAll()
  }

  setScale(option = {}) {
    if (!isPlainObject(option)) option = { scale: option }
    if (!option.layer) option.layer = this.activeObject
    const { layer, scaleX, scaleY, scale } = option
    if (!layer) return
    setScaleOfDiffType('scaleX', scaleX)
    setScaleOfDiffType('scaleY', scaleY)
    setScaleOfDiffType('scale', scale)
    this.renderAll()

    function setScaleOfDiffType(type, scale) {
      const { max } = Math
      if (isNil(scale)) return
      if (isNumber(scale)) {
        layer.set({
          [type]: scale
        })
        return
      }
      const { width, height } = layer
      const pxNum = parseFloat(scale)
      scale = pxNum / max(width, height)
      layer.set({
        scaleX: scale,
        scaleY: scale
      })
    }
  }

  setOpacity(option = {}) {
    if (!isPlainObject(option)) option = { opacity: option }
    if (!option.layer) option.layer = this.activeObject
    const { opacity, layer } = option
    if (!layer) return
    layer.set({
      opacity
    })
    this.renderAll()
  }

  setCacheOpacity(option = {}) {
    if (!isPlainObject(option)) option = { cacheOpacity: option }
    if (!option.layer) option.layer = this.activeObject
    let { cacheOpacity, layer } = option
    console.log('layerlayerlayerlayerlayerlayerlayerlayerlayerlayerlayer', layer)
    if (!layer) return
    if (isNil(cacheOpacity)) cacheOpacity = layer.cacheOpacity || 0
    layer.cacheOpacity = cacheOpacity
    this.renderAll()
  }

  setPosition(option = {}) {
    if (!isPlainObject(option)) option = { left: option }
    if (!option.layer) option.layer = this.activeObject
    const { left, top, layer } = option
    if (!isNil(left)) {
      layer.set({
        left
      })
    }
    if (!isNil(top)) {
      layer.set({
        top
      })
    }
    this.renderAll()
  }

  async setTile(option) {
    if (!isPlainObject(option)) option = { tileType: option }
    if (!option.layer) option.layer = this.activeObject
    if (!option.canvas) option.canvas = this.canvas
    let { tileType, layer, canvas, opacityLayer } = option
    if (tileType == -1) tileType = undefined
    if (isString(tileType)) tileType = +tileType
    const res = await new TileClass().baseTile(tileType, layer, canvas)
    const [err, data] = res
    const group = data && data.group
    if (opacityLayer && !err && group && group.getObjects() && group.getObjects().length) {
      const gOs = group.getObjects()
      gOs.map(o => o.set({
        opacity: layer.cacheOpacity || 0
      }))
    }
    this.renderAll()
    return res
  }

  setOpacityTile(...args) {
    let [option, ...restArgs] = args
    if (!isPlainObject(option)) option = { tileType: option }
    if (isNil(option.opacityLayer)) option.opacityLayer = true
    return this.setTile(option, ...restArgs)
  }

  async createImage(image, option = {}) {
    const url = image
    const that = this
    if (isString(url)) {
      return createImageByUrl(url)
    }
    return createImageByDom()

    async function createImageByUrl() {
      return new Promise(resolve => {
        fabric.Image.fromURL(url, (img) => {
          if (isFunction(option)) option = option(img)
          if (!option.id) option.id = that.createLayerId(img)
          if (isNil(option.active)) option.active = true
          const { active, ...restOption } = option
          img.set(restOption)
          if (active && that.canvas) {
            that.canvas.setActiveObject(img)
          }
          resolve(img)
        }, {
          crossOrigin: 'anonymous'
        })
      }).catch(() => {
        Promise.resolve(false)
      })
    }

    function createImageByDom() {
      // 未实行
    }
  }

  setItext(option = {}) {
    if (!isPlainObject(option)) option = { text: option }
    if (!option.layer) option.layer = this.activeObject
    let { layer, ...restOption } = option
    if (!layer) return
    layer.set(restOption)
    this.renderAll()
  }

  createItext(text, option = {}) {
    const defaultOption = { left: 0, top: 0, fill: '#000', editable: false, active: true }
    option = Object.assign(defaultOption, option)
    const { active, ...restOption } = option
    const iText = new fabric.IText(text, restOption)
    if (active && this.canvas) {
      this.canvas.setActiveObject(iText)
    }
    return iText
  }
}
