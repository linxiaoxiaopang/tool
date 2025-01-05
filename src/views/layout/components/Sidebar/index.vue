<template>
  <el-scrollbar class="sidebar-container">
    <el-menu
      v-if="sidebarType === SHOW_SIDEBAR"
      ref="menus"
      class="sidebar-menu"
      :show-timeout="200"
      :default-active="defaultActive"
      :default-openeds="menuDefaultOpends"
      :collapse="false"
      mode="vertical"
      text-color="#495060"
      active-text-color="#3841DB"
    >
      <sidebar-item v-for="(route, sIndex) in routesList" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
     <personalLayout v-else-if="sidebarType === SHOW_PERSONAL" :routerList="routesList"></personalLayout>
  </el-scrollbar>
</template>

<script>
import personalLayout from '@/views/components/personalLayout'
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { MENU_DEFAULT_OPENEDS, SHOW_SIDEBAR, SHOW_PERSONAL } from '@/utils/constant'

export default {
  components: { SidebarItem, personalLayout },

  props: {
    sidebarType: [Number, String]
  },

  data() {
    return {
      SHOW_SIDEBAR,
      SHOW_PERSONAL,
      notGroupList: []
    }
  },

  computed: {
    ...mapGetters(['permission_routers', 'curRouterPid']),
    defaultActive({
      $route: {
        path,
        query: { activePath }
      }
    }) {
      return activePath || path
    },

    menuDefaultOpends() {
      return MENU_DEFAULT_OPENEDS
    },

    routeName({ defaultActive }) {
      return `/${defaultActive.split('/')[1]}` || '/prototype'
    },

    routesList({ permission_routers, routeName }) {
      console.log('permission_routers===', permission_routers, routeName)
      return permission_routers.filter((route) => route.name == routeName)
    },

    isMenuItem() {
      return (curRoutes, sIndex) => {
        try {
          return !!curRoutes.matchRouteList[sIndex].isMenuItem
        } catch {
          false
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  margin: 10px 0;
  margin-left: 20px;
  color: $color-content;
}
.el-menu {
  overflow: hidden;
}
.sidebar-container {
  width: $app-sidebar-width;
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  .sidebar-menu {
    margin-top: calc((#{$menuTitleHeight} - 14px) / -2);
  }
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
      // padding: 0 0 0 $menuLeft !important;
      height: $menuHeight;
      line-height: $menuHeight;
      min-width: auto;

      background-color: transparent;

      &:hover {
        color: $color-primary !important;
      }
    }
    .el-submenu__title {
      height: $menuTitleHeight;
      line-height: $menuTitleHeight;
      color: $color-content !important;

      background-color: transparent;

      .el-submenu__icon-arrow {
        display: none;
      }
    }
  }
}
</style>
