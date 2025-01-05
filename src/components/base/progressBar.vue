<template>
  <el-progress
    :class="['zd-progress', $attrs.percentage == 100 ? 'success' : '']"
    :type="type"
    v-bind="$attrs"
    v-on="$listeners"
  ></el-progress>
</template>

<script>
export default {
  name: 'progressBar',

  props: {
    type: {
      type: String,
      default: 'line',
      validator(value) {
        return ['line', 'circle', 'dashboard'].includes(value)
      }
    }
  }
}
</script>

<style lang="scss" >
.zd-progress.success {
  .el-progress-bar__inner {
    background-color: $--color-success !important;
  }
}
.zd-progress {
  .el-progress-bar {
    width: 99%;
  }
  .el-progress__text {
    font-size: 20px !important;
  }
}
</style>
