/* eslint-disable */
import { validateDiffData, getPageData } from '@/components/avue/utils/util'
import { REQUEST_ALL_DATA } from '@/utils/constant'
import { initData } from '@/api/data'
import { getValueFromObj } from '@/utils'
import { validatenull } from '@/components/avue/utils/validate'

/*
 * @example
 * // 全选组件
 <el-checkbox
 v-model="checkedAll"
 :indeterminate="indeterminate"
 :disabled="canSelectionAllDataTotal === 0"
 class="checkbox-large"
 @change="checkedAllChange"
 >全选</el-checkbox>
 *
 * // elTable表格实例
 * tableRef
 *
 * // 为elTable添加下面的事件
 * @select="handleSelect"
 * @select-all="handleSelectAll"
 *
 * // 获取选中数据
 * this.getSelectionDataAllArr() // 返回一个Promise
 *
 * // 如果有selectable
 * // 必须设置this.selectable = selectable
 *
 * this.checkAllInitCallBack()在init之后调用
 * */
let options = {
  checkbox: {
    requestDataProp: 'tableData',
    requestPostDataProp: 'postData',
    allDataTotalProp: 'tablePage.total',
    elTableInstance: 'elTableInstance',
    tableLoading: 'tableLoading'
  },
  avueCrud: {
    requestDataProp: 'tableData',
    requestPostDataProp: 'postData',
    allDataTotalProp: 'tablePage.total',
    elTableInstance: '$refs.crud.$refs.table',
    tableLoading: 'tableLoading'
  },
  table: {
    requestDataProp: 'data',
    requestPostDataProp: 'params',
    allDataTotalProp: 'total',
    elTableInstance: '$refs.table',
    tableLoading: 'loading'
  }
}
export default function (option = {}) {
  let { type = 'avueCrud', apiType = type, getList } = option
  let curOption = options[type]

  let lastAllDataRequest
  return {
    data() {
      return {
        checkedList: [],
        selectionDataAllObj: {},
        // elTable表格实例
        tableRef: {},
        allData: null,
        curAllData: null,
        curAllDataLoading: false,
        checkedAllChangeLoading: false,
        // 全选按钮的值：全选或半选都为true
        checkedAll: false,
        // 不可选列表（selectable为false，筛选出来的数据）
        nonselectableList: [],
        // 非全选时，数据为selectedList
        // 选择列表
        selectedList: [],
        // 全选时，数据为所有数据中排除unselectList的部分
        // 取消选择列表
        unselectList: [],
        oPostData: {}
      }
    },
    computed: {
      checkedAllDisabled({ canSelectionAllDataTotal, [curOption.tableLoading]: tableLoading }) {
        return canSelectionAllDataTotal === 0 || tableLoading
      },
      isChecked({ checkedAll, indeterminate }) {
        return checkedAll || indeterminate
      },
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

      selectedTotalChange({ selectedTotal, unselectTotal, allDataTotal }) {
        return {
          selectedTotal,
          unselectTotal,
          allDataTotal
        }
      },
      selectedTotal({ selectedList, nonselectableList }) {
        return selectedList.length + nonselectableList.length
      },
      unselectTotal({ unselectList, nonselectableList }) {
        return unselectList.length + nonselectableList.length
      },

      selectionDataAll({ selectionDataAllObj }) {
        return Object.values(selectionDataAllObj)
      },
      selectionDataAllKeys({ selectionDataAll }) {
        return selectionDataAll.map((item) => item.id)
      },
      // 是否有选中值：selectionDataAll 中有值 或者 全选但是数据正在请求
      hasSelectionDataAll({ selectionDataAll, selectionDataAllLoading }) {
        return !!selectionDataAll.length || selectionDataAllLoading
      },
      // 正在获取全选数据
      selectionDataAllLoading({ checkedAll, checkedAllChangeLoading }) {
        return checkedAll && !!checkedAllChangeLoading
      },

      // 当前页可选择数据
      canSelectionCurPageData({ requestData }) {
        return this.getCanSelectionData(requestData)
      },
      // 当前页数据
      requestData() {
        return this[curOption.requestDataProp]
      },
      // 请求参数
      requestPostData() {
        return this[curOption.requestPostDataProp]
      },
      requestAllDataPostData() {
        return REQUEST_ALL_DATA
      },

      getAllDataApi() {
        if (['checkbox', 'avueCrud'].includes(apiType)) {
          return (isAllData) => {
            return getList(
              isAllData
                ? this.requestAllDataPostData
                : {
                    ...this.requestPostData,
                    ...REQUEST_ALL_DATA
                  }
            )
          }
        } else if (apiType === 'table') {
          return (isAllData) => {
            return initData(
              this.url,
              this.method,
              isAllData
                ? this.requestAllDataPostData
                : {
                    ...this.requestPostData,
                    ...REQUEST_ALL_DATA
                  }
            )
          }
        }
      },
      allDataTotal() {
        return getValueFromObj(this, curOption.allDataTotalProp)
      },
      canSelectionAllDataTotal({ allDataTotal, nonselectableList }) {
        return allDataTotal - nonselectableList.length
      },

      elTableInstance() {
        return {
          toggleRowSelection: (row, selected) => {
            let isCurData = this.canSelectionCurPageData.findIndex((item) => item.id === row.id) > -1
            let checkedIndex = this.checkedList.findIndex((id) => id === row.id)
            let isChecked = checkedIndex > -1
            if (selected) {
              if (!isChecked && isCurData) {
                this.checkedList.push(row.id)
              }
            } else if (selected === false) {
              if (isChecked && isCurData) {
                this.checkedList.splice(checkedIndex, 1)
              }
            } else {
              if (isChecked) {
                this.checkedList.splice(checkedIndex, 1)
              } else {
                this.checkedList.push(row.id)
              }
            }
            // console.log(this.checkedList)
          },
          clearSelection: () => {
            this.checkedList = []
          }
        }
      }
    },
    watch: {
      async selectedTotalChange() {
        // 在 getList 中，setSelection 先设置了 selectedList，total 在之后才发生变化，导致 this.checkedAll = true
        await this.initLoading
        let { selectedTotal, unselectTotal, allDataTotal } = this.selectedTotalChange
        // console.log(selectedTotal, unselectTotal, allDataTotal)
        if (selectedTotal === allDataTotal) {
          this.checkedAll = true
        }
        if (unselectTotal === allDataTotal) {
          this.checkedAll = false
        }
      },
      // 监听全选按钮的变化
      // checkedAll为true，有半选的情况
      checkedAll(n) {
        // console.log(n)
        // 清空选择数据
        this.selectedList = []

        this.unselectList = []
      },
      /*requestPostData: {
       handler(n, o) {
       o = { ...o, page: n.page }
       if (validateDiffData(n, o)) {
       let { selectionDataAllKeys } = this
       // 请求参数改变时，初始化数据
       this.initCheckAllData(true)
       this.setSelection(selectionDataAllKeys)
       console.log(selectionDataAllKeys)
       }
       },
       deep: true
       },*/

      requestData: {
        handler(n) {
          this.getNonselectableList(n)
        },
        deep: true
      },
      curAllData: {
        handler(n) {
          Array.isArray(n) && this.getNonselectableList(n)
        },
        deep: true
      },
      selectable() {
        // 筛选条件改变时
        this.initCheckAllData()
      },

      async [curOption.tableLoading](n) {
        if (!n && this.setSelectionLoading) {
          this[curOption.tableLoading] = true
          // setSelection 调用时，应禁止表格勾选
          await this.setSelectionLoading
          // init 调用时的 loading 效果
          await this.initLoading
          this[curOption.tableLoading] = false
        }
      }
      /*,selectionDataAll: {
       handler(n) {
       console.log(n)
       },
       deep: true
       }*/
    },
    mounted() {
      this.getElTableInstance()
    },
    methods: {
      initCallBack(res, postData) {
        this.checkAllInitCallBack(res, postData)
      },
      afterInit(res, postData) {
        this.checkAllInitCallBack(res, postData)
      },
      async getList(postData) {
        this.initLoading = new Promise((resolve) => (this.initResolve = resolve))
        // console.log('getList')
        let { selectionDataAll, oPostData } = this

        this.oPostData = postData
        // console.log(oPostData, postData)
        // console.log(validateDiffData(postData, oPostData, ['page']))
        let isSearchChange = validateDiffData(postData, oPostData, ['page'])
        if (isSearchChange) {
          // 在全选，全部数据请求未返回时，搜索新的全部数据
          if (this.checkedAll) {
            await this.checkedAllChangeLoading
          }

          let { selectionDataAll } = this
          // 请求参数改变时，初始化数据
          await this.setSelection(selectionDataAll)
          // console.log(this)
          // console.log(selectionDataAll)
        }

        if (selectionDataAll.length) {
          let curAllData = await this.getAllData()
          let { tablePage } = this
          return {
            code: 0,
            detail: getPageData(curAllData, tablePage),
            page: {
              ...tablePage,
              total: curAllData?.length || 0
            }
          }
        } else {
          return getList(postData)
        }
      },
      // init 之后会调用的函数
      checkAllInitCallBack() {
        // console.log('checkAllInitCallBack')
        this.initResolve()
        this.initLoading = false

        this.setCurSelection()
      },
      setCurSelection() {
        this.$nextTick(() => {
          this.getElTableInstance()
          if (!this.tableRef) return
          // 拿到选中的数组，要删除的数组，全选框的值
          const { selectionDataAllKeys } = this
          // console.log(selectionDataAllKeys)
          this.canSelectionCurPageData
            .filter(({ id }) => selectionDataAllKeys.includes(id))
            .forEach((row) => {
              if (row) {
                this.tableRef.toggleRowSelection(row, true)
              }
            })
        })
      },

      //改变全选所有复选框,传入个布尔值（其实就是checkAll）
      checkedAllChange: setLoading('checkedAllChange'),
      async checkedAllChangeFn(val) {
        let { tableRef } = this
        if (!tableRef) tableRef = this.getElTableInstance()
        // console.log('checkedAllChange', this.checkedAll, val)
        // 半选的时候点击全选按钮val会返回false
        if (this.unselectList.length) {
          val = true
          // 等elCheckbox组件内部的值改变之后再设为true
          // 否则elCheckbox组件内部的值仍为false
          this.$nextTick(function () {
            this.checkedAll = true
          })
        }

        // 点击全选时，表格数据为 curAllData，需要等 curAllData 请求完毕再设置表格选中项
        if (val) {
          // 如果全选按钮checkAll的值为true,把当页的表格中的复选框全部勾上
          this.canSelectionCurPageData.forEach((row) => {
            if (row) {
              tableRef.toggleRowSelection(row, true)
            }
          })
        } else {
          // 如果全选按钮checkAll的值为false,就取消当页选中的所有复选框
          tableRef.clearSelection()
        }

        // 在请求的过程中可能进行选择与取消操作
        let curSelectionDataAllArr = this.getSelectionDataAllArr(false)
        let curAllData = await this.getAllData()
        if (curAllData) {
          curSelectionDataAllArr = await curSelectionDataAllArr
          let { selectionDataAllObj } = this
          curAllData.forEach((row) => {
            this.$delete(selectionDataAllObj, row.id)
          })
          curSelectionDataAllArr.forEach((row) => {
            this.$set(selectionDataAllObj, row.id, row)
          })
        }
      },

      // 初始化全选数据
      initCheckAllData(initAllData) {
        // console.log('initAllData')
        this.checkedAll = false
        this.nonselectableList = []

        this.selectedList = []

        this.unselectList = []

        if (initAllData) {
          this.curAllData = this.curAllData instanceof Promise ? undefined : null
        }

        this.selectionDataAllObj = {}

        this.tableRef?.clearSelection?.()
      },

      // 获取所有数据
      async getSelectionDataAllArr(isAllData = true) {
        if (isAllData) {
          await this.allData
          await this.curAllData
          return this.selectionDataAll
        }

        let allData = await this.getAllData()
        if (!allData) return []
        // 根据是否全选判断，数据应该怎么拿
        if (this.checkedAll) {
          // checkedAll为true，数据为所有数据中排除unselectList的部分
          let { unselectList } = this
          if (unselectList.length) {
            return this.getCanSelectionData(allData.filter(({ id }) => !unselectList.includes(id)))
          } else {
            return this.getCanSelectionData(allData)
          }
        } else {
          // checkedAll 为false，直接从 selectedList 拿
          let { selectedList } = this
          return this.getCanSelectionData(allData.filter(({ id }) => selectedList.includes(id)))
        }
      },
      async getAllData(isAllData) {
        // console.log('getAllData', isAllData)
        let { allData } = this
        if (!isAllData) {
          // 当前页面请求与全部数据请求一致时，this.curAllData = this.allData
          if (allData && this.isRequestAllDataPostData()) {
            return allData
          }
          return this.getCurAllData()
        }

        if (allData) return allData
        // 在之后调用getAllData 获取到的数据都是同一个数据
        let curRequest = this.getAllDataApi(isAllData)
        this.allData = awaitResolveDetail(curRequest) // this.curAllData 作为Promise时必须返回 res.detail

        let res = await awaitResolve(curRequest)

        allData = res?.detail
        if (this.curAllData === this.allData) {
          this.curAllData = allData
        }

        return (this.allData = allData)
      },
      async getCurAllData() {
        // 再次请求：搜索条件不变的情况下，返回之前的数据
        // 重新请求：搜索条件改变的时候，重新请求全部数据
        // console.log('getCurAllData')
        this.curAllDataLoading = true
        let { curAllData, requestPostData } = this
        // console.log('curAllData', curAllData)
        if (!curAllData) {
          // 在之后调用getAllData获取到的数据都是同一个数据
          let curRequest = this.getAllDataApi()
          let curAllDataRequest = awaitResolveDetail(curRequest) // this.curAllData 作为Promise时必须返回 res.detail
          lastAllDataRequest = curAllDataRequest

          // 再次请求时，请求的是同一份数据
          let curAllDataResolve
          this.curAllData = new Promise((resolve) => (curAllDataResolve = resolve))

          // 当前页面请求与全部数据请求一致时，this.allData = curAllDataRequest
          if (this.isRequestAllDataPostData(requestPostData)) this.allData = curAllDataRequest

          let res = await awaitResolve(curRequest)
          curAllData = res?.detail

          // 当前页面请求与全部数据请求一致时，this.allData = curAllData
          if (this.isRequestAllDataPostData(requestPostData)) this.allData = curAllData

          // 防止因为前一次请求比最近请求晚响应，导致前一次请求数据覆盖最近请求数据
          // 即多次重新请求只返回最新请求数据
          // this.curAllData 不存在，即被置空时，不进行赋值
          if (lastAllDataRequest !== curAllDataRequest || !this.curAllData) {
            curAllDataResolve()
            return
          }

          if (curAllData) {
            this.curAllData = curAllData
          } else {
            this.curAllData = curAllData = null
            this.$message.warning('获取数据失败，请重试')
          }
          curAllDataResolve(curAllData)
        }

        // console.log(curAllData)
        // 确保this.curAllDataLoading = false 在curAllData请求结束后执行
        await curAllData
        this.curAllDataLoading = false

        return curAllData
      },
      isRequestAllDataPostData(postData = this.requestPostData) {
        return !validateDiffData(this.requestAllDataPostData, postData, ['page'])
      },

      clearSelection() {
        this.initCheckAllData()
      },
      setSelection: setLoading('setSelection'),
      async setSelectionFn(selection) {
        // console.log('setSelectionFn')
        this.initCheckAllData(true)
        if (!validatenull(selection)) {
          if (typeof selection[0] === 'object') selection = this.getCanSelectionData(selection)

          let tempObj = {}
          selection = selection.map((item) => {
            if (typeof item === 'object') {
              tempObj[item.id] = item
              return item.id
            } else {
              tempObj[item] = { id: item }
              return item
            }
          })
          this.selectionDataAllObj = tempObj

          // setSelection 调用时，禁止勾选
          this[curOption.tableLoading] = true
          let curAllData = await this.getAllData()
          this[curOption.tableLoading] = false
          if (!curAllData) return
          this.selectedList = this.getCanSelectionData(curAllData)
            .filter((row) => selection.includes(row.id))
            .map((item) => item.id)

          this.setCurSelection()

          let allData = await this.getAllData(true)
          if (!allData) return
          let allDataObj = {}
          this.getCanSelectionData(allData).map((row) => (allDataObj[row.id] = row))
          let { selectionDataAllObj } = this
          for (const id in selectionDataAllObj) {
            if (allDataObj[id]) {
              this.$set(selectionDataAllObj, id, allDataObj[id])
            } else {
              this.$delete(selectionDataAllObj, id)
            }
          }
        }
      },
      async toggleRowSelection(row, selected) {
        if (!this.isSelectableRow(row)) return
        // row必须为当前页的row对象
        let curRow = this.canSelectionCurPageData.find((item) => item.id === row.id)
        curRow && this.tableRef.toggleRowSelection(curRow, selected)

        // selectionDataAllObj set : selected 为 true 或者 selected 为 undefined 并且 row 不存在 selectionDataAllObj 中
        // selectionDataAllObj delete : selected 为 false 或者 selected 为 undefined 并且 row 存在 selectionDataAllObj 中
        let { selectionDataAllObj } = this
        selected = selected || (selected === undefined && !selectionDataAllObj[row.id])
        if (selected) {
          this.$set(selectionDataAllObj, row.id, row)
        } else {
          this.$delete(selectionDataAllObj, row.id)
        }

        let curAllData = await this.getAllData()
        if (!curAllData) return
        let isCurRow = curAllData.some((curRow) => curRow.id === row.id)
        isCurRow && this.handleSelect(selected ? [row] : [], row)
      },

      // 点击checkbox中的单选框触发事件
      handleCheckboxSelect(checked, row) {
        let selection = []
        let { checkedList } = this
        let isIncludes = checkedList.includes(row.id)
        if (checked) {
          if (!isIncludes) {
            checkedList.push(row.id)
          }
          selection.push(row)
        } else {
          if (isIncludes) {
            let index = checkedList.findIndex((id) => id === row.id)
            if (index > -1) {
              checkedList.splice(index, 1)
            }
          }
        }
        // console.log(checkedList)
        this.handleSelect(selection, row)
      },
      // 点击表格中的单选框触发事件
      handleSelect(selection, row) {
        // console.log(selection.map(item => item.id), row.id)
        let checked = selection.some((item) => item.id === row.id)
        // console.log(checked)
        // 根据是否全选判断，数据应放在哪个数组中
        let { checkedAll } = this
        let selectionData = this[checkedAll ? 'unselectList' : 'selectedList']

        // 在selectedList中存在时，为删除操作，应从selectedList删除
        // 在unselectList中存在时，为选中操作，应从unselectList删除

        // 判断当前选择的id 是否在我们已选择数组的中
        if ((checked && checkedAll) || (!checked && !checkedAll)) {
          let index = selectionData.findIndex((id) => id === row.id)
          selectionData.splice(index, 1)
        } else {
          // 如果不在就是选中操作，就在选中数组中添加此id
          selectionData.push(row.id)
        }

        let { selectionDataAllObj } = this
        if (checked) {
          this.$set(selectionDataAllObj, row.id, row)
        } else {
          this.$delete(selectionDataAllObj, row.id)
        }
      },
      // 点击当前页全选的事件
      handleSelectAll(selection) {
        // console.log('handleSelectAll', this.checkedAll)
        // 判断当前操作是全选还是取消全选
        let checked = !!selection.length

        // 根据是否全选判断，数据应放在哪个数组中
        let { checkedAll, canSelectionCurPageData } = this
        let selectionData = this[checkedAll ? 'unselectList' : 'selectedList']

        // selectedList在全选(!checkedAll && checked)时添加，取消全选(!checkedAll && !checked)时删除
        // unselectList在全选(checkedAll && checked)时删除，取消全选(checkedAll && !checked)时添加
        if ((checked && checkedAll) || (!checked && !checkedAll)) {
          // 删除
          // 先拿到当页数据的 id 组成的数组（取消的id数组）
          const ids = canSelectionCurPageData.map(({ id }) => id)
          ids.map((id) => {
            const fIndex = selectionData.findIndex((cId) => cId == id)
            if (fIndex > -1) {
              selectionData.splice(fIndex, 1)
            }
          })
        } else {
          // 添加
          const ids = canSelectionCurPageData.map(({ id }) => id)
          this[checkedAll ? 'unselectList' : 'selectedList'] = [...new Set(selectionData.concat(ids))]
        }

        let { selectionDataAllObj } = this
        if (checked) {
          canSelectionCurPageData.forEach((row) => this.$set(selectionDataAllObj, row.id, row))
        } else {
          canSelectionCurPageData.forEach((row) => this.$delete(selectionDataAllObj, row.id))
        }
        // console.log(selection)
        // console.log('this.checkedAll', this.checkedAll)
        // console.log('this.unselectList', this.unselectList)
        // console.log('this.selectedList', this.selectedList)
        // console.log('this.nonselectableList', this.nonselectableList)
      },

      getNonselectableList(data) {
        let { selectable } = this
        if (selectable && Array.isArray(data)) {
          let ids = []
          data.filter((row) => {
            if (!selectable(row)) {
              ids.push(row.id)
            }
          })
          this.nonselectableList = [...new Set(this.nonselectableList.concat(ids))]
        }
      },
      getCanSelectionData(data) {
        if (!this.selectable) return data
        return data.filter(this.selectable)
      },
      isSelectableRow(row) {
        if (!row) return false
        let { selectable } = this
        if (!selectable) return true
        return selectable(row)
      },

      //拿到table的ref
      getElTableInstance() {
        return (this.tableRef = getValueFromObj(this, curOption.elTableInstance))
      },

      // 处理批量与单次选择
      hasSelectionData() {
        // 是否有选中数据
        if (!this.checkedAll && !this.selectedList.length) {
          this.$message.warning('请至少选择一条数据')
          return false
        }
        return true
      },
      getSelectionData,
      validateSelectionData,
      handleSelectionData(param) {
        param = validateSelectionData(this, param)
        if (!param) return
        return param()
      }
    }
  }
}

export async function handleSelectionData(that, param, callback) {
  param = validateSelectionData(that, param)
  if (!param) return
  if (typeof callback === 'function') await callback(param, that)
  return param
}
export function validateSelectionData(that, param) {
  if (param === 'batch') {
    if (!that.hasSelectionData()) return
    param = that.getSelectionDataAllArr
  }
  return getSelectionData(param)
}
export function getSelectionData(selectionData) {
  if (typeof selectionData === 'function') return selectionData
  selectionData = Array.isArray(selectionData) ? selectionData : [selectionData]
  return () => selectionData
}

export function setLoading(fnName) {
  return async function (...args) {
    let loadingName = `${fnName}Loading`
    let loading = (this[loadingName] = this[`${fnName}Fn`](...args))
    loading.finally(() => (this[loadingName] = false))
    return await loading
  }
}
