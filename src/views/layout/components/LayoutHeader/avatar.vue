<template>
  <el-dropdown class="avatar-container right-menu-item" trigger="click">
    <div class="avatar-wrapper">
      <el-button type="text" class="user-avatar">{{ name || '暂无' }}</el-button>
      <i class="el-icon-caret-bottom" />
    </div>
    <el-dropdown-menu slot="dropdown" class="avatar-dropdown" :visibleArrow="false">
      <el-dropdown-item>
        <span style="display: block" @click="logOut">退出登录</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    logOut() {
      localStorage.setItem('guideVisible', true)
      this.$store.dispatch('LogOut')
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-wrapper,
.user-avatar {
  color: #fff;
}
.avatar-dropdown {
  &[x-placement^=bottom] {
    margin-top: 24px;
  }
}
</style>
