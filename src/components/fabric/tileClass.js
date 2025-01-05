import { validData } from '@/components/avue/utils/util'
import { findIndex } from 'lodash'
import { delGroupList, getAfterRotateSize } from '@/utils'

export const TileClass = class TileClass {
  constructor() {
  }

  async baseTile(tileType, curLayer, instance) {
    //curLayer为空时，返回
    if (!curLayer) return [true, null]
    const canvas = this.getCanvas(instance)
    if (tileType === undefined) {
      this.delGroupList(canvas, this.getObjects(canvas), curLayer)
      return [true, null]
    }
    //格式化当前激活对象 curLayer
    this.formatCurLayer(curLayer)
    //获取x轴和y轴的平铺数量
    const { x: hTotalNum, y: vTotalNum } = this.getTileFillNumInXAndY({ curLayer, canvas })
    //填充所有方向的平铺
    const pArr = this.fillAllPosTileImg({
      canvas,
      curLayer,
      hTotalNum,
      vTotalNum,
      tileType
    })
    const groupData = await Promise.all(pArr)
    const groupId = `${curLayer.id}Group`
    const existGroup = this.existGroupById(this.getObjects(canvas), groupId)
    // if (existGroup) this.delLastGroupLayer(canvas, this.getObjects(canvas), curLayer)
    if (existGroup) {
      this.delGroupList(canvas, this.getObjects(canvas), curLayer)
      // this.delLastGroupLayer(canvas, this.getObjects(canvas), curLayer)
    }
    // return [true, null]
    //渲染平铺组
    const group = await this.renderTileGroup(groupData, curLayer, canvas)
    //移动组位置并激活组块对应的图片
    this.moveGroupIPos(canvas, this.getObjects(canvas), group, curLayer)
    if(group) group.markBaseTile = true //标记是否是平铺的组
    return [false, { group }]
  }


  getCanvas(instance) {
    return validData(instance.canvas, instance)
  }

  getObjects(canvas) {
    return canvas.getObjects()
  }

  getObjectIndex(objects, curLayer) {
    return findIndex(objects, { id: curLayer.id })
  }

  /**
   * 查找最后一个组层
   * @param objects
   * @param curLayer
   * @returns {null|*}
   */
  findLastGroupLayer(objects, curLayer) {
    if (!curLayer) return null
    const fIndex = this.getObjectIndex(objects, curLayer)
    return validData(objects[fIndex - 1], null)
  }

  /**
   * 删除之前的组图层
   * @param curLayer
   * @param instance
   */
  delGroupLayer(layer, canvas, isRender = true) {
    if (!layer) return
    if (layer.type !== 'group') return
    canvas.remove(layer)
    isRender && canvas.renderAll()
  }

  /**
   * 删除跟激活图层一样的组层
   * @param canvas
   * @param objects
   * @param curLayer
   */
  delGroupList(canvas, objects, curLayer) {
    return delGroupList(canvas, objects, curLayer)
  }

  /**
   * 删除最后一个组层
   * @param canvas
   * @param objects
   * @param curLayer
   */
  delLastGroupLayer(canvas, objects, curLayer) {
    const groupLayer = this.findLastGroupLayer(objects, curLayer)
    this.delGroupLayer(groupLayer, canvas)
  }

  /**
   * 格式化当前激活对象 curLayer
   * @param curLayer
   */
  formatCurLayer(curLayer) {
    if (curLayer.angle < 0) curLayer.angle = curLayer.angle + 360
    curLayer.skewX = 0
    curLayer.skewY = 0
  }

  //渲染group
  async renderTileGroup(groupData, curLayer, canvas) {
    const { x: curLayerX, y: curLayerY } = curLayer.getCenterPoint()
    const group = new fabric.Group(groupData, {
      id: `${curLayer.id}Group`,
      angle: curLayer.angle,
      originX: 'center',
      originY: 'center'
    })
    group.setOptions({
      left: curLayerX,
      top: curLayerY,
      selectable: false
    })
    canvas.add(group)
    canvas.renderAll()
    return group
  }


  // /**
  //  * 获取x轴和y轴的平铺数量
  //  * @param curLayer
  //  * @param canvas
  //  * @returns {{x: number, y: number}}
  //  */
  // getTileFillNumInXAndY({ curLayer, canvas }) {
  //   const { ceil } = Math
  //   const { groupHorizontal: horizontal = 0, groupVertical: vertical = 0 } = curLayer
  //   const { width = 0, height = 0, scaleX = 1, scaleY = 1 } = curLayer
  //   const { width: canvasWidth, height: canvasHeight } = canvas
  //   const [dirWidth, dirHeight] = [width * scaleX + horizontal, height * scaleY + vertical]
  //   const [hTotalNum, vTotalNum] = [ceil(canvasWidth / dirWidth) + 1, ceil(canvasHeight / dirHeight) + 1]
  //   return {
  //     x: hTotalNum,
  //     y: vTotalNum
  //   }
  // }

  /**
   * 获取x轴和y轴的平铺数量
   * @param curLayer
   * @param canvas
   * @returns {{x: number, y: number}}
   */
  getTileFillNumInXAndY({ curLayer, canvas }) {
    const { ceil } = Math
    const { groupHorizontal: horizontal = 0, groupVertical: vertical = 0, angle } = curLayer
    const { width = 0, height = 0, scaleX = 1, scaleY = 1 } = curLayer
    const { width: canvasWidth, height: canvasHeight } = canvas
    const [dirWidth, dirHeight] = [width * scaleX + horizontal, height * scaleY + vertical]
    //获取画布旋转之后的宽度和高度
    const {
      naturalWidth,
      naturalHeight
    } = getAfterRotateSize({
      width: canvasWidth,
      height: canvasHeight
    }, angle, { x: 0, y: 0 })
    const formatHalfW =  naturalWidth / 2
    const formatHalfH =  naturalHeight / 2
    const [hTotalNum, vTotalNum] = [ ceil(formatHalfW / dirWidth) + 1, ceil(formatHalfH / dirHeight) + 1]
    return {
      x: hTotalNum,
      y: vTotalNum
    }
  }

  /**
   * 填充所有方向的平铺
   * @param curLayer
   * @param hTotalNum
   * @param vTotalNum
   * @param tileType
   * @returns {*[]}
   */
  fillAllPosTileImg({ canvas, curLayer, hTotalNum, vTotalNum, tileType }) {
    const {  abs, round } = Math
    const { left, top, scaleX, scaleY, width, height, groupHorizontal: horizontal = 0, groupVertical: vertical = 0 } = curLayer
    const [realW, realH] = [width * scaleX + horizontal, height * scaleY + vertical]
    let dirHNum = (left - canvas.getWidth() / 2) / realW
    let dirVNum = (top - canvas.getHeight() / 2) / realH
    const calcNum = Math.sqrt(dirHNum * dirHNum + dirVNum * dirVNum)
    //两端同时加上唯一的块
    // dirHNum = 0
    // dirVNum = 0
    hTotalNum = hTotalNum + round(abs(calcNum))
    vTotalNum = vTotalNum + round(abs(calcNum))
    //promise列表
    let pArr = []
    //hPosNum vPosNum 1标识x轴y轴正方向 -1表示x轴y轴负方向
    this.fillTileImg({
      curLayer,
      hTotalNum,
      vTotalNum,
      tileType,
      pArr,
      hPosNum: 1,
      vPosNum: 1
    })

    this.fillTileImg({
      curLayer,
      hTotalNum,
      vTotalNum,
      tileType,
      pArr,
      hPosNum: -1,
      vPosNum: -1,
      hAndVLine0Continue: true
    })

    this.fillTileImg({
      curLayer,
      hTotalNum,
      vTotalNum,
      tileType,
      pArr,
      hPosNum: -1,
      vPosNum: 1,
      hLine0Continue: true,
      vLine0Continue: true
    })
    this.fillTileImg({
      curLayer,
      hTotalNum,
      vTotalNum,
      tileType,
      pArr,
      hPosNum: 1,
      vPosNum: -1,
      hLine0Continue: true,
      vLine0Continue: true
    })
    return pArr
  }

  /**
   * 根据方向填充平铺
   * @param curLayer
   * @param hTotalNum
   * @param vTotalNum
   * @param tileType
   * @param hPosNum
   * @param vPosNum
   * @param pArr
   * @param hLine0Continue
   * @param vLine0Continue
   * @param hAndVLine0Continue
   */
  fillTileImg(
    {
      curLayer,
      hTotalNum,
      vTotalNum,
      tileType,
      hPosNum,
      vPosNum,
      pArr,
      hLine0Continue,
      vLine0Continue,
      hAndVLine0Continue
    }) {
    const {
      width = 0,
      height = 0,
      scaleX = 1,
      scaleY = 1,
      groupHorizontal: horizontal = 0,
      groupVertical: vertical = 0
    } = curLayer

    let dirWidth = (width * scaleX + horizontal) * hPosNum
    let dirHeight = (height * scaleY + vertical) * vPosNum

    if (tileType === 2) dirWidth += horizontal * hPosNum
    if (tileType === 3) dirHeight += vertical * vPosNum

    for (let i = 0; i < hTotalNum; i++) {
      if (i == 0 && hLine0Continue) continue
      for (let j = 0; j < vTotalNum; j++) {
        if (j == 0 && vLine0Continue) continue
        if (i == 0 && j == 0 && hAndVLine0Continue) continue
        const cloneObject = this.clone(curLayer, {}, (o) => {
          o.setOptions({
            angle: 0,
            scaleX,
            scaleY,
            left: o.left + i * dirWidth,
            top: o.top + j * dirHeight
          })
          if (tileType === 1) {
            if (i % 2) o.flipX = !o.flipX
            if (j % 2) o.flipY = !o.flipY
          }
          if (tileType === 2 && j % 2) {
            if ((hPosNum === -1 && vPosNum === 1) || (hPosNum === 1 && vPosNum === -1)) {
              o.left -= horizontal * hPosNum
            } else {
              o.left += horizontal * hPosNum
            }
          }
          if (tileType === 3 && i % 2) {
            if ((hPosNum === 1 && vPosNum === -1) || (hPosNum === -1 && vPosNum === 1)) {
              o.top -= vertical * vPosNum
            } else {
              o.top += vertical * vPosNum
            }
          }
        })
        pArr.push(cloneObject)
      }
    }
  }

  /**
   * 移动组位置并激活组块对应的图片
   * @param c
   * @param group
   * @param curLayer
   */
  moveGroupIPos(canvas, objects, group, curLayer) {
    let fIndex = this.getObjectIndex(objects, curLayer)
    group.moveTo(fIndex)
    canvas.setActiveObject(curLayer)
    canvas.renderAll()
  }


  /**
   * 根据Id判断是否存在组
   * @param id
   * @returns {boolean|*}
   */
  existGroupById(objects, id) {
    const fIndex = objects.findIndex((obj) => obj.id == id)
    if (fIndex >= 0) return objects[fIndex]
    return false
  }

  /**
   * 复制图层
   * @param curLayer
   * @param option
   * @param cb
   * @returns {Promise<unknown>}
   */
  clone(curLayer, option, cb) {
    return new Promise(reslove => {
      curLayer.clone((o) => {
        cb && cb(o)
        reslove(o)
      })
    })
  }
}
