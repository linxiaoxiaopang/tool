<template>
  <div v-if="show || isKeepExist" v-show="show">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'KeepExist',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    prop: String,
    include: Array,
    exclude: Array
  },
  data() {
    return {
      isShow: false
    }
  },
  computed: {
    isKeepExist() {
      return this.isShow && this.isInclude
    },
    isInclude({ include, exclude, prop }) {
      if (!prop) return true
      const isInclude = include ? include.includes(prop) : true
      const isExclude = exclude ? exclude.includes(prop) : false
      return isInclude && !isExclude
    }
  },
  watch: {
    show: {
      handler(n) {
        if (n) this.isShow = n
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>