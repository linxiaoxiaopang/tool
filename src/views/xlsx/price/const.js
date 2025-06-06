import { instanceCacheSheet } from './utils'
import { accDiv, accMul } from '@/utils'
import { isArray } from 'lodash'

export const loanKeyMap = {
  bank: '银行',
  rate: '利率',
  keyword: '关键字'
}

export const replacementKeyMap = {
  vehicleSeries: '车系',
  BYD: '比亚迪',
  noBYD: '非比亚迪'
}

export const terminalDiscountKeyMap = {
  vehicleSeries: '车系',
  vehicleModel: '车型',
  discountAllowance: '折让额度'
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

export const filingKeyMap = {
  vehicleSeries: '车系',
  vehicleModel: '车型',
  regulationDiscount: '备案差价'
}

export const interestFreeMap = {
  channel: '渠道',
  vehicleSeries: '车系',
  productName: '产品名称',
  maxFinancingAmount: '最高融资金额',
  productTerm: '产品期限',
  rebate: '返利',
  dealerProfitAfterDiscount: '贴息后经销商利润'
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
        item.value = `${bank}_${rate}`
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
      const tmpData = []
      data.map(item => {
        const { vehicleSeries, vehicleModel } = item
        item.label = vehicleSeries
        item.value = vehicleSeries
        if (vehicleModel == '全系') {
          item.vehicleModel = ''
          tmpData.push(item)
          return
        }

        const splitData = vehicleModel.split(/、/).map(sItem => sItem.trim())
        splitData.map(sItem => {
          tmpData.push({
            ...item,
            vehicleModel: sItem
          })
        })
      })
      return tmpData
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
  },
  {
    label: '备案',
    value: 'filing',
    handleData(data) {
      return data.map(item => {
        const { vehicleSeries, vehicleModel } = item
        item.label = `${vehicleSeries} ${vehicleModel}`
        item.value = `${vehicleSeries} ${vehicleModel}`
        return item
      })
    },
    keyMap: filingKeyMap
  },
  {
    label: '免息',
    value: 'interestFree',
    handleData(data) {
      return data.map(item => {
        const { productName, dealerProfitAfterDiscount } = item
        item.label = productName
        item.value = dealerProfitAfterDiscount
        return item
      })
    },
    keyMap: interestFreeMap
  }
]


// export let sheetData = instanceCacheSheet.get() || defaultSheetData
export let sheetData = getDefaultSheetData()

export function updateSheetData(data) {
  Object.keys(sheetData).map(key => {
    if (isArray(sheetData[key])) {
      sheetData[key].length = 0
      sheetData[key].push(...data[key])
    } else {
      sheetData[key] = data[key]
    }
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
      isExport: true,
      handleExportValue(row) {
        const { loanProduct } = row
        if (!loanProduct) return ''
        const [label, value] = loanProduct.split('_')
        return `${label}60期（返点${accMul(value, 100)}%）`
      }
    },
    {
      label: '贷款金额',
      prop: 'loanAmount',
      isExport: true,
      suffix: '元'
    },
    {
      label: '店端贷款利润',
      prop: 'dealerLoanProfit',
      isExport: true,
      suffix: '元'
    },
    {
      label: '客户贷款贴息',
      prop: 'customerInterestSubsidy',
      isExport: true,
      suffix: '元'
    },
    {
      label: '价格优惠',
      prop: 'insuranceGift',
      type: 'text',
      isExport: true,
      suffix: '元'
    },
    {
      label: '超出自律会金额',
      prop: 'amountExceedingRegulation',
      isExport: true,
      suffix: '元'
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
        const {
          guidePrice,
          regulationDiscount,
          financialSubsidy,
          tradeInSubsidy,
          invoicePriceCalculation,
          insuranceGift
        } = row
        let insuranceGiftStr = ''
        if (insuranceGift > 0) {
          insuranceGiftStr = `-${insuranceGift}（价格优惠）`
        }
        return `${guidePrice}（指导价）-${regulationDiscount}（自律会优惠）-${financialSubsidy}（金融补贴）-${tradeInSubsidy}（置换补贴）${insuranceGiftStr} = ${invoicePriceCalculation}元`
      }
    },
    { label: '指导价', prop: 'guidePrice' },
    { label: '自律会优惠', prop: 'regulationDiscount' },
    { label: '金融补贴', prop: 'financialSubsidy' },
    {
      label: '一级毛利',
      prop: 'grossProfitLevel1',
      isExport: true,
      suffix: '元',
      handleExportLabel() {
        // 一级毛利（开价-进价成本）：-27800元
        return '一级毛利（开票价-进价成本）'
      }
    },
    {
      label: '二级毛利',
      prop: 'grossProfitLevel2',
      isExport: true,
      suffix: '元',
      handleExportLabel() {
        // （置换折让+提销差+终端折让）
        return '二级毛利（置换折让+提销差+终端折让）'
      }
    },
    {
      label: '三级毛利',
      prop: 'grossProfitLevel3',
      isExport: true,
      suffix: '元',
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
      props: {
        type: 'textarea'
      },
      type: 'textarea',
      isExport: true
    }
  ]
}

export function getDefaultSheetData() {
  return sheetDic.reduce((prev, cur) => {
    prev[cur.value] = []
    return prev
  }, {})
}
