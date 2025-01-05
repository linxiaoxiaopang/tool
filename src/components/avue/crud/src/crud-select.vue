<template>
  <base-select
    v-model="text"
    :popperClass="`uiid-zd-${prop}-popper`"
    class="avue-select"
    :class="{ 'is-readonly': readonly }"
    :size="size"
    :placeholder="placeholder || '请选择' + label"
    :disabled="disabled || readonly"
    :checkbox="checkbox"
    :clearable="clearable"
    :filterable="filterable"
    :loading="loading"
    :load="scrollLoad"
    @visible-change="handleVisibleChange"
    v-bind="$attrs"
    v-on="new$listeners"
  >
    <template v-for="(val, key) in $scopedSlots" v-slot:[key]="scope">
      <slot :name="key" v-bind="scope"></slot>
    </template>

    <template v-if="isGroup">
      <el-option-group
        v-for="group in finalDic"
        :key="group[dictLabel]"
        :label="group[dictLabel]">
        <base-option
          v-for="item in group.options"
          :key="item[dictValue]"
          :label="item[dictLabel]"
          :value="item[dictValue]"
          :data="item"
          :disabled="item.disabled"
          :filterMethod="filterMethod"
        ></base-option>
      </el-option-group>
    </template>
    <template v-else>
      <base-option
        v-for="(item,index) in finalDic"
        :key="index"
        :label="item[dictLabel]"
        :value="item[dictValue]"
        :data="item"
        :checkbox="checkbox"
        :labelPrefix="item.labelPrefix"
        :showLabelPrefix="validData(item.showLabelPrefixInPopper, true)"
        :disabled="item.disabled"
        :filterMethod="filterMethod"
      ></base-option>
    </template>

    <li
      v-if="load"
      v-show="!loadNoMore"
      ref="scrollEl"
      v-infinite-scroll="scrollLoad"
      :infinite-scroll-distance="36"
      :infinite-scroll-disabled="loadDisabled"
      class="el-select-dropdown__empty"
      style="height: 36px"
    >加载中</li>
  </base-select>
</template>

<script>
import { validData } from '@/components/avue/utils/util'
import { isScroll } from '@/utils/element'
import { validatenull } from '@/components/avue/utils/validate'
import { find } from 'lodash'

export default {
  name: 'AvueCrudSelect',
  props: {
    label: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    },
    value: {
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: false
    },
    filterMethod: Function,
    checkbox: Boolean,
    visibleChange: {
      type: Function,
      default: () => true
    },
    props: {
      default: () => {
        return {}
      }
    },
    dic: {
      type: Array,
      default: () => ([])
    },
    load: Function,
    isRequestOnEmptyDic: Boolean
  },
  data() {
    return {
      text: '',
      loading: false,
      remoteData: [],

      loadLoading: false,
      loadPage: 0,
      loadTotal: Infinity,
      loadData: [],
      // 由于load是懒加载，loadData中可能不包含当前value的dicItem：导致显示异常
      // 将dic中value的dicItem拼接到loadData
      valueDic: null
    }
  },
  computed: {
    finalDic() {
      if (this.load) {
        const { loadData } = this
        if (!validatenull(loadData)) return loadData.concat(this.valueDic || [])
        return validData(this.dic, [])
      }
      return validData(this.remoteData, this.dic, [])
    },
    valueDicChange({ text, loadData }) {
      if (!this.load) return null

      if (text && !this.findByValue(loadData, text)) {
        const valueDic = this.findByValue(this.dic, text)
        if (valueDic) return valueDic
      }

      return null
    },
    isGroup({ finalDic }) {
      return finalDic?.[0]?.options
    },
    dictLabel() {
      return this.props.label || 'label'
    },
    dictValue() {
      return this.props.value || 'value'
    },
    new$listeners() {
      return Object.assign(
        {
          ...this.$listeners
        },
        {
          change: this.handleChange
        }
      )
    },

    loadNoMore() {
      return this.loadData.length >= this.loadTotal
    },
    loadDisabled() {
      return this.loadLoading || this.loadNoMore
    }
  },
  watch: {
    value: {
      async handler(n) {
        this.text = n

        if (!this.isRequested && this.isRequestOnEmptyDic && !validatenull(n) && validatenull(this.finalDic)) {
          this.isRequested = true
          if (this.load) {
            if (!find(this.finalDic, { [this.dictValue]: n })) {
              while (true) {
                if (this.loadDisabled) break

                const len = this.loadData.length
                await this.scrollLoad()
                if (len === this.loadData.length) break
                if (find(this.loadData, { [this.dictValue]: n })) break
              }
            }
          } else {
            this.visibleChange(true, async (dic) => {
              this.loading = true
              this.remoteData = await dic
              this.loading = false
            })
          }
        }
      },
      immediate: true
    },
    load: {
      handler() {
        this.initLoad()
      },
      immediate: true
    },
    valueDicChange: {
      handler(valueDic) {
        this.valueDic = valueDic
      },
      immediate: true
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('change', value)
      this.$emit('search-change')
    },

    async handleVisibleChange(visible) {
      this.visibleChange(visible, async (dic) => {
        this.loading = true
        this.remoteData = await dic
        this.loading = false
      })

      if (visible) {
        if (this.load && !this.loadDisabled) {
          let isLoad = this.loadPage === 0
          // 首次加载，加载样式显示
          if (isLoad) this.loading = true
          // 已获取数据，仍然没有出现滚动条时，再次获取数据
          if (!isLoad) {
            await new Promise(this.$nextTick)
            isLoad = !isScroll(this.$refs.scrollEl)
          }
          if (isLoad) {
            await this.scrollLoad()
            this.loading = false
          }
        }
      }
    },
    scrollLoad() {
      // console.log('load')
      return new Promise(resolve => {
        if (typeof this.load === 'function') {
          this.loadLoading = true
          this.load(
            ++this.loadPage,
            (data, total) => {
              this.loadTotal = total ?? Infinity
              this.loadData = this.loadData.concat(data)
              this.loadLoading = false

              resolve()
            },
            this
          )
        }
      })
    },
    initLoad() {
      this.loadPage = 0
      this.loadTotal = Infinity
      this.loadData = []
      this.loadLoading = false
    },

    validData,
    findByValue(dic, value) {
      return find(dic, { [this.dictValue]: value })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  &.avue-select {
    max-width: 322px;
  }
  &.is-readonly {
    .el-input.is-disabled .el-input__inner {
      color: $color-content;
      background-color: transparent;
      cursor: pointer;
    }
    .el-input.is-disabled .el-input__icon {
      cursor: pointer;
    }
  }
}
</style>
