<template>
  <pageContainer class="flex-column">
    <baseTable class="tabs-active-border--primary" :key="key" :option="option" :data="data" v-bind="$attrs">
      <template #menuLeft>
        <AddOrEdit @submit="onAdd" />
        <el-button class="ml10" type="primary" @click="onExport"> 导出结果</el-button>
      </template>

      <template #menuRight>
        <el-button class="ml10" type="danger" @click="onClear"> 清空数据</el-button>
        <XlsxTable
          ref="xlsxTable"
          class="inline-block ml10"
          :isMergeCell="true"
          :analysisAll="true"
          :keepOrigin="true"
          @on-map-select-file="onSelectMapData"
        >
          <el-button type="primary"> {{ dataBaseDate ? `(${dataBaseDate})` : '' }} 更新数据库</el-button>
        </XlsxTable>
      </template>

      <template #menu="{row}">
        <AddOrEdit type="edit" :data="row" @submit="onEdit(row, ...arguments)" />
        <el-button class="ml10" type="text" @click="onDelete(row)"> 删除</el-button>
        <el-button class="ml10" type="text" @click="onExport(row)"> 导出结果</el-button>
      </template>
    </baseTable>
  </pageContainer>
</template>

<script>
import baseTableChild from '@/components/base/baseTable/mixins/baseTableChild'
import getBaseTableDataMixin from '@/components/base/baseTable/mixins/getBaseTableDataMixin'
import XlsxTable from '@/components/xlsxTable.vue'
import AddOrEdit from './module/addOrEdit'
import { changeArrKey, getUUID, initJsonData } from '@/utils'
import { getDefaultSheetData, option, sheetDic, updateSheetData } from './const'
import { instanceCacheSheet } from './utils'
import { formatDate } from 'element-ui/src/utils/date-util'
import { isArray, merge } from 'lodash'
import { uploadToOss } from '@/commons/webOss'

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
      dataBaseDate: '',
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

  mounted() {
    this.initSheetData()
  },

  methods: {
    async initSheetData() {
      this.$emit('beforeDataBaseUpdate')
      const src = 'https://lgy-tool.oss-cn-beijing.aliyuncs.com/asset/dataBase.json'
      const res = await awaitLoadingOnly(initJsonData(src))
      const sheetData = merge({}, getDefaultSheetData(), res)
      instanceCacheSheet.update(sheetData)
      this.dataBaseDate = sheetData.date || ''
      updateSheetData(sheetData)
      this.$emit('afterDataBaseInitUpdate')
    },

    jsonToBlob(json) {
      const jsonData = json
      const jsonString = JSON.stringify(jsonData, null, 2) // 转为格式化的 JSON 字符串
      // 创建 Blob 对象，指定 MIME 类型为 application/json
      const blob = new Blob([jsonString], { type: 'application/json' })
      return new File([blob], 'dataBase.json', {
        type: blob.type,          // 继承 Blob 的 MIME 类型
        lastModified: Date.now()  // 当前时间作为修改日期
      })
    },

    async onSelectMapData(excelData) {
      try {
        const file = this.$refs.xlsxTable.rawFile
        const uploadFileRes = await uploadToOss(file)
        if (!uploadFileRes) return
        const sheetData = {}
        for (let item of sheetDic) {
          const { value: prop, label: sheetName, keyMap, handleData } = item
          const { body } = excelData[sheetName]
          sheetData[prop] = handleData(changeArrKey(body, keyMap))
        }
        sheetData.date = formatDate(new Date())
        const blob = this.jsonToBlob(sheetData)
        const result = await uploadToOss(blob, {
          useNormalName: true
        })
        console.log('result', result)
        this.dataBaseDate = sheetData.date
        instanceCacheSheet.update(sheetData)
        updateSheetData(sheetData)
      } catch (error) {
        this.$message.error(error.toString())
        throw error
      }
    },

    onDelete(row) {
      const fIndex = this.data.findIndex(item => item == row)
      if (fIndex >= 0) {
        this.data.splice(fIndex, 1)
      }
    },

    onClear() {
      this.data = []
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
        let { label, prop, handleExportValue, handleExportLabel, suffix } = item
        let value = row[prop]
        if (handleExportLabel) {
          label = handleExportLabel(row)
        }
        if (handleExportValue) {
          value = handleExportValue(row)
        } else if (suffix) {
          value = `${value}${suffix}`
        }

        tmpArr.push(label, ': ', value)
        return tmpArr.join('')
      })
      return result.join('<br/>')
    },

    onExport(data) {
      if (!data) data = this.data
      if (!isArray(data)) data = [data]
      if (!data.length) {
        this.$message.error('数据为空，无法导出。')
        return
      }
      const result = data.map(item => {
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
