<template>
  <CategoryType
    class="sidebar-container"
    cateProp="privateCategroyQuery"
    :data="data"
    v-loading="loading"
    @nodeClickHandler="nodeClickHandler"
  >
  </CategoryType>
</template>

<script>
import CategoryType from '@/components/categoryType'
import { mapMutations, mapGetters } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
export default {
  components: {
    CategoryType
  },
  data() {
    return {
      data: [],
      loading: true
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['permission_routers', 'curRouterPid']),
    isProductPage() {
      return this.curRoutes.name === '我的产品'
    },
    curRoutes() {
      const routes = Array.isArray(this.permission_routers) ? this.permission_routers : []
      return routes.find(({ id }) => id == this.curRouterPid)
    },
    fullPath({ curRoutes = {} }) {
      return (row) => {
        const path = `${curRoutes.path}/${row.path}`
        return path
      }
    },
    filterCurRoutes() {
      if (this.isProductPage) {
        const curRoutes = cloneDeep(this.curRoutes)
        return curRoutes.children.filter((item) => !item.hidden && item.id !== this.myProductRoute.id)
      }
      return []
    },
    myProductRoute() {
      let myProductRoute = null
      this.curRoutes.children &&
        this.curRoutes.children.map((item) => {
          if (item.name === '产品列表') {
            myProductRoute = item
          }
        })
      return myProductRoute
    }
  },
  methods: {
    ...mapMutations(['SET_PRIVATE_CATEGORY']),
    nodeClickHandler({ id, children = [] }) {
      // if (children.length > 0) return
      this.SET_PRIVATE_CATEGORY(id)
    },
    async init() {
      this.loading = true
      try {
        const detail = cloneDeep(await this.$store.dispatch('GetDic', 'proCategory'))
        detail.unshift({
          children: [],
          id: 'all',
          name: '全部分类'
        })
        this.data = detail
        this.SET_PRIVATE_CATEGORY(detail[0].id)
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    toOtherPage(path) {
      this.$router.push(`${this.curRoutes.path}/${path}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  height: 44px;
  font-size: 14px;
  align-items: center;
  margin-left: $menuLeft;
}

.is-product-page {
  ::v-deep {
    .svg-icon {
      position: absolute;
      top: 2px;
      bottom: 0;
      margin: auto;
      font-size: 16px;

      + * {
        margin-left: 30px;
      }
    }
    .el-menu {
      border: none;
    }
    .el-menu-item {
      padding: 0 0 0 $menuLeft !important;
      height: $menuHeight;
      line-height: $menuHeight;
      min-width: auto;

      &:hover {
        background-color: $menuHover;
      }
    }
    .el-submenu__title {
      height: $menuTitleHeight;
      line-height: $menuTitleHeight;
      padding: 0 0 0 $menuLeft !important;
      color: $color-content !important;

      .el-submenu__icon-arrow {
        display: none;
      }
    }
  }
}
</style>
