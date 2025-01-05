/* eslint-disable */
import { accAdd, accSub } from '@/utils'
import { validData } from '@/components/avue/utils/util'
import { RETURN_GROUP_CHANGE_WAYBILL } from '@/utils/constant/order'

// 货款总计
export function getTotalPrice(row) {
  const { paymentProduct, tax } = getFinancePart(row)
  const paymentFreight = getRawFreightPrice(row)
  return parseAmount(accAdd(paymentProduct, paymentFreight, tax))
}

// 产品优惠
export function getProductDiscount(row) {
  // console.log(row,'row')
  const amount = getFinancePart(row)
  const productDiscount = accSub(amount.increaseAmount, amount.couponAmount)
  if (productDiscount === 0) return 0
  return `${productDiscount > 0 ? '+' : ''}${productDiscount}`
}

// 运费优惠
export function getFreightDiscount(row) {
  if (isAfterSales(row)) return 0

  const amount = getFinancePart(row)
  const productDiscount = accSub(amount.increaseFreight, amount.couponFreight)
  if (productDiscount === 0) return 0
  return `${productDiscount > 0 ? '+' : ''}${productDiscount}`
}

export function getLogisticsServiceName(row) {
  try {
    return JSON.parse(row.expressThird).logistics_service_name
  } catch (error) {}
}

export function getOrderPackage(row) {
  return validData(row.$order, row)
}

// 物流信息
export function getExpressName(row) {
  const expressInfo = getExpressInfo(row)
  return validData(expressInfo.expressShippingMethodCnName, expressInfo.expressCompanyName)
}

let expressTrackMethod = {
  1: 'expressWaybillCode',
  2: 'expressServiceCode'
}

export function getExpressWaybillCode(row) {
  const expressInfo = getExpressInfo(row)
  const expressWaybillCode = $GET(expressInfo, 'expressWaybillCode', '')
  const expressServiceCode = $GET(expressInfo, expressTrackMethod[expressInfo?.expressTrackMethod], '')
  return validData(expressWaybillCode, expressServiceCode)
}

export function isAfterSales(row) {
  const { orderStatus } = row
  return RETURN_GROUP_CHANGE_WAYBILL.find((item) => item == orderStatus)
}

export function getAfterSalesApplyRecordDTO(row) {
  return $GET(row, 'afterSalesApplyRecordDTO', {})
}

export function getWaybillApplyRecordDTO(row) {
  return $GET(getAfterSalesApplyRecordDTO(row), 'waybillApplyRecordDTO', {})
}

export function getFinancePart(row) {
  return $GET(row, 'financePart', {})
}

export function getRawFreightPrice(row) {
  if (isAfterSales(row)) return getAfterSalesApplyRecordDTO(row).realFreight
  return getFinancePart(row).paymentFreight
}

export function getOrderType(row) {
  if (isAfterSales(row)) return getAfterSalesApplyRecordDTO(row).orderType
  return row.orderType
}

export function getFreightPrice(row) {
  return $defaultPlaceholder(getRawFreightPrice(row))
}

/**
 * 获取物流
 * @param row
 * @returns {*}
 */
export function getLogisticsPart(row) {
  if (isAfterSales(row)) return $GET(row, 'afterSalesApplyRecordDTO', {})
  return $GET(row, 'logisticsPart', {})
}

/**
 * 获取收件人
 * @param row
 * @returns {*}
 */
export function getConsigneeName(row) {
  let prop = 'consigneeName'
  if (isAfterSales(row)) prop = 'contactName'
  return $defaultPlaceholder($GET(getLogisticsPart(row), prop, ''))
}

/**
 * 获取收件国家
 * @param row
 * @returns {*}
 */
export function getConsigneeCountryCode(row) {
  let prop = 'consigneeCountryCode'
  if (isAfterSales(row)) prop = 'contactCountryCode'
  return $defaultPlaceholder($GET(getLogisticsPart(row), prop, ''))
}

export function getExpressInfo(row) {
  if (isAfterSales(row)) return $GET(getAfterSalesApplyRecordDTO(row), 'waybillApplyRecordDTO', {})
  return row
}

export function getExpressWaybillIsCreated(row) {
  const expressInfo = Object.keys(getExpressInfo(row)).length ? getExpressInfo(row) : getAfterSalesApplyRecordDTO(row)
  return expressInfo.expressWaybillIsCreated
}

export function getDeliveryShippingType(row) {
  if (isAfterSales(row)) return getAfterSalesApplyRecordDTO(row).deliveryShippingType
  return row.deliveryShippingType
}

export function getOrderRemark(row) {
  if (isAfterSales(row)) return getExpressInfo(row).remark
  return $GET(row, 'logisticsPart.errorInfo', '')
}
