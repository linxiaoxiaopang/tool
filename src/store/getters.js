import dic from '@/store/modules/dic'
import store from '@/store/index'
import { isPlainObject, capitalize } from 'lodash'

const getters = {
  devicePixelRatio: (state) => state.window.windowData.devicePixelRatio,
  setting: (state) => state.setting,

  sidebar: (state) => state.app.sidebar,
  shop: (state) => state.shop,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  baidu_access_token: (state) => state.user.baidu_access_token,
  avatar: (state) => state.user.avatar,
  cachedViews: (state) => state.tagsView.cachedViews,
  id: (state) => state.user.id,
  name: (state) => state.user.name,
  company: (state) => state.user.company,
  createTime: (state) => state.user.createTime,
  email: (state) => state.user.email,
  mobile: (state) => state.user.mobile,
  roles: (state) => state.user.roles,
  britain_duty_paragraph: (state) => state.user.britain_duty_paragraph,
  ioss_duty_paragraph: (state) => state.user.ioss_duty_paragraph,
  //是否是超级管理员
  is_super: (state) => state.user.is_super,
  isAdmin: (state) => state.user.isAdmin,
  isMain: (state) => state.user.isMain,
  isPayOrder: (state) => state.user.isPayOrder,
  isFirstLogin: (state) => state.user.isFirstLogin,
  type: (state) => state.user.type,
  isAuth: (state) => state.user.isAuth, //是否进行认证
  isShowDialog: (state) => state.user.isShowDialog, //是否有显示过认证模态框
  isSkipReferenceRecord: (state) => state.user.isSkipReferenceRecord, //是否跳过引导
  invitationCode: (state) => state.user.invitationCode,
  invitationName: (state) => state.user.invitationName,
  permission_routers: (state) => state.permission.routers,
  curRouterId: (state) => state.permission.curRouterId,
  curRouterPid: (state) => state.permission.curRouterPid,
  addRouters: (state) => state.permission.addRouters,
  socketApi: (state) => state.api.socketApi,
  //product
  categoryQuery: (state) => {
    if (state.product.category) {
      let category = JSON.parse(sessionStorage.getItem('category'))
      if (category) {
        state.product.category = category === 'all' ? category : Number(category)
      }
    }
    return state.product.category
  },
  //我的产品分类
  privateCategroyQuery: (state) => {
    if (state.product.privateCategroy) {
      let privateCategroy = JSON.parse(sessionStorage.getItem('privateCategroy'))
      if (privateCategroy) {
        state.product.privateCategroy = privateCategroy === 'all' ? privateCategroy : Number(privateCategroy)
      }
    }
    return state.product.privateCategroy
  }
}

for (const dicKey in dic.state) {
  const { partData } = dic.state[dicKey]
  const partDataKeys = Object.keys(partData || {})
  if (isPlainObject(partData) && partDataKeys.length) {
    partDataKeys.map((prop) => {
      const key = `${dicKey}${capitalize(prop)}`
      getters[key] = (state) => {
        store.dispatch('GetDic', dicKey)
        const partData = state.dic[dicKey].partData
        return Array.isArray(partData[prop]) ? partData[prop] : []
      }
    })
  }
  getters[dicKey] = (state) => {
    store.dispatch('GetDic', dicKey)
    let { dicData } = state.dic[dicKey]
    return Array.isArray(dicData) ? dicData : []
  }
  getters[`${dicKey}Props`] = (state) => {
    return (
      state.dic[dicKey].props || {
        label: 'label',
        value: 'value'
      }
    )
  }
}

export default getters
