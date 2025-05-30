import { accAdd, accMul, accSub } from '@/utils'
import { sheetData } from '../../const'

export class CalculationCar {
  constructor(option = {}) {
    const { vmInstance } = option
    this.vmInstance = vmInstance
  }

  get form() {
    return this.vmInstance.form
  }

  get sheetData() {
    return sheetData
  }

  get loanDic() {
    return this.sheetData.loan
  }

  get replacementDic() {
    return this.sheetData.replacement
  }

  get profitSystemDic() {
    return this.sheetData.profitSystem
  }

  get terminalDiscountDic() {
    return this.sheetData.terminalDiscount
  }

  get currentPurchased() {
    const { purchasedModel } = this.form
    return this.profitSystemDic.find(item => item.value === purchasedModel)
  }

  get currentReplacement() {
    return this.replacementDic.find(item => item.vehicleSeries == this.currentPurchased?.vehicleSeries)
  }

  get currentTerminalDiscount() {
    return this.terminalDiscountDic.find(item => item.vehicleSeries == this.currentPurchased?.vehicleSeries)
  }

  calcPurchasedModel() {
    if (!this.currentPurchased) return
    const { guidePrice } = this.currentPurchased
    const { regulationDiscount } = this.currentTerminalDiscount
    const { form } = this
    form.regulationDiscount = regulationDiscount
    form.guidePrice = guidePrice
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
    if (!currentReplacement) {
      form.tradeInSubsidy = 0
      return
    }
    form.tradeInSubsidy = currentReplacement[tradeType] || 0
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
    const {
      guidePrice,
      priceDifference,
      monthlyDeliveryConcession,
      advertisingSupportConcession,
      sincereServiceAssessmentConcession,
      wes
    } = this.currentPurchased
    const deliveryPrice = accSub(invoicePriceCalculation, guidePrice, monthlyDeliveryConcession, advertisingSupportConcession, sincereServiceAssessmentConcession, wes)
    form.grossProfitLevel1 = accAdd(deliveryPrice, priceDifference)
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
