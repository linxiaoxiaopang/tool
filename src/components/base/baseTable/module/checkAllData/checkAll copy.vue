<template>
  <el-checkbox
    class="checkbox-large check-all"
    :value="checkedAll"
    :indeterminate="indeterminate"
    :disabled="loading"
    @change="onchange"
  >
    <slot>
      {{ content }}
    </slot>
  </el-checkbox>
</template>
<script>
import childMixin from '@/components/base/baseTable/mixins/childMixin'
import CacheApi, { LastRequest } from '@/components/base/baseTable/utils/cacheApi'
import { validatenull, isEqual } from '@/components/avue/utils/validate'

export default {
  mixins: [childMixin()],
  props: {
    // 必传
    data: {
      type: Array,
      default: () => ([])
    },
    total: {
      type: Number,
      default: 0
    },
    postData: {
      type: Object,
      default: () => ({})
    },
    rowKey: {
      default: 'id'
    },
    getInstance: Function,
    // 选传
    allData: {
      type: Array,
      default: () => ([])
    },
    getAllData: {
      type: Function,
      default: () => []
    },
    isHandleRealData: Boolean,
    // 是否在搜索条件改变时，保留之前选中的数据
    isReserveSelection: Boolean,
    // 配置
    selectable: {
      type: Function,
      default: () => true
    },
    content: {
      type: String,
      default: '全选'
    }
  },
  data() {
    return {
      loading: false,

      // getAllData返回数据
      allRequestData: [],
      // 全选按钮的值：全选或半选都为true
      checkedAll: false,
      // 不可选列表（selectable为false，筛选出来的数据）
      // 不一定是全部的不可选数据，isHandleRealData为true时是，为false时为afterInit后从data筛选出
      nonselectableList: [],
      // 非全选时，数据为selectedList
      // 选择列表
      selectedList: [],
      // 全选时，数据为所有数据中排除unselectList的部分
      // 取消选择列表
      unselectList: []
    }
  },
  computed: {
    // indeterminate，控制全选按钮上的 一杠是否显示
    indeterminate() {
      if (this.checkedAll) {
        // 当全选按钮选中时，看看this.unselectList里有没有东西，有的话标识有东西没有选中，则返回true 没有就返回false
        return !!this.unselectList.length
      }
      // 当全选按钮没有选中时，this.selectedList 里有无我们选中的东西
      // 不用判断长度是否等于全部数据，因为一旦等于全部数据this.checkedAll会被设为true
      return !!this.selectedList.length
    },

    totalChange() {
      return {
        total: this.total,
        selectedTotal: this.selectedTotal,
        nonselectableTotal: this.nonselectableTotal
      }
    },
    selectedTotal() {
      if (this.checkedAll) {
        return this.total - this.unselectList.length - this.nonselectableTotal
      } else {
        return this.selectedList.length
      }
    },
    nonselectableTotal() {
      return this.nonselectableList.length
    },

    selectableData() {
      return this.getSelectableData(this.data)
    },

    isReserve() {
      return this.isReserveSelection && this.isHandleRealData
    },
    allSelection() {
      let loading = false
      let allSelection = [] // 全部选中项
      let curSelection = [] // 当前搜索条件下的选中项
      let resolves = [] // 延迟取值

      const lastRequest = new LastRequest(
        async (postData, request) => {
          if (!this.isHandleRealData) return
          loading = true
          this.loading = true
          const selectionData = await this.getCurSelectionData()
          if (!request.isLastRequest) return
          loading = false
          this.loading = false

          if (this.isReserve) {
            selectionChange(allSelection, selectionData, curSelection)
          } else {
            allSelection = selectionData
          }
          curSelection = selectionData

          resolves.forEach(resolve => resolve(allSelection))
          resolves = []
          emit()
        }
      )
      lastRequest.push = (row) => {
        if (loading) {
          lastRequest.init()
        } else {
          push(row)
          emit(allSelection)
        }
      }
      lastRequest.pull = (row) => {
        if (loading) {
          lastRequest.init()
        } else {
          pull(row)
          emit(allSelection)
        }
      }
      lastRequest.clear = () => {
        loading = false
        lastRequest.cancel()
        curSelectionRequest.cancel()

        curSelection = []
        allSelection = []
        resolves.forEach(resolve => resolve(allSelection))
        resolves = []
        emit(allSelection)
      }
      lastRequest.get = () => {
        if (loading) {
          return new Promise(resolve => resolves.push(resolve))
        }
        return allSelection
      }

      const curSelectionRequest = new LastRequest(
        async (postData, request) => {
          this.loading = true

          await lastRequest.get()
          curSelection = []
          this.clearCurSelection()
          this.getAllDataApi.clearAll()
          if (!request.isLastRequest) return

          if (allSelection.length) {
            const allData = await this.getAllDataApi.getData()
            if (!allData || !request.isLastRequest) return

            this.selectedList = this.intersection(allSelection, allData)
            this.setCurSelection()
          }

          this.loading = false
        }
      )
      const { cancel } = curSelectionRequest
      curSelectionRequest.cancel = () => {
        cancel()
        this.loading = false
      }
      lastRequest.changeCurSelection = curSelectionRequest.init
      lastRequest.clearCurSelection = () => {
        this.separate(allSelection, curSelection)
        curSelection = []
      }

      const push = (row) => {
        this.push(curSelection, row)
        this.push(allSelection, row)
      }
      const pull = (row) => {
        this.pull(curSelection, row)
        this.pull(allSelection, row)
      }
      const emit = () => {
        this.$emit('selectionChange', allSelection)
        // this.$emit('selectionCountChange', allSelection.length)
      }
      const selectionChange = (list, selection, oSelection) => {
        const addList = selection.filter(item => !this.includes(oSelection, item))
        const delList = oSelection.filter(item => !this.includes(selection, item))
        this.merge(list, addList)
        this.separate(list, delList)

        return list
      }

      return lastRequest
    },

    listInstance() {
      return {
        clearSelection: () => {
          this.getInstance?.()?.clearSelection?.()
        },
        toggleRowSelection: (row, selected) => {
          this.getInstance?.()?.toggleRowSelection?.(row, selected)
        }
      }
    },
    getAllDataApi({ getAllData }) {
      const cacheApi = new CacheApi(
        async () => {
          if (!validatenull(this.allData)) return this.allData
          if (!validatenull(this.allRequestData)) return this.allRequestData

          const allData = await getAllData()
          // await new Promise(resolve => setTimeout(resolve, 5000))

          // api改变时，返回空数组
          if (getAllData !== this.getAllData) return

          this.setNonselectableList(allData)
          return this.allRequestData = allData
        },
        0,
        { isLastRequest: false }
      )
      const { clearAll } = cacheApi
      cacheApi.clearAll = () => {
        clearAll()
        this.allRequestData = []
      }
      return cacheApi
    }
  },
  watch: {
    postData: {
      handler(n, o) {
        if (!isEqual(n, o, 'page')) {
          this.onDataChange()
        }
      },
      immediate: true
    },

    totalChange: {
      handler({ total, selectedTotal, nonselectableTotal }, { total: oTotal, selectedTotal: oSelectedTotal } = {}) {
        if (total !== oTotal) return this.onDataChange()

        if (total === 0) return

        // 这里只改变checkedAll的状态
        const checkedAll = total === (selectedTotal + nonselectableTotal)
        // 只有checkedAll改变时才处理：全选时取消所有选择；checkedAll为false时勾选全部数据
        if (checkedAll !== this.checkedAll) {
          if (checkedAll) { // 为true时，可以直接改变
            this.allRequestData = this.selectedList
            this.checkedAllChange(true)
          } else if (selectedTotal === 0) { // false时，只有当selectedTotal为0才处理（全选时取消unselectList的情况）
            this.checkedAllChange(false)
          }
        }
      },
      immediate: true
    },
    selectedTotal: {
      handler(n) {
        this.$emit('selectionCountChange', n)
      },
      immediate: true
    },

    checkedAll: {
      handler(checkedAll) {
        this.$emit('input', checkedAll)
      },
      immediate: true
    },

    getAllDataApi: {
      handler() {
        this.clearSelection()
        this.allRequestData = []
      },
      immediate: true
    },

    loading: {
      handler(loading) {
        this.$emit('update:loading', loading)
      },
      immediate: true
    },

    sup_this: {
      handler(n, o) {
        [
          ['after-init', this.afterInit],
          ['select', this.handleSelect],
          ['select-all', this.handleSelectAll]
        ].forEach(([name, event]) => {
          this.off(o, name, event)
          this.on(n, name, event)
        })
      },
      immediate: true
    }
  },
  methods: {
    afterInit() {
      const { data } = this
      this.setNonselectableList(data)
      this.setCurSelection()

      if (!validatenull(this.allRequestData)) {
        this.push(this.allRequestData, ...data)
      }
    },
    handleSelect(selection, row) {
      this.toggleRowSelection(row, this.includes(selection, row))
    },
    handleSelectAll(selection) {
      this.selectableData.forEach(item => {
        if (this.includes(selection, item)) {
          this.addRowSelection(item, false)
        } else {
          this.clearRowSelection(item, false)
        }
      })
    },

    onchange(checked) {
      // 全选框为空选( { indeterminate: false, checkedAll: false } )时，checked = true
      // 全选框为半选( { indeterminate: true, checkedAll: true } | { indeterminate: true, checkedAll: false } )时，checked = true
      // 全选框为全选( { indeterminate: false, checkedAll: true } )时，checked = false
      const { indeterminate, checkedAll } = this
      checked = indeterminate || !checkedAll

      this.checkedAllChange(checked)
      this.$emit('checkChange', checked)
    },
    checkedAllChange(checkedAll) {
      if (checkedAll) {
        this.checkedAll = true // 是否会触发el-checkbox的change事件？否
        this.selectedList = []
        this.unselectList = []
        this.setCurSelection(true)
      } else {
        this.clearCurSelection()
      }

      this.allSelection.init()
    },
    async setCurSelection(isMounted) {
      if (!isMounted) await new Promise(resolve => this.$nextTick(resolve))

      const selectedData = this.getSelectedData(this.data)
      this.toggleSelection(selectedData, true)
    },

    onDataChange() {
      if (this.isReserve) {
        this.allSelection.changeCurSelection()
      } else {
        this.getAllDataApi.clearAll()
        this.clearSelection()
      }
    },

    getSelectionData() {
      if (this.isHandleRealData) {
        return this.allSelection.get()
      } else {
        return this.getCurSelectionData()
      }
    },
    // 返回调用方法时当前搜索条件下的选中项
    async getCurSelectionData() {
      if (this.checkedAll) {
        const { unselectList } = this
        const allData = await this.getAllDataApi.getData()
        if (!allData) return
        const allSelectableData = this.getSelectableData(allData)
        return allSelectableData.filter(item => !this.includes(unselectList, item))
      } else {
        return [...this.selectedList]
      }
    },
    getSelectableData(data) {
      return data.filter(this.selectable)
    },
    getSelectedData(data) {
      return data.filter(this.isSelectedData)
    },
    setNonselectableList(data) {
      const nonselectableList = this.getNonselectableList(data)
      this.push(this.nonselectableList, ...nonselectableList)
    },
    getNonselectableList(data) {
      return data.filter(row => !this.selectable(row))
    },

    clearSelection() {
      this.clearCurSelection()
      this.allSelection.clear()
    },
    clearCurSelection() {
      this.checkedAll = false // 是否会触发el-checkbox的change事件？否
      this.selectedList = []
      this.unselectList = []
      this.nonselectableList = []

      this.allSelection.clearCurSelection()
      this.listInstance.clearSelection()
    },
    toggleSelection(selection, selected) {
      selection.forEach(row => this.toggleRowSelection(row, selected))
    },
    toggleRowSelection(row, selected) {
      if (selected === undefined) {
        selected = !this.isSelectedData(row)
      }

      this[selected ? 'addRowSelection' : 'clearRowSelection'](row)
    },
    addRowSelection(row, isShow = true) {
      if (this.checkedAll) {
        this.pull(this.unselectList, row)
      } else {
        this.push(this.selectedList, row)
      }
      this.allSelection.push(row)

      if (isShow && this.includes(this.data, row)) {
        this.listInstance.toggleRowSelection(row, true)
      }
    },
    clearRowSelection(row, isShow = true) {
      if (this.checkedAll) {
        this.push(this.unselectList, row)
      } else {
        this.pull(this.selectedList, row)
      }
      this.allSelection.pull(row)

      if (isShow && this.includes(this.data, row)) {
        this.listInstance.toggleRowSelection(row, false)
      }
    },
    isSelectedData(row) {
      if (this.checkedAll) {
        return !this.includes(this.unselectList, row)
      } else {
        return this.includes(this.selectedList, row)
      }
    },


    intersection(list1, list2) {
      return list1.filter(item => this.includes(list2, item))
    },
    merge(list1, list2) {
      this.push(list1, ...list2)
      return list1
    },
    separate(list1, list2) {
      list2.forEach(item => this.pull(list1, item))
      return list1
    },
    push(list, ...rows) {
      rows.forEach((row) => {
        let index = this.findIndex(list, row)
        if (index > -1) {
          list.splice(index, 1, row)
        } else {
          list.push(row)
        }
      })
      return list
    },
    pull(list, row) {
      const index = this.findIndex(list, row)
      index > -1 && list.splice(index, 1)
      return list
    },
    includes(list, row) {
      return list.some(item => this.isEqual(item, row))
    },
    findIndex(list, row) {
      return list.findIndex(item => this.isEqual(item, row))
    },
    isEqual(data1, data2) {
      if (data1 === data2) return true

      let { rowKey } = this
      return data1[rowKey] === data2[rowKey]
    }
  }
}
</script>
<style lang="scss">
.checkbox-all-data {
  &.no-label {
    .el-checkbox__label {
      display: none;
    }
  }
}
</style>
