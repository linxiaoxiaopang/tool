import { accAdd, accMul, accSub } from '@/utils'
import { sheetData } from '../../const'

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
    const { vmInstance } = option
    this.vmInstance = vmInstance
    this.sheetData = sheetData
  }

  get form() {
    return this.vmInstance.form
  }

  // get sheetData() {
  //   return sheetData
  // }

  get loanDic() {
    return this.sheetData.loan
  }

  get replacementDic() {
    return this.sheetData.replacement
  }

  get profitSystemDic() {
    debugger
    return this.sheetData.profitSystem
  }

  get currentPurchased() {
    const { purchasedModel } = this.form
    return this.profitSystemDic.find(item => item.value === purchasedModel)
  }

  get currentReplacement() {
    return this.replacementDic.find(item => item.vehicleSeries == this.currentPurchased.vehicleSeries)
  }

  calcPurchasedModel() {
    if (!this.currentPurchased) return
    const { regulationDiscount, guidePrice } = this.currentPurchased
    const { currentReplacement } = this
    const { form } = this
    let { tradeType } = form
    tradeType = tradeType || 0
    form.regulationDiscount = regulationDiscount
    form.guidePrice = guidePrice
    form.tradeInSubsidy = currentReplacement[tradeType] || 0
    this.calcGrossProfitLevel2()
  }

  calcCustomerInterestSubsidy() {
    const { customerInterestSubsidy, loanAmount } = this.form
    const { max } = Math
    this.form.amountExceedingRegulation = max(accSub(customerInterestSubsidy, accMul(loanAmount, 0.1)), 0)
  }

  calcTradeInSubsidy() {
    const { form, currentReplacement } = this
    let { tradeType } = form
    tradeType = tradeType || 0
    if (!currentReplacement) {
      form.tradeInSubsidy = 0
      return
    }
    form.tradeInSubsidy = currentReplacement[tradeType]
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
    const { form } = this
    const { dealerLoanProfit } = form
    form.financialSubsidy = dealerLoanProfit
  }

  calcInvoicePriceCalculation() {
    const {
      regulationDiscount,
      guidePrice,
      financialSubsidy,
      tradeInSubsidy
    } = this.form
    const invoicePriceCalculation = this.form.invoicePriceCalculation = accSub(guidePrice, regulationDiscount, financialSubsidy, tradeInSubsidy)
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
    const { tradeInSubsidy, regulationDiscount } = this.form
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
