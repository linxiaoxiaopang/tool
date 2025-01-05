/* eslint-disable */
import { constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'
import store from '@/store'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: null,
    curRouterId: sessionStorage.getItem('curRouterId'),
    curRouterPid: sessionStorage.getItem('curRouterPid')
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_CUR_ROUTER_PID: (state, curRouterPid) => {
      state.curRouterPid = curRouterPid
      sessionStorage.setItem('curRouterPid', curRouterPid)
    },
    SET_CUR_ROUTER_ID: (state, curRouterId) => {
      state.curRouterId = curRouterId
      sessionStorage.setItem('curRouterId', curRouterId)
    }
  },
  actions: {
    GenerateRoutes({ commit, state }, asyncRouter) {
      commit('SET_ROUTERS', asyncRouter)
      const sessionPid = sessionStorage.getItem('curRouterPid')
      if (sessionPid) {
        commit('SET_CUR_ROUTER_PID', Number(sessionPid))
      } else if (!state.curRouterPid) {
        const curRoute = asyncRouter.filter(({ hidden }) => !hidden)[0] || {}
        commit('SET_CUR_ROUTER_PID', curRoute.pid || curRoute.id || '')
      }
    }
  }
}

let lowRedirect = []
export const filterAsyncRouter = (routers) => {
  // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = routers.filter((router, index) => {
    let isMain = store.getters.isMain
    let isPayOrder = store.getters.isPayOrder
    if (isMain) {
      if (router.meta?.onlyChild) {
        return false
      }
    } else {
      if (router.meta?.onlyMain) {
        return false
      }
    }
    // 免支付隐藏
    if(!isPayOrder){
      if(router.meta?.isPayOrder){
        return false
      }
    }

    const isSuper = store.getters.is_super //简单绕过超级管理员限制
    if (router.hidden) {
      router.meta.hidden = router.hidden
      router.meta.pid = router.pid
    }
    if (router.meta && router.meta.title) {
      const names = router.meta.title.split('-')
      router.meta.title = names.slice(-1)[0]
    }
    if (!isSuper) {
      if (index === 0 && router.pid === 0) {
      } else {
        if (
          Array.isArray(router.children) &&
          router.children.length
        ) {
          const fItem = routers.find(({ id: fId }) => {
            return fId === router.id
          })
          // 路由菜单数组
          let authRouters = fItem.children.filter(route => route.meta.isAuthRoute)
          let path = authRouters[0]?.path
          if (path) {
            if (lowRedirect.includes(path)) {
              path = authRouters[1]?.path || path
            }
            if (path.indexOf('/') === '0') {
              router.redirect = path
            } else {
              router.redirect = `${fItem.path}/${path}`
            }
          } else {
            router.redirect = null
            router.meta.isFinalRouter = true
          }
        }
      }
    }

    if (router.component) {
      if (router.component === 'Layout') {
        // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
  return accessedRouters
}

export const loadView = (view) => {
  // 路由懒加载
  return () => import(`@/views/${view}`)
}

export default permission
