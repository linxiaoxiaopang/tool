import { accSub, accAdd, accMul } from '@/utils'

export const purchasedModelDic = [
  {
    label: '宋DM智驾',
    value: '宋DM智驾',
    guidePrice: '145800',
    tradeTypeData: {
      0: 0,
      1: 6000,
      2: 8000
    },
    regulationDiscount: '10000'
  },
  {
    label: '海狮07DM智驾',
    value: '海狮07智驾',
    guidePrice: '165800',
    tradeTypeData: {
      0: 0,
      1: 9000,
      2: 11000
    },
    regulationDiscount: '16000'
  }
]

export function getFormOption() {
  const formOption = {
    labelWidth: 120,
    column: [
      {
        label: '客户',
        prop: 'customer'
      },
      {
        label: '购买车型',
        prop: 'purchasedModel',
        type: 'select',
        dicData: purchasedModelDic,
        control: () => {
          calcPurchasedModel.call(this)
        }
      },
      {
        label: '车架号',
        prop: 'vinNumber'
      },
      {
        label: '贷款产品',
        prop: 'loanProduct',
        type: 'select',
        dicData: [{
          label: '迪链（60期）14%',
          value: '0.14'
        }],
        control: () => {
          calcDealerLoanProfit.call(this, this.form)
        }
      },
      {
        label: '贷款金额',
        prop: 'loanAmount',
        control: () => {
          calcDealerLoanProfit.call(this, this.form)
        }
      },
      {
        label: '客户贷款贴息',
        prop: 'customerInterestSubsidy',
        control: (value) => {
          calcDealerLoanProfit.call(this, this.form)
          this.invoicePriceCalculationForm.financialSubsidy = value
        }
      },
      {
        label: '店端贷款利润',
        prop: 'dealerLoanProfit',
        type: 'text'
      },
      { label: '保险赠送', prop: 'insuranceGift' },
      { label: '超出自律会金额', prop: 'amountExceedingRegulation' },
      {
        label: '开票价计算',
        prop: 'invoicePriceCalculation',
        control: () => {
          calcGrossProfitLevel1.call(this)
        }
      },
      {
        label: '一级毛利',
        prop: 'grossProfitLevel1',
        control: () => {
          calcOrderTotalGrossProfit.call(this)
        },
        type: 'text'
      },
      {
        label: '二级毛利',
        prop: 'grossProfitLevel2',
        control: () => {
          calcOrderTotalGrossProfit.call(this)
        }
      },
      {
        label: '三级毛利',
        prop: 'grossProfitLevel3',
        control: () => {
          calcOrderTotalGrossProfit.call(this)
        }
      },
      {
        label: '订单综合毛利',
        prop: 'orderTotalGrossProfit',
        type: 'text'
      },
      { label: '备注', prop: 'remarks' }
    ]
  }
  return formOption
}

export function getInvoicePriceCalculationFormOption() {
  const invoicePriceCalculationFormOption = {
    column: [ // 修改为 columns（标准表格配置属性名）
      { label: '指导价', prop: 'guidePrice' },
      { label: '自律会优惠', prop: 'regulationDiscount' },
      { label: '金融补贴', prop: 'financialSubsidy' },
      {
        label: '置换类型',
        prop: 'tradeType',
        type: 'select',
        control: (value, form) => {
          const tradeTypeData = this.currentPurchased?.tradeTypeData
          if (!tradeTypeData) {
            form.tradeInSubsidy = 0
            return
          }
          value = value || 0
          form.tradeInSubsidy = tradeTypeData[value]
        },
        dicData: [
          {
            label: '无',
            value: 0
          },
          {
            label: '普通置换',
            value: 1
          },
          {
            label: '比亚迪置换',
            value: 2
          }
        ]
      },
      {
        label: '置换补贴',
        prop: 'tradeInSubsidy',
        type: 'text',
        control: () => {
          calcInvoicePriceCalculation.call(this)
        }
      },
      {
        label: '总计',
        prop: 'invoicePriceCalculation',
        type: 'text',
        control: () => {
          calcGrossProfitLevel1.call(this)
        }
      }
    ]
  }
  return invoicePriceCalculationFormOption
}

function calcPurchasedModel() {
  const fItem = this.currentPurchased
  if (!fItem) return
  const { regulationDiscount, guidePrice, financialSubsidy, tradeTypeData } = fItem
  const { invoicePriceCalculationForm } = this
  let { tradeType } = invoicePriceCalculationForm
  tradeType = tradeType || 0
  invoicePriceCalculationForm.regulationDiscount = regulationDiscount
  invoicePriceCalculationForm.guidePrice = guidePrice
  invoicePriceCalculationForm.financialSubsidy = financialSubsidy
  invoicePriceCalculationForm.tradeInSubsidy = tradeTypeData[tradeType]
}

function calcDealerLoanProfit(form) {
  if (!form) return
  let { customerInterestSubsidy, loanProduct, loanAmount } = form
  if (!loanProduct || !loanAmount) {
    form.dealerLoanProfit = ''
    return
  }
  customerInterestSubsidy = customerInterestSubsidy || 0
  form.dealerLoanProfit = accSub(accMul(loanAmount, loanProduct), customerInterestSubsidy)
}

function calcOrderTotalGrossProfit() {
  const form = this.form
  let { grossProfitLevel1, grossProfitLevel2, grossProfitLevel3 } = form
  grossProfitLevel1 = grossProfitLevel1 || 0
  grossProfitLevel2 = grossProfitLevel2 || 0
  grossProfitLevel3 = grossProfitLevel3 || 0
  form.orderTotalGrossProfit = accAdd(grossProfitLevel1, grossProfitLevel2, grossProfitLevel3)
}

function calcInvoicePriceCalculation() {
  const {
    regulationDiscount,
    guidePrice,
    financialSubsidy,
    tradeInSubsidy
  } = this.invoicePriceCalculationForm
  const invoicePriceCalculation = this.invoicePriceCalculationForm.invoicePriceCalculation = accSub(guidePrice, regulationDiscount, financialSubsidy, tradeInSubsidy)
  this.form.invoicePriceCalculation = invoicePriceCalculation
}

function calcGrossProfitLevel1() {
  const form = this.form
  const { invoicePriceCalculation } = form
  if (!this.currentPurchased) return
  const { guidePrice } = this.currentPurchased
  form.grossProfitLevel1 = accSub(invoicePriceCalculation, guidePrice)
}
