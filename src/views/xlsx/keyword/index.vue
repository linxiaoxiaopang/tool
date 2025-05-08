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
        <el-button @click='onAnalysis' v-if='data.length'>
          解析表格
        </el-button>

        <el-button @click='copyStyledText' v-if='formatData.length'>
          复制
        </el-button>
      </template>
      <template #[`${item.headerName}`] v-for='item in column'>
        <div>
          <HeaderSelect v-model='item.keywordType' />
          {{ item.label }}
        </div>
      </template>
      <template #formatTitle='{row}'>
        <span v-html='row.formatTitle'></span>
      </template>
    </baseTable>
  </pageContainer>
</template>

<script>
import baseTableChild from '@/components/base/baseTable/mixins/baseTableChild'
import getBaseTableDataMixin from '@/components/base/baseTable/mixins/getBaseTableDataMixin'
import XlsxTable from '@/components/xlsxTable.vue'
import HeaderSelect from './module/headerSelect'
import { headerDicList } from './const'
import { getUUID } from '@/utils'
import { map } from 'lodash'

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
    },

    formatData({data}) {
      return data.filter(item => item.formatTitle)
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
      column.push({
        label: '格式化后标题',
        prop: 'formatTitle'
      })
      this.data = body.map(item => {
        item.formatTitle = ''
        return item
      })
      this.column = column
      this.key = getUUID()
    },

    onAnalysis() {
      const titleItem = this.column.find(item => item.keywordType == headerDicList.title)
      if (!titleItem) {
        this.$message.error('原表题必选')
        return
      }
      const delItems = this.column.filter(item => item.keywordType == headerDicList.delete)
      const replaceItems = this.column.filter(item => item.keywordType == headerDicList.replace)
      const usedItems = this.column.filter(item => item.keywordType == headerDicList.used)
      const keepKeywordsItems = this.column.filter(item => item.keywordType == headerDicList.keepKeywords)
      const orderKeywordItems = this.column.filter(item => item.keywordType == headerDicList.color || item.keywordType == headerDicList.suffix || item.keywordType == headerDicList.suffixAndColor)
      this.data.map(item => {
        let title = item[titleItem.prop]
        keepKeywordsItems.map((sItem) => {
          const value = item[sItem.prop]
          const spliceValues = value.split(/,|，/)
          let matchData = []
          spliceValues.map(gItem => {
            const reg = new RegExp(gItem, 'ig')
            const matchValues = title.match(reg)
            if(!matchValues) return
            matchData.push(...matchValues)
          })
          title = matchData.join(' ')
        })

        delItems.map((sItem) => {
          const delValue = item[sItem.prop]
          const spliceDelValues = delValue.split(/,|，/)
          spliceDelValues.map(gItem => {
            const reg = new RegExp(gItem, 'ig')
            title = title.replace(reg, '')
          })
        })
        replaceItems.map((sItem, sIndex) => {
          const replaceValue = item[sItem.prop]
          const spliceDelValues = replaceValue.split(/,|，/)
          spliceDelValues.map(gItem => {
            const reg = new RegExp(gItem, 'ig')
            if (!usedItems[sIndex]) {
              title = title.replace(reg, '')
            } else {
              title = title.replace(reg, item[usedItems[sIndex].prop] || '')
            }
          })
        })
        orderKeywordItems.map(sItem => {
          if (sItem.keywordType == headerDicList.color) {
            const colorValue = item[sItem.prop]
            const splitTitle = title.split(colorValue)
            title = splitTitle.join(`<span class='text-danger'>${colorValue}</span>`)
          } else if (sItem.keywordType == headerDicList.suffixAndColor) {
            const suffixValue = item[sItem.prop]
            title += `<span class='text-danger'>${suffixValue}</span>`
          } else {
            const suffixValue = item[sItem.prop]
            title += suffixValue
          }
        })
        item.formatTitle = title.trim()
      })
      this.data = [...this.data]
    },

    copyStyledText() {
      // 创建一个隐藏的元素，用于存储带有样式的文本
      var tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'
      tempDiv.style.opacity = 0
      tempDiv.innerHTML = `<div>${map(this.data, 'formatTitle').map(item => item + '<br/>').join('')}</div>`
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
      } catch (err) {
        console.error('复制失败：', err)
      }
      // 清除选择和移除临时元素
      selection.removeAllRanges()
      document.body.removeChild(tempDiv)
    }
  }
}

</script>

<style lang='scss' scoped>

</style>
