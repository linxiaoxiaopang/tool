/* eslint-disable */
import {
  DELIVERY_SHIPPING_EXPRESS,
  DELIVERY_SHIPPING_LIST,
  DELIVERY_SHIPPING_STANDARD,
  SHOP_TYPE_SHOPIFY,
  WAIT_RELATION,
  IN_PRODUCTION,
  RETURN_GOODS,
  EXPRESS_WAYBILL_CREATED,
  EXPRESS_WAYBILL_PRINTED,
  EXPRESS_WAYBILL_NOT_CREATE,
  EXPRESS_WAYBILL_CREATE_ERROR
} from '@/utils/constant/order'
import {
  PACKAGE_TYPE_MERGE,
  PACKAGE_TYPE_SPLIT,
  PACKAGE_TYPE_UNHANDLED
} from '@/utils/constant/toaddit'

import { isArray, find, isPlainObject, isFunction } from 'lodash'

import store from '@/store'
import { validData } from '@/components/avue/utils/util'
import { isNil } from 'lodash'
import { getDeliveryShippingType, getExpressWaybillIsCreated } from '@/views/toaddit/order/order/utils/functional'

/**
 * 订单数据是否可以进行重新申请运单号
 * @param row
 * @returns {boolean}
 */
//可以重新进行申请运单的状态
const EXPRESS_WAYBILL_REAPPLY_LIST = {
    //订单状态 生产中 || 退货中
    orderStatus: [IN_PRODUCTION, RETURN_GOODS],
    //运货单面单 已经生成(申请成功) || 生成异常
    expressWaybillIsCreated: [
      EXPRESS_WAYBILL_CREATED,
      EXPRESS_WAYBILL_PRINTED,
      EXPRESS_WAYBILL_NOT_CREATE,
      EXPRESS_WAYBILL_CREATE_ERROR
    ]
  }
export function canExpressReApply(row) {
  const orderStatus = $GET(row, 'orderStatus', '')
  const expressWaybillIsCreated = getExpressWaybillIsCreated(row)
  const orderStatusList = EXPRESS_WAYBILL_REAPPLY_LIST.orderStatus
  const expressWaybillIsCreatedList = EXPRESS_WAYBILL_REAPPLY_LIST.expressWaybillIsCreated
  const isFindOrderStatus = orderStatusList.find((status) => status == orderStatus)
  const isFindExpressWaybillIsCreated = expressWaybillIsCreatedList.find(
    (expressWaybillStatus) => expressWaybillStatus == expressWaybillIsCreated
  )
  if (isFindExpressWaybillIsCreated === 0) return true
  if (!isFindOrderStatus) return false
  return !!isFindExpressWaybillIsCreated
}

/**
 * 根据id获取物流公司的渠道的prop
 * @param id
 * @param prop
 * @returns {*}
 */
export function getShippingMethodListPropOfId(id, prop = 'accountId') {
  const list = store.getters.shippingMethodId || []
  const findItem = find(list, { id })
  return findItem && findItem[prop]
}

/**
 * 获取订单中的产品总数
 * @param orderItemList
 * @returns {*}
 */
export function getOrderTotalProduct(data, prop = 'productCount') {
  data || (data = [])
  if (isPlainObject(data)) {
    data = $GET(data, 'orderItemPartList', [])
  }
  return data.reduce((cur, prev) => {
    if (prev[prop]) cur += prev[prop]
    return cur
  }, 0)
}

/**
 * 对比data和selectionData产品之间dir
 * @param data
 * @param selectionData
 * @returns {(boolean|string)[]}
 */
export function dirTotalProductCount(data, selectionData, selectionDataProp = 'count') {
  return [
    getOrderTotalProduct(data.$order) - getOrderTotalProduct(selectionData, selectionDataProp) <= 0,
    '原包裹至少需要保留一个产品'
  ]
}

/**
 * 格式化包裹列表
 * @param data
 * @returns {*}
 */
export function normalizePackageData(data) {
  //筛掉orderCode 是Null的脏数据
  // data = data.filter(({ orderCode }) => orderCode)
  const formatData = data.reduce((prev, next) => {
    const normalizedRow = normalizeRow(next)
    const rowData = isArray(normalizedRow) ? normalizedRow : [normalizedRow]
    const firstRow = $GET(rowData, '0', {})
    prev.push({ $isTitle: true, ...firstRow, $unselectable: false, $rowKey: firstRow.$packageId }, ...rowData)
    return prev
  }, [])
  return formatData

  // return fillDeliveryInfo(formatData)

  function normalizeRow(row) {
    if (isUnhandledOrder(row)) return fillOrder(row, row)
    // if (isSplitOrder(row)) return fillOrder($GET(row, 'splitOrder', {}), row)
    if (isSplitOrder(row)) return fillOrder($GET(row, 'splitOrder', {}), row)
    const mergeOrderList = $GET(row, 'mergeOrderList', [])
    const mergeOrderLen = mergeOrderList.length
    return mergeOrderList.map((mergeOrder, index) => {
      return Object.assign(
        fillOrder(mergeOrder, row),
        index === 0
          ? {
            $rowspan: {
              expressInfo: mergeOrderLen,
              declareInfo: mergeOrderLen,
              $menu: mergeOrderLen
            }
          }
          : {
            $rowspan: {
              expressInfo: 0,
              declareInfo: 0,
              $menu: 0
            }
          }
      )
    })
  }

  function fillOrder(order, row) {
    const { packageOrderType, systemOrderCode, nickName, id, packageOrderStatus } = row
    return Object.assign(order, {
      $unselectable: true,
      $order: row,
      $packageOrderCode: systemOrderCode,
      $packageId: id,
      $rowKey: `${id}-${order.id}`,
      packageOrderStatus
    })
  }

  /**
   * 填充发货地信息
   * @param data
   * @returns {*}
   */
  function fillDeliveryInfo(data) {
    return data.map((item) => {
      const { deliveryInfoDTO } = item
      if (!deliveryInfoDTO || (!deliveryInfoDTO.supplierName && !deliveryInfoDTO.warehouseName)) {
        item.$deliveryMethod = $defaultPlaceholder()
        item.$deliveryPlace = $defaultPlaceholder()
        return item
      }
      if (deliveryInfoDTO.supplierName) {
        item.$deliveryMethod = '工厂发货'
        item.$deliveryPlace = deliveryInfoDTO.supplierName
      }
      if (deliveryInfoDTO.warehouseName) {
        item.$deliveryMethod = '仓库发货'
        item.$deliveryPlace = deliveryInfoDTO.warehouseName
      }
      return item
    })
  }
}

export function isSplitOrder(order) {
  return getPackageOrderType(order) === 'isSplit'
}

export function isMergeOrder(order) {
  return getPackageOrderType(order) === 'isMerge'
}

export function isUnhandledOrder(order) {
  return getPackageOrderType(order) === 'isUnhandled'
}

// 货运方式：1-标运；2-快运
export function isShippingStandard(order) {
  return getPackageDeliveryShippingType(order) === 'isStandard'
}

export function isShippingExpress(order) {
  return getPackageDeliveryShippingType(order) === 'isExpress'
}

/**
 * 获取包裹类型 拆单 | 合单 | 未处理
 * @param order
 * @returns {*}
 */
function getPackageOrderType(order) {
  if (order.$order) order = validData(order.$order, order)
  return {
    [PACKAGE_TYPE_SPLIT]: 'isSplit',
    [PACKAGE_TYPE_MERGE]: 'isMerge',
    [PACKAGE_TYPE_UNHANDLED]: 'isUnhandled'
  }[validData(order.packageOrderType, PACKAGE_TYPE_UNHANDLED)]
}

/**
 * 货运方式：1-标运；2-快运
 * @param order
 * @returns {*}
 */
export function getPackageDeliveryShippingType(order) {
  if (!isPlainObject(order)) order = { deliveryShippingType: order }
  return {
    [DELIVERY_SHIPPING_STANDARD]: 'isStandard',
    [DELIVERY_SHIPPING_EXPRESS]: 'isExpress'
  }[validData(order.deliveryShippingType, DELIVERY_SHIPPING_STANDARD)]
}

/**
 * 根据获取货物类型筛选数据
 * @param data
 * @param type
 * @returns {*}
 */
export function getPackagedDataByDeliveryShippingType(data, type) {
  return data.filter((item) => {
    item = item.$order || item
    return getDeliveryShippingType(item) == type
  })
}

/**
 * 根据包裹列表获取获取订单props
 * @param packageOrderList
 * @param props
 * @returns {*}
 */
export function getOrderPropsInPackageList(packageOrderList, props) {
  if (!isArray(packageOrderList)) packageOrderList = [packageOrderList]
  packageOrderList = packageOrderList.map((item) => {
    return validData(item.$order, item)
  })
  if (!isArray(props) && props) props = [props]
  const allData = packageOrderList.reduce((data, packageOrder) => {
    if (isMergeOrder(packageOrder)) {
      data.push(...$GET(packageOrder, 'mergeOrderList', []))
    } else if (isSplitOrder(packageOrder)) {
      data.push($GET(packageOrder, 'splitOrder', {}))
    } else {
      data.push(packageOrder)
    }
    return data
  }, [])
  if (!props) return allData
  return $MAP(allData, props)
}

export function getPackageList(data) {
  return data.map((item) => validData(item.$order, item))
}

export function getHeaderOrderByOrder() {}

/**
 * 获取货运方式
 * @param data
 * @returns {*|string}
 */
export function getDeliveryShippingName(data) {
  if (isArray(data) && data.length > 0) data = data[0]
  return DELIVERY_SHIPPING_LIST[data.deliveryShippingType] || '暂无'
}

/**
 * 格式化订单统计数据
 * @param data
 * @param statusList
 * @param prop
 * @returns {number|*}
 */
export function formatOrderStatistics(data, statusList, prop = 'waybillStatus', count = 'count') {
  if (!statusList) return 0
  if (!isArray) statusList = [statusList]
  return data.reduce((cur, next) => {
    let status = null
    if (isFunction(prop)) {
      status = prop(next, statusList, data)
    } else {
      status = next[prop]
    }
    if (isNil(status)) return cur
    const fItem = find(statusList, (item) => item == status)
    if (isNil(fItem)) return cur
    return (cur += validData(next[count], 0))
  }, 0)
}

/**
 * 格式化统计的column
 * @param column
 * @param data
 * @param statusListProp
 * @param prop
 * @param count
 * @returns {*}
 */

export function formatOrderColumn(
  column,
  data,
  prop = 'waybillStatus',
  count = 'count',
  statusListProp = 'statusList'
) {
  return column.map((item) => {
    const statusList = item[statusListProp]
    return {
      ...item,
      label: `${item.label} (${formatOrderStatistics(data, statusList, prop, count)})`
    }
  })
}

/**
 * 根据订单状态和店铺类型获取sku
 * @param row
 * @returns {*}
 */
export function getSkuByShopType(row) {
  const { productExternalSkuCode, productInternalSkuCode, orderStatus, shopType } = row
  if (orderStatus != WAIT_RELATION) return productInternalSkuCode
  const list = {
    [SHOP_TYPE_SHOPIFY]: '未关联产品',
    default: productExternalSkuCode
  }
  return validData(list[shopType], list.default, '暂无')
}