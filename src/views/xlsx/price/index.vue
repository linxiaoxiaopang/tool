<template>
  <pageContainer class="flex-column">
    <baseTable class="tabs-active-border--primary" :key="key" :option="option" :data="data" v-bind="$attrs">
      <template #menuLeft>
        <AddOrEdit @submit="onAdd" />
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
        <AddOrEdit type="edit" :data="row" @submit="onEdit(row, ...arguments)" />
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
import { instanceCacheSheet } from './utils'

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
      instanceCacheSheet.update(sheetData)
      updateSheetData(sheetData)
    },

    onAdd(form, done) {
      this.data.push(form)
      done(true)
    },

    onEdit(row, form, done) {
      const fIndex = this.data.findIndex(item => item === row)
      this.data.splice(fIndex, 1, form)
      done(true)
    },

    generateTemplate(row) {
      const { column } = option
      const exportColumn = column.filter(item => item.isExport)
      let result = exportColumn.map(item => {
        const tmpArr = []
        let { label, prop, handleExportValue , handleExportLabel} = item
        let value = row[prop]
        if(handleExportLabel) {
          label = handleExportLabel(row)
        }
        if(handleExportValue) {
          value = handleExportValue(row)
        }
        tmpArr.push(label, ': ', value)
        return tmpArr.join('')
      })
      return result.join('<br/>')
    },

    onExport() {
      if (!this.data.length) {
        this.$message.error('数据为空，无法导出。')
        return
      }
      const result = this.data.map(item => {
        return this.generateTemplate(item)
      })
      this.copyStyledText(result)
    },

    copyStyledText(result) {
      // 创建一个隐藏的元素，用于存储带有样式的文本
      var tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'
      tempDiv.style.opacity = 0
      tempDiv.innerHTML = `<div>${result.map(item => item + '<br/>').join('<br/>')}</div>`
      console.log('tempDiv.innerHTML', tempDiv.innerHTML)
      document.body.appendChild(tempDiv)
      // 选择元素中的内容
      var range = document.createRange()
      range.selectNode(tempDiv)
      // 获取选择对象
      var selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      try {
        // 执行复制操作
        document.execCommand('copy')
        console.log('复制成功')
        this.$message.success('复制成功')
      } catch (err) {
        this.$message.error('复制失败')
        console.error('复制失败：', err)
      }
      // 清除选择和移除临时元素
      selection.removeAllRanges()
      document.body.removeChild(tempDiv)
    },

    getFormattedDate() {
      const d = new Date()
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }
  }
}
</script>

<style lang="scss" scoped></style>
