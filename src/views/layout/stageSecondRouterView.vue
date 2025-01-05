<template>
  <div class="flex">
    <personalLayout :routerList="routesList"></personalLayout>
    <router-view class="flex-one"></router-view>
  </div>
</template>

<script>
import personalLayout from '@/views/components/personalLayout'

import { mapGetters } from 'vuex'

export default {
  components: {
    personalLayout
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

     routeName({ defaultActive }) {
      return `/${defaultActive.split('/')[1]}` || '/prototype'
    },

    routesList({ permission_routers, routeName }) {
      return permission_routers.filter((route) => route.name == routeName)
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  padding: 17px 31px;
} 
</style>