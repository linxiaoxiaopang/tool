<template>
  <el-input
    ref="input"
    class="mobile-input-component"
    :class="`mobile-input-component--${theme}`"
    v-bind="$attrs"
    v-on="$listeners"
    :type="$attrs.type || 'text'"
    :placeholder="$attrs.placeholder || '请输入手机号'"
  >
    <template slot="prefix"><span> +86 </span></template>
  </el-input>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'normal'
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-input-component {
  position: relative;

  ::v-deep {
    .el-input__prefix {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0px;
      top: 0;
      width: 70px;
      height: 100%;
      background: transparent;
      border: none;
      //border-right: 1px solid $border-color;
      color: $color-title;
    }
    .el-input__prefix::after {
      content: '';
      position: absolute;
      top: 50%;
      right: -1px;
      width: 1px;
      height: 35px;
      transform: translateY(-50%);
      background: $border-color;
    }

    .el-input__inner {
      padding-left: 85px;
    }
  }
}
.mobile-input-component--dark {
  ::v-deep {
    .el-input__prefix {
      width: 40px;
      color: $color-content;
      border: none;
    }

    .el-input__inner {
      padding-left: 40px;
    }
  }
}
</style>
