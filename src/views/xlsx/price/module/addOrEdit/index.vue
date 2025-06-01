<template>
  <dialogForm
    v-model="form"
    customClass="review-dialog-wrapper"
    @closed="closed"
    v-bind="option"
    v-on="$listeners"
  >
    <template #bodyHeader>
      <div class="user-selected-wrapper" v-if="option.showUserSelected">
        <avue-crud-input type="textarea" v-model="selectedContent" class="mr24" :minRows="8"></avue-crud-input>
        <el-button type="primary" @click="onAnalysis">解析</el-button>
      </div>
    </template>
  </dialogForm>
</template>

<script>
import { getFormOption, SELECTED_KEY_MAP } from './const'
import { cloneDeep } from 'lodash'
import { changeArrKey } from '@/utils'
import { CalculationCar } from '@/views/xlsx/price/module/addOrEdit/utils'

export default {
  props: {
    type: {
      type: String,
      default: 'add'
    },

    data: Object
  },

  data() {
    return {
      selectedContent: '',
      form: {
        insuranceGift: 0,
        financialSubsidy: 0,
        invoicePriceCalculation: 0
      }
    }
  },

  computed: {
    option({ type, formOption }) {
      const list = {
        add: {
          title: '新增',
          btnType: 'primary',
          btnSize: 'medium',
          showUserSelected: true,
          width: 1000,
          height: '80vh',
          option: formOption
        },
        edit: {
          title: '编辑',
          btnType: 'text',
          showUserSelected: false,
          height: '80vh',
          width: 1000,
          option: formOption,
          beforeOpen: () => {
            this.form = cloneDeep(this.data)
            return true
          }
        }
      }
      return list[type]
    },

    calculationCarInstance() {
      return new CalculationCar({
        vmInstance: this
      })
    },

    formOption() {
      return getFormOption.call(this)
    }
  },


  methods: {
    findPurchasedModel(value) {
      value = value.toLowerCase()
      let searchValue = value
      const profitSystemDic = this.calculationCarInstance.profitSystemDic
      let fItem = profitSystemDic.find(item => item.value.toLowerCase() == value)
      searchValue = fItem?.value || ''
      if (searchValue) return searchValue
      fItem = profitSystemDic.find(item => item.value.toLowerCase().indexOf(value) >= 0)
      searchValue = fItem?.value || ''
      if (searchValue) return searchValue
      fItem = profitSystemDic.find(item => {
        let itemValue = item.value.toLowerCase()
        const splitValue = value.split('')
        for (let sItem of splitValue) {
          const fIndex = itemValue.indexOf(sItem)
          if (fIndex < 0) return
          itemValue = itemValue.substr(fIndex + 1)
        }
        return true
      })
      searchValue = fItem?.value || ''
      fItem = profitSystemDic.find(item => {
        let itemValue = item.value.toLowerCase()
        const splitValue = value.split('')
        for (let sItem of splitValue) {
          const fIndex = itemValue.indexOf(sItem)
          if (fIndex < 0) return
          itemValue = [...itemValue]
          itemValue.splice(fIndex, 1)
          itemValue = itemValue.join('')
        }
        return true
      })
      searchValue = fItem?.value || ''
      return searchValue
    },

    findTradeType(value) {
      if (!value) return '0'
      const currentReplacement = this.calculationCarInstance.currentReplacement
      if (!currentReplacement) return '0'
      const keys = Object.keys(currentReplacement)
      for (let key of keys) {
        const itemValue = currentReplacement[key]
        if (value == itemValue) {
          return key
        }
      }
      return '0'
    },

    findLoan(value) {
      const { loanDic } = this.calculationCarInstance
      let findLoan = loanDic.find(sItem => {
        return value.indexOf(sItem.bank) >= 0
      })
      if (!findLoan) {
        findLoan = loanDic.find(sItem => {
          return value.indexOf(sItem.keyword) >= 0
        })
      }
      return findLoan
    },

    onAnalysis() {
      const { max } = Math
      const selectedContent = this.selectedContent
      if (!selectedContent) return
      const splitLineData = selectedContent.split('\n')
      const splitData = {}
      splitLineData.map(item => {
        try {
          const [keysStr, valuesStr] = item.split(/:|：/)
          const keys = keysStr.split('/')
          let values = valuesStr.split('/')
          if ((keysStr.indexOf('银行') >= 0 || keysStr.indexOf('购车方式') >= 0) && keysStr.indexOf('贷款') >= 0 && keys.length !== values.length) {
            values = []
            let findLoan = this.findLoan(valuesStr)
            values.push(findLoan?.bank || '')
            const matchData = valuesStr.match(/\d+/g)
            if (!matchData) {
              values.push(60)
              values.push(0)
              return
            }
            let num1 = matchData.shift()
            let num2 = matchData.shift() || 0
            if (num1 == 60 || +num2 > +num1) {
              //贷款金额不能小于1000
              if (num2 < 1000 && num2 != 0) {
                num2 = 0
              }
            } else if (+num2 <= +num1) {
              let tmpNum = num1
              num1 = num2
              num2 = tmpNum
            }
            values.push(num1)
            values.push(num2)
          }

          keys.map((key, index) => {
            if (key.indexOf('银行') >= 0 || key.indexOf('购车方式') >= 0) {
              const findLoan = this.findLoan(values[index])
              splitData[key] = findLoan?.bank
            } else {
              splitData[key] = values[index]
            }
          })
        } catch (err) {
          console.log('err', err)
        }
      })
      const obj = changeArrKey([splitData], SELECTED_KEY_MAP)[0]
      for (let key in obj) {
        let value = obj[key]
        if (key === 'loanProduct') {
          const fItem = this.calculationCarInstance.loanDic.find(item => item.bank == value)
          value = fItem?.value || ''
        }
        if (key === 'purchasedModel') {
          value = this.findPurchasedModel(value)
        }
        if (key === 'tradeType') {
          value = this.findTradeType(value)
        }
        if (key == 'bank') {
          value = this.findTradeType(value)
        }
        this.form[key] = value
      }
      if (this.form.customerInterestSubsidy) {
        this.form.customerInterestSubsidy = max(this.form.customerInterestSubsidy, this.form.dealerLoanProfit, 0)
      }
      this.$message.success('操作成功，请仔细核对。')
    },

    closed() {
      Object.assign(this, this.$options.data.call(this))
    }
  }
}
</script>

<style lang="scss">
.review-dialog-wrapper {
  .form-container {
    margin-top: 32px;
  }
}

.user-selected-wrapper {
  display: flex;
}
</style>
