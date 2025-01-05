<template>
  <div v-if="!item.hidden && item.children" class="menu-wrapper" :class="{ 'is-zero-retract': item.isZeroRetract }">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        item.children &&
        item.children.filter(({ hidden }) => !hidden).length === 1 &&
        !item.showFullRoute
      "
    >
      <template v-if="onlyOneChild.children && onlyOneChild.children.filter(({ hidden }) => !hidden).length == 0">
        <!-- 特殊处理原型列表 -->
        <el-submenu
          :index="resolvePath(onlyOneChild.path)"
          v-if="resolvePath(onlyOneChild.path) == '/design/index' && resolvePath(onlyOneChild.path) == $route.path"
        >
          <template slot="title">
            <item v-if="onlyOneChild.meta" :icon="onlyOneChild.meta.icon" :title="onlyOneChild.meta.title" />
          </template>
        </el-submenu>
        <!-- 特殊处理产品列表 -->
        <el-submenu
          :index="resolvePath(onlyOneChild.path)"
          v-else-if="resolvePath(onlyOneChild.path) === '/prototype/list' && resolvePath(onlyOneChild.path) == $route.path"
        >
          <template slot="title">
            <item v-if="onlyOneChild.meta" :icon="onlyOneChild.meta.icon" :title="onlyOneChild.meta.title" />
          </template>
        </el-submenu>

        <app-link v-else :to="resolvePath(onlyOneChild.path)" :disabled="isDisabled(onlyOneChild)">
          <el-menu-item
            :index="resolvePath(onlyOneChild.path)"
            :class="{
              'submenu-title-noDropdown': !isNest,
              'menu-hidden-is-active': onlyOneChild.name === activeId
            }"
            :disabled="isDisabled(onlyOneChild)"
          >
            <item
              v-if="onlyOneChild.meta"
              :icon="onlyOneChild.meta.icon || item.meta.icon"
              :title="onlyOneChild.meta.title"
            />
          </el-menu-item>
        </app-link>
      </template>

      <sidebar-item
        v-else
        :is-nest="true"
        :item="onlyOneChild"
        :key="onlyOneChild.name"
        :base-path="resolvePath(onlyOneChild.path)"
        class="nest-menu"
        :class="[onlyOneChild.name === activeId && 'menu-hidden-is-active']"
      />
    </template>
    <template v-else-if="!item.pid && isMenuItem">
      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item
          v-if="child.children && child.children.length > 0"
          :is-nest="true"
          :item="child"
          :key="child.name"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />

        <el-submenu
          :index="resolvePath(child.path)"
          v-else-if="resolvePath(child.path) == '/design/index' && resolvePath(child.path) == $route.path"
        >
          <template slot="title">
            <item v-if="child.meta" :icon="child.meta.icon" :title="child.meta.title" />
          </template>
        </el-submenu>

        <!-- 特殊处理原型列表 -->
        <el-submenu
          :index="resolvePath(child.path)"
          v-else-if="resolvePath(child.path) === '/prototype/list' && resolvePath(child.path) == $route.path"
        >
          <template slot="title">
            <item v-if="child.meta" :icon="child.meta.icon" :title="child.meta.title" />
          </template>
        </el-submenu>
        <app-link v-else :to="resolvePath(child.path)" :disabled="isDisabled(child)" :key="child.name">
          <el-menu-item
            :class="{
              'menu-hidden-is-active': child.name === activeId,
              'is-last': child.isLast
            }"
            :index="resolvePath(child.path)"
            :disabled="isDisabled(child)"
          >
            <item v-if="child.meta" :icon="child.meta.icon" :title="title(child)" />
          </el-menu-item>
        </app-link>
      </template>
    </template>
    <template v-else-if="item.children && item.children.filter(({ hidden }) => !hidden).length === 0"></template>
    <el-submenu
      v-else
      ref="submenu"
      :index="`${resolvePath(item.path)}_submenu`"
      :class="{ hideIconArrow: item.hideIconArrow }"
    >
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta.icon" :title="title(item)" />
      </template>

      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item
          v-if="child.children && child.children.length > 0"
          :is-nest="true"
          :item="child"
          :key="child.name"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
        <app-link v-else :to="resolvePath(child.path)" :disabled="isDisabled(child)" :key="child.name">
          <el-menu-item
            :class="{
              'menu-hidden-is-active': child.name === activeId,
              'is-last': child.isLast
            }"
            :index="resolvePath(child.path)"
            :disabled="isDisabled(child)"
          >
            <item v-if="child.meta" :title="title(child)" />
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'
import { isExternal } from '@/utils'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import { validatenull } from '@/components/avue/utils/validate'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    isMenuItem: Boolean
  },
  data() {
    return {
      onlyOneChild: null,
      logo: '',
      activeId: null
    }
  },
  computed: {
    ...mapGetters(['sidebarCount']),
    statistics({ sidebarCount }) {
      return sidebarCount[this.$route.path.split('/').filter(Boolean)[0]]
    },
    title({ statistics }) {
      return (view) => {
        if (!statistics) return view.meta.title
        let count = statistics[view.path]
        return validatenull(count) ? view.meta.title : `${view.meta.title}(${count})`
      }
    }
  },
  // mounted: function() {
  //   this.initLogo()
  // },
  watch: {
    $route: {
      handler(newVal) {
        this.showHiddenMenuActive(newVal)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    showHiddenMenuActive(data) {
      this.activeId = null
      try {
        const { meta: { hidden, activeId } = {} } = data
        if (hidden) {
          this.activeId = activeId
        }
      } catch (err) {
        return false
      }
    },
    hasOneShowingChild(children, parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item

          return true
        }
      })
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        this.onlyOneChild.noShowingChildren = true
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
    isDisabled(route) {
      return route.meta.isAuthRoute === false
    }
    // initLogo() {
    //   if (this.sidebar.opened) {
    //     this.logo = require('../../../../assets/logo/logo1.png')
    //   } else {
    //     this.logo = require('../../../../assets/logo/logo2.png')
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.menu-hidden-is-active,
.is-active {
  color: #3841db !important;
}
.el-menu-item.is-active {
  &::before {
    content: '';
    position: absolute;
    left: 0;
    width: 3px;
    height: 100%;
    background-color: $--color-primary;
  }
}
.el-menu-item:focus,
.el-menu-item.is-active {
  background-color: $menuHover !important;
}
.el-menu-item:hover {
  color: $--color-primary;
}
.el-menu-item.is-last {
  border-bottom: 1px solid #dcdee0;
}
</style>
