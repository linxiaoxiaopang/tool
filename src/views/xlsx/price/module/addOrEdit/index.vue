<template>
  <dialogForm
    v-model="form"
    customClass="review-dialog-wrapper"
    :beforeOpen="beforeOpen"
    @closed="closed"
    v-bind="option"
  >
    <template #invoicePriceCalculation>
      <baseForm v-model="form.invoicePriceCalculationForm" :option='invoicePriceCalculationFormOption'>

      </baseForm>
    </template>

  </dialogForm>
</template>

<script>
import { formOption, invoicePriceCalculationFormOption } from './const'
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
      form: {
        invoicePriceCalculationForm: {
          tradeInSubsidy: 0
        }
      },
      invoicePriceCalculationFormOption,
      selectionData: []
    }
  },

  computed: {
    option({type}) {
      const list = {
         add: {
           title: '新增',
           option: formOption
         }
      }

      return  list[type]
    }
  },

  watch: {
    // 'form.loanProduct': {
    //   handler(newVal) {
    //     if(!newVal) newVal = 0
    //    this.form.dealerLoanProfit = this.form.loanAmount * newVal
    //   },
    //   immediate: true
    // }
  },

  methods: {
    async beforeOpen() {
      const { updateContent, teamReviewRemake, adminReviewRemake  } = this.data?.artworkChangeRecordList?.[0] || {}
      this.form.updateContent = updateContent
      this.form.teamReviewRemake =  adminReviewRemake || teamReviewRemake
      return true
    },

    closed() {
      Object.assign(this.$data, this.$options.data())
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
</style>
