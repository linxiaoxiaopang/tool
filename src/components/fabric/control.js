/* eslint-disable */
import { DESIGN_SHOW_AREA_H, DESIGN_SHOW_AREA_W } from '@/utils/constant'

const ICON_SIZE = 20,
  HALF_ICON_SIZE = ICON_SIZE / 2

const rotate = require('@/assets/images/rotate.png')
const scaleTlBr = require('@/assets/images/scale_tl_br.png')
const scaleMtMb = require('@/assets/images/scale_mt_mb.png')
const scaleMlMr = require('@/assets/images/scale_ml_mr.png')
const scaleTrBl = require('@/assets/images/scale_tr_bl.png')

const controlsUtils = fabric.controlsUtils,
  scaleSkewStyleHandler = controlsUtils.scaleSkewCursorStyleHandler,
  scaleStyleHandler = controlsUtils.scaleCursorStyleHandler,
  scalingEqually = controlsUtils.scalingEqually,
  scalingYOrSkewingX = controlsUtils.scalingYOrSkewingX,
  scalingXOrSkewingY = controlsUtils.scalingXOrSkewingY,
  scaleOrSkewActionName = controlsUtils.scaleOrSkewActionName,
  objectControls = fabric.Object.prototype.controls

const defaultIcon = loadIcon(scaleTlBr),
  rotateIcon = loadIcon(rotate),
  scaleTlBrIcon = loadIcon(scaleTlBr),
  scaleMlMbIcon = loadIcon(scaleMtMb),
  scaleMlMrIcon = loadIcon(scaleMlMr),
  scaleTrBlIcon = loadIcon(scaleTrBl)

// objectControls.transparentCorners = false
// objectControls.cornerColor = 'red'
// objectControls.cornerStyle = 'circle'

// function deleteObject(eventData, transform) {
//   var target = transform.target
//   var canvas = target.canvas
//   canvas.remove(target)
//   canvas.requestRenderAll()
// }

export const Control = class Control {
  constructor(canvas) {
    this.canvas = canvas
  }

  //渲染图标
  static renderIcon(ctx, left, top, styleOverride, fabricObject, icon) {
    styleOverride = styleOverride || {}
    var xSize = this.sizeX || styleOverride.cornerSize || fabricObject.cornerSize,
      ySize = this.sizeY || styleOverride.cornerSize || fabricObject.cornerSize,
      transparentCorners =
        typeof styleOverride.transparentCorners !== 'undefined'
          ? styleOverride.transparentCorners
          : fabricObject.transparentCorners,
      methodName = transparentCorners ? 'stroke' : 'fill',
      stroke = !transparentCorners && (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor),
      myLeft = left,
      myTop = top,
      size
    ctx.save()
    ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor
    ctx.strokeStyle = styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor
    // as soon as fabric react v5, remove ie11, use proper ellipse code.
    if (xSize > ySize) {
      size = xSize
      ctx.scale(1.0, ySize / xSize)
      myTop = (top * xSize) / ySize
    } else if (ySize > xSize) {
      size = ySize
      ctx.scale(xSize / ySize, 1.0)
      myLeft = (left * ySize) / xSize
    } else {
      size = xSize
    }
    // this is still wrong
    ctx.lineWidth = 1
    ctx.beginPath()
    // ctx.arc(myLeft, myTop, size / 2, 0, 2 * Math.PI, false);
    ctx.translate(myLeft, myTop)
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
    ctx.drawImage(icon || defaultIcon, -size / 2, -size / 2, size, size)
    ctx[methodName]()
    if (stroke) {
      ctx.stroke()
    }
    ctx.restore()
  }

  static mtrMouseDownHandler(eventData, transformData, x, y) {
    const target = transformData.target
    const { width, height, scaleX, scaleY, angle } = target
    const { x: left, y: top } = target.getCenterPoint()
    let circle = new fabric.Circle({
      top: top,
      left: left,
      fill: 'rgba(255, 255, 255, 0)',
      stroke: '#1890ff',
      strokeWidth: 2,
      color: '#3841DB',
      originX: 'center',
      originY: 'center',
      radius: Math.max(width * scaleX * 0.5, height * scaleY * 0.5)
    })

    let textbox = new fabric.Textbox((+angle || 0).toFixed(2) + '', {
      top: top,
      left: left,
      textBackgroundColor: '#3841DB',
      originX: 'center',
      originY: 'center',
      fontSize: 20,
      id: 'textbox',
      fill: '#fff',
      textAlign: 'center',
      editable: false
    })

    target.canvas.add(textbox)
    target.canvas.add(circle)
    target.canvas.renderAll()
    return true
  }

  static mtrMouseUpHandler(eventData, transformData, x, y) {
    const target = transformData.target
    target.canvas.renderAll()
    return true
  }

  //初始化的icon
  initOriginControl() {
    this.oMl(scaleMlMrIcon)
    this.oMr(scaleMlMrIcon)
    this.oMb(scaleMlMbIcon)
    this.oMt(scaleMlMbIcon)
    this.oTl(scaleTlBrIcon)
    this.oTr(scaleTrBlIcon)
    this.oBr(scaleTlBrIcon)
    this.oBl(scaleTrBlIcon)
    this.oMtr(rotateIcon)
  }

  //移动时候的icon
  initMoveControl() {
    this.tl(scaleTlBrIcon)
    this.br(scaleTlBrIcon)
    this.mtr(rotateIcon)
  }

  oMl(icon) {
    objectControls.ml = new fabric.Control({
      x: -0.5,
      y: 0,
      sizeX: ICON_SIZE,
      sizeY: ICON_SIZE,
      cursorStyleHandler: scaleStyleHandler,
      actionHandler: scalingXOrSkewingY,
      getActionName: scaleOrSkewActionName,
      render: function (ctx, left, top, styleOverride, fabricObject) {
        Control.renderIcon.call(this, ctx, left, top, styleOverride, fabricObject, icon)
      }
    })
  }

  oMr(icon) {
    objectControls.mr = new fabric.Control({
      x: 0.5,
      y: 0,
      sizeX: ICON_SIZE,
      sizeY: ICON_SIZE,
      cursorStyleHandler: scaleSkewStyleHandler,
      actionHandler: scalingXOrSkewingY,
      getActionName: scaleOrSkewActionName,
      render: function (ctx, left, top, styleOverride, fabricObject) {
        Control.renderIcon.call(this, ctx, left, top, styleOverride, fabricObject, icon)
      }
    })
  }

  oMb(icon) {
    objectControls.mb = new fabric.Control({
      x: 0,
      y: 0.5,
      sizeX: ICON_SIZE,
      sizeY: ICON_SIZE,
      cursorStyleHandler: scaleSkewStyleHandler,
      actionHandler: scalingYOrSkewingX,
      getActionName: scaleOrSkewActionName,
      render: function (ctx, left, top, styleOverride, fabricObject) {
        Control.renderIcon.call(this, ctx, left, top, styleOverride, fabricObject, icon)
      }
    })
  }

  oMt(icon) {
    objectControls.mt = new fabric.Control({
      x: 0,
      y: -0.5,
      sizeX: ICON_SIZE,
      sizeY: ICON_SIZE,
      cursorStyleHandler: scaleSkewStyleHandler,
      actionHandler: scalingYOrSkewingX,
      getActionName: scaleOrSkewActionName,
      render: function (ctx, left, top, styleOverride, fabricObject) {
        Control.renderIcon.call(this, ctx, left, top, styleOverride, fabricObject, icon)
      }
    })
  }

  oTl(icon) {
    objectControls.tl = new fabric.Control({
      x: -0.5,
      y: -0.5,
      sizeX: ICON_SIZE,
      sizeY: ICON_SIZE,
      cursorStyleHandler: scaleStyleHandler,
      actionHandler: scalingEqually,
      render: function (ctx, left, top, styleOverride, fabricObject) {
        Control.renderIcon.call(this, ctx, left, top, styleOverride, fabricObject, icon)
      }
    })
  }

  oTr(icon) {
    objectControls.tr = new fabric.Control({
      x: 0.5,
      y: -0.5,
      sizeX: ICON_SIZE,
      sizeY: ICON_SIZE,
      cursorStyleHandler: scaleStyleHandler,
      actionHandler: scalingEqually,
      render: function (ctx, left, top, styleOverride, fabricObject) {
        Control.renderIcon.call(this, ctx, left, top, styleOverride, fabricObject, icon)
      }
    })
  }

  oBl(icon) {
    objectControls.bl = new fabric.Control({
      x: -0.5,
      y: 0.5,
      sizeX: ICON_SIZE,
      sizeY: ICON_SIZE,
      cursorStyleHandler: scaleStyleHandler,
      actionHandler: scalingEqually,
      render: function (ctx, left, top, styleOverride, fabricObject) {
        Control.renderIcon.call(this, ctx, left, top, styleOverride, fabricObject, icon)
      }
    })
  }

  oBr(icon) {
    objectControls.br = new fabric.Control({
      x: 0.5,
      y: 0.5,
      sizeX: ICON_SIZE,
      sizeY: ICON_SIZE,
      cursorStyleHandler: scaleStyleHandler,
      actionHandler: scalingEqually,
      render: function (ctx, left, top, styleOverride, fabricObject) {
        Control.renderIcon.call(this, ctx, left, top, styleOverride, fabricObject, icon)
      }
    })
  }

  oMtr(icon) {
    objectControls.mtr = new fabric.Control({
      x: 0,
      y: -0.5,
      actionHandler: controlsUtils.rotationWithSnapping,
      cursorStyleHandler: controlsUtils.rotationStyleHandler,
      withConnection: true,
      actionName: 'rotate',
      sizeX: ICON_SIZE,
      sizeY: ICON_SIZE,
      offsetY: -40,
      mouseDownHandler: Control.mtrMouseDownHandler.bind(this),
      render: function (ctx, left, top, styleOverride, fabricObject) {
        Control.renderIcon.call(this, ctx, left, top, styleOverride, fabricObject, icon)
      }
    })
  }

  //移动时候的控制器
  tl(icon) {
    const activeObject = this.canvas.getActiveObject()
    const { moveL, moveT } = getTlMoveLAndMoveTByActiveObject(activeObject)
    objectControls.tl = new fabric.Control({
      x: -0.5,
      y: -0.5,
      sizeX: ICON_SIZE,
      sizeY: ICON_SIZE,
      offsetX: moveL,
      offsetY: moveT,
      cursorStyleHandler: scaleStyleHandler,
      actionHandler: scalingEqually,
      render: function (ctx, left, top, styleOverride, fabricObject) {
        //重新计算位置
        Control.renderIcon.call(this, ctx, left, top, styleOverride, fabricObject, icon)
      }
    })

    function getTlMoveLAndMoveTByActiveObject(activeObject) {
      const { PI, cos, sin } = Math
      const { left: oL, top: oT, width: oW, height: oH, scaleX: oScaleX, scaleY: oScaleY, angle } = activeObject
      let [posLeft, posTop] = [oL - (oW * oScaleX) / 2, oT - (oH * oScaleY) / 2]
      const degreesToRadiansAngle = fabric.util.degreesToRadians(angle)
      const { x, y } = fabric.util.rotatePoint({ x: posLeft, y: posTop }, { x: oL, y: oT }, degreesToRadiansAngle)
      if (angle) {
        let character = 1

        if (angle > 90 && angle < 270) {
          character = -1
        }

        posLeft = (x / cos((PI / 180) * -angle)) * character - (HALF_ICON_SIZE / cos((PI / 180) * -angle)) * character
        posTop = (y / cos((PI / 180) * -angle)) * character - (HALF_ICON_SIZE / cos((PI / 180) * -angle)) * character
      } else {
        posLeft = posLeft - HALF_ICON_SIZE
        posTop = posTop - HALF_ICON_SIZE
      }

      let moveL = Math.min(posLeft, 0)
      let moveT = Math.min(posTop, 0)
      if (angle > 90 && x > DESIGN_SHOW_AREA_W) {
        moveL = (x - DESIGN_SHOW_AREA_W) / cos((PI / 180) * -angle) + HALF_ICON_SIZE / cos((PI / 180) * -angle)
      }

      if (angle > 90 && y > DESIGN_SHOW_AREA_H) {
        moveT = (y - DESIGN_SHOW_AREA_H) / cos((PI / 180) * -angle) + HALF_ICON_SIZE / cos((PI / 180) * -angle)
      }
      return {
        moveL: -moveL,
        moveT: -moveT
      }
    }
  }

  //移动时候的控制器
  br(icon) {
    const activeObject = this.canvas.getActiveObject()
    const { moveL, moveT } = getBrMoveLAndMoveTByActiveObject(activeObject)
    objectControls.br = new fabric.Control({
      x: 0.5,
      y: 0.5,
      sizeX: ICON_SIZE,
      sizeY: ICON_SIZE,
      offsetX: moveL,
      offsetY: moveT,
      cursorStyleHandler: scaleStyleHandler,
      actionHandler: scalingEqually,
      render: function (ctx, left, top, styleOverride, fabricObject) {
        //重新计算位置
        Control.renderIcon.call(this, ctx, left, top, styleOverride, fabricObject, icon)
      }
    })

    //重新计算br的位置
    function getBrMoveLAndMoveTByActiveObject(activeObject) {
      const { PI, cos, sin } = Math
      const { left: oL, top: oT, width: oW, height: oH, scaleX: oScaleX, scaleY: oScaleY, angle } = activeObject
      let [posRight, posBottom] = [oL + (oW * oScaleX) / 2, oT + (oH * oScaleY) / 2]
      const degreesToRadiansAngle = fabric.util.degreesToRadians(angle)
      const { x, y } = fabric.util.rotatePoint({ x: posRight, y: posBottom }, { x: oL, y: oT }, degreesToRadiansAngle)
      let moveL = 0
      let moveT = 0
      if (angle) {
        let character = 1

        if (angle > 90 && angle < 270) {
          character = -1
        }

        posRight = x
        posBottom = y
        if (posRight > DESIGN_SHOW_AREA_W) {
          moveL = -(
            ((x - DESIGN_SHOW_AREA_W) / cos((PI / 180) * -angle)) * character +
            (HALF_ICON_SIZE / cos((PI / 180) * -angle)) * character
          )
        }
        if (posBottom > DESIGN_SHOW_AREA_H) {
          moveT = -(
            ((y - DESIGN_SHOW_AREA_H) / cos((PI / 180) * -angle)) * character +
            (HALF_ICON_SIZE / cos((PI / 180) * -angle)) * character
          )
          console.log('moveT', moveT)
        }
      } else {
        posRight = posRight + HALF_ICON_SIZE
        posBottom = posBottom + HALF_ICON_SIZE

        moveL = Math.min(DESIGN_SHOW_AREA_W - posRight, 0)
        moveT = Math.min(DESIGN_SHOW_AREA_H - posBottom, 0)
      }

      if (angle > 90 && x < 0) {
        moveL = x / cos((PI / 180) * -angle) - HALF_ICON_SIZE / cos((PI / 180) * -angle)
        moveL = -moveL
        console.log('moveL', moveL)
      }

      if (angle > 90 && y < 0) {
        moveT = y / cos((PI / 180) * -angle) - HALF_ICON_SIZE / cos((PI / 180) * -angle)
        moveT = -moveT
      }
      return {
        moveL,
        moveT
      }
    }
  }

  mtr(icon) {
    const activeObject = this.canvas.getActiveObject()
    const { moveL, moveT } = getMtrMoveLAndMoveTByActiveObject(activeObject)
    objectControls.mtr = new fabric.Control({
      x: 0,
      y: -0.5,
      actionHandler: controlsUtils.rotationWithSnapping,
      cursorStyleHandler: controlsUtils.rotationStyleHandler,
      withConnection: true,
      actionName: 'rotate',
      sizeX: ICON_SIZE,
      sizeY: ICON_SIZE,
      offsetX: moveL,
      offsetY: moveT,
      mouseDownHandler: Control.mtrMouseDownHandler.bind(this),
      render: function (ctx, left, top, styleOverride, fabricObject) {
        Control.renderIcon.call(this, ctx, left, top, styleOverride, fabricObject, icon)
      }
    })

    //重新计算位置
    function getMtrMoveLAndMoveTByActiveObject(activeObject) {
      const { PI, cos, sin } = Math
      const { left: oL, top: oT, width: oW, height: oH, scaleX: oScaleX, scaleY: oScaleY, angle } = activeObject
      let [posLeft, posTop] = [oL, oT - (oH * oScaleY) / 2]

      const degreesToRadiansAngle = fabric.util.degreesToRadians(angle)

      const p = fabric.util.rotatePoint({ x: posLeft, y: posTop }, { x: oL, y: oT }, degreesToRadiansAngle)
      let { x, y } = p
      if (angle) {
        // let character = 1
        // if (angle > 90 && angle < 270) {
        //   character = -1
        // }
        // posLeft = (x / cos((PI / 180) * -angle)) * character
        // posTop = y
        // posLeft = (posLeft / cos((PI / 180) * -angle)) * character
        // posTop = posTop
      } else {
        posLeft = posLeft
        posTop = posTop
      }

      posTop = posTop - 40 * Math.sin((Math.PI / 180) * -angle)

      let moveL = Math.min(posLeft, 0)
      let moveT = Math.min(posTop, 0)

      if (x - 40 - HALF_ICON_SIZE < 0) {
        console.log('aaaa')
        if (x > 0) {
          moveT = -10 / sin((PI / 180) * -angle)
        } else {
          moveT = (x - 40) * (sin((PI / 180) * -angle) || 1)
          moveL = x - ICON_SIZE
        }
      }

      if (y - 40 - HALF_ICON_SIZE < 0) {
        if (y > 0) {
          moveT = -10 / (cos((PI / 180) * -angle) || 1)
        } else {
          moveT = y / (cos((PI / 180) * -angle) || 1)
        }
      }

      if (x > DESIGN_SHOW_AREA_W - 40 - HALF_ICON_SIZE) {
        if (x < DESIGN_SHOW_AREA_W) {
          moveT = 10 * (sin((PI / 180) * -angle) || 1)
        } else {
          moveT = (x - DESIGN_SHOW_AREA_W + ICON_SIZE) * (sin((PI / 180) * -angle) || 1)
          moveL = x - DESIGN_SHOW_AREA_W + ICON_SIZE
        }
      }

      if (y > DESIGN_SHOW_AREA_H - 40 - HALF_ICON_SIZE) {
        if (y < DESIGN_SHOW_AREA_H) {
          moveT = 10 / cos((PI / 180) * -angle)
        } else if (angle < 90) {
          moveT = (y - DESIGN_SHOW_AREA_H) / sin((PI / 180) * -angle)
        } else {
          moveT = (y - DESIGN_SHOW_AREA_H) / cos((PI / 180) * -angle)
        }
      }
      console.log('moveT')
      console.log('activeObject.height * activeObject.scaleY', activeObject.height * activeObject.scaleY)
      if (angle == 0 && moveT > Math.abs(activeObject.height * activeObject.scaleY)) {
        moveT = 0
      }

      if (angle != 0 && moveT > Math.abs(activeObject.height * activeObject.scaleY)) {
        moveT = 100
      }

      if (moveT >= 0) {
        moveT += 40
      } else {
        moveT -= 40
      }

      return {
        moveT: -moveT,
        moveL: -moveL
      }
    }
  }
}

function getRotatePoint({ rX, rY, oX, oY, angle }) {
  const { PI, cos, sin } = Math
  const rotate = (PI / 180) * -angle
  let x = (rX - oX) * cos(rotate) - (rY - oY) * sin(rotate) + oX
  let y = (rY - oY) * cos(rotate) + (rX - oX) * sin(rotate) + oY
  // console.log(x, y)
  const dirX = x - rX
  const dirY = y - rY
  // console.log(dirX, dirY)
  return {
    dirX,
    dirY,
    x,
    y
  }
}

function loadIcon(url) {
  const img = document.createElement('img')
  img.src = url
  return img
}
