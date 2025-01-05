import { validData } from '@/components/avue/utils/util'
import { map, isEqual } from 'lodash'
import { validatenull } from '@/components/avue/utils/validate'

export default {
  props: {
    value: {
      default: () => {
        return []
      }
    },
    dic: {
      default: () => {
        return []
      }
    },
    props: {
      default: () => {
        return {
          label: 'label',
          value: 'id'
        }
      }
    },
    readonly: Boolean,
    disabled: Boolean,
    selectable: Function,
    checkAll: Boolean
  },
  data() {
    return {
      checkedIdList: [],
      checkedListReactive: []
    }
  },
  computed: {
    checkedList({ checkedIdList, checkedListReactive, idItems }) {
      // 响应式修改checkedListReactive
      checkedListReactive.splice(checkedIdList.length, checkedListReactive.length)
      checkedIdList.forEach((id, index) => {
        this.replace(checkedListReactive, index, idItems[id])
      })
      return checkedListReactive
    },
    idItems({ dic, dictValue }) {
      let tmpObj = {}
      for (const item of dic) {
        const id = item[dictValue]
        tmpObj[id] = item
      }
      return tmpObj
    },
    checkableIdList() {
      return map(this.checkableList, this.dictValue)
    },
    checkableList({ dic, selectable }) {
      return typeof selectable === 'function' ? dic.filter((row, index) => selectable(row, index)) : dic
    },
    disabledIdList() {
      return map(this.disabledList, this.dictValue)
    },
    disabledList({ dic, selectable }) {
      return typeof selectable === 'function' ? dic.filter((row, index) => !selectable(row, index)) : []
    },
  
    checkAllStatus({ dic, checkedCount, disabledCount, total }) {
      if (total <= 0 || validatenull(dic)) return { value: false }
      
      const count = checkedCount + disabledCount
      const checkAll = count >= total
      return {
        value: checkAll,
        indeterminate: checkedCount > 0 && count < total
      }
    },
    checkedCount() {
      return this.checkedIdList.length
    },
    disabledCount() {
      return this.disabledList.length
    },
    total() {
      return this.dic?.length
    },
  
    isDisabled({ readonly, disabled }) {
      return disabled || readonly
    },
    dictLabel() {
      return this.props.label || 'label'
    },
    dictValue() {
      return this.props.value || 'id'
    }
  },
  watch: {
    value: {
      handler() {
        this.checkedIdList = this.value
      },
      immediate: true,
      deep: true
    },
    dic: {
      handler(n) {
        if (this.checkAll && !validatenull(n)) {
          const idList = map(n, this.dictValue)
          this.checkedIdList = this.checkedIdList.filter(id => idList.includes(id))
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
    toggleRowSelection(row, selected) {
      if (selected) {
        this.push(this.checkedListReactive, row)
      } else {
        this.pull(this.checkedListReactive, row)
      }
      const { checkedIdList } = this
      const nCheckedIdList = this.checkedIdList = map(this.checkedListReactive, 'id')
      !isEqual(checkedIdList, nCheckedIdList) && this.handleChange(nCheckedIdList)
    },
    clearSelection() {
      this.checkedIdList = []
      this.handleChange(this.checkedIdList)
    },
    checkAllChange(checked) {
      this.checkedIdList = checked ? [...this.checkableIdList] : []
      this.handleChange(this.checkedIdList)
      this.$emit('select-all', this.checkedList)
    },
    
    validData,
    push(list, ...rows) {
      rows.forEach((row) => {
        let index = this.findIndex(list, row)
        if (index > -1) {
          this.replace(list, index, row)
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
    replace(list, index, row) {
      row && list[index] !== row && list.splice(index, 1, row)
    },
    findIndex(list, row) {
      return list.findIndex(item => this.isEqual(item, row))
    },
    isEqual(data1, data2) {
      if (data1 === data2) return true
    
      let { dictValue } = this
      return data1?.[dictValue] === data2?.[dictValue]
    }
  }
}
