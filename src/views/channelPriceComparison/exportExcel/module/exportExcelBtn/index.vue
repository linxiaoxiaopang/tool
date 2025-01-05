<template>
  <XlsxTable :isMergeCell="true"  @on-select-file="onSelectFile">
    <slot name="xlsxBtn">
      <el-button >导入表格</el-button>
    </slot>
  </XlsxTable>
</template>

<script>
import XlsxTable from '@/components/xlsxTable.vue'
import { changeArrKey } from '@/utils'

export default {
  components: { XlsxTable },

  data() {
    return {
      data: [],
      transformKeys: {
        deliveryShipping: '出货方式',
        countryCnName: '国家',
        cargoAttributes: '货物属性',
        expressShippingMethod: '渠道',
        weight: '重量',
        price: '价格',
        registrationFee: '挂号费'
      }
    }
  },

  methods: {
    async onSelectFile(excelData) {
      let { body = [] } = excelData
      this.data = changeArrKey(body, this.transformKeys)
      this.$emit('changeData', this.data)
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
