<template>
  <XlsxTable
    :isHandleMerge="isHandleMerge"
    @on-select-all-file="awaitLoading"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot>
      <div class="xlsx-wrapper">
        <i class="el-icon-plus"></i>
      </div>
    </slot>
  </XlsxTable>
</template>

<script>
import XlsxTable from '@/components/xlsxTable'
import { changeArrKey } from '@/utils'
import { handleDataRules } from '@/utils/utils/validate'

export default {
  components: { XlsxTable },
  props: {
    excelKeys: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: [Object, Array],
      default: () => ({})
    },

    handleExcelData: {
      type: Function,
      default: (data) => data
    },
    handleParseData: {
      type: Function,
      default: (data) => data
    },
    isHandleMerge: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    async selectExcelData(excelData) {
      this.$emit('before-parse')
      // console.log(excelData)
      let { body = [] } = this.handleExcelData(excelData)
      // 获取字段转换后的数据
      const fileList = this.handleParseData(changeArrKey(body, this.excelKeys))
      this.$emit('input', fileList)

      const validData = await handleDataRules(this.rules, fileList)
      this.$emit('after-parse', { fileList, validData })

      // console.log(body)
      // console.log(fileList)
      // console.log(valids)
      // console.log({ fileList, valids })
    },
    awaitLoading(excelData) {
      awaitLoading(this.selectExcelData(excelData))
    }
  }
}
</script>
