import { getOption } from '@/components/base/baseTable/utils/util'

export const HIDE_LEFT_MENU = 0 //隐藏左边框
export const SHOW_SIDEBAR = 1 //显示路由 sidebar
export const SHOW_PERSONAL = 2 // 显示 personalLayout
export const HIDE_LEFT_MENU_FORCE = 9999 // 强制隐藏左边框

//layout 布局对象
export const LAYOUT_OPTIONS = {
  hideLayoutHeaderRouteList: [], //隐藏头部
  hideBottomList: [], // 默认隐藏底部
  //侧边栏类型
  sidebarTypeList: {
    [HIDE_LEFT_MENU]: [], //默认隐藏侧边栏
    [SHOW_SIDEBAR]: [],
    [SHOW_PERSONAL]: ['businessCardSetup'],
    [HIDE_LEFT_MENU_FORCE]: []
  },
  // 面包屑
  breadcrumbOption: {
    zdSpecifyPrototypePrice: ['zdUserList', 'zdSpecifyPrototypePrice'],
    zdUserInfo: ['zdUserList', 'zdUserInfo'],
    toUserInfo: ['toUserList', 'zdUserInfo']
  },
  hideTitleList: [],

  titlePrefix: {
    zdcustom: '正丁',
    toaddit: 'Toaddit'
  },

  titleMap: {
    zdImageManagement: '用户图片管理-正丁',
    zdDesignProductManagement: '用户定制产品列表-正丁',
    zdStoreManagement: '店铺列表-正丁',
    zdOrder: '订单管理-正丁',
    zdFBA: 'FBA订单列表-正丁',
    zdAfterSaleManagement: '售后订单-ToAddit',
    toImageManagement: '用户图片管理-ToAddit',
    toDesignProductManagement: '用户定制产品列表-ToAddit',
    toStoreManagement: '店铺列表-ToAddit',
    toOrder: '订单管理-ToAddit',
    toAfterSaleManagement: '售后订单-ToAddit',

  }
}

// 进入子页面时，使侧边栏的对应的父页面激活
export const ACTIVE_NAMES = {}

export function isShowSidebar(sidebarType) {
  return !!(sidebarType && ![HIDE_LEFT_MENU, HIDE_LEFT_MENU_FORCE].includes(sidebarType))
}
