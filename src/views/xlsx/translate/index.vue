<template>
  <pageContainer class='flex-column'>
    <baseTable
      class='tabs-active-border--primary'
      :key='key'
      :option='option'
      :data='data'
      v-bind='$attrs'
    >
      <template #menuLeft='scoped'>
        <XlsxTable @on-select-file='onSelectFile' class='inline-block' :keepOrigin='true' />
        <el-button class="ml10" type="primary" @click="onExport"> 导出翻译 </el-button>

      </template>

      <template #[`${item.headerName}`] v-for='item in column'>
        <div>
          <HeaderSelect :multiple='true' v-model='item.languages' @change='onChange(item, $event)' />
          {{ item.label }}
        </div>
      </template>
    </baseTable>
  </pageContainer>
</template>

<script>
import baseTableChild from '@/components/base/baseTable/mixins/baseTableChild'
import getBaseTableDataMixin from '@/components/base/baseTable/mixins/getBaseTableDataMixin'
import XlsxTable from '@/components/xlsxTable.vue'
import HeaderSelect from './module/headerSelect'
import { baiduTranslate } from '@/utils/translate'
import { getUUID } from '@/utils'
import { isArray, map } from 'lodash'
import { dic } from './const'
import * as XLSX from 'xlsx'

export default {
  components: {
    XlsxTable,
    HeaderSelect
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
      languages: [],
      column: [],
      data: [],
      key: getUUID()
    }
  },

  computed: {
    option({ column }) {
      return {
        menu: false,
        column
      }
    }
  },

  methods: {
    async onSelectFile(excelData) {
      let { body = [], header } = excelData
      const column = header.map(prop => {
        return {
          label: prop,
          prop: prop,
          headerName: `${prop}Header`
        }
      })
      this.column = column
      this.data = body
      this.key = getUUID()
    },

    onExport() {
      if (!this.data.length) {
        this.$message.error('数据为空，无法导出。')
        return
      }
      const ws = XLSX.utils.json_to_sheet(this.data)

      // 创建工作簿并添加工作表
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '用户数据')

      // 导出为Excel文件
      XLSX.writeFile(wb, `${this.getFormattedDate()}翻译.xlsx`)
    },

    getFormattedDate() {
      const d = new Date()
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    },

    clearCol(col, delValues) {
      const { prop: colProp } = col
      if (!delValues) {
        delValues = this.dic
      }
      delValues.map(item => {
        const fIndex = this.column.findIndex(sItem => sItem.prop == `${colProp}_${item.value}`)
        if (fIndex >= 0) {
          this.column.splice(fIndex, 1)
        }
      })
    },

    async onChange(col, values) {
      if (!values) return
      if (!isArray(values)) values = [values]
      const delValues = dic.filter(item => !values.find(sItem => sItem == item.value))
      this.clearCol(col, delValues)
      if (!values.length) return
      const { label: colLabel, prop: colProp } = col
      const filterValues = []
      for (let language of values) {
        const prop = `${colProp}_${language}`
        const fItem = this.column.find(item => item.prop == prop)
        if (!fItem) {
          filterValues.push(language)
        }
      }
      values = filterValues
      delValues.map(item => {
        const fIndex = this.column.findIndex(sItem => sItem.prop == `${colProp}_${item.value}`)
        if (fIndex >= 0) {
          this.column.splice(fIndex, 1)
        }
      })
      const fIndex = this.column.findIndex(item => item == col)
      if (fIndex >= 0) {
        this.column.splice(fIndex + 1, 0, ...values.map(language => {
          const fItem = dic.find(item => item.value == language)
          return {
            label: `${colLabel}_${fItem.value}`,
            prop: `${colProp}_${fItem.value}`
          }
        }))
      }
      for (let language of values) {
        const { sentencesData, query } = this.getTranslateData(this.data, colProp)
        const res = await this.translate({ query, to: language })
        const { data: { trans_result: transResult } } = res
        sentencesData.map(item => {
          const { raw, start, end } = item
          const curTrans = transResult.slice(start, end).map(item => item.dst)
          const prop = `${colProp}_${language}`
          this.$set(raw, prop, curTrans.join('\n'))
        })
        console.log('res', res)
      }

      this.key = getUUID()
    },

    getTranslateData(data, prop) {
      let pos = 0
      const sentencesData = data.map(item => {
        const sentences = item[prop].split('\n')
        const start = pos
        const offset = sentences.length
        const end = start + offset
        const tmpObj = {
          start,
          offset,
          end,
          sentences,
          rawId: item.id,
          raw: item
        }
        pos = end
        return tmpObj
      })
      const query = map(data, prop).join('\n')
      return {
        sentencesData,
        query
      }
    },

    async translate(query) {
      const res = await baiduTranslate.action(query)
      console.log('res', res)
      return res
    }
  }
}

</script>

<style lang='scss' scoped>

</style>
