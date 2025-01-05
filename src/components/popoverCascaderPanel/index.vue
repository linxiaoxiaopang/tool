<template>
  <el-popover
    ref="popover"
    popperClass="popover-cascader-panel"
    :placement="placement"
    trigger="hover"
    v-bind="$attrs"
  >
    <template #reference>
      <slot name="reference"></slot>
    </template>
    <el-cascader-panel :value="value" :options="dic" :props="{ expandTrigger: 'hover' }" @change="changeHandler">
      <template #default="{ node, data }">
        <base-image v-if="data.isImage" :src="data.value" size="80" imgSize="none" fit="contain" style="position: absolute; top: 0; bottom: 0; left: 0"></base-image>
        <template v-else>{{ node.label }}</template>
      </template>
    </el-cascader-panel>
  </el-popover>
</template>

<script>
export default {
  props: {
    value: {},
    dic: {
      type: Array,
      default: () => ([])
    },
    placement: {
      type: String,
      default: 'right-start'
    },
    showAllLevels: Boolean
  },
  methods: {
    changeHandler(pathValue) {
      const value = this.showAllLevels ? pathValue : pathValue[pathValue.length - 1]
      this.$emit('input', value)
      this.$emit('change', value)
      this.$refs.popover.doClose()
    }
  }
}
</script>

<style lang="scss">
.popover-cascader-panel {
  padding: 0;
  &.el-popper {
    margin: 0;
  }
  .popper__arrow {
    display: none;
  }
}
</style>