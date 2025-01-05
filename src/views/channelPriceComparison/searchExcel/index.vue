<template>
  <pageContainer>
    <baseTable
      class="tabs-active-border--primary"
      :list="list"
      :data="filterData"
      :spanMethod="spanMethod"
      v-bind="$attrs"
    >
      <template #createTimeSearchForm>
        <dateTimePicker v-model="search.createTime" @change="searchChange"/>
      </template>
    </baseTable>
  </pageContainer>
</template>

<script>
import baseTableChild from '@/components/base/baseTable/mixins/baseTableChild'
import getBaseTableDataMixin from '@/components/base/baseTable/mixins/getBaseTableDataMixin'
import baseExcelMixin from '../mixins/baseExcelMixin'
import dateTimePicker from '@/components/base/baseTable/module/dateTimePicker'
import { getList, getFormatPrice } from '../utils'
import channelPriceComparisonApi from '@/api/channelPriceComparison'
import { validatenull } from '@/components/avue/utils/validate'
import { formatDate } from 'element-ui/src/utils/date-util'

export default {
  mixins: [
    baseTableChild(),
    getBaseTableDataMixin({
      dataAttrs: {
        searchForm: {},
        tableColumn: [],
        curTabItem: {}
      }
    }),
    baseExcelMixin()
  ],

  components: {
    dateTimePicker
  },

  data() {
    const today = formatDate(Date.now(), 'yyyy-MM-dd')
    return {
      search: {
        createTime: [today, today]
      },
      list: getList([], 'searchExcel')
    }
  },

  watch: {
    currentValue: {
      handler() {
        setTimeout(() => {
          this.updateDataAndOption()
        }, 50)
      },
      immediate: true
    }
  },

  methods: {
    async updateDataAndOption() {
      await this.getData()
      this.updateListByData(this.data)
    },

    searchChange() {
      this.updateDataAndOption()
    },

    async getData() {
      const createTime = $GET(this.search, 'createTime', [])
      if (validatenull(createTime)) {
        this.$message.error('请选择时间区间，再进行此操作')
        return
      }
      const [createStartData, createEndData] = createTime
      let res = await awaitResolveDetailLoading(channelPriceComparisonApi.list({
        type: this.currentValue,
        createEndTime: `${createEndData} 23:59:59`,
        createStartTime: `${createStartData} 00:00:00`,
        orderItems: [{ asc: false, column: 'create_time' }],
        page: {
          pageIndex: 1,
          pageSize: 0
        }
      }))
      this.data = []
      if (!res) return
      this.data = getFormatPrice(res)
    },

    updateListByData(data) {
      this.list = getList(data, 'searchExcel')
    }
  }
}

</script>

<style lang="scss" scoped>
</style>
