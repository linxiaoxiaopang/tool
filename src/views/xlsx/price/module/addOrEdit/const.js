import { accSub, accAdd } from '@/utils'

export const formOption = {
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
      dicData: [
        {
          label: '宋DM智驾',
          value: '宋DM智驾',
          guidePrice: '145800',
          tradeTypeData: {
            0: 0,
            1: 8000,
            2: 11000
          },
          regulationDiscount: '16000'
        },
        {
          label: '唐DM智驾',
          value: '唐DM智驾',
          guidePrice: '165800',
          tradeTypeData: {
            0: 0,
            1: 8000,
            2: 11000
          },
          regulationDiscount: '16000'
        }
      ],
      control(value, form, col) {
        calcPurchasedModel(value, form, col)
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
        label: '迪链（60期）',
        value: '0.14'
      }],
      control(value, form) {
        calcDealerLoanProfit(form)
      }
    },
    {
      label: '贷款金额',
      prop: 'loanAmount',
      control(value, form) {
        calcDealerLoanProfit(form)
      }
    },
    {
      label: '客户贷款贴息',
      prop: 'customerInterestSubsidy',
      control(value, form) {
        calcDealerLoanProfit(form)
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
      prop: 'invoicePriceCalculation'
    },
    {
      label: '一级毛利',
      prop: 'grossProfitLevel1',
      control(value, form) {
        calcOrderTotalGrossProfit(form)
      }
    },
    {
      label: '二级毛利',
      prop: 'grossProfitLevel2',
      control(value, form) {
        calcOrderTotalGrossProfit(form)
      }
    },
    {
      label: '三级毛利',
      prop: 'grossProfitLevel3',
      control(value, form) {
        calcOrderTotalGrossProfit(form)
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

export const invoicePriceCalculationFormOption = {
  column: [ // 修改为 columns（标准表格配置属性名）
    { label: '指导价', prop: 'guidePrice' },
    { label: '自律会优惠', prop: 'regulationDiscount' },
    { label: '金融补贴', prop: 'financialSubsidy' },
    {
      label: '置换类型',
      prop: 'tradeType',
      type: 'select',
      control(value, form) {
        console.log('value', value)
        console.log('form', form)
        const tradeTypeData = form.tradeTypeData
        if (!tradeTypeData) {
          form.tradeInSubsidy = 0
          return
        }
        form.tradeInSubsidy = tradeTypeData[value || 0]
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
      type: 'text'
    }
  ]
}

function calcPurchasedModel(value, form, col) {
  const { dicData } = col
  const fItem = dicData.find(item => item.value == value)
  if (!fItem) return
  const { regulationDiscount, guidePrice, financialSubsidy, tradeTypeData } = fItem
  const { invoicePriceCalculationForm } = form
  const { tradeType } = invoicePriceCalculationForm
  invoicePriceCalculationForm.regulationDiscount = regulationDiscount
  invoicePriceCalculationForm.guidePrice = guidePrice
  invoicePriceCalculationForm.financialSubsidy = financialSubsidy
  invoicePriceCalculationForm.tradeTypeData = tradeTypeData
  invoicePriceCalculationForm.tradeInSubsidy = tradeTypeData[tradeType || 0]
}

function calcDealerLoanProfit(form) {
  let { customerInterestSubsidy, loanProduct, loanAmount } = form
  if (!loanProduct || !loanAmount) {
    form.dealerLoanProfit = ''
    return
  }
  customerInterestSubsidy = customerInterestSubsidy || 0
  form.dealerLoanProfit = form.loanAmount * form.loanProduct - customerInterestSubsidy
}

function calcOrderTotalGrossProfit(form) {
  let { grossProfitLevel1, grossProfitLevel2, grossProfitLevel3 } = form
  grossProfitLevel1 = grossProfitLevel1 || 0
  grossProfitLevel2 = grossProfitLevel2 || 0
  grossProfitLevel3 = grossProfitLevel3 || 0
  form.orderTotalGrossProfit = accSub(accAdd(grossProfitLevel2, grossProfitLevel3), grossProfitLevel1)
}
