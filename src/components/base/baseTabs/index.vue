<template>
  <div class="base-tabs" uiid="zd-tabs">
    <el-tabs
      :value="curValue"
      :type="tabsType"
      :class="{ [`base-tabs--${parentOption.type}`]: parentOption.type }"
      :tabPosition="tabPosition"
      @input="oninput"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="column in columnOption"
        :key="column.value"
        :label="column.label"
        :name="column.value"
        :lazy="lazy"
      >
        <div slot="label" class="tabs__item__content">
          <slot :name="`${column.value}Label`" :column="column">
            <slot name="label" :column="column">{{
              column.label
            }}</slot>
          </slot>
          <slot :name="`${column.value}SuffixIcon`">
            <slot name="suffixIcon">
              <tabsIcon v-if="column.suffixIcon" :option="column.suffixIcon" :isActive="curValue === column.value" />
            </slot>
          </slot>
        </div>
        <slot :name="column.value" :column="column">
          <slot :column="column">
            <component v-if="column.name" :is="column.name" :column="column" v-bind="column.attrs"></component>
          </slot>
        </slot>
      </el-tab-pane>
    </el-tabs>

    <baseTabs
      v-if="children"
      :key="curValue"
      :uiid="`zd-tabs-${curValue}`"
      v-model="childValue"
      :dic="children"
      :lazy="lazy"
      :type="type"
      @change="handleChange"
      @tab-click="handleTabClick"
    >
      <template v-for="(val, key) in $scopedSlots" v-slot:[key]="scope">
        <slot :name="key" v-bind="scope"></slot>
      </template>
    </baseTabs>
  </div>
</template>

<script>
import { cloneDeep, find } from 'lodash'
import { validData } from '@/components/avue/utils/util'
import { validatenull } from '@/components/avue/utils/validate'
import { getTabAllLevels, getTabsOption, getTabValues } from './util'

export default {
  name: 'baseTabs',
  components: {
    tabsIcon: {
      functional: true,
      render(h, { props: { option, isActive } }) {
        let template = {
          arrow: <i class={ ['el-icon-arrow-down', { 'is-reverse': isActive }] } />
        }[option]
        if (template) return template

        return <baseIcon option={ option } />
      }
    }
  },
  props: {
    value: {
      default: ''
    },
    dic: {
      type: Array | Object,
      default: () => {
        return []
      }
    },
    option: {
      type: Object
    },
    showChild: {
      type: Boolean,
      default: true
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    // card|border|border-card|text|normal|box-card
    type: {
      default: 'border'
    },
    lazy: {
      type: Boolean,
      default: true
    },
    tabPosition: String
  },
  data() {
    return {
      curValue: '',
      childValue: []
    }
  },
  computed: {
    finalValue: {
      get({ curValue, childValue }) {
        return [curValue].concat(childValue)
      },
      set(value) {
        if (!Array.isArray(value)) {
          value = this.tabAllLevels[value] || []
        }
        // console.log('finalValue', value)
        this.curValue = value[0]
        this.childValue = value.slice(1)
      }
    },
    defaultValue({ parentOption: { defaultValue }, columnOption }) {
      return validData(defaultValue, columnOption[0]?.value)
    },

    parentOption({ option, dic, type, tabPosition }) {
      if (!option) option = getTabsOption(dic)
      option = cloneDeep(option)

      option.type = validData(option.type, type)

      if (['left', 'right'].includes(tabPosition)) {
        delete option.type
      }

      return option
    },
    tabsType({ parentOption: { type } }) {
      if (['normal', 'default'].includes(type)) return
      return {
        border: 'card',
        'card-tab': 'card',
        'box-card': 'border-card',
      }[type] || type
    },
    columnOption () {
      return (this.parentOption.column || []).filter((ele) => !ele.hide)
    },
    objectOption({ columnOption }) {
      return getTabValues(columnOption)
    },
    curItem() {
      return this.objectOption[this.curValue] || {}
    },
    children() {
      if (this.showChild) {
        return this.curItem.children
      }
    },

    tabAllLevels() {
      return getTabAllLevels(this.parentOption)
    },

    hasContent({ columnOption, $scopedSlots }) {
      let hasContent = !!$scopedSlots.default
      columnOption.forEach(column => {
        if (column.name || $scopedSlots[column.value]) hasContent = true
      })
      return hasContent
    }
  },
  watch: {
    value: {
      handler(value) {
        // console.log('value', value)
        this.finalValue = value
      },
      immediate: true,
      deep: true
    },
    defaultValue: {
      handler(defaultValue) {
        // console.log('defaultValue', defaultValue, this.curValue)
        // curValue无值时，设置为默认值
        if (!validatenull(this.curValue)) return

        this.curValue = defaultValue
        validatenull(this.children) && this.handleChange()
      },
      immediate: true
    }
  },
  methods: {
    handleTabClick(tab, e) {
      // 如果有children，就由子组件触发change
      if (validatenull(this.children)) {
        this.childValue = []
        this.handleChange()
      } else if (this.oldValue !== this.curValue) { // 切换tab时，清空childValue
        this.childValue = []
      }

      this.$emit('tab-click', tab, e)
    },
    handleChange() {
      // console.log(this.curValue, 'handleChange')
      let { finalValue } = this
      finalValue = this.showAllLevels ? finalValue : finalValue.slice(-1)[0]
      this.$emit('input', finalValue)
      this.$emit('change', finalValue)
      this.$emit('search-change', finalValue)
    },
    oninput(value) {
      this.oldValue = this.curValue
      this.curValue = value
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  $height: 36px;
  &.base-tabs {
    width: 100%;
    .el-tabs__nav-wrap:not(.is-right):not(.is-left)::after {
      height: 1px;
    }

    .el-tabs + .base-tabs {
      margin-top: 2px;
    }
  }

  &[class*='base-tabs--'] {
    > .el-tabs__header {
      margin-bottom: 0;
    }
  }

  &.base-tabs--default,
  &.base-tabs--normal {
    > .el-tabs__header {
      .el-tabs__item,
      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        height: 48px;
        line-height: 48px;
      }
    }
  }
  &.base-tabs--normal {
    > .el-tabs__header {
      .el-tabs__item {
        padding: 0;
      }
      .tabs__item__content {
        padding: 0 24px;
      }
    }
  }

  &.base-tabs--border {
    > .el-tabs__header {
      border: none;

      .el-tabs__item,
      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        line-height: $height;
      }

      .el-tabs__item {
        height: $height;
        padding: 0 16px;
        border-bottom-color: $border-color;
        &:hover {
          background-color: $color-background;
        }
      }
    }
  }

  &.base-tabs--text {
    > .el-tabs__header {
      .el-tabs__nav-wrap::after {
        display: none;
      }

      .el-tabs__item,
      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        line-height: 1;
      }

      .el-tabs__item {
        height: 1em;
        padding: 0 20px;
        font-size: 16px;

        &:first-child {
          padding-left: 0;
        }
      }
    }
  }

  &.base-tabs--box-card {
    @include box-shadow;
    > .el-tabs__header {
      background-color: transparent;

      .el-tabs__item,
      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        height: 55px;
        line-height: 55px;
      }

      .el-tabs__item {
        color: $color-title;
        background-color: transparent;
        &.is-active {
          color: $color-primary;
          border-color: transparent;
        }
      }
    }
    > .el-tabs__content {
      padding: 0;
    }
  }
}
</style>