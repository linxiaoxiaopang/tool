<template>
  <pageContainer class="flex-column">
    <baseTable
      class="tabs-active-border--primary"
      :list="list"
      :spanMethod="spanMethod"
      v-bind="$attrs"
    >
      <template #menuLeft="scoped">
        <el-button @click="onExport">
          导出表格
        </el-button>
      </template>
    </baseTable>
  </pageContainer>
</template>

<script>
import baseTableChild from '@/components/base/baseTable/mixins/baseTableChild'
import getBaseTableDataMixin from '@/components/base/baseTable/mixins/getBaseTableDataMixin'
import { list } from './const'
import { createSpanMethod, exportWrap } from '@/utils'
import channelPriceComparisonApi from '@/api/channelPriceComparison'
import { REQUEST_ALL_DATA } from '@/utils/constant'
import { formatDate } from 'element-ui/src/utils/date-util'

export default {

  mixins: [
    baseTableChild(),
    getBaseTableDataMixin({
      dataAttrs: {
        curTabItem: {},
        tableData: [],
        postData: {}
      }
    })
  ],

  props: {
    type: String
  },

  computed: {
    list() {
      return list
    }
  },

  methods: {
    onExport() {
      const isSelectedDate = this.postData.createEndTime && this.postData.createStartTime
      if(!isSelectedDate) {
        this.$message.warning('请先选择时间区间，再进行此操作！')
        return
      }
      return exportWrap(awaitLoading(
        channelPriceComparisonApi.exportShippingMethodPriceComparison({
          ...this.postData,
          ...REQUEST_ALL_DATA
        })
      ), `渠道价格对比表-${formatDate(Date.now(), 'yyyyMMdd')}` )
    },

    spanMethod(params) {
      return createSpanMethod(params, this.tableData, {
        props: [
          [
            {
              deliveryShipping: ['deliveryShipping']
            }
          ]
        ]
      })
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
