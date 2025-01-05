/* eslint-disable */
import checkAllData from '@/components/base/baseTable/module/checkAllData/checkAll'
import { pull } from 'lodash'
import { validatenull } from '@/components/avue/utils/validate'
import { validData } from '@/components/avue/utils/util'

export default {
  components: { checkAllData },
  model: {
    event: 'selection-change'
  },
  props: {
    props: {
      default: () => {
        return {}
      }
    },
    value: Array,
    defaultSelection: Array
  },
  data() {
    return {
      vm: this,
      text: [],
      selection: []
    }
  },
  computed: {
    rowKey() {
      return this.props.value || 'value'
    },
    selectionData() {
      return validData(this.value, this.defaultSelection)
    }
  },
  watch: {
    selectionData: {
      handler(n) {
        if (!validatenull(n)) {
          this.$nextTick(function () {
            this.toggleSelection(n, true)
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    selectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    handleSelect(row, selected) {
      selected ? this.push(this.selection, row) : pull(this.selection, row)
      this.$emit('select', this.selection, row)
    },
    handleSelectAll() {
      this.$emit('select-all', this.selection)
    },
    toggleRowSelection(row, selected) {
      const value = row[this.rowKey]
      selected ? this.push(this.text, value) : pull(this.text, value)
      selected ? this.push(this.selection, row) : pull(this.selection, row)
    },
    clearSelection() {
      this.selection = []
      this.text = []
    },
    getInstance() {
      return this
    },
    
    toggleSelection(...args) {
      const { checkAllData } = this.$refs
      const { toggleSelection } = checkAllData || {}
      return toggleSelection?.apply(null, args)
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
    findIndex(list, row) {
      return list.findIndex(item => this.isEqual(item, row))
    },
    isEqual(data1, data2) {
      if (typeof data1 !== 'object') return data1 === data2
      if (data1 === data2) return true
    
      let { rowKey } = this
      return data1[rowKey] === data2[rowKey]
    }
  }
}