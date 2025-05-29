import { CalculationCar } from './utils'

export function getFormOption() {
  const instance = new CalculationCar({
    vmInstance: this
  })

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
        dicData: instance.dic,
        control: () => {
          instance.calcPurchasedModel()
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
          instance.calcDealerLoanProfit()
        }
      },
      {
        label: '贷款金额',
        prop: 'loanAmount',
        control: () => {
          instance.calcFinancialSubsidy()
          instance.calcDealerLoanProfit()
          instance.calcGrossProfitLevel3()
        }
      },
      {
        label: '店端贷款利润',
        prop: 'dealerLoanProfit',
        control: () => {
          instance.calcGrossProfitLevel2()
        },
        type: 'text'
      },
      {
        label: '客户贷款贴息',
        prop: 'customerInterestSubsidy',
        control() {
          instance.calcCustomerInterestSubsidy()
        }
      },
      { label: '保险赠送', prop: 'insuranceGift' },
      {
        label: '超出自律会金额',
        prop: 'amountExceedingRegulation',
        type: 'text'
      },
      {
        label: '开票价计算',
        prop: 'invoicePriceCalculation',
        control: () => {
          instance.calcGrossProfitLevel1()
        }
      },
      {
        label: '上牌费用',
        prop: 'registrationFee',
        type: 'select',
        value: 500,
        dicData: [
          {
            label: '0',
            value: 0
          },
          {
            label: '500',
            value: 500
          },
          {
            label: '300',
            value: 300
          }
        ]
      },
      {
        label: '一级毛利',
        prop: 'grossProfitLevel1',
        control: () => {
          instance.calcOrderTotalGrossProfit()
        },
        type: 'text'
      },
      {
        label: '二级毛利',
        prop: 'grossProfitLevel2',
        control: () => {
          instance.calcOrderTotalGrossProfit()
        },
        type: 'text'
      },
      {
        label: '三级毛利',
        prop: 'grossProfitLevel3',
        control: () => {
          instance.calcOrderTotalGrossProfit()
        },
        type: 'text'
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
  const instance = new CalculationCar({
    vmInstance: this
  })

  const invoicePriceCalculationFormOption = {
    column: [
      {
        label: '指导价',
        prop: 'guidePrice',
        type: 'text'
      },
      {
        label: '自律会优惠',
        prop: 'regulationDiscount',
        type: 'text'
      },
      {
        label: '金融补贴',
        prop: 'financialSubsidy',
        type: 'text'
      },
      {
        label: '置换类型',
        prop: 'tradeType',
        type: 'select',
        control: () => {
          instance.calcTradeInSubsidy()
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
          instance.calcInvoicePriceCalculation()
        }
      },
      {
        label: '总计',
        prop: 'invoicePriceCalculation',
        type: 'text',
        control: () => {
          instance.calcGrossProfitLevel1()
        }
      }
    ]
  }
  return invoicePriceCalculationFormOption
}
