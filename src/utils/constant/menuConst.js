/* eslint-disable */
import { REQUEST_ALL_DATA } from '@/utils/constant/requestConst'

// 菜单列表 menuType 0菜单 1按钮 2其它
export const MENU_TYPE_MENU = 0
export const MENU_TYPE_BTN = 1
export const MENU_TYPE_OTHER = 2
export const MENU_TYPES = {
  menu: MENU_TYPE_MENU,
  btn: MENU_TYPE_BTN,
  other: MENU_TYPE_OTHER
}
export function getXMenuType(type = 'other') {
  return {
    'x-menu-type': MENU_TYPES[type]
  }
}

export const CLIENT_TYPE_PLUGIN_BUSINESS = 20


//默认展开的submenu
export const MENU_DEFAULT_OPENEDS = ['/design/index', '/prototype/list']
//当前平台类型
export const CURRENT_MENU_TYPE = CLIENT_TYPE_PLUGIN_BUSINESS

export const MENU_DIC = {
  [CLIENT_TYPE_PLUGIN_BUSINESS]: {
    label: '正定小工具系统',
    value: CLIENT_TYPE_PLUGIN_BUSINESS,
    name: 'logisticsMenuList',
    secret: 'uPfWARitOl0mdd2A',
    requestPrefix: 'lmis',
    headers: {
      'x-client-id': 'zdLogisticsTools',
      'x-client-type': CLIENT_TYPE_PLUGIN_BUSINESS
    },
    tokenKey: {
      access: 'x-plugin-access-token',
      refresh: 'x-plugin-refresh-token'
    }
  }
}

//获取当前平台的配置
export const CURRENT_CLIENT_CONFIGURE = MENU_DIC[CURRENT_MENU_TYPE]
// 权限前缀
export const PERMISSION_PREFIX = CURRENT_CLIENT_CONFIGURE.requestPrefix

export const GET_PERMISSION_PREFIX = (code) => {
  return new RegExp(`^${PERMISSION_PREFIX}:`).test(code) ? code : `${PERMISSION_PREFIX}:${code.replace(/^:/, '')}`
}

export const REQUEST_PREFIX = CURRENT_CLIENT_CONFIGURE.requestPrefix

//获取请求前缀
export const GET_REQUEST_PREFIX = (url) => {
  return /^\/?common/.test(url) ? url : `/${REQUEST_PREFIX}/${url.replace(/^\//, '')}`
}

//获取平台类型字典
export function GET_CLIENT_TYPE_DIC() {
  const clientTypeDic = {}
  for (let clientType in MENU_DIC) {
    const prop = MENU_DIC[clientType].name
    //额外新增的MenuList
    const addMenuList = []
    //默认当前平台
    addMenuList.push(CURRENT_CLIENT_CONFIGURE.value)
    clientTypeDic[prop] = {
      url: GET_REQUEST_PREFIX('common/authService/menu/wmsTreeMenuList'),
      data: {
        clientType,
        ...REQUEST_ALL_DATA
      },
      dicData: null,
      props: {
        label: 'roleName',
        value: 'id'
      }
    }
  }
  return clientTypeDic
}

//根据类型获取数据
export function GET_DIC_BY_TYPE(type = CURRENT_MENU_TYPE) {
  return MENU_DIC[type]
}

