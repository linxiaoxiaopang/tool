<template>
  <div class="el-page-header">
    <div class="el-page-header__left" @click="goBack">
      <i class="el-icon-arrow-left"></i>
      <div class="el-page-header__title">
        <slot name="title">{{ title }}</slot>
      </div>
    </div>
    <div class="el-page-header__content">
      <slot name="content">{{ content }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: String,
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },

  methods: {
    goBack() {
      history.go(-1)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep {

  .el-page-header__left::after {
    right: -9px;
  }
  .el-page-header__left{
    margin-right: 20px;
  }
  .el-page-header__content {
    font-size: 14px;
    color: #4e5969;
  }
  .el-icon-arrow-left {
    padding-top: 4px;
    width: 14px;
    height: 10px;
    font-weight:bold;
  }
  .el-icon-arrow-left:hover{
    color: #1F5FFF;
  }
}
</style>
