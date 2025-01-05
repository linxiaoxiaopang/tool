/* eslint-disable */
import { validData } from '@/components/avue/utils/util'
import { getAfterSalesApplyRecordDTO, isAfterSales } from '@/utils/business/order/functional'

export function getExpressInfo(row) {
  if (isAfterSales(row)) return $GET(getAfterSalesApplyRecordDTO(row), 'waybillApplyRecordDTO', {})
  return row
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