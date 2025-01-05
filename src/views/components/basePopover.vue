<template>
  <!-- popover跟随最近的可滚动的父级滚动而滚动：overflow: auto; -->
  <el-popover @show="isOpened = true" v-bind="$attrs" v-on="$listeners">
    <template v-if="isOpened">
      <slot></slot>
    </template>
    <template slot="reference"><slot name="reference"></slot></template>
  </el-popover>
</template>

<script>
export default {
  props: {
    // 打开popover后，初始化default插槽内容
    initOnOpen: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否打开过popover
      isOpened: false
    }
  }
}
</script>

<style lang="scss"></style>
