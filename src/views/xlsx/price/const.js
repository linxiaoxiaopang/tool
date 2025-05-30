import { instanceCacheSheet } from './utils'

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
  regulationDiscount: '折让额度'
}

export const profitSystemKeyMap = {
  vehicleSeries: '车系',
  vehicleModel: '车型',
  guidePrice: '建议零售价',
  deliveryPrice: '提车价',
  priceDifference: '提车差价',
  monthlyDeliveryConcession: '月度提车折让',
  advertisingSupportConcession: '广告支持折让',
  sincereServiceAssessmentConcession: '精诚服务考核折让',
  wes: '智享服务体验(WES)折让'
}

export const tradeTypeDic = [
  {
    label: '无',
    value: 'none'
  },
  {
    label: '普通置换',
    value: 'noBYD'
  },
  {
    label: '比亚迪置换',
    value: 'BYD'
  }
]

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
        item.value = `${vehicleSeries} ${vehicleModel}`
        return item
      })
    },
    keyMap: profitSystemKeyMap
  }
]

export let sheetData = instanceCacheSheet.get() || sheetDic.reduce((prev, cur) => {
  prev[cur.value] = []
  return prev
}, {})

export function updateSheetData(data) {
  Object.keys(sheetData).map(key => {
    sheetData[key].length = 0
    sheetData[key].push(...data[key])
  })
}

export const option = {
  column: [
    {
      label: '客户',
      prop: 'customer',
      isExport: true
    },
    {
      label: '购买车型',
      prop: 'purchasedModel',
      isExport: true
    },
    {
      label: '车架号',
      prop: 'vinNumber',
      isExport: true
    },
    {
      label: '贷款产品',
      prop: 'loanProduct',
      isExport: true
    },
    {
      label: '贷款金额',
      prop: 'loanAmount',
      isExport: true
    },
    {
      label: '店端贷款利润',
      prop: 'dealerLoanProfit',
      isExport: true
    },
    {
      label: '客户贷款贴息',
      prop: 'customerInterestSubsidy',
      isExport: true
    },
    {
      label: '保险赠送',
      prop: 'registrationFee',
      isExport: true
    },
    {
      label: '超出自律会金额',
      prop: 'amountExceedingRegulation',
      isExport: true
    },
    { label: '上牌费用', prop: 'dealerLoanProfit' },
    {
      label: '置换类型',
      prop: 'tradeType',
      type: 'select',
      dicData: tradeTypeDic
    },
    { label: '置换补贴', prop: 'tradeInSubsidy' },
    {
      label: '开票价计算',
      prop: 'invoicePriceCalculation',
      isExport: true,
      handleExportValue(row) {
        // 145800（指导价）-16000（自律会优惠）-11800（金融补贴）-8000（置换补贴）=110000元
        const { guidePrice, regulationDiscount, financialSubsidy, tradeInSubsidy, invoicePriceCalculation } = row
        return `${guidePrice}（指导价）-${regulationDiscount}（自律会优惠）-${financialSubsidy}（金融补贴）-${tradeInSubsidy}（置换补贴）=${invoicePriceCalculation}元`
      }
    },
    { label: '指导价', prop: 'guidePrice' },
    { label: '自律会优惠', prop: 'regulationDiscount' },
    { label: '金融补贴', prop: 'financialSubsidy' },
    {
      label: '一级毛利',
      prop: 'grossProfitLevel1',
      isExport: true,
      handleExportLabel() {
        // 一级毛利（开价-进价成本）：-27800元
        return '一级毛利（开价-进价成本）'
      }
    },
    {
      label: '二级毛利',
      prop: 'grossProfitLevel2',
      isExport: true,
      handleExportLabel() {
        // （置换折让+提销差+终端折让）
        return '二级毛利（置换折让+提销差+终端折让）'
      }
    },
    {
      label: '三级毛利',
      prop: 'grossProfitLevel3',
      isExport: true,
      handleExportLabel() {
        // （单车金融+单车保险+上牌利润+精品利润-赠送成本）
        return '三级毛利（单车金融+单车保险+上牌利润+精品利润-赠送成本）'
      }
    },
    {
      label: '订单综合毛利',
      prop: 'orderTotalGrossProfit',
      isExport: true
    },
    {
      label: '备注',
      prop: 'remarks',
      isExport: true
    }
  ]
}
