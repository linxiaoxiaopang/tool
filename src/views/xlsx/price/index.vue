<template>
  <pageContainer class="flex-column">
    <baseTable class="tabs-active-border--primary" :key="key" :option="option" :data="data" v-bind="$attrs">
      <template #menuLeft>
        <AddOrEdit @submit="onsubmit" />
        <XlsxTable
          class="inline-block ml10"
          :isMergeCell="true"
          :analysisAll="true"
          :keepOrigin="true"
          @on-map-select-file="onSelectMapData"
        >
          <el-button type="primary"> 上传规则</el-button>
        </XlsxTable>
        <el-button class="ml10" type="primary" @click="onExport"> 导出结果</el-button>
      </template>

      <template #menu="{row}">
        <AddOrEdit type="edit" :data="row" />
      </template>
    </baseTable>
  </pageContainer>
</template>

<script>
import baseTableChild from '@/components/base/baseTable/mixins/baseTableChild'
import getBaseTableDataMixin from '@/components/base/baseTable/mixins/getBaseTableDataMixin'
import XlsxTable from '@/components/xlsxTable.vue'
import AddOrEdit from './module/addOrEdit'
import { changeArrKey, getUUID } from '@/utils'
import { option, sheetDic, updateSheetData } from './const'

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
    onSelectMapData(excelData) {
      const sheetData = {}
      for (let item of sheetDic) {
        const { value: prop, label: sheetName, keyMap, handleData } = item
        const { body } = excelData[sheetName]
        sheetData[prop] = handleData(changeArrKey(body, keyMap))
      }
      updateSheetData(sheetData)
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
    },

    getFormattedDate() {
      const d = new Date()
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }
  }
}
</script>

<style lang="scss" scoped></style>
