/* eslint-disable */

export const list = {
  type: 'normal',
  column: [
    {
      label: '紧急',
      value: 'urgency',
      resetMergeData: {
        urgencyType: 1
      }
    },
    {
      label: '普通',
      value: 'common',
      resetMergeData: {
        purchaseStockType: 0
      }
    },
    {
      label: '定制品',
      value: 'custom',
      resetMergeData: {
        isCustomGoods: true
      }
    }
  ]
}

export const tableOption = {
  searchBtn: true,
  selection: true,
  pageSizes: [2],
  selectable(row) {
    return row.$index === 0
  },
  column: [
    {
      label: '授权码',
      prop: 'accessToken',
      search: true,
      hide: true
    },
    {
      label: '订单号',
      prop: 'subPurchaseOrderSn'
    },
    {
      label: 'SKU信息',
      prop: 'sku'
    },
    {
      label: '产品数量',
      prop: 'purchaseQuantity'
    }
  ]
}