<template>
  <div v-if="showHeaderSearch" ref="headerSearch" class="crud-header">
    <!--v-show="searchFlag && showSearch"-->
    <el-form
      ref="searchForm"
      class="formPart"
      :model="searchForm"
      :size="finalOption.searchSize || DEFAULT_TABLE_SIZE"
      :label-width="setPx(finalOption.searchLabelWidth, 'auto')"
      :label-suffix="validData(finalOption.searchLabelSuffix, finalOption.isSearchLabelSuffix === false ? '' : ':')"
      @submit.native.prevent
    >
      <el-row :gutter="validData(finalOption.gutter, 16)">
        <!-- 循环列搜索框 -->
        <el-col
          v-for="(column, index) in getDisplayColumn(searchColumn)"
          :key="column.prop"
          :md="column.searchSpan || 6"
          :xs="24"
          :span="24"
          :offset="column.offset || 0"
          :pull="column.pull"
          :style="{ width: setPx(column.searchWidth, !column.searchSpan && validData(finalOption.isSearchAuto, true) && 'auto') }"
        >
          <el-form-item
            :label="column.searchLabel"
            :prop="column.prop"
            :size="column.searchSize"
            :label-width="setPx(column.searchLabelWidth, 'auto')"
          >
            <slot
              v-if="vaildData(column.searchFormSlot, column.searchSlotName)"
              v-bind="handleBindColumn(column)"
              v-model="searchForm[column.prop]"
              :name="column.searchSlotName || `${column.prop}SearchForm`"
              :dic="setDic(column, DIC)"
              :form="searchForm"
              :label="column.searchLabel"
              :prop="column.prop"
              :props="column.props"
              :size="column.searchSize || finalOption.searchSize || DEFAULT_TABLE_SIZE"
              :placeholder="column.searchPlaceholder"
              :searchChange="searchChange"
            ></slot>
            <component
              v-else
              :is="components[column.type] || components[column.searchType] || getSearchType(column.type)"
              v-model="searchForm[column.prop]"
              :uiid="`zd-${column.prop}`"
              :style="{ width: setPx(column.searchContentWidth) }"
              :form="searchForm"
              :column="column"
              :type="column.type"
              :size="column.searchSize || finalOption.searchSize || DEFAULT_TABLE_SIZE"
              :valueFormat="column.valueFormat"
              :label="column.searchLabel"
              :prefix-icon="column.searchPrefixIcon"
              :suffix-icon="column.searchSuffixIcon"
              :placeholder="column.searchPlaceholder"
              :props="column.props"
              :dic="setDic(column, DIC)"
              :border="column.border"
              :minRows="column.minRows"
              :maxRows="column.maxRows"
              :controls="column.controls"
              :controls-position="column.controlsPosition"
              :emitPath="column.emitPath"
              :checkStrictly="column.checkStrictly"
              :show-all-levels="column.showAllLevels"
              @input="handleChange"
              @search-change="searchChange"
              v-bind="handleBindColumn(column)"
            ></component>
          </el-form-item>
        </el-col>
        <el-col v-if="btn" :span="1.5" class="search-form-btn text-right nowrap">
          <el-form-item>
            <el-button
              v-if="searchBtn"
              type="primary"
              @click="searchChange('btn')"
              :icon="finalOption.searchIcon || finalOption.isSearchIcon && 'el-icon-search'"
              class="search-form-confirm"
              :size="finalOption.searchSize || DEFAULT_TABLE_SIZE"
            >
              <template v-if="vaildData(finalOption.isSearchText, true)">
                {{ finalOption.searchText || '搜索' }}
              </template>
            </el-button>
            <el-button
              v-if="resetBtn"
              @click="searchReset"
              :icon="finalOption.resetIcon || finalOption.isResetIcon && 'el-icon-refresh'"
              class="search-form-reset"
              :size="finalOption.searchSize || DEFAULT_TABLE_SIZE"
            >
              <template v-if="vaildData(finalOption.isResetText, true)">
                {{ finalOption.resetText || '重置' }}
              </template>
            </el-button>
            <slot name="searchMenu"></slot>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { DEFAULT_TABLE_SIZE } from '../../utils/const/config'
import { validatenull } from '../../utils/validate'
import crud from '../../mixins/crud'
import dateTimePicker from '@/components/base/baseTable/module/dateTimePicker'
import selectInput from '@/components/base/baseForm/module/selectInput'
import rangeInput from '@/components/base/baseTable/module/rangeInput'
import defaultImg from '@/views/components/base/defaultImg'
import listRadioGroup from '@/views/components/base/listRadioGroup'
import { validData } from '@/components/avue/utils/util'
import { cloneDeep } from 'lodash'

const defaultWidths = {
  default: 246,
  listRadioGroup: {
    searchSize: 'mini',
    searchWidth: '100%'
  },
  dateTimePicker: 358
}

export default {
  name: 'crudHeaderSearch',
  mixins: [crud()],
  inject: {
    crud: {
      default: () => {}
    }
  },
  props: {
    search: {
      type: Object,
      default: () => ({})
    },
    option: Object
  },
  data() {
    return {
      DEFAULT_TABLE_SIZE,
      searchForm: {}
    }
  },
  computed: {
    finalOption() {
      return this.option || this.crud?.option || {}
    },
    searchColumn() {
      return cloneDeep(this.finalOption.column || []).filter((column) => {
        if (!column.search) return

        column.searchLabel = this.vaildData(column.searchLabel, column.label)
        if (!column.searchLabel) {
          column.searchLabelWidth = this.vaildData(column.searchLabelWidth, 0)
        }
        if (validatenull(column.searchWidth) && validatenull(column.searchSpan)) {
          const width = validData(defaultWidths[column.type], defaultWidths.default)
          if (typeof width === 'object') {
            Object.assign(column, width)
          } else {
            column.searchContentWidth = validData(column.searchContentWidth, width)
          }
        }
        if (['input', undefined].includes(column.type)) {
          column.searchPrefixIcon = validData(column.searchPrefixIcon, 'el-icon-search')
        }

        return column.search
      })
    },
    objectOption() {
      let tempObj = {}
      this.searchColumn.forEach(column => {
        tempObj[column.prop] = column
      })
      return tempObj
    },
    controlOption() {
      return this.searchColumn.filter(column => column.control)
    },
    DIC() {
      return {
        ...this.$attrs.dic,
        ...this.finalOption.dic,
        ...this.crud?.DIC
      }
    },

    searchFlag() {
      return !validatenull(this.searchForm)
    },
    showHeaderSearch() {
      return this.searchFlag
    },
    btn() {
      return this.vaildData(this.finalOption.btn, this.searchBtn || this.resetBtn)
    },
    searchBtn() {
      return this.vaildData(this.finalOption.searchBtn, false)
    },
    resetBtn() {
      return this.vaildData(this.finalOption.resetBtn, false)
    },

    autosearch() {
      return validData(this.$attrs.autosearch, this.finalOption.autosearch, true)
    },

    components() {
      return {
        defaultImg,
        dateTimePicker,
        selectInput,
        rangeInput,
        listRadioGroup
      }
    }
  },
  watch: {
    search: {
      handler (search) {
        this.searchForm = Object.assign(this.searchForm, search)
      },
      immediate: true,
      deep: true
    },
    finalOption: {
      handler(n, o) {
        if (n !== o) {
          //初始化表单
          this.formInit()
        }
      },
      immediate: true,
      deep: true
    },
    searchForm: {
      handler: 'controlHandler',
      immediate: true,
      deep: true
    },
    objectOption: 'controlHandler'
  },
  methods: {
    formInit() {
      const list = this.finalOption.column
      let form = {}
      let searchForm = {}
      list.forEach((ele) => {
        if (['checkbox', 'daterange', 'cascader'].includes(ele.type)) {
          form[ele.prop] = []
          if (ele.search) {
            searchForm[ele.prop] = []
          }
        } else if (ele.type == 'number') {
          form[ele.prop] = 0
          if (ele.search) {
            searchForm[ele.prop] = 0
          }
        } else {
          form[ele.prop] = ''
          if (ele.search) {
            searchForm[ele.prop] = ''
          }
        }
        if (!validatenull(ele.value)) form[ele.prop] = ele.value
        if (!validatenull(ele.searchValue)) searchForm[ele.prop] = ele.searchValue
      })
      this.searchForm = Object.assign({}, searchForm, this.search)
      this.handleChange()

      !this.isSearchInit && this.searchInit()
      this.isSearchInit = true
    },
    // 解决searchForm默认值未设置即发起请求
    searchInit() {
      this.$nextTick(() => {
        this.$emit('search-init', this.searchForm)
        this.crud?.$emit('search-init', this.searchForm)
      })
    },

    handleChange() {
      this.$emit('update:search', this.searchForm)
      this.crud?.$emit('update:search', this.searchForm)
    },
    //搜索回调
    searchChange(trigger) {
      if (trigger !== 'btn' && !this.autosearch) return

      this.$emit('search-change', this.searchForm)
      this.crud?.$emit('search-change', this.searchForm)
    },
    //搜索清空
    searchReset() {
      this.$refs['searchForm'].resetFields()
      this.$emit('search-reset', this.searchForm)
      this.crud?.$emit('search-reset', this.searchForm)
    },

    validate(callback) {
      return this.$refs.searchForm.validate(callback)
    },

    controlHandler() {
      const { DIC } = this
      this.controlOption.forEach(ele => {
        let control = ele.control(
          this.searchForm[ele.prop],
          this.searchForm,
          { ...ele, dicData: this.setDic(ele, DIC) },
          DIC
        ) || {}
        Object.keys(control).forEach(item => {
          this.assignReactive(this.objectOption[item], control[item])
          if (control[item].dicData) {
            DIC[item] = control[item].dicData
          }
        })
      })
    },
    assignReactive(target, source) {
      if (!target || !source) return
      for (const key in source) {
        this.$set(target, key, source[key])
      }
    },
    getDisplayColumn(column) {
      return (column || []).filter(col => col.search)
    },

    handleBindColumn(column) {
      const { DIC } = this
      const tmpObj = {}
      if (column.dicTypes) {
        for (const key in column.dicTypes) {
          const dicType = column.dicTypes[key]
          const [dicName] = Array.isArray(dicType) ? dicType : [dicType]
          tmpObj[key] = DIC[dicName]
        }
      }

      return {
        ...tmpObj,
        ...column,
        slot: undefined,
        $sort: undefined,
        $sortKey: undefined
      }
    },

    validData
  }
}
</script>

<style lang="scss" scoped>

</style>
