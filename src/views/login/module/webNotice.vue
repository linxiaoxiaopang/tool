<template>
  <div :class="`web-notice--${mode}`">
    <span>Copyright @正丁云商平台 All Rights Reserved</span>
    <el-divider direction="vertical"></el-divider>
    <span class="no-wrap">{{ Value_Added_Number }}</span>
    <el-divider direction="vertical"></el-divider>
    <a class="no-wrap" target="_blank" href="https://beian.mps.gov.cn/#/query/webSearch?code=35050202000405" rel="noreferrer"><img class="icon" src="@/assets/images/keepOnRecordCode/2.png" alt="">{{ KEEP_ON_RECORD_CODE2 }}</a>
    <el-divider direction="vertical"></el-divider>
    <a class="no-wrap" target="_blank" href="https://beian.miit.gov.cn/#/">{{ KEEP_ON_RECORD_CODE }}</a>
    <el-divider direction="vertical"></el-divider>
    {{ COMPANY_NAME }}版权所有
  </div>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      default: 'normal'
    }
  }
}
</script>

<style lang="scss" scoped>
.no-wrap {
  white-space: nowrap;
}

.web-notice--normal {
  text-align: center;
  height: $app-footer-height;
  line-height: 60px;
  color: #808080;
  .el-divider {
    position: relative;
    top: -1px;
    background: currentColor;
  }
}
.web-notice--login {
  width: 480px;
  text-align: center;
  color: $color-sub;
  margin:0 auto;
  line-height: 30px;
  .el-divider {
    display: none;
    + * {
      margin-left: 5px;
    }
  }
}

.icon {
  width: 16px;
  margin-right: 5px;
  vertical-align: -4px;
}
</style>
