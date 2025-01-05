<template>
  <section class="app-main" id="appMain">
    <!-- <transition :name="animationName" mode="out-in"> -->
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    <!-- </transition> -->
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      // return this.$store.state.tagsView.cachedViews.concat(['knifeBaseInfo'])
      return ['prototypeList', 'productCombination', 'productCustomCombination']
    },
    key() {
      return this.$route.fullPath
    }
  },
  data() {
    return {
      animationName: 'fade-transform'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  flex: 1;
  position: relative;
  //overflow: hidden;
  overflow: auto;
  overflow-x: hidden;
}
</style>
