/* eslint-disable */

// purchaseStockType 是否是JIT备货
export const PURCHASE_STOCK_TYPE_COMMON = 0 // 普通
export const PURCHASE_STOCK_TYPE_JIT = 1 // JIT备货
export const PURCHASE_STOCK_TYPE_DIC = [
  {
    label: '普通',
    value: PURCHASE_STOCK_TYPE_COMMON
  },
  {
    label: 'JIT备货',
    value: PURCHASE_STOCK_TYPE_JIT
  }
]