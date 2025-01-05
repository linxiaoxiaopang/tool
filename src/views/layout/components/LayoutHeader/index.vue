<template>
  <header class="layoutHeader">
    <div class="head-logo">{{ SYSTEM_NAME }}</div>
    <ul class="navs">
      <template
        v-for="{
          name: id,
          pid,
          title: name,
          meta: { isFinalRouter } = {},
          path,
          redirect,
          children,
          childrenNames,
          hidden
        } in navsList"
      >
        <li v-if="hidden" :class="['item', childrenNames.includes(curRouterId) && 'active']">
          <router-link
            :uiid="`zd-${path}`"
            class="link"
            @click="toggeleRouterId(id, pid, redirect, isFinalRouter)"
            :to="noAuthRouter(redirect, isFinalRouter) ? '' : path"
          >
            <p>{{ name }}</p>
          </router-link>
        </li>
        <el-popover
          v-else
          placement="top-start"
          width="auto"
          trigger="hover"
          popper-class="popper-link-list layoutHeaderPopper"
          transition="none"
          :class="['item', childrenNames.includes(curRouterId) && 'active']"
          :visible-arrow="false"
        >
          <div class="popper-link-menu" v-for="(item, index) in children" :key="index">
            <div class="boldTitle">{{ item.title }}</div>
            <div class="link-wrapper">
              <router-link
                :class="['link-hover', 'popper-link-item', fullPath(link) === $route.path ? 'link-active' : '']"
                v-for="(link, ind) in item.list"
                :key="ind"
                :to="fullPath(link)"
              >
                {{ linkName(link) }}
              </router-link
              >
            </div>
          </div>
          <li slot="reference" :class="['item', childrenNames.includes(curRouterId) && 'active']">
            <router-link
              :uiid="`zd-${path}`"
              class="link"
              @click="toggeleRouterId(id, pid, redirect, isFinalRouter)"
              :to="noAuthRouter(redirect, isFinalRouter) ? '' : path"
            >
              <p>{{ name }}</p>
            </router-link>
          </li>
        </el-popover>
      </template>
    </ul>

    <avatar/>
  </header>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { PERSONAL_CENTER_NAME } from '@/utils/constant'
import Avatar from './avatar'
import { checkPermission } from '@/utils/permission'
import { getMenuRouterList } from '@/utils'
import { validData } from '@/components/avue/utils/util'

export default {
  components: {
    Avatar
  },
  data() {
    return {
      PERSONAL_CENTER_NAME,
      search: '',
      routerUrl: '',
      messageBtn: checkPermission('externalbusiness:message:icon')
    }
  },
  watch: {
    $route: {
      handler(newVal) {
        this.routerUrl = newVal.fullPath
        const { matched: [{ path: pPath }] = [{}] } = newVal
        const routers = this.permission_routers
        //第一个路由重置为首页路由，path 未 '/'或''
        if (pPath === '' || pPath === '/') {
          const fitersRoutes = routers.filter(({ hidden, name }) => !hidden && name != PERSONAL_CENTER_NAME)

          return this.toggeleRouterId(fitersRoutes[0].name)
        }
        if (!pPath) return
        const curPRoute = routers.filter(({ path }) => {
          return path === pPath
        })
        curPRoute[0] && this.toggeleRouterId(curPRoute[0].name)
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['permission_routers', 'curRouterPid', 'curRouterId']),
    navsList() {
      let routeList = getMenuRouterList()
      for (let key in routeList) {
        const item = routeList[key]
        const children = item.children
        item.hidden = validData(
          item.hidden,
          children.every(({ hidden }) => hidden)
        )
        item.childrenNames = []
        children.forEach(({ list }) => {
          list?.forEach((route) => {
            item.childrenNames.push(route.name)
          })
        })

        if (children.every(({ list }) => !list && list.length)) {
          delete routeList[key]
        }

        children.find((child) => {
          return child.list?.find((route) => {
            if (!route.hidden && route.parent && !route.parent.hidden) {
              Object.assign(item, route.parent)
              item.title = item.title || route.parent?.meta?.title
              return true
            }
          })
        })
      }
      return routeList.filter(Boolean)
    },

    fullPath() {
      return ({ path, parent, redirect }) => {
        if (!redirect) return `${parent.path}/${path}`
        //重定向地址是否以'/'开头
        if (/^\//.test(redirect)) return redirect
        return `${parent.path}/${redirect}`
      }
    },

    /**
     * @description: hover 调整路由
     * @param {*}
     * @return {*}
     */
    linkName() {
      return (link) => {
        try {
          return link.meta.title || link.name
        } catch {
          link.name
        }
      }
    }
  },
  created() {
    this.toggeleRouterId(this.curRouterPid)
  },
  methods: {
    ...mapMutations(['SET_CUR_ROUTER_PID']),

    toggeleRouterId(id, pid, redirect, isFinalRouter) {
      if (this.noAuthRouter(redirect, isFinalRouter)) return this.$message.error('暂无访问权限，请联系管理员添加！')
      this.SET_CUR_ROUTER_PID(id)
    },
    noAuthRouter(redirect, isFinalRouter) {
      return redirect === null && isFinalRouter
    }
  }
}
</script>

<style lang="scss" scoped>
.layoutHeader.layoutHeader {
  display: flex;
  height: $app-header-height;
  padding: 0 40px;
  background: $color-primary--active;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;

  .link-active {
    color: red !important;
  }

  .line.message:not(:last-child)::after {
    content: '|';
    line-height: 1;
    font-size: 18px;
    margin: 0 10px;
    display: inline-block;
    transform: scaleX(0.5);
    color: rgba($color: #b3b3b3, $alpha: 0.5);
  }

  .message {
    color: rgba(255, 255, 255, 0.5);
    margin-left: 0;
    font-size: 14px;
  }

  .rightBtn {
    margin-right: 30px;
  }

  .head-logo {
    padding: 0;
    margin-right: 64px;
    color: #fff;
    font-size: 18px;
  }

  .navs {
    display: flex;
    align-items: center;
    flex: 1;

    .item {
      text-align: center;
      line-height: 60px;
      width: 80px;
      position: relative;
      font-size: 14px;
      color: rgba($color: #fff, $alpha: 0.5);
      white-space: nowrap;
    }

    .item:hover {
      line-height: 40px;
      height: 60px;
      width: 80px;
      border-radius: 1px;
      background: rgba(63, 110, 226, 0.51);
    }

    .item.active,
    .item:hover {
      color: #fff;

      .link p {
        content: '';
        position: absolute;
        line-height: 60px;
        height: 60px;
        width: 80px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 1px;
        background: rgba(63, 110, 226, 0.51);
      }
    }
  }

  .icon-wrapper {
    position: relative;

    .dot {
      position: absolute;
      top: -3px;
      right: 11px;
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $color-warning;
    }

    i {
      display: inline-block;
      margin: 0 10px;
      color: $color-gray;
    }
  }

  .design-btn {
    font-size: 18px;
    margin-right: 20px;
    padding: 0px 10px;
    height: 36px;
    line-height: 36px;
    color: $color-primary;
    background: #fff;
    font-weight: 600;
    border-radius: 4px;
    font-weight: 400;
    cursor: pointer;

    .el-image {
      position: relative;
      top: 2px;
      margin-right: 5px;
      width: 15px;
      height: 15px;
    }
  }

  .el-avatar {
    width: 36px;
    height: 36px;
    border: 1px solid $border-color;
    border-radius: 50%;
    background: $color-background;
    cursor: pointer;
  }
}

.popper-link-list {
  .popper-link-menu {
    max-width: 456px;

    .link-wrapper {
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }
  }

  .boldTitle.boldTitle {
    margin-left: 20px;
    margin-bottom: 18px;
    color: $color-sub;
  }

  .popper-link-item {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 4px;
    white-space: nowrap;
    color: $color-content;
  }
}
</style>
<style lang="scss">
.layoutHeaderPopper.el-popover[x-placement^='bottom'] {
  margin-top: 0px !important;
  color: $color-title;
}

.layoutHeaderPopper {
  padding: 28px 20px 0px 20px;
}
</style>
