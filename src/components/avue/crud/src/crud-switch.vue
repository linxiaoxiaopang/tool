<template>
  <el-switch
    v-model="text"
    class="avue-switch"
    :class="{ 'label-inner': isInner }"
    :size="size"
    :width="len"
    :active-text="active[labelKey]"
    :active-value="active[valueKey]"
    :inactive-value="inactive[valueKey]"
    :inactive-text="inactive[labelKey]"
    :active-icon-class="activeIconClass"
    :inactive-icon-class="inactiveIconClass"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    :disabled="disabled"
    :readonly="readonly"
    @click.native="handleClick"
  ></el-switch>
</template>

<script>
import create from '../../core/create'
import props from '../../core/props.js'
import event from '../../core/event.js'

export default create({
  name: 'switch',
  mixins: [props(), event()],
  props: {
    value: {},
    hasText: Boolean,
    activeIconClass: String,
    inactiveIconClass: String,
    activeColor: String,
    inactiveColor: String,
    len: Number,
    dic: {
      type: Array,
      default: () => {
        return [
          {
            value: 0
          },
          {
            value: 1
          }
        ]
      }
    }
  },
  data() {
    return {}
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {
    active() {
      return this.finalDic[1] || {}
    },
    inactive() {
      return this.finalDic[0] || {}
    },
    isInner({ labelKey }) {
      return !this.finalDic.some(({ [labelKey]: label }) => !label || label.length > 1)
    },
    finalDic() {
      return this.hasText
        ? [{ label: '展', value: false }, { label: '收', value: true }]
        : this.dic
    }
  },
  methods: {}
})
</script>

<style lang="scss" scoped>
::v-deep {
  .el-switch__core {
    background-color: $color-placeholder;
  }
  &.label-inner {
    .el-switch__label {
      display: none;
      position: absolute;
      margin: 0;
      color: $color-white;
      z-index: 66;
      &:not(.is-active) {
        display: block;
      }
      * {
        font-size: 12px;
      }
    }
    .el-switch__label--left {
      left: 8px;
    }
    .el-switch__label--right {
      right: 6px;
    }
  }
}
</style>