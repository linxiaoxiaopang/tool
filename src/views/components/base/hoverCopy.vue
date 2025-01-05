<template functional>
  <span v-if="props.trigger === 'icon'" :uiid="data.attrs.uiid" :class="[data.staticClass, data.class]">
    <slot></slot>
    <span v-copy="props.value" class="ml5" style="cursor: pointer;">
      <i class="iconfont icon-fuzhi"></i>
    </span>
  </span>
  <el-popover
    v-else
    :uiid="data.attrs.uiid"
    placement="right"
    trigger="hover"
    popper-class="hoverCopy"
  >
    <el-button type="text" v-if="props.value" v-copy="props.value" :key="props.value">复制</el-button>
    <span slot="reference" :class="[data.staticClass, data.class]" :style="[data.staticStyle, data.style]">
      <slot>{{ props.value }}</slot>
    </span>
  </el-popover>
</template>

<style lang="scss">
.el-popover.hoverCopy {
  min-width: auto;
  padding: 0;
  .el-button {
    padding: 8px 12px;
  }
}
</style>
