import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/views/layout/Layout'

/* Layout */
// import clientRouter from "./clientRouter";

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {/login
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

const isDev = process.env.NODE_ENV === 'development'
const redirect = isTouchDevice ? '/biyadi' : '/xlsx'
export const constantRouterMap = [
  {
    redirect,
    path: '/',
    name: 'topic',
    component: Layout,
    hidden: true,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/layout/components/Sidebar/redirect')
      }
    ]
  }
]

export default new Router({
  mode: isDev ? 'hash' : 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRouterMap]
})
