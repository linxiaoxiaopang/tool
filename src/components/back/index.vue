<template>
  <el-backtop
    v-if="isShow"
    :target="target"
    :style="{
      position: 'fixed',
      right: '50px',
      bottom: '100px',
      zIndex: 99999999999999
    }"
  >
    <el-button size="mini" type="primary">回到顶部</el-button>
  </el-backtop>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isShow: false
    }
  },
  computed: {
    ...mapState({
      target(state) {
        return state.app.backtopTarget
      }
    })
  },
  watch: {
    target() {
      this.isShow = false
      this.$nextTick(function () {
        this.isShow = true
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
