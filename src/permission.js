import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { handlePermission } from '@/utils/permission' // getToken from cookie
import { filterAsyncRouter } from './store/modules/permission'
import { flatTreeMapDeep } from '@/utils'
import loginApi from '@/api/system/login'

import superRouter from '@/router/superRouter'
import zdToolUserRouter from '@/router/zdToolUserRouter'
import { validatenull } from '@/components/avue/utils/validate'
import { cloneDeep, map } from 'lodash'

const { buildMenus } = loginApi
const whiteList = ['/login']
NProgress.configure({ showSpinner: false }) // NProgress Configuration
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar;
  const isInWhiteList = whiteList.indexOf(to.path) !== -1
  // const token = getToken()
  // if (!token && to.path === '/') return next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
  // if (isInWhiteList && (to.path !== '/' || !token && to.path === '/')) return next()
  // if (!token) return next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
  // store.commit('SET_CUR_ROUTER_ID', to.name)
  console.log('store.getters.addRouters', store.getters.addRouters)
  if (store.getters.addRouters) return next()
  // 判断当前用户是否已拉取完user_info信息
  store.dispatch('GetInfo')
    .then((res) => {
      if (!res) throw new Error('请求异常')
      console.log('res', res)
      const accountName = $GET(res, 'detail.accountName', '')
      let routerList = superRouter
      if(accountName == 'zdToolUser') {
        routerList = zdToolUserRouter
      }
      const { isSuperUser } = res.detail || {}
      if (isSuperUser) {
        return createSuperUserMenu(from, to, next, routerList)
      }
      createNormalUserMenu(from, to, next)
    }).catch(() => store.dispatch('LogOut'))
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})


/**
 * 超级管理员路由创建，根据superRouter文件创建
 * @param from
 * @param to
 * @param next
 */
function createSuperUserMenu(from, to, next, routerList) {
  console.log('routerListrouterListrouterList', routerList)
  createUserMenu(routerList, from, to, next)
}

/**
 * 普通用户根据getMenu返回值创建
 * @param from
 * @param to
 * @param next
 * @returns {Promise<*>}
 */
async function createNormalUserMenu(from, to, next) {
  try {
    const res = await buildMenus()
    //权限返回是[]
    if (validatenull(res.detail)) return store.dispatch('LogOut')
    let permission = handlePermission(res?.detail)
    store.commit('SET_ROLES', permission.roles)
    store.commit('SET_MENU_TYPE_OF_PATH', permission.menuTypeOfPath)
    const detail = permission.routes
    if (validatenull(detail)) {
      return next('/404')
    }
    createUserMenu(detail, from, to, next)
  } catch (err) {
    store.dispatch('LogOut')
  }
}

/**
 * 获取第一个Menu的path，存在重定向，获取重定向的地址
 * @param menus
 * @returns {*}
 */
function getFirstMenuPath(menus) {
  //传进来的就是子路由
  const firstMenu = menus[0]
  if (!firstMenu) return '/'
  const { redirect, path: firstMenuPath, componentPath: firstComponentPath } = firstMenu
  //超级管理员
  if (redirect) return redirect
  if (firstComponentPath !== 'Layout') return firstMenuPath
  const firstChildPath = $GET(firstMenu, 'children[0].path', '')
  return (firstMenuPath + '/' + firstChildPath).replace(/\/\//g, '/')
}


/**
 * 权限分配中包含跳转路径/跳转名
 * @param asyncRouter
 * @param to
 * @returns {*}
 */
function findRoute(asyncRouter, to) {
  let { name, path } = to
  const flatData = flatTreeMapDeep(asyncRouter)
  if (name) return flatData.find(item => item.name === name)
  const splitPath = path.split('/')
  name = splitPath[splitPath.length - 1]
  const route = flatData.find(item => item.name === name)
  if (route) return route
  const topPath = splitPath.shift() + '/' + splitPath.shift()
  splitPath.unshift(topPath)
  let samePathRoute = null
  splitPath.map((path, index) => {
    const fItem = asyncRouter.find(item => item.path === path)
    if (fItem) {
      asyncRouter = fItem.children
    }
    if (index === splitPath.length - 1) {
      samePathRoute = fItem
    }
  })
  return samePathRoute
}


/**
 * 创建用户路由列表
 * @param asyncRouter
 * @param from
 * @param to
 * @param next
 */
async function createUserMenu(asyncRouter, from, to, next) {
  asyncRouter = filterAsyncRouter(cloneDeep(asyncRouter))
  asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
  await store.dispatch('GenerateRoutes', asyncRouter)
  router.addRoutes(asyncRouter) // 动态添加可访问路由表
  // const redirect = queryRedirect(from) //回退到登出的页面
  // if (redirect && findRoute(asyncRouter, { path: redirect })) return next({ path: redirect, replace: true })
  const localRoutes = $GET(router, 'options.routes', [])  //获取本地路由
  const allRoutes = [...asyncRouter, ...localRoutes] //合并本地路由和动态路由
  const isFind = findRoute(allRoutes, to) //权限中包含跳转的路由
  if (isFind) {
    return next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
  }
  const firstMenuPath = getFirstMenuPath(allRoutes) //权限分配不包含跳转路由，跳转到第一个路由。
  return next({
    path: firstMenuPath,
    replace: true
  })
}

/**
 * 跳转历史路由
 * @param to
 * @returns {*|boolean}
 */
function queryRedirect(to) {
  return $GET(to, 'query.redirect', '')
}
