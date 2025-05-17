<template>
  <pageContainer class="flex-column">
    <baseTable class="tabs-active-border--primary" :key="key" :option="option" :data="data" v-bind="$attrs">
      <template #menuLeft>
        <XlsxTable @on-select-file="onSelectMangoOrder" class="inline-block" :keepOrigin="true">
          <el-button type="primary"> 上传芒果店长excel </el-button>
        </XlsxTable>
        <XlsxTable @on-select-file="onSelectMangoMapOrder" class="inline-block ml10" :keepOrigin="true">
          <el-button type="primary"> 上传芒果店长映射excel </el-button>
        </XlsxTable>

        <el-button class="ml10" type="primary" @click="onExport"> 导出正丁excel </el-button>
      </template>
    </baseTable>
  </pageContainer>
</template>

<script>
import baseTableChild from '@/components/base/baseTable/mixins/baseTableChild'
import getBaseTableDataMixin from '@/components/base/baseTable/mixins/getBaseTableDataMixin'
import XlsxTable from '@/components/xlsxTable.vue'
import { getUUID, changeArrKey } from '@/utils'
import * as XLSX from 'xlsx'
import { option, ORDER_KEYS, MANGOERP_ORDER_KEYS, MANGOERP_MAP_ORDER_KEYS } from './const'
import { cloneDeep } from 'lodash'

export default {
  components: {
    XlsxTable
  },

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

  data() {
    return {
      column: [],
      data: [],
      mango: {
        data: []
      },
      mangoMap: {
        data: []
      },
      key: getUUID()
    }
  },

  computed: {
    option() {
      return option
    },

    mangoData({ mango }) {
      return mango.data
    },

    mangoMapData({ mangoMap }) {
      return mangoMap.data
    }
  },

  methods: {
    async onSelectMangoOrder(excelData) {
      let { body = [] } = excelData
      this.mango.data = changeArrKey(body, MANGOERP_ORDER_KEYS)
      this.mergeData()
    },

    onSelectMangoMapOrder(excelData) {
      let { body = [] } = excelData
      this.mangoMap.data = changeArrKey(body, MANGOERP_MAP_ORDER_KEYS)
      this.mergeData()
    },

    onExport() {
      if (!this.data.length) {
        this.$message.error('数据为空，无法导出。')
        return
      }
      const header = Object.keys(this.data[0])
      this.exportJsonToExcel({ header, data: this.data })
    },

    exportJsonToExcel() {
      // 示例JSON数据
      const jsonData = this.data
      const props = Object.keys(ORDER_KEYS)
      const data = jsonData.map((item) => {
        const tmpObj = {}
        props.map((prop) => {
          tmpObj[ORDER_KEYS[prop]] = item[prop]
        })
        return tmpObj
      })
      debugger

      // 创建工作表
      const ws = XLSX.utils.json_to_sheet(data)

      // 创建工作簿并添加工作表
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '用户数据')

      // 导出为Excel文件
      XLSX.writeFile(wb, `${this.getFormattedDate()}芒果店长.xlsx`)
    },

    getFormattedDate() {
      const d = new Date()
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    },

    mergeData() {
      if (!this.mangoData.length || !this.mangoMapData.length) return
      const cloneMangoData = cloneDeep(this.mangoData)
      const cloneMangoMapData = cloneDeep(this.mangoMapData)
      const finalData = []
      cloneMangoData.map((item) => {
        const filterData = cloneMangoMapData.filter((sItem) => sItem.orderCode == item.orderCode)
        if (!filterData.length) {
          finalData.push(item)
          return
        }
        const fillData = filterData.map((sItem) => {
          return {
            ...item,
            ...sItem
          }
        })
        finalData.push(...fillData)
      })
      this.data = this.formatData(finalData)
      this.key = getUUID()
    },

    formatData(data) {
      return data.map((item) => {
        item.sku = item.sku.split('-').slice(3).join('-')
        return item
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
