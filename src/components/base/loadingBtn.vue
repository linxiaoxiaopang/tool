<template>
  <el-button :loading="loading" :disabled="isDisabled || disabled" :type="type" :size="size" v-bind="$attrs" v-on="new$listeners">
    <slot :loading="loading"></slot>
  </el-button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String,
      default: 'normal'
    },
    loadingLock: Boolean
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    new$listeners() {
      return Object.assign(
        {
          ...this.$listeners
        },
        {
          click: this.onclick
        }
      )
    }
  },
  methods: {
    async onclick(e) {
      if (this.loading) return
      this.loading = true
      try {
        await (this.loadingLock ? awaitLoading : awaitWrap)(this.$listeners.click.fns(e, this))
      } catch (e) {}
      this.loading = false
    }
  }
}
</script>

<style></style>
