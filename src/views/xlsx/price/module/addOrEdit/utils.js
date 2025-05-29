import { accAdd, accMul, accSub } from '@/utils'

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

export class CalculationCar {
  constructor(option = {}) {
    const { vmInstance, dic = purchasedModelDic } = option
    this.dic = dic
    this.vmInstance = vmInstance
  }

  get form() {
    return this.vmInstance.form
  }

  get invoicePriceCalculationForm() {
    return this.vmInstance.invoicePriceCalculationForm
  }

  get currentPurchased() {
    const { purchasedModel } = this.form
    return this.dic.find(item => item.value === purchasedModel)
  }

  calcPurchasedModel() {
    if (!this.currentPurchased) return
    const { regulationDiscount, guidePrice, tradeTypeData } = this.currentPurchased
    const { invoicePriceCalculationForm } = this
    let { tradeType } = invoicePriceCalculationForm
    tradeType = tradeType || 0
    invoicePriceCalculationForm.regulationDiscount = regulationDiscount
    invoicePriceCalculationForm.guidePrice = guidePrice
    invoicePriceCalculationForm.tradeInSubsidy = tradeTypeData[tradeType]
    this.calcGrossProfitLevel2()
  }

  calcCustomerInterestSubsidy() {
    const { customerInterestSubsidy, loanAmount } = this.form
    const { max } = Math
    this.form.amountExceedingRegulation = max(accSub(customerInterestSubsidy, accMul(loanAmount, 0.1)), 0)
  }

  calcTradeInSubsidy() {
    const { invoicePriceCalculationForm } = this
    let { tradeType } = invoicePriceCalculationForm
    tradeType = tradeType || 0
    const tradeTypeData = this.currentPurchased?.tradeTypeData
    if (!tradeTypeData) {
      invoicePriceCalculationForm.tradeInSubsidy = 0
      return
    }
    invoicePriceCalculationForm.tradeInSubsidy = tradeTypeData[tradeType]
  }

  calcDealerLoanProfit() {
    const { form } = this
    const { loanProduct, loanAmount } = form
    if (!loanProduct || !loanAmount) {
      form.dealerLoanProfit = ''
      return
    }
    form.dealerLoanProfit = accMul(loanAmount, loanProduct)
  }

  calcFinancialSubsidy() {
    const { form, invoicePriceCalculationForm } = this
    const { dealerLoanProfit } = form
    invoicePriceCalculationForm.financialSubsidy = dealerLoanProfit
  }

  calcInvoicePriceCalculation() {
    const {
      regulationDiscount,
      guidePrice,
      financialSubsidy,
      tradeInSubsidy
    } = this.invoicePriceCalculationForm
    const invoicePriceCalculation = this.invoicePriceCalculationForm.invoicePriceCalculation = accSub(guidePrice, regulationDiscount, financialSubsidy, tradeInSubsidy)
    this.form.invoicePriceCalculation = invoicePriceCalculation
  }

  calcGrossProfitLevel1() {
    const form = this.form
    const { invoicePriceCalculation } = form
    if (!this.currentPurchased) return
    const { guidePrice } = this.currentPurchased
    form.grossProfitLevel1 = accSub(invoicePriceCalculation, guidePrice)
  }

  calcGrossProfitLevel2() {
    const form = this.form
    const { tradeInSubsidy, regulationDiscount } = this.invoicePriceCalculationForm
    form.grossProfitLevel2 = accAdd(tradeInSubsidy, regulationDiscount)
  }

  calcGrossProfitLevel3() {
    const form = this.form
    const { registrationFee, dealerLoanProfit } = this.form
    form.grossProfitLevel3 = accAdd(registrationFee, dealerLoanProfit)
  }

  calcOrderTotalGrossProfit() {
    const form = this.form
    let { grossProfitLevel1, grossProfitLevel2, grossProfitLevel3 } = form
    grossProfitLevel1 = grossProfitLevel1 || 0
    grossProfitLevel2 = grossProfitLevel2 || 0
    grossProfitLevel3 = grossProfitLevel3 || 0
    form.orderTotalGrossProfit = accAdd(grossProfitLevel1, grossProfitLevel2, grossProfitLevel3)
  }
}
