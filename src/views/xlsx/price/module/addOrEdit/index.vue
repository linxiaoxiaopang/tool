<template>
  <dialogForm
    v-model='form'
    customClass='review-dialog-wrapper'
    @closed='closed'
    v-bind='option'
    v-on='$listeners'
  >
  </dialogForm>
</template>

<script>
import { getFormOption } from './const'
import { cloneDeep } from 'lodash'

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
          option: formOption
        },
        edit: {
          title: '编辑',
          btnType: 'text',
          option: formOption,
          beforeOpen: () => {
            this.form = cloneDeep(this.data)
            return true
          }
        }
      }
      return list[type]
    },

    formOption() {
      return getFormOption.call(this)
    }
  },


  methods: {
    closed() {
      Object.assign(this, this.$options.data.call(this))
    }
  }
}
</script>

<style lang='scss'>
.review-dialog-wrapper {
  .form-container {
    margin-top: 32px;
  }
}
</style>
