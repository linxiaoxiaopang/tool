<template>
  <avue-crud
    ref="crud"
    class="base-table"
    :class="{ 'flex-one-page': finalOption.isOnePage }"
    :height="finalHeight"
    :search.sync="searchForm"
    :data="finalData"
    :option="finalOption"
    :checkCurrent="finalCheckAll && checkboxCurrent"
    :unselectable="!canCheckOnCheckAll && isCheckAllFromBtn"
    :dic="finalDic"
    :page="tablePage"
    :tableLoading="tableLoading || loading"
    :span-method="handleSpanMethod"
    @size-change="sizeChange"
    @current-change="pageChange"
    @search-change="searchChange"
    @search-reset="searchChange"
    @select="handleSelect"
    @select-all="handleSelectAll"
    @search-init="baseTableInit"
    v-bind="$attrs"
    v-on="new$listeners"
  >
    <template v-for="slot in scopedSlots" v-slot:[slot.prop]="scope">
      <component
        v-if="components[slot.type]"
        :is="components[slot.type]"
        v-bind="handleBindData(scope, slot)"
      ></component>
      <slot v-else :name="slot.prop" v-bind="scope"></slot>
    </template>

    <template v-if="finalList || $scopedSlots[tabsPlacement]" #[tabsPlacement]>
      <div class="crud-header-before">
        <baseTabs
          v-if="finalList"
          v-model="curTab"
          :dic="finalList"
          @change="handleTabChange"
          @tab-click="handleTabClick"
        >
          <template v-for="(value, key) in tabsSlots" v-slot:[key]="scope">
            <slot :name="value" v-bind="scope"></slot>
          </template>
        </baseTabs>
        <div><slot :name="tabsPlacement" :tab="curTabItem"></slot></div>
      </div>
    </template>
    <template #[checkAllPlacement]>
      <checkAllData
        v-if="finalCheckAll || checkCurrent"
        ref="checkAllData"
        v-bind="checkAllAttrs"
        v-on="checkAllListeners"
      ></checkAllData>
      <slot :name="checkAllPlacement"></slot>
    </template>
  </avue-crud>
</template>

<script>
import avueCrudMixin from './mixins/avueCrud'
import checkAllMixin from './module/checkAllData/checkAllMixin'
import parent from './mixins/parent'
import getParentAttrsMixin from './mixins/getParentAttrsMixin'
import proxyMixin from './mixins/proxyMixin'
import { cloneDeep, pull, get, lowerFirst } from 'lodash'
import baseIteratee from 'lodash/_baseIteratee'
import { getDiffData, validateDiffData, validData } from '@/components/avue/utils/util'
import { filterByPermission, getTabAllLevels, getTabValues } from '@/components/base/baseTabs/util'
import { validatenull } from '@/components/avue/utils/validate'
import { handleTableSpan, handleObjectSpanMethod } from './utils/mergeTable'
import propsOriginMixin from '@/mixins/parentProps/propsOriginMixin'

let customSlotList = [] // 自定义插槽
const emptyObj = {}

export default {
  name: 'baseTable',
  componentName: 'baseTable',
  inheritAttrs: false,
  mixins: [
    propsOriginMixin,
    getParentAttrsMixin([
      'list',
      'tabOptions',
      'resetMergeData',
      'checkCurrent',
      'dic',
      'getList',
      'api',
      'isInit',
      'selectable',
      'isReserveSelection',
      'handleSearchFormProps',
      'beforeInit',
      'afterInit',
      'handleTableData',
      'handlePostData'
    ]),

    // proxyMixin 对父级赋值 应该在 子级后面
    proxyMixin([
      {
        name: 'crud',
        dataAttrs: {
          tableColumn: []
        }
      },
      {
        name: 'baseTable',
        componentName: 'crud',
        relation: 'grand'
      },
      {
        name: 'baseTable',
        relation: 'parent'
      }
    ]),

    avueCrudMixin({
      isInit: false
    }),
    checkAllMixin()
  ],
  props: {
    // 全部列表数据
    data: {
      type: Array,
      default: () => []
    },
    option: {
      type: Object,
      default: () => ({})
    },
    search: {
      type: Object,
      default: () => ({})
    },
    loading: Boolean,
    showAllLevels: Boolean,
    tabValue: {},
    pageObj: {
      type: Object
    },
    api: Function,
    initOnTabChange: Boolean,
    allDataApi: Function,
    handlePageData: {
      type: Function,
      default: (data) => data
    },

    tabsPlacement: {
      default: 'headerBefore'
    },

    checkAll: Boolean,
    checkboxCurrent: Boolean,
    checkAllPlacement: {
      default: 'menuLeftBefore'
    },
    canCheckOnCheckAll: Boolean,
    isHandleRealData: Boolean,
    mergeKeys: {
      type: Array,
      default: () => []
    },
    spanMethod: Function,
    defaultSelection: Array,
    radioMode: Boolean
  },
  data() {
    return {
      curTab: [],
      unwatchs: {},
      tablePage: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      DIC: {},
      rowSpanObj: {},
      isOnePageLock: false
    }
  },
  computed: {
    finalData() {
      let {
        data,
        getList,
        tableData,
        tablePage: { pageIndex, pageSize },
        finalOption: { topPage, page }
      } = this

      if (getList) {
        return tableData
      }

      if (validatenull(data)) return []
      // 无上下分页器，则显示全部数据
      if (topPage === false && page === false) return this.handlePageData(data)
      return this.handlePageData(
        data.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
      )
    },
    checkData({ finalData }) {
      return this.handleCheckData(finalData)
    },

    finalList() {
      return filterByPermission(this.getParentAttrs('list'))
    },
    tabAllLevels() {
      return getTabAllLevels(this.finalList)
    },
    listObj({ finalList }) {
      return getTabValues(finalList)
    },
    curTabItem({ tabOptions }) {
      const curTabValue = this.curTab.slice(-1)[0]
      return {
        ...tabOptions.default,
        ...tabOptions[curTabValue],
        ...this.listObj[curTabValue]
      }
    },
    tabOptions() {
      return this.getParentAttrs('tabOptions') || {}
    },
    resetMergeData({ listObj, tabOptions }) {
      let mergeData = this.curTab.reduce((prev, value) => {
        return {
          ...prev,
          ...tabOptions[value]?.resetMergeData,
          ...listObj[value]?.resetMergeData
        }
      }, {})
      return {
        ...this.getParentAttrs('resetMergeData'),
        ...tabOptions.default?.resetMergeData,
        ...mergeData
      }
    },
    getList() {
      return this.getAttr('getList') || this.getAttr('api') || this.api
    },
    isInit() {
      return validData(this.getAttr('isInit'), true)
    },
    curOption() {
      return this.curTabItem.option || this.option
    },
    finalCheckAll() {
      return validData(this.curTabItem.checkAll, this.curOption.checkAll, this.checkAll)
    },
    checkCurrent() {
      return validData(this.curTabItem.checkCurrent, this.curOption.checkCurrent, this.getParentAttrs('checkCurrent'))
    },

    finalOption({ finalSettings, finalColumn }) {
      return {
        ...finalSettings,
        column: finalColumn,
        selection: validData(finalSettings.selection, this.finalCheckAll),
        canCheckOnCheckAll: validData(
          this.curTabItem.canCheckOnCheckAll,
          finalSettings.canCheckOnCheckAll,
          this.canCheckOnCheckAll
        )
      }
    },
    finalSettings({ curOption, finalColumn }) {
      let isOnePage = validData(curOption.isOnePage, true)
      return {
        ...curOption,
        isOnePage,
        height: undefined,
        finalHeight: validData(curOption.height, isOnePage ? '100%' : undefined),
        search: validData(
          curOption.search,
          finalColumn.some((ele) => ele.search)
        ),
        rowKey: validData(curOption.rowKey, curOption.reserveSelection ? 'id' : undefined),
        topPage: validData(curOption.topPage, false),
        pageSizes: validData(curOption.pageSizes, [20, 50, 100, 200]),
        editBtn: validData(curOption.editBtn, false),
        delBtn: validData(curOption.delBtn, false),
        selectable: this.selectable
      }
    },
    finalColumn({ curOption }) {
      return cloneDeep(curOption.column || [])
    },
    finalDic() {
      return {
        ...this.DIC,
        ...this.getParentAttrs('dic'),
        ...this.curOption.dic
      }
    },
    selectable() {
      return (row, index) => {
        if (this.isUnselectable(row)) return false

        const selectable = this.selectableFn
        return typeof selectable !== 'function' || selectable(row, index)
      }
    },
    selectableFn() {
      return this.curOption.selectable || this.getAttr('selectable')
    },
    checkable() {
      const checkable = this.curOption.checkable || this.curTabItem.checkable

      return (row, index) => {
        if (this.isUnselectable(row)) return false

        return typeof checkable !== 'function' || checkable(row, index)
      }
    },
    isUnselectable() {
      return (row) => {
        return this.spanRules && row.$unselectable
      }
    },
    finalHeight({ finalSettings }) {
      if (finalSettings.finalHeight && finalSettings.isOnePage)
        return this.isOnePageLock ? finalSettings.finalHeight : undefined
      return finalSettings.finalHeight
    },

    isReserveSelection() {
      return this.getAttr('isReserveSelection')
    },

    scopedSlots({ finalColumn, slots, componentKeys }) {
      let scopedSlots = slots.map((slot) => slot)
      finalColumn.forEach((column) => {
        // 有设置插槽则开启表单插槽功能
        let tempArr = scopedSlots.filter((slot) => slot.originProp === column.prop)
        if (tempArr.length) {
          tempArr.forEach((slot) => {
            column[slot.slotType] = true
            slot.type = column.type
          })
        }
        if (componentKeys.includes(column.type)) {
          column.slot = true
          scopedSlots.push({
            prop: column.prop,
            type: column.type
          })
          if (column.search) {
            column.searchFormSlot = true
            scopedSlots.push({
              prop: `${column.prop}SearchForm`,
              type: column.type
            })
          }
        }
      })

      return scopedSlots
    },
    slots({ $scopedSlots }) {
      let scopedSlots = Object.keys($scopedSlots)
      pull(scopedSlots, ...customSlotList) // 删除插槽以便扩展

      let tempArr = []
      scopedSlots.forEach((prop) => {
        let slot = { prop }
        tempArr.push(slot)

        if (/SearchForm$/.test(prop)) {
          slot.slotType = 'searchFormSlot'
          slot.originProp = prop.replace(/SearchForm$/, '')
        } else if (/Header$/.test(prop)) {
          slot.slotType = 'headerSlot'
          slot.originProp = prop.replace(/Header$/, '')
        } else {
          slot.slotType = 'slot'
          slot.originProp = prop
        }
      })
      return tempArr
    },
    componentKeys({ components }) {
      return Object.keys(components)
    },
    components() {
      return {}
    },

    tabsSlots({ $scopedSlots }) {
      const tmpObj = {}
      for (const key in $scopedSlots) {
        if (/^tabs/.test(key)) {
          const slotName = lowerFirst(key.replace(/^tabs/, ''))
          tmpObj[slotName] = key
        }
      }
      return tmpObj
    },

    propIndexes({ finalOption, tableColumn = [] }) {
      let tmpObj = { length: 0, indexes: {} }
      let propIndexes = tmpObj.indexes
      for (const prop of ['expand', 'selection', 'index']) {
        if (finalOption[prop]) {
          tmpObj.start || (tmpObj.start = prop)
          tmpObj.end = prop

          propIndexes[prop] = tmpObj.length++
        }
      }
      tableColumn.forEach(({ prop }) => {
        tmpObj.start || (tmpObj.start = prop)
        tmpObj.end = prop

        propIndexes[prop] = tmpObj.length++
      })
      if (validData(finalOption.menu, true)) {
        tmpObj.start || (tmpObj.start = '$menu')
        tmpObj.end = '$menu'

        propIndexes.$menu = tmpObj.length++
      }
      return tmpObj
    },
    spanRules({ curOption: { autoSpan, spanRules } }) {
      if (!autoSpan && !spanRules) return

      // ruleName：合并规则名称（行数据自定义字段/数组子项）
      // 当前行使用规则：row[ruleName] || row.$rowspanRules.includes(ruleName) || row.$colspanRules.includes(ruleName)
      // prop：表格列prop  matchFn：行数据匹配函数（@params row）同lodash.findIndex匹配规则
      // rowspan - props：表明该规则适用于哪些表格列
      // let spanRules = {
      //   rowspan: {
      //     [ruleName]: {
      //       props: [prop],
      //       start: matchFn,
      //       end: matchFn,
      //       show: matchFn // 行合并只能选择第一行为显示行？？
      //     }
      //   },
      //   colspan: {
      //     [ruleName]: {
      //       start: prop,
      //       end: prop,
      //       show: prop
      //     }
      //   }
      // }
      let { tableColumn } = this
      let firstProp = tableColumn[0]?.prop
      let defaultRules = {
        rowspan: {},
        colspan: {
          $isTitle: {
            start: firstProp
          },
          $unselectable: {
            start: 'selection',
            end: firstProp,
            show: firstProp
          }
        }
      }

      let { rowspan = {}, colspan = {} } = spanRules || {}
      Object.assign(rowspan, defaultRules.rowspan)
      Object.assign(colspan, defaultRules.colspan)

      let {
        propIndexes: { start, end, indexes }
      } = this
      let props = Object.keys(indexes)
      for (const ruleName in rowspan) {
        const rule = rowspan[ruleName]
        for (const key of ['start', 'end', 'show']) {
          rule[key] && (rule[key] = baseIteratee(rule[key]))
        }
        !rule.props && (rule.props = props)
      }

      for (const ruleName in colspan) {
        const rule = colspan[ruleName]
        !rule.start && (rule.start = start)
        !rule.end && (rule.end = end)
        !rule.show && (rule.show = rule.start)

        let tmpObj = {}
        let startIndex = indexes[rule.start]
        let endIndex = indexes[rule.end]
        for (let i = startIndex; i <= endIndex; i++) {
          tmpObj[i] = 0
        }
        tmpObj[indexes[rule.show]] = endIndex - startIndex + 1
        colspan[ruleName] = tmpObj
      }

      return {
        rowspan,
        colspan
      }
    },
    autoSpanMethod({ spanRules, finalData }) {
      if (!spanRules) return

      const { rowspan, colspan } = spanRules

      let rowspanObj = {}
      finalData.forEach((row, rowIndex) => {
        if (!row.$colspan || row.$colspan.$calculate) {
          row.$colspan = { $calculate: true }

          if (!row.$colspanRules) row.$colspanRules = []
          for (const ruleName in colspan) {
            row[ruleName] && !row.$colspanRules.includes(ruleName) && row.$colspanRules.unshift(ruleName)
          }
          colspan.$colspanAll &&
            row.$colspanAll !== false &&
            !row.$colspanRules.includes('$colspanAll') &&
            row.$colspanRules.unshift('$colspanAll')
          colspan.$all && row.$all !== false && !row.$colspanRules.includes('$all') && row.$colspanRules.unshift('$all')

          row.$colspanRules.forEach((ruleName) => colspan[ruleName] && Object.assign(row.$colspan, colspan[ruleName]))
        }

        if (!row.$rowspan || row.$rowspan.$calculate) {
          row.$rowspan = { $calculate: true }

          if (!row.$rowspanRules) row.$rowspanRules = []
          for (const ruleName in rowspan) {
            row[ruleName] && !row.$rowspanRules.includes(ruleName) && row.$rowspanRules.unshift(ruleName)
          }
          rowspan.$rowspanAll &&
            row.$rowspanAll !== false &&
            !row.$rowspanRules.includes('$rowspanAll') &&
            row.$rowspanRules.unshift('$rowspanAll')
          rowspan.$all && row.$all !== false && !row.$rowspanRules.includes('$all') && row.$rowspanRules.unshift('$all')

          let newRowspanObj = {}
          row.$rowspanRules.forEach((ruleName) => {
            let rule = rowspan[ruleName]
            if (rule) {
              rule.props.forEach((prop) => {
                // ruleObj
                newRowspanObj[prop] = {
                  ...rule,
                  prop,
                  rule,
                  rows: []
                }
              })
            }
          })
          for (const prop in newRowspanObj) {
            let ruleObj = rowspanObj[prop]
            let newRuleObj = newRowspanObj[prop]
            if (ruleObj) {
              // 当前行的行合并规则发生改变
              if (ruleObj.rule !== newRuleObj.rule) {
                calculateRowspan(ruleObj)

                rowspanObj[prop] = newRuleObj
              }
            } else {
              rowspanObj[prop] = newRuleObj
            }
          }
          for (const prop in rowspanObj) {
            let ruleObj = rowspanObj[prop]
            // 当前行的行合并规则中，必须有起始行
            if (!ruleObj.$start) {
              // 起始行匹配失败时，结束行合并
              if (!ruleObj.start || !ruleObj.start(row, rowIndex, finalData)) {
                delete rowspanObj[prop]
                continue
              }
              ruleObj.$start = row
            }

            if (ruleObj.end) {
              if (ruleObj.end(row, rowIndex, finalData)) {
                ruleObj.$end = row
                ruleObj.rows.push(row)
                calculateRowspan(ruleObj)
                delete rowspanObj[prop]
              }
            } else {
              // 不存在结束行时，以start匹配失败的前一行为结束行
              if (ruleObj.start(row, rowIndex, finalData)) {
                ruleObj.rows.push(row)
              } else {
                ruleObj.$end = ruleObj.rows[ruleObj.rows.length - 1]
                calculateRowspan(ruleObj)
                delete rowspanObj[prop]
              }
            }
          }
        }
      })
      for (const prop in rowspanObj) {
        calculateRowspan(rowspanObj[prop])
      }

      function calculateRowspan(ruleObj) {
        let { prop, $start, $show, rows } = ruleObj
        rows.forEach((row) => {
          if (ruleObj.show && ruleObj.show(row)) $show = row
          row.$rowspan[prop] = 0
        })
        // 显示行匹配失败时，以起始行为显示行
        if (!$show) $show = $start
        $show.$rowspan[prop] = rows.length
      }

      return ({ row, column, columnIndex }) => {
        let rowspan = row.$rowspan[column.property]
        let colspan = row.$colspan[columnIndex]
        return [rowspan === undefined ? 1 : rowspan, colspan === undefined ? 1 : colspan]
      }
    },

    handleSearchFormProps() {
      return this.getAttr('handleSearchFormProps')
    },
    new$listeners() {
      return Object.assign(
        {
          ...this.$listeners
        },
        {
          input: () => {},
          'selection-change': (selection) => {
            if (!this.$refs.checkAllData) {
              this.$emit('selection-change', selection)
              this.handleSelectionChange(selection)
            }
          }
        }
      )
    }
  },
  watch: {
    curOption: {
      handler() {
        this.tablePage.pageIndex = 1

        this.getDic()
      },
      immediate: true
    },
    data: {
      handler(n, o) {
        if (!this.getList) {
          this.tablePage.total = n?.length || 0

          if (n !== o) {
            this.tablePage.pageIndex = 1
          }
        }
      },
      immediate: true
    },
    finalData(newVal) {
      if (this.mergeKeys.length) {
        this.rowSpanObj = handleTableSpan(this.mergeKeys, newVal)
      }

      // flex-one-page
      // 问题：flex-one-page高度设置为100%时，若外层高度设置为自适应，table内容无法撑开flex-one-page
      // 解决方法：table数据渲染完成后，设置height为100%，使el-table重新计算table高度
      this.isOnePageLock = false
      newVal.length && this.$nextTick(() => (this.isOnePageLock = true))
    },
    search: {
      handler(search) {
        this.searchForm = Object.assign(this.searchForm, search)
      },
      immediate: true,
      deep: true
    },
    defaultSelection: {
      handler(n) {
        if (!validatenull(n)) {
          this.$nextTick(function () {
            this.toggleSelection(n, true)
          })
        }
      },
      immediate: true
    },
    selectableFn: 'clearSelection',
    tabValue: {
      handler(n) {
        if (!validatenull(n)) {
          this.toggleTab(n)
        }
      },
      immediate: true
    }
  },
  created() {
    this.initPage()
    if (!this.finalOption.search) this.baseTableInit()
  },
  activated() {
    this.getDic()
  },
  methods: {
    handleTabChange() {
      this.tableData = [] // 防止切换时，表格内容重复渲染
      this.searchForm = {}
      this.$emit('tab-change', this.showAllLevels ? this.curTab : this.curTab.slice(-1)[0])
      this.$nextTick(function () {
        ;(this.isInit || this.initOnTabChange) && this.searchChange()
      })
    },
    handleTabClick(...args) {
      this.$emit('tab-click', ...args)
    },
    toggleTab(value) {
      let allLevels = this.tabAllLevels[value]
      // console.log('toggleTab', allLevels)
      if (allLevels) {
        this.curTab = allLevels
        this.handleTabChange()
      }
    },

    initPage() {
      let { unwatchs } = this
      if (unwatchs.initPage) unwatchs.initPage()
      unwatchs.initPage = this.$watch(
        function ({ pageObj }) {
          if (pageObj) return pageObj

          let {
            tablePage,
            finalOption: { pageSizes = [5, 10, 15, 20], pageSize }
          } = this

          if (getDiffData(pageSizes, this.oPageSizes)) {
            tablePage.pageSize = pageSize || pageSizes[0]
            this.oPageSizes = pageSizes
          }

          return tablePage
        },
        function (n) {
          n.total = this.tablePage.total
          this.tablePage = n
        },
        {
          immediate: true
        }
      )
    },

    // 解决searchForm默认值未设置即发起请求
    baseTableInit() {
      if (this.isInit && !this.finalList) {
        this.init()
      }
    },

    toggleSelection(...args) {
      const { crud, checkAllData } = this.$refs
      const { toggleSelection } = checkAllData || crud || {}
      return toggleSelection?.apply(null, args)
    },
    toggleRowSelection(...args) {
      const { crud, checkAllData } = this.$refs
      const { toggleRowSelection } = checkAllData || crud || {}
      return toggleRowSelection?.apply(null, args)
    },
    clearSelection(...args) {
      const { crud, checkAllData } = this.$refs
      const { clearSelection } = checkAllData || crud || {}
      return clearSelection?.apply(null, args)
    },
    toggleRowExpansion(row, expanded) {
      return this.$refs.crud.toggleRowExpansion(row, expanded)
    },
    async getDic() {
      const curRequest = (this.DICLastRequest = this.$store.dispatch('HandleOption', { column: this.finalColumn }))
      await curRequest
      if (curRequest === this.DICLastRequest) {
        this.DIC = await this.DICLastRequest
      }
    },

    handleSpanMethod(tableObj, vm) {
      const span = get(tableObj.row, `$tableSpan.${tableObj.column.property}`)
      if (span) return span

      let spanMethod = this.curTabItem.spanMethod || this.spanMethod
      if (typeof spanMethod === 'function') return spanMethod(tableObj, vm)

      let { autoSpanMethod } = this
      if (typeof autoSpanMethod === 'function') return autoSpanMethod(tableObj, vm)

      return handleObjectSpanMethod(tableObj, this.mergeKeys, this.rowSpanObj, this.notEmpty)
    },

    beforeInit() {
      return this.runFn(this.getAttr('beforeInit'))
    },
    afterInit(res, postData, data) {
      // getAllData
      if (validateDiffData(this.postData, this.oPostData, ['page'])) this.oAllData = null
      this.oPostData = postData

      // tab 切换时，如果表格列数差距过大，会导致表格样式错乱
      this.$refs.crud?.doLayout()
      this.$nextTick(this.$refs.crud?.doLayout)

      return this.runFn(this.getAttr('afterInit'), res, postData, data)
    },
    handleTableData(data) {
      return this.runFn(this.getAttr('handleTableData'), data) || data
    },
    handlePostData(data, searchForm) {
      return this.runFn(this.getAttr('handlePostData'), data, searchForm, this) || data
    },

    doLayout() {
      if (this.finalOption.isOnePage) {
        this.isOnePageLock = false
        this.$nextTick(() => (this.isOnePageLock = true))
      }
      return this.$refs.crud?.doLayout()
    },

    // 传值方式：curTabItem、$attrs、sup_this
    getAttr(prop) {
      return this.curTabItem[prop] || this.getParentAttrs(prop)
    },

    handleBindData(scope, slot) {
      return scope
    },
    runFn(fn, ...args) {
      return typeof fn === 'function' && fn(...args)
    },
    validData
  }
}
</script>

<style lang="scss" scoped>
::v-deep.crud-container {
  width: 100%;
  &.flex-one-page {
    .el-table__body-wrapper {
      overflow-y: auto;
    }
    .table-checkbox-wrapper {
      flex: 1;
      overflow: hidden auto;
    }
  }
  .el-table {
    border-top: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    &::after {
      content: '';
      position: absolute;
      background-color: #ebeef5;
      z-index: 2000;
      top: 0;
      right: 0;
      width: 1px;
      height: 100%;
    }
  }
  .crud-header-before {
    display: flex;
    justify-content: space-between;
    position: relative;
    width: 100%;
    margin-bottom: 16px;
  }
  .base-tabs {
    .base-tabs {
      margin-top: 16px;
    }
  }
}
</style>
