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
        <avue-crud-input type="text" v-model="selectedContent"></avue-crud-input>
        <el-button @click="onAnalysis">解析</el-button>
      </div>
    </template>
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

    formOption() {
      return getFormOption.call(this)
    }
  },


  methods: {
    onAnalysis() {

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
</style>
