import request from '@/service/request'
import store from '@/store'
import { getXMenuType } from '@/utils/constant'
import { createApi } from '@/utils/constant/requestConst'

const api = createApi({
  getChildUser: '/authService/user/childrenList', // 获取子账户列表
  getSelectedRoles:'/authService/role/myCreateRoleList',//角色列表
  matchRoles:'/authService/user/updateUser',
  disableUser:'/authService/user/isDisabled', //冻结解冻
  resetPassword:'/authService/user/changePassword' //修改密码
})

export default api

export async function add(data, menuType = 'btn') {
  // eslint-disable-next-line no-undef
  return doSomethingAfterRequest(
    request({
      headers: getXMenuType(menuType),
      url: '/externalbusiness/authService/user/createChildUser',
      method: 'post',
      data
    }),
    () => store.dispatch('GetChildUser')
  )
}

export function read() {
  return request({
    headers: getXMenuType(),
    url: '/externalbusiness/authService/user/getUserInfo',
    method: 'post',
    data: {}
  })
}
export function getUserById(id) {
  return request({
    url: '/externalbusiness/authService/user/getUserById',
    method: 'post',
    data: {
      id
    }
  })
}

export async function edit(data, menuType = 'btn') {
  // eslint-disable-next-line no-undef
  return doSomethingAfterRequest(
    request({
      headers: getXMenuType(menuType),
      url: '/externalbusiness/authService/user/updateUser',
      method: 'post',
      data
    }),
    () => store.dispatch('GetChildUser')
  )
}

export function update(data, menuType = 'btn') {
  return request({
    headers: getXMenuType(menuType),
    url: '/externalbusiness/authService/user/updateUser',
    method: 'post',
    data
  })
}

//更新税号
export function updateParagraph(data, menuType = 'btn') {
  return request({
    headers: getXMenuType(menuType),
    url: '/externalbusiness/authService/user/updateDutyParagraph',
    method: 'post',
    data
  })
}

// export function resetPassword(data, menuType = 'btn') {
//   return request({
//     headers: getXMenuType(menuType),
//     url: '/externalbusiness/authService/user/changePassword',
//     method: 'post',
//     data
//   })
// }

export function changePassword(data, menuType = 'btn') {
  return request({
    headers: getXMenuType(menuType),
    url: '/externalbusiness/authService/user/changeMyPassword',
    method: 'post',
    data
  })
}

// export function getChildUser(data = REQUEST_ALL_DATA, menuType = 'other') {
//   return request({
//     headers: getXMenuType(menuType),
//     url: '/externalbusiness/authService/user/childrenList',
//     method: 'post',
//     data
//   })
// }
export function disableUser(data) {
  return request({
    url: '/externalbusiness/authService/user/isDisabled',
    method: 'post',
    data
  })
}
// 获取税号列表
export function getTaxNumberTemplateList(data = {}) {
  return request({
    url: '/externalbusiness/systemService/expressTaxNumberTemplate/expressTaxNumberTemplateList',
    method: 'post',
    data
  })
}

// 删除税号
export function deleteTaxNumberTemplate(data = {}) {
  return request({
    url: '/externalbusiness/systemService/expressTaxNumberTemplate/deleteTaxNumberTemplate',
    method: 'post',
    data
  })
}

// 新增税号模板接口
export function addTaxNumberTemplate(data = {}) {
  return request({
    url: '/externalbusiness/systemService/expressTaxNumberTemplate/createExpressTaxNumberTemplate',
    method: 'post',
    data
  })
}
// 更新税号模板接口
export function editTaxNumberTemplate(data = {}) {
  return request({
    url: '/externalbusiness/systemService/expressTaxNumberTemplate/updateExpressTaxNumberTemplate',
    method: 'post',
    data
  })
}

// 子账号更换税号模板接口
export function updateDutyParagraph(data = {}) {
  return request({
    url: '/externalbusiness/authService/user/updateDutyParagraph',
    method: 'post',
    data
  })
}

//获取Vip列表
export function getVipList(data) {
  return request({
    url: '/externalbusiness/financeService/memberLevelList',
    method: 'post',
    data
  })
}

//获取当前登录账号的会员等级
export function getLevel(data) {
  return request({
    url: '/externalbusiness/financeService/getMemberLevel',
    method: 'post',
    data
  })
}

//修改公司
export function updateCompany(data) {
  return request({
    url: '/externalbusiness/financeService/invoiceApplyRecord/getInvoiceAddressMessage',
    method: 'post',
    data
  })
}

//更新用户信息
export function updateUser(data) {
  return request({
    url: '/externalbusiness/authService/user/updateUser',
    method: 'post',
    data
  })
}

//更新用户邮箱
export function updateEmail(data) {
  return request({
    url: '/externalbusiness/authService/updateEmail',
    method: 'post',
    data
  })
}

// 根据用户id获取数据
export function getDataByUserId(data) {
  return request({
    url: '/externalbusiness/authService/user/getUserById',
    method: 'post',
    data
  })
}

// 更新用户行为
export function updateUserInfo(data) {
  return request({
    url: '/externalbusiness/authService/userFirstLoginGuidance/update',
    method: 'post',
    data
  })
}
