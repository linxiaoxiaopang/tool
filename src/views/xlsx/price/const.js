export const loanKeyMap = {
  bank: '银行',
  rate: '利率'
}

export const replacementKeyMap = {
  vehicleSeries: '车系',
  BYD: '比亚迪',
  noBYD: '非比亚迪'
}

export const terminalDiscountKeyMap = {
  vehicleSeries: '车系',
  vehicleModel: '车型',
  discount: '折让额度'
}

export const profitSystemKeyMap = {
  vehicleSeries: '车系',
  vehicleModel: '车型',
  suggestedRetailPrice: '建议零售价',
  deliveryPrice: '提车价',
  priceDifference: '提车差价',
  monthlyDeliveryConcession: '月度提车折让',
  advertisingSupportConcession: '广告支持折让',
  sincereServiceAssessmentConcession: '精诚服务考核折让',
  wes: '智享服务体验(WES)折让'
}

export const sheetDic = [
  {
    label: '贷款',
    value: 'loan',

    handleData(data) {
      return data.map(item => {
        const { bank, rate } = item
        item.label = `${bank}(${rate})`
        item.value = rate
        return item
      })
    },
    keyMap: loanKeyMap
  },
  {
    label: '置换',
    value: 'replacement',
    handleData(data) {
      return data
    },
    keyMap: replacementKeyMap
  },
  {
    label: '终端折让',
    value: 'terminalDiscount',
    handleData(data) {
      return data.map(item => {
        const { vehicleSeries } = item
        item.label = vehicleSeries
        item.value = vehicleSeries
        return item
      })
    },
    keyMap: terminalDiscountKeyMap
  },
  {
    label: '利润体系',
    value: 'profitSystem',
    handleData(data) {
      return data.map(item => {
        const { vehicleSeries, vehicleModel } = item
        item.label = `${vehicleSeries} ${vehicleModel}`
        item.value = `${vehicleSeries}|${vehicleModel}`
        return item
      })
    },
    keyMap: profitSystemKeyMap
  }
]

export let sheetData = sheetDic.reduce((prev, cur) => {
  prev[cur.value] = []
  return prev
}, {})

export function updateSheetData(data) {
  Object.keys(sheetData).map(key => {
    sheetData[key] = data[key]
  })
}

export const ORDER_KEYS = {
  sku: 'SKU',
  consigneeCountryCode: '国家',
  consigneeDetailAddress: '收货人地址',
  consigneeCity: '收货人城市',
  consigneeName: '收货人',
  productCount: '产品数量',
  expressCompanyName: '物流方式',
  // expressCompanyId: '物流公司id',
  consigneeContactPhone: '收货人电话',
  consigneeContactMobilePhone: '收货人手机号码',
  consigneeProvince: '收货人州/省',
  orderCode: '订单号',
  expressWaybillCode: '运单号',
  consigneePostcode: '邮编',
  salesman: '业务员',
  dept: '部门',
  totalPrice: '销售金额',
  externalFreight: '运费',
  buyerId: '买家ID（非必填）'
}

export const option = {
  column: [
    {
      label: '客户',
      prop: 'customer'
    },
    {
      label: '购买车型',
      prop: 'purchasedModel'
    },
    { label: '车架号', prop: 'vinNumber' },
    { label: '贷款产品', prop: 'loanProduct' },
    { label: '贷款金额', prop: 'loanAmount' },
    { label: '店端贷款利润', prop: 'dealerLoanProfit' },
    { label: '客户贷款贴息', prop: 'customerInterestSubsidy' },
    { label: '保险赠送', prop: 'insuranceGift' },
    { label: '超出自律会金额', prop: 'amountExceedingRegulation' },
    { label: '开票价计算', prop: 'invoicePriceCalculation' },
    { label: '一级毛利', prop: 'grossProfitLevel1' },
    { label: '二级毛利', prop: 'grossProfitLevel2' },
    { label: '三级毛利', prop: 'grossProfitLevel3' },
    { label: '订单综合毛利', prop: 'orderTotalGrossProfit' },
    { label: '备注', prop: 'remarks' }
  ]
}
