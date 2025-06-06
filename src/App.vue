<template>
  <div id="app">
    <router-view v-bind="layoutOptions" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { HIDE_LEFT_MENU, LAYOUT_OPTIONS, isShowSidebar } from '@/utils/constant'

export default {
  name: 'App',

  mounted() {
    //设置window信息
    this.setWindowData()
  },

  computed: {
    /**
     * @description: 根据路由返回的path，自定义不一样的layout布局
     * @param {Object} route
     * @return {Object} 返回layout布局的配置项
     */
    layoutOptions({ $route }) {
      const { max } = Math
      const { name, path, matched } = $route
      const topMatched = $GET(matched, '0', null)
      const {
        hideLayoutHeaderRouteList,
        sidebarTypeList,
        hideBottomList,
        breadcrumbOption,
        hideTitleList,
        titleMap,
        titlePrefix
      } = LAYOUT_OPTIONS
      const defaultOptions = {
        hasLayoutHeader: true,
        hasBottom: false,
        sidebarType: HIDE_LEFT_MENU,
        breadcrumbOption: undefined,
        showTitle: true
      }
      const fillOptions = {}
      const leftSlideArr = []
      //是否隐藏头部
      if (hideLayoutHeaderRouteList.includes(name) || hideLayoutHeaderRouteList.includes(path)) {
        fillOptions.hasLayoutHeader = false
      }

      //是否隐藏底部
      if (hideBottomList.includes(name) || hideBottomList.includes(path)) {
        defaultOptions.hasBottom = false
      }
      //侧边栏类型
      for (let key in sidebarTypeList) {
        const list = sidebarTypeList[key]
        if (matched?.some(({ name, path }) => list.includes(name) || list.includes(path))) {
          leftSlideArr.push(+key)
        }
      }
      //选择侧边栏类型，默人选择类型最大的。
      if (leftSlideArr.length) {
        fillOptions.sidebarType = max(...leftSlideArr)
      }

      // 面包屑配置
      fillOptions.breadcrumbOption = breadcrumbOption[name]

      fillOptions.showTitle = !fillOptions.breadcrumbOption && (!isShowSidebar(fillOptions.sidebarType))
      if (hideTitleList.includes(name) || hideTitleList.includes(path)) {
        fillOptions.showTitle = false
      }
      if (fillOptions.showTitle && titleMap[name]) {
        fillOptions.title = titleMap[name]
      } else if (topMatched) {
        const titlePrefixKeys = Object.keys(titlePrefix)
        const fItem = titlePrefixKeys.find(item => {
          try {
            return topMatched.name.indexOf(item) == 1 || topMatched.path.indexOf(item) == 1
          } catch {
            return false
          }
        })
        if (fItem) {
          fillOptions.title = this.$route.meta?.title + '-' + titlePrefix[fItem]
        }
      }

      return {
        ...defaultOptions,
        ...fillOptions
      }
    }
  },
  methods: {
    ...mapMutations(['SET_WINDOW_DATA']),

    setWindowData() {
      this.SET_WINDOW_DATA({
        devicePixelRatio: window.devicePixelRatio
      })
    }
  }
}
</script>

<style lang="scss">
.global-touch-device {
  .app-wrapper {
    min-width: initial;
  }

  .app-content.app-content.app-content {
    background-color: initial;
  }
}
</style>
