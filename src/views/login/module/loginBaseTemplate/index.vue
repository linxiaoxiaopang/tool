<template>
  <div class="login-base_template">
    <div class="container">
      <div class="content">
        <slot name="content"></slot>
      </div>
      <div class="info-wrapper">
        <el-image :src="require('@/assets/images/logo.png')" />
        <div class="school-name">{{ COMPANY_NAME }}</div>
        <div class="sub-name">{{ SYSTEM_NAME }}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {}
</script>

<style lang="scss" scoped>
.login-base_template {
  display: flex;
  height: 100vh;
  background-color: #64c2a7;
}

.container {
  padding: 2rem;
  padding-bottom: 3rem;
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translate(0, -50%);
  background: white;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  .info-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    right: 100%;
    top: 0;
    margin-right: -1px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background: white;
    .el-image {
      margin-bottom: 20px;
      width: 120px;
    }
    .school-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #000;
      margin-bottom: 10px;
    }
  }
}
</style>
