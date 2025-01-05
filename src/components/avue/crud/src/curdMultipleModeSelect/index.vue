<template>
  <el-select
    ref="selectEl"
    :value="formatValue"
    @visible-change="handleVisibleChange"
    v-bind="allSelectOption"
    v-on="$listeners"
  >
    <template #prefix v-if="prefix">
      <span v-auto-w>{{ prefix }} :</span>
    </template>

    <template #empty>
      <div class="container" v-loading="loading">
        <div class="group-wrapper" :is="option.component.groupName" v-model="currentValue">
          <div class="content">
            <div class="tree-wrapper item">
              <el-input v-if="filterable" class="mb10" v-model="searchValue" v-bind="allSearchOption" />
              <el-tree :data="dicOfSearch" v-bind="allTreeOption" v-on="$listeners">
                <template #default="{ data, node }">
                  <component :is="option.component.itemName" :label="data[dictValue]">
                    <slot :data="data">
                      <span v-html="detail(data)" />
                    </slot>
                  </component>
                </template>
              </el-tree>
            </div>

            <div class="item result" v-if="option.showResult">
              <div class="mb10">已选中（{{ currentValue.length }}）</div>
              <el-checkbox-group v-model="currentValue">
                <el-checkbox
                  class="block mb10"
                  v-for="(item, index) in checkDataByCurrentValue"
                  :key="index"
                  :label="item[dictValue]"
                >
                  <slot :data="item">
                    <span v-html="detail(item)" />
                  </slot>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>

        <div class="btn-wrapper flex-center-between">
          <div class="left-btn flex-center">
            <slot name="leftBtn">
              <component :is="leftBtnComponentName" v-if="leftBtnComponentName" v-on="$listeners" v-bind="allLeftBtnComponentOption" />
              <span v-else />
            </slot>
          </div>

          <div class="right-btn">
            <el-button class="text-title" type="text" @click="onClose"> 取消 </el-button>
            <el-button class="text-primary ml15" type="text" @click="onSubmit"> 确定 </el-button>
          </div>
        </div>
      </div>
    </template>
  </el-select>
</template>

<script>
import { treeDefaultOption, selectDefaultOption, searchDefaultOption } from './const'
import { flatTreeMapDeep, getSplitAttrs } from '@/utils'
import { validatenull } from '@/components/avue/utils/validate'
import { escapeRegexpString } from 'element-ui/src/utils/util'
import { validData } from '@/components/avue/utils/util'
import { isNil, isArray, merge, map, xor, cloneDeep } from 'lodash'

const PREFIX_LIST = {
  tree: 'treeOption',
  select: 'selectOption',
  searchInput: 'searchOption',
  leftBtnComponent: 'leftBtnComponentOption',
  default: 'select'
}

const getDetailText = (function () {
  const tempElement = document.createElement('div')
  return function (htmlString) {
    tempElement.innerHTML = htmlString
    return tempElement.textContent || tempElement.innerText
  }
})()

export default {
  name: 'AvueCurdMultipleModeSelect',

  props: {
    treeConfig: {
      type: Object,
      default: () => ({})
    },

    selectConfig: {
      type: Object,
      default: () => ({})
    },

    searchConfig: {
      type: Object,
      default: () => ({})
    },

    leftBtnComponentConfig: {
       type: Object,
      default: () => ({})
    },

    value: {
      required: true
    },

    label: {
      type: String,
      default: ''
    },

    prefix: String,

    dic: {
      type: Array,
      default: () => []
    },

    multiple: Boolean,

    filterable: {
      type: Boolean,
      default: true
    },

    visibleChange: {
      type: Function,
      default: () => true
    },

    leftBtnComponentName: {
      type: [String, Object]
    },

    formatter: Function
  },

  data() {
    return {
      loading: false,
      remoteData: [],
      currentValue: '',
      searchValue: ''
    }
  },

  directives: {
    autoW(el) {
      setTimeout(() => {
        if (!el || !el.parentNode) return
        const { offsetWidth } = el.parentNode
        const inputInner = el.parentNode.parentNode.querySelector('.el-input__inner')
        if (!inputInner) return
        inputInner.style.paddingLeft = offsetWidth + 10 + 'px'
      })
    }
  },

  computed: {
    type({ multiple }) {
      return multiple ? 'checkbox' : 'radio'
    },

    option({ type }) {
      const list = {
        radio: {
          component: {
            groupName: 'el-radio-group',
            itemName: 'el-radio'
          },
          span: 24,
          showResult: false,

          initCurrentValue: () => {
            if (isNil(this.value) || validatenull(this.value)) return ''
            if (isArray(this.value)) return this.value[0]
            return this.value
          },

          formatCheckedValue(checkedValue) {
            return checkedValue[0] || ''
          }
        },
        checkbox: {
          component: {
            groupName: 'el-checkbox-group',
            itemName: 'el-checkbox'
          },
          span: 12,
          showResult: true,

          initCurrentValue: () => {
            if (isNil(this.value) || this.value === '') return []
            if (isArray(this.value)) return this.value
            return [this.value]
          },

          formatCheckedValue(checkedValue) {
            return checkedValue
          }
        }
      }
      return list[type]
    },

    split$Attrs({ $attrs }) {
      return getSplitAttrs($attrs, PREFIX_LIST)
    },

    allTreeOption({ treeConfig, split$Attrs }) {
      return merge({}, treeDefaultOption, split$Attrs.treeOption, treeConfig)
    },

    allSelectOption({ selectConfig, split$Attrs, label }) {
      return merge({}, selectDefaultOption, { placeholder: `请选择${label}` }, split$Attrs.selectOption, selectConfig)
    },

    allSearchOption({ searchConfig, split$Attrs, label }) {
      return merge({}, searchDefaultOption, { placeholder: `请搜索${label}` }, split$Attrs.searchOption, searchConfig)
    },

    allLeftBtnComponentOption({ leftBtnComponentConfig, split$Attrs }) {
      return merge({}, split$Attrs.leftBtnComponentOption, leftBtnComponentConfig)
    },

    treeProps({ allTreeOption }) {
      return allTreeOption.props || {}
    },

    dictLabel({ treeProps }) {
      return treeProps.label || 'label'
    },

    dictValue({ treeProps }) {
      return treeProps.value || 'value'
    },

    finalDic({ remoteData, dic }) {
      return validData(remoteData, dic, [])
    },

    flatDic({ finalDic }) {
      const cloneData = cloneDeep(flatTreeMapDeep(finalDic))
      if (validatenull(cloneData)) return []
      return cloneData.map((item) => {
        delete item.children
        return item
      })
    },

    dicOfSearch({ finalDic, flatDic, searchValue }) {
      if (!searchValue) return finalDic
      return flatDic.filter((item) => {
        return new RegExp(escapeRegexpString(searchValue), 'i').test(getDetailText(this.detail(item)))
      })
    },

    formatValue({ value, dictLabel, dictValue }) {
      const checkedData = this.getCheckedData(value)
      const labels = map(checkedData, dictLabel)
      const values = map(checkedData, dictValue)
      if (!value) value = []
      if (!isArray(value)) {
        value = [value]
      }
      const delValue = xor(values, value)
      labels.push(...delValue)
      return labels.join('；')
    },

    checkDataByCurrentValue({ currentValue }) {
      return this.getCheckedData(currentValue)
    }
  },

  watch: {
    value: {
      handler() {
        this.initCurrentValue()
      },
      immediate: true
    }
  },

  methods: {
    initCurrentValue() {
      this.currentValue = this.option.initCurrentValue()
    },

    getCheckedData(checkedValue) {
      if (validatenull(this.flatDic)) return []
      if (!isArray(checkedValue)) checkedValue = [checkedValue]
      return this.flatDic.filter((item) => checkedValue.find((curValue) => item[this.dictValue] == curValue))
    },

    onSubmit() {
      const checkedData = this.getCheckedData(this.currentValue)
      this.currentValue = this.option.formatCheckedValue(map(checkedData, this.dictValue))
      this.$emit('input', this.currentValue)
      this.handleChange(this.currentValue)
      this.onClose()
    },

    onClose() {
      this.initCurrentValue()
      this.$refs.selectEl.visible = false
    },

    handleChange(value) {
      this.$emit('change', value)
      this.$emit('search-change')
    },

    detail(row) {
      if (!this.formatter) return row[this.dictLabel]
      return this.formatter(row, this)
    },

    handleVisibleChange(visible) {
      this.visibleChange(visible, async (dic) => {
        this.loading = true
        this.remoteData = await dic
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
}

.group-wrapper {
  width: 100%;
}

.content {
  display: flex;
  font-size: 14px;

  .tree-wrapper {
    flex: 1;
  }

  .item {
    padding: 10px;
    max-height: 250px;
    min-width: 200px;
    overflow: auto;
  }

  ::v-deep {
    .el-tree-node__content,
    .result > .el-checkbox-group {
      min-height: 26px;
      height: auto;

      & > .el-checkbox,
      & > .el-radio {
        display: flex;
        align-items: center;

        .el-checkbox__label,
        .el-radio__label {
          flex: 1;
          word-break: break-all;
          white-space: normal;
        }
      }
    }
  }
}

.tree-wrapper {
  border-right: 1px solid $border-color;
}

.btn-wrapper {
  font-size: 14px;
  padding: 0 20px;
  line-height: 50px;
  border-top: 1px solid $border-color;
}

::v-deep {
  .el-input__prefix {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
}
</style>
