<template>
  <pageContainer class='flex-column'>
    <baseTable class='tabs-active-border--primary' :key='key' :option='option' :data='data' v-bind='$attrs'>
      <template #menuLeft>
        <AddOrEdit @submit='onsubmit' />
        <XlsxTable @on-select-file='onSelectMangoMapOrder' class='inline-block ml10' :keepOrigin='true'>
          <el-button type='primary'> 上传规则</el-button>
        </XlsxTable>
        <el-button class='ml10' type='primary' @click='onExport'> 导出结果</el-button>
      </template>

      <template #menu='{row}'>
        <AddOrEdit type='edit' :data='row' />
      </template>
    </baseTable>
  </pageContainer>
</template>

<script>
import baseTableChild from '@/components/base/baseTable/mixins/baseTableChild'
import getBaseTableDataMixin from '@/components/base/baseTable/mixins/getBaseTableDataMixin'
import XlsxTable from '@/components/xlsxTable.vue'
import AddOrEdit from './module/addOrEdit'
import { getUUID } from '@/utils'
import * as XLSX from 'xlsx'
import { option, ORDER_KEYS } from './const'

export default {
  components: {
    XlsxTable,
    AddOrEdit
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
      key: getUUID()
    }
  },

  computed: {
    option() {
      return option
    }
  },

  methods: {
    async onSelectMangoOrder(excelData) {
      let { body = [] } = excelData
    },

    onSelectMangoMapOrder(excelData) {
      let { body = [] } = excelData

    },

    onsubmit(form, done) {
      this.data.push(form)
      done(true)
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

      // 创建工作表
      const ws = XLSX.utils.json_to_sheet(data)

      // 创建工作簿并添加工作表
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '用户数据')

      // 导出为Excel文件
      XLSX.writeFile(wb, `${this.getFormattedDate()}价格.xlsx`)
    },

    getFormattedDate() {
      const d = new Date()
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }
  }
}
</script>

<style lang='scss' scoped></style>
