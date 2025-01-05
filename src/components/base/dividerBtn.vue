<template>
  <div class="inline-block">
    <slot></slot>
    <el-divider v-if="showDivider" direction="vertical"></el-divider>
  </div>
</template>

<script>
export default {
  props: {
    showDivider: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style>
</style>