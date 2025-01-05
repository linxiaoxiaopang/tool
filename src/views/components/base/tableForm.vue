<template>
  <el-form
    ref="form"
    class="validate-form-self"
    :class="{ 'is-edit': !disabled }"
    :style="{ width: setPx(option.width) }"
    :model="form"
    :label-width="setPx(option.labelWidth, 80)"
    :label-suffix="labelSuffix"
    :validate-on-rule-change="validData(option.validateOnRuleChange, false)"
    :hide-required-asterisk="option.hideRequiredAsterisk"
    @submit.native.prevent
    @validate="handleValidate"
  >
    <el-table
      ref="table"
      border
      class="table-border"
      :class="{ 'not-empty-text': !hasEmptyText }"
      :data="form.tableData"
      :row-key="option.rowKey"
      :row-class-name="tableRowClassName"
      v-on="$listeners"
    >
      <!-- 选择框 -->
      <template v-if="option.selection">
        <el-table-column
          type="selection"
          width="50"
          align="center"
          :selectable="option.selectable"
          :reserve-selection="option.reserveSelection"
        ></el-table-column>
      </template>

      <el-table-column
        v-for="column in columnOption"
        :key="column.prop"
        :width="column.width"
        :min-width="column.minWidth"
        v-bind="column"
      >
        <template #default="scoped">
          <slot :name="column.prop" v-bind="scoped">
            <template v-if="!getDisabled(column) && column.children">
              <el-form-item
                v-for="item in column.children || []"
                :key="`${item.prop}${form.tableData[scoped.$index].$key}`"
                :label="item.label"
                :prop="`tableData[${scoped.$index}].${item.prop}`"
                :rules="item.rules"
                :label-width="setPx(validData(item.labelWidth, option.labelWidth, 0))"
                :show-message="validData(item.showMessage, false)"
                :class="[validData(item.showMessage, false) && 'show-message']"
              >
                <slot
                  :name="item.prop"
                  :row="scoped.row"
                  :$index="scoped.$index"
                  :form="form.tableData[scoped.$index]"
                  :dic="getDic(item, scoped.row)"
                  :disabled="getDisabled(item, scoped.row)"
                  :size="validData(item.size, 'small')"
                  :option="item"
                  v-bind="item"
                >
                  <component
                    :is="getComponent(item.type)"
                    v-model="form.tableData[scoped.$index][item.prop]"
                    v-bind="item"
                    :dic="getDic(item, scoped.row)"
                    :disabled="getDisabled(item, scoped.row)"
                    :size="validData(item.size, 'small')"
                    @input="onCellInput(scoped.row, item)"
                    @change="onCellChange(scoped.row, item)"
                    @blur="onblur"
                  ></component>
                </slot>
              </el-form-item>
            </template>
            <template v-else>
              <span v-if="column.type || column.formatter" v-html="detail(scoped.row, column)"></span>
              <span v-else>{{ validData($GET(scoped.row, column.prop, null), column.placeholder) }}</span>
            </template>
          </slot>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!disabled && validData(option.menu, true)"
        label="操作"
        :fixed="option.menuFixed"
        :align="validData(option.menuAlign)"
        :header-align="option.menuHeaderAlign"
        :width="validData(option.menuWidth, 240)"
      >
        <template #default="scoped">
          <slot name="menu" v-bind="scoped"></slot>
          <Popover
            v-if="validData(option.delBtn, true)"
            :disabled="!(canDeleteOnRemainingOne || form.tableData.length > 1)"
            @sureHandler="delTableData(scoped.$index)"
          >
            <template #tip>
              <p>确认删除产品？</p>
            </template>
            <template #reference="{ scope: loading }">
              <el-button type="text">删除</el-button>
            </template>
          </Popover>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter'
import { componentMethodsMixin } from '@/mixins'
import { findByvalue, setDic, vaildData } from '@/components/avue/utils/util'
import { setPx, validData } from '@/components/avue/utils/util'
import { cloneDeep, get } from 'lodash'
import { flatTreeMapDeep } from '@/utils';
import moment from 'moment'

export default {
  mixins: [emitter, componentMethodsMixin('table', ['toggleRowSelection', 'clearSelection'])],
  props: {
    option: {
      default: () => ({})
    },
    value: {
      default: () => []
    },
    prop: {
      default: 'tableData'
    },
    disabled: Boolean,
    hasEmptyText: {
      default: true
    },
    canDeleteOnRemainingOne: {
      default: true
    },
    rowClassName: [String, Function]
  },
  data() {
    return {
      validateMessages: {},
      form: {}
    }
  },
  computed: {
    columnOption({ option: { column, disabled } }) {
      disabled = validData(disabled, this.disabled)
      return cloneDeep(column).filter((item) => {
        item.disabled = validData(item.disabled, disabled)
        item.children?.forEach((ele) => ele.rules = this.formatRules({ rules: ele.rules, label: validData(ele.label, item.label) }))
        return !item.hide
      })
    },
    defaultRow({ columnOption }) {
      let tempObj = {}
      columnOption.forEach((column) => {
        column.children?.forEach((item) => {
          tempObj[item.prop] = ''
        })
      })
      return tempObj
    },

    labelSuffix({ option: { labelSuffix } }) {
      if (typeof labelSuffix === 'boolean') return labelSuffix ? '：' : ''
      return vaildData(labelSuffix, '：')
    },

    getters({ $store }) {
      return $GET($store, 'getters', {})
    },

    allColumnDic({ columnOption, option, getters }) {
      const flatColumn = flatTreeMapDeep(columnOption)
      const optionDic = validData(option.dic, {})
      return flatColumn.reduce((cur, next) => {
        const dicProp = this.getDicProp(next)
        if (!dicProp) return cur
        if (cur[dicProp]) return cur
        cur[dicProp] = validData(optionDic[dicProp], getters[dicProp], [])
        return cur
      }, {})
    },

    dic({ allColumnDic }) {
      return allColumnDic
    }
  },
  watch: {
    value: {
      handler(value) {
        this.$set(this.form, 'tableData', Array.isArray(value) ? value : [])
      },
      immediate: true
    }
  },
  methods: {
    detail(row, column) {
      let result = get(row, column.prop)
      if (column.formatter && typeof column.formatter === 'function') {
        result = column.formatter(row, column, result)
      }
      if (column.type) {
        if ((column.type == 'date' || column.type == 'time' || column.type == 'datetime') && column.format) {
          const format = column.format.replace('dd', 'DD').replace('yyyy', 'YYYY')
          result = moment(result).format(format)
        }
        result = findByvalue(validData(this.dic[this.getDicProp(column)], []) , result, column.props)
      }
      this.$set(row, column.prop, result)
      return validData(result, column.placeholder)
    },

    addTableData(row = cloneDeep(this.defaultRow)) {
      row.$key = +new Date()
      this.form.tableData.push(row)
      this.oninput()
    },
    delTableData(index) {
      this.form.tableData.splice(index, 1)
      this.oninput()
    },

    oninput() {
      this.$emit('input', this.form.tableData)

      this.dispatch('ElFormItem', 'el.form.change')
    },
    onblur() {
      this.$emit('blur', this.form.tableData)
    },
    onCellInput(row, item) {
      if (typeof item.onCellInput === 'function') item.onCellInput(row, item)
      this.$emit('cell-input', row, item)
      this.oninput()
    },
    onCellChange(row, item) {
      if (typeof item.onCellChange === 'function') item.onCellChange(row, item)
      this.$emit('cell-change', row, item)
      this.oninput()
    },
    handleValidate(prop, valid, msg) {
      // console.log(prop, valid, msg)

      let { validateMessages } = this
      validateMessages[prop] = valid || msg
      if (valid) {
        for (const key in validateMessages) {
          if (validateMessages[key] !== true) msg = validateMessages[key]
        }
      }

      this.$emit('validate', this.prop, msg)
    },
    async validate(callback) {
      return this.$refs.form.validate(callback)
    },

    //行添加class
    tableRowClassName(param) {
      let result = [param.row.$rowClassName]

      let { rowClassName } = this
      switch (typeof rowClassName) {
        case 'string':
          result.push(rowClassName)
          break
        case 'function':
          result.push(rowClassName(param, this.value))
          break
      }

      return result.filter(Boolean).join(' ')
    },

    // 选中实例
    toggleSelection(rows, selected) {
      if (rows) {
        rows.forEach((row) => {
          this.toggleRowSelection(row, selected)
        })
      } else {
        this.clearSelection()
      }
    },

    getDicProp(column) {
      const { type, dicType, prop } = column
      if (dicType) return dicType
      if (type) return prop
      return null
    },

    getDic(column, row) {
      let dic = this.dic
      return validData(setDic(column, dic), dic[row[column.dicData]], undefined)
    },

    formatRules({ rules, label }) {
      if(!rules) return
      rules = Array.isArray(rules) ? rules : [rules]
      return rules.map((rule) => {
        if (rule.required === true) {
          return {
            message: `${label || '该项'}必填`,
            ...rule
          }
        }
        return rule
      })
    },
    getDisabled({ disabled }, row) {
      if (typeof disabled === 'function') return disabled(row)
      return validData(disabled, this.disabled)
    },
    getComponent(type) {
      let component = {
        select: 'avueCrudSelect'
      }[type]
      return component || 'avueCrudInput'
    },
    setPx,
    validData
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .not-empty-text .el-table__empty-block {
    display: none;
  }

  .el-table.el-table--border.table-border {
    border-left: 1px solid $border-color;

    &::after {
      display: block;
    }

    th {
      border-right: none;
    }
  }

  th {
    height: 35px;
    padding: 0;
  }

  td {
    height: 53px;
  }

  .is-disabled {
    .el-button--text {
      color: #cccccc;
    }
  }

  &.is-edit {
    td {
      padding: 0;
    }
  }

  .el-form-item {
    margin-bottom: 0;
  }

  .el-form-item__content {
    line-height: 52px;
  }
}

.show-message {
  ::v-deep {
    .el-form-item__content {
      padding-top: 10px;
      line-height: 1.2;
    }
  }

  padding-bottom: 15px;
  margin-bottom: 10px;
}
</style>
