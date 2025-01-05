<template>
  <el-form ref="form" class="table-form" size="small" :model="form" :label-suffix="labelSuffix">
    <baseTable ref="baseTable" :propsOption="baseTablePropsOption" :option="option" v-bind="$attrs" v-on="$listeners">
      <template #tableFormItem="scope">
        <el-row v-if="formColumns[scope.tableColumn.prop]" class="table-form-item-wrapper">
          <el-col
            v-for="(item, index) in formColumns[scope.tableColumn.prop]"
            :key="`${getFormItemProp(item, scope)}--${keyMap.get(scope.row)}`"
            :span="validData(item.span, 24)"
            :offset="item.offset"
          >
            <el-form-item
              class="table-form-item"
              :row="scope.row"
              :label="item.showLabel ? item.label : undefined"
              :label-width="setPx(item.labelWidth)"
              :prop="getFormItemProp(item, scope)"
              :required="item.required"
              :rules="item.rules"
              :inline-message="true"
            >
              <slot :name="item.tableFormItemSlotName" :formColumn="item" v-bind="scope">
                <slot :name="`${item.prop}TableFormItem`" :formColumn="item" v-bind="scope">
                  <formTemp
                    v-model="scope.row[item.prop]"
                    :column="item"
                    :disabled="getResult(item.disabled, scope)"
                    :dic="finalDic[item.prop]"
                    @blur="getResult(item.blur, scope)"
                    @clear="getResult(item.clear, scope)"
                    @change="getResult(item.change, scope)"
                  ></formTemp>
                </slot>
              </slot>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <template v-for="(val, key) in $scopedSlots" v-slot:[key]="scope">
        <slot :name="key" v-bind="scope"></slot>
      </template>
    </baseTable>
  </el-form>
</template>

<script>
import formTemp from '@/components/avue/form/src/formTemp'
import propsTargetMixin from '@/mixins/parentProps/propsTargetMixin'
import { validatenull } from '@/components/avue/utils/validate'
import { setPx, validData } from '@/components/avue/utils/util'
import { flatten, map, cloneDeep } from 'lodash'
import { getResult } from '@/utils/functional'

export default {
  inheritAttrs: false,
  components: {
    formTemp
  },
  mixins: [
    propsTargetMixin({
      dataAttrs: {
        finalData: [],
        finalDic: {},
        finalColumn: []
      }
    })
  ],
  props: {
    option: {},
    propsOption: Object | Array,
    disabled: Boolean
  },
  data() {
    return {
      form: {},
      keyMap: new Map()
    }
  },
  computed: {
    formProps() {
      return map(this.flatColumn, 'prop')
    },
    flatColumn() {
      return flatten(Object.values(this.formColumns))
    },
    tableProps() {
      return Object.keys(this.formColumns)
    },
    formColumns({ option }) {
      if (this.disabled) return {}
      const tmpObj = {}
      for (const column of cloneDeep(option.column || [])) {
        if (column.slotName) continue

        let list
        if (column.cell || column.tableFormItemSlotName) list = [column]
        if (!validatenull(column.column)) list = Array.isArray(column.column) ? column.column : [column.column]
        if (validatenull(list)) continue

        for (const ele of list) {
          // 默认不显示label
          ele.showLabel = validData(ele.showLabel, false)

          // 格式化rules
          if (ele.rules) {
            let rules = Array.isArray(ele.rules) ? ele.rules : [ele.rules]
            ele.rules = rules.map((rule) => {
              if (rule.required === true) {
                return {
                  message: `${ele.label || '该项'}必填`,
                  ...rule
                }
              } else if (rule.validatorRow) {
                return {
                  validator: (...args) => {
                    const tableData = this.finalData
                    const index = args[0].field.split('.')[1]
                    const row = tableData[index]
                    args[3] = row || args[3]
                    rule.validatorRow(...args, this)
                  }
                }
              }
              return rule
            })
          }
        }
        tmpObj[column.prop] = list
      }
      return tmpObj
    },

    labelSuffix({ option: { labelSuffix } }) {
      if (typeof labelSuffix === 'boolean') return labelSuffix ? '：' : ''
      return validData(labelSuffix, '：')
    },

    baseTablePropsOption() {
      return [this.propsOption, this.propsTargetOption].filter(Boolean)
    }
  },
  watch: {
    finalData: {
      handler(finalData) {
        const { formProps, keyMap } = this
        const keys = [...keyMap.values()]
        let key = 0
        let nKeyMap = new Map()

        for (const row of finalData) {
          for (const prop of formProps) {
            // 设置响应式，解决输入框输入后未触发校验问题
            !row.hasOwnProperty(prop) && this.$set(row, prop, row[prop])
          }

          const oKey = keyMap.get(row)
          nKeyMap.set(row, oKey ? oKey : getKey())
        }
        this.form.tableData = finalData

        this.keyMap = nKeyMap
        function getKey() {
          return keys.includes(++key) ? getKey() : key
        }
      },
      immediate: true
    },
    finalColumn: {
      handler(finalColumn) {
        const { tableProps } = this
        for (const column of finalColumn) {
          if (tableProps.includes(column.prop)) column.slotName = 'tableFormItem'
        }
      },
      immediate: true
    }
  },
  methods: {
    validate(cb) {
      return this.$refs.form.validate(cb)
    },
    validateField(field, callback) {
      return this.$refs.form.validateField(field, callback)
    },
    toggleRowExpansion(row, expanded) {
      return this.$refs.baseTable.toggleRowExpansion(row, expanded)
    },

    getFormItemProp(item, scope) {
      return `tableData.${scope.$index}.${item.prop}`
    },

    validData,
    setPx,
    getResult
  }
}
</script>

<style lang="scss" scoped>
.table-form-item {
  margin-bottom: 0;
}
</style>