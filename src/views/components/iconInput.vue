<template>
  <el-input ref="input" v-eyes-icon="eyesIconOption" v-bind="$attrs" v-on="$listeners"></el-input>
</template>

<script>
import { waitTimeByNum } from '@/utils'

export default {
  props: {
    openEyesClass: {
      type: String,
      default: 'icon-xianshi'
    },
    closeEyesClass: {
      type: String,
      default: 'icon-yincang'
    }
  },

  data() {
    return {
      isMounted: false
    }
  },

  directives: {
    eyesIcon: {
      async componentUpdated(el, bind, vnode) {
        const { value } = bind
        if (!value) return
        const { showPwdVisible, passwordVisible } = value
        if (!showPwdVisible) return
        //开启宏任务下次生命周期再执行dom操作
        await waitTimeByNum(0)
        const viewIconEl = el.querySelector('.el-icon-view')
        if (viewIconEl) {
          viewIconEl.classList.remove('el-icon-view')
          viewIconEl.classList.add('hook-toggle-icon')
          viewIconEl.classList.add('password-icon')
          viewIconEl.classList.add('iconfont')
          Object.assign(viewIconEl.style, { fontSize: '20px', position: 'relative', top: '2px' })
        }
        const iconEl = el.querySelector('.hook-toggle-icon')
        if (!iconEl) return
        const { openEyesClass, closeEyesClass } = vnode.context
        if (passwordVisible) {
          iconEl.classList.add(openEyesClass)
          iconEl.classList.remove(closeEyesClass)
        } else {
          iconEl.classList.add(closeEyesClass)
          iconEl.classList.remove(openEyesClass)
        }
      }
    }
  },

  mounted() {
    this.isMounted = true
  },

  computed: {
    eyesIconOption({ isMounted }) {
      if (!isMounted) return null
      const { showPwdVisible, passwordVisible } = this.$refs.input
      return {
        showPwdVisible,
        passwordVisible
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  ::v-deep {
    .password-icon {
      margin-right: 10px;
    }
  }
}
</style>
