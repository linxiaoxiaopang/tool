<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in finalList" v-if="item.meta.title" :key="item.name">
        <span v-if="item.redirect === 'noredirect' || index === finalList.length - 1" class="no-redirect">{{
          item.meta.title
        }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { mapGetters } from 'vuex'
import { getRouteByName } from '@/utils'

export default {
  name: 'Breadcrumb',
  props: {
    routeList: Array,
    breadcrumbOption: Array
  },
  data() {
    return {
      levelList: null
    }
  },
  computed: {
    ...mapGetters(['permission_routers']),
    list({ breadcrumbOption, permission_routers }) {
      return breadcrumbOption
        ?.map((name) => {
          if (typeof name === 'function') return name(this.$route, this.$store)
          if (typeof name === 'object') return name
          return getRouteByName(permission_routers, name)
        })
        .filter(Boolean)
    },
    finalList() {
      return this.list || this.routeList || this.levelList
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter((item) => {
        if (item.name) {
          return true
        }
      })
      const first = matched[0]
      if (first && first.name !== '首页') {
        matched = [{ path: '/', meta: { title: '首页' } }].concat(matched)
      }
      this.levelList = matched
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, name, query } = item
      this.$emit('beforeLink', item)
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push({ name, query })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  margin-bottom: 30px;
  a {
    color: $color-sub;
    font-weight: normal;
  }
  a:hover {
    color: $color-primary;
  }
  .no-redirect {
    color: $color-content;
    cursor: text;
    font-size: 14px;
    font-weight: 500;
  }
  ::v-deep .el-breadcrumb__separator {
    color: $color-sub;
  }
}
</style>
