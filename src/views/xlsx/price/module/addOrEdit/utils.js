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

  get filingDic() {
    return this.sheetData.filing
  }

  get currentPurchased() {
    const { purchasedModel } = this.form
    return this.profitSystemDic.find(item => item.value === purchasedModel)
  }

  get currentReplacement() {
    return this.replacementDic.find(item => item.vehicleSeries == this.currentPurchased?.vehicleSeries)
  }

  get currentTerminalDiscount() {
    const fItem = this.terminalDiscountDic.find(item => {
      const isSameVehicleSeries = item.vehicleSeries == this.currentPurchased?.vehicleSeries
      if (!isSameVehicleSeries) return false
      if (!item.vehicleModel) return true
      return item.vehicleModel == this.currentPurchased?.vehicleModel
    })
    if (fItem) return fItem
    if (!this.currentPurchased) return null
    return {
      label: this.currentPurchased.vehicleSeries,
      value: this.currentPurchased.vehicleSeries,
      vehicleSeries: this.currentPurchased.vehicleSeries,
      vehicleModel: this.currentPurchased.vehicleModel,
      discountAllowance: '0'
    }
  }

  get currentFiling() {
    if (!this.currentPurchased) return null
    return this.filingDic.find(item => {
      return this.shakingSpace(item.vehicleSeries) == this.shakingSpace(this.currentPurchased.vehicleSeries) && this.shakingSpace(item.vehicleModel) == this.shakingSpace(this.currentPurchased.vehicleModel)
    })
  }

  shakingSpace(value) {
    if (!value) return
    value = `${value}`
    return value.replace(/\s/g, '').toLowerCase()
  }

  calcPurchasedModel() {
    if (!this.currentPurchased) return
    const { guidePrice } = this.currentPurchased
    const { regulationDiscount } = this.currentFiling
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
    form.dealerLoanProfit = accMul(loanAmount, loanProduct.split('_')[1])
  }

  calcFinancialSubsidy() {
    const { form } = this
    const { customerInterestSubsidy } = form
    form.financialSubsidy = customerInterestSubsidy
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

  calcUseInvoicePriceCalculation() {
    const { max } = Math
    if (!this.currentFiling) {
      this.form.amountExceedingRegulation = 0
      this.form.insuranceGift = 0
      return
    }
    const { guidePrice, invoicePriceCalculation, tradeInSubsidy, loanAmount, dealerLoanProfit } = this.form
    const { regulationDiscount } = this.currentFiling
    const subValue = accSub(guidePrice, invoicePriceCalculation, tradeInSubsidy, regulationDiscount)
    if (subValue <= 0) {
      this.form.amountExceedingRegulation = 0
      this.form.insuranceGift = 0
      return
    }
    const loanAmountQuota = accMul(loanAmount, 0.1)
    this.form.amountExceedingRegulation = max(0, accSub(subValue, loanAmountQuota))
    this.form.insuranceGift = max(0, accSub(subValue, dealerLoanProfit))
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
    const deliveryPrice = accSub(invoicePriceCalculation, guidePrice)
    form.grossProfitLevel1 = accAdd(deliveryPrice, priceDifference, monthlyDeliveryConcession, advertisingSupportConcession, sincereServiceAssessmentConcession, wes)
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
