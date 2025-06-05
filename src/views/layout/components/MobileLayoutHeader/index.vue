<template>
  <div class="mobile-layout-header">
    <i class="icon el-icon-s-unfold" @click="drawer = true">
    </i>

    <el-drawer
      direction="ltr"
      title="我是导航"
      :visible.sync="drawer"
      :with-header="false">
      <div class="item">
        <router-link class="link" to="/biyadi/price">
          价格测算
        </router-link>
      </div>

      <div class="item">
        <router-link to="/biyadi/dataBase">
          数据库
        </router-link>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false
    }
  },

  watch: {
    $route() {
      this.drawer = false
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-layout-header {
  display: flex;
  height: $app-header-height;
  padding: 0 20px;
  align-items: center;
  background: $color-primary--active;
  .icon {
    font-size: 30px;
    color: #fff;
  }

  .item {
    padding: 10px;
    font-size: 20px;
  }

  .router-link-active {
    color: $color-primary;
    text-underline: $color-primary;
  }
}
</style>
