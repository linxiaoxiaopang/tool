<template>
  <el-table-column
    ref="column"
    :key="column.$sortKey"
    :prop="column.prop"
    :show-overflow-tooltip="validData(column.showOverflowTooltip, column.overHidden)"
    :min-width="validData(column.minWidth, crud.option.autoHeaderWidth && getPxWidth(column))"
    :sortable="column.sortable"
    :align="validData(column.align, crud.option.align)"
    :header-align="validData(column.headerAlign, crud.option.headerAlign)"
    :width="column.width"
    :label="column.label"
    :fixed="column.fixed"
    :class-name="column.className"
  >
    <template slot="header" slot-scope="scope">
      <slot :name="column.headerSlotName || `${column.prop}Header`" :dic="dic" :currentColumn="column" v-bind="scope">
        <slot name="Header" :dic="dic" :currentColumn="column" v-bind="scope">{{
            column.label
          }}</slot>
      </slot>
    </template>
    <template slot-scope="scope">
      <div v-if="!crud.disabled && (formTemps[scope.$index] = filterFormTempList(formTempList, scope))" class="table-form-list">
        <TableFormItem
          v-for="(item, index) in formTemps[scope.$index]"
          :key="index"
          :row="scope.row"
          :label="item.label"
          :prop="item.prop"
          :required="item.required"
          :rules="item.rules"
        >
          <formTemp
            v-model="scope.row[item.prop]"
            :column="item"
            :dic="dic"
          ></formTemp>
        </TableFormItem>
      </div>
      <slot
        v-else
        :name="column.slotName || column.prop"
        :dic="dic"
        :tableColumn="column"
        :currentColumn="column"
        v-bind="scope"
      >
        <span v-if="column.type || column.formatter" v-html="detail(scope.row, column, scope.$index)"></span>
        <span v-else>{{ cellDetail(scope.row, column) }}</span>
        <!-- 存在报错信息 -->
        <div v-if="scope.row.asyncValidatorErrorList && scope.row.asyncValidatorErrorList[`_${column.prop}_errMsg`]" class="text-danger">
          {{scope.row.asyncValidatorErrorList[`_${column.prop}_errMsg`]}}
        </div>
      </slot>
    </template>
  </el-table-column>
</template>

<script>
import { findByvalue, setDic, validData } from '@/components/avue/utils/util'
import { cloneDeep, get } from 'lodash'
import column from '@/components/avue/core/column'
import formTemp from '@/components/avue/form/src/formTemp'
import tableFormItem from './tableFormItem'
import { validatenull } from '@/components/avue/utils/validate'
import { getResult } from '@/utils/functional'
import moment from 'moment'

export default {
  name: 'column-slot',
  components: { tableFormItem, formTemp },
  mixins: [column],
  props: {
    column: Object,
    columnOption: Array,
  },
  data() {
    return {
      formTemps: {}
    }
  },
  computed: {
    formTempList({ column }) {
      if (this.$scopedSlots[column.slotName]) return
      if (!validatenull(column.column)) return Array.isArray(column.column) ? column.column : [column.column]
      if (column.cell) return [column]
    },
    dic() {
      return setDic(this.column, this.crud.DIC)
    },
    placeholder() {
      return this.validData(this.column.placeholder, this.crud.option.placeholder)
    }
  },
  methods: {
    //处理数据
    detail(row, column, index) {
      let result = get(row, column.prop)
      if (column.formatter && typeof column.formatter === 'function') {
        result = column.formatter(row, column, result, index)
      }
      if (column.type) {
        if ((column.type == 'date' || column.type == 'time' || column.type == 'datetime') && column.format) {
          const format = column.format.replace('dd', 'DD').replace('yyyy', 'YYYY')
          result = moment(result).format(format)
        }
        result = findByvalue(this.dic, result, column.props)
      }
      this.$set(row, `$${column.prop}`, result)
      return result
    },
    cellDetail(row, column) {
      const { prop } = column
      const value = get(row, prop)
      if (validatenull(value)) return this.placeholder

      return value
    },

    filterFormTempList(list, { row, $index }) {
      if (!validData(row.$cellEdit, true) || !Array.isArray(list)) return

      let { column } = this
      list = cloneDeep(list).filter(item => {
        return !(item.disabled = getResult(item.disabled, row, column, $index))
      })
      return list.length && list
    }
  }
}
</script>

<style lang="scss" scoped>

</style>