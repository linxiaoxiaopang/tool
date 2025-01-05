/* eslint-disable */
import loginApi from '@/api/system/login'

const {
  login,
  loginByMobile,
  getInfo,
  logoutting,
  refreshToken
} = loginApi

import { getToken, setToken, removeToken } from '@/utils/auth'
import { parseTime } from '@/utils'

const user = {
  state: {
    baidu_access_token: '',
    token: getToken(),
    refreshToken: getToken('refresh'),
    id: '',
    name: '',
    email: '',
    avatar: '',
    createTime: '',
    mobile: null,
    roles: [],
    isMain: false,
    is_super: false,
    isAdmin: false,
    isFirstLogin: false,
    type: undefined,
    isSkipReferenceRecord: 0,
    britain_duty_paragraph: '',
    ioss_duty_paragraph: '',
    isLinkWebsocket: true,
    company: '',
    isPayOrder: true,
    isAuth: 1,
    isShowDialog: false,
    invitationCode: '',
    invitationName: ''
  },
  mutations: {
    SET_TOKEN: (state, { accessToken, rememberMe, expires }) => {
      state.token = accessToken
      setToken(accessToken, rememberMe, expires)
    },
    SET_REFRESH_TOKEN: (state, { refreshToken, rememberMe, expires }) => {
      state.refreshToken = refreshToken
      setToken(refreshToken, rememberMe, expires, 'refresh')
    },
    SET_COMPANY: (state, company) => {
      state.company = company
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_CREATE_TIME: (state, createTime) => {
      state.createTime = createTime
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_BRITAIN: (state, britain_duty_paragraph) => {
      state.britain_duty_paragraph = britain_duty_paragraph
    },
    SET_IOSS: (state, ioss_duty_paragraph) => {
      state.ioss_duty_paragraph = ioss_duty_paragraph
    },
    //设置超级管理员
    SET_IS_SUPER: (state, is_super) => {
      state.is_super = is_super
    },
    SET_IS_ADMIN: (state, isAdmin) => {
      state.isAdmin = isAdmin
    },
    SET_IS_MAIN: (state, isMain) => {
      state.isMain = isMain
    },
    SET_IS_FIRSTLOGIN: (state, isFirstLogin) => {
      state.isFirstLogin = isFirstLogin
    },
    SET_TYPE: (state, type) => {
      state.type = type
    },
    SET_MOBILE: (state, mobile) => {
      state.mobile = mobile
    },

    SET_CODE: (state, invitationCode) => {
      state.invitationCode = invitationCode
    },

    SET_INVITATION_NAME: (state, invitationName) => {
      state.invitationName = invitationName
    },

    CLEAR_TOKEN: (state) => {
      state.token = ''
      removeToken()
    },
    CLEAR_REFRESH_TOKEN: (state) => {
      state.refreshToken = ''
      removeToken('refresh')
    },

    WEBSOCKET_STATUS_CHANGE: (state, val) => {
      state.isLinkWebsocket = val
    },
    SET_IS_PAY_ORDER: (state, isPayOrder) => {
      console.log('isPayOrder', isPayOrder)
      state.isPayOrder = isPayOrder
    },
    SET_AUTH: (state, auth) => {
      state.isAuth = auth
    },
    SET_SHOW_DIALOG: (state, auth) => {
      state.isShowDialog = auth
    },
    SET_SKIP_RECORD: (state, skip) => {
      state.isSkipReferenceRecord = skip
    }
  },

  actions: {
    // 密码登录
    Login({ commit, dispatch }, userInfo) {
      const accountName = userInfo.username
      const password = userInfo.password
      const rememberMe = userInfo.rememberMe
      const captchaVerification = userInfo.captchaVerification
      return new Promise((resolve, reject) => {
        login({ accountName, password, captchaVerification })
          .then((res) => {
            if ($SUC(res)) {
              const { accessToken, refreshToken, isCertificated } = res.detail || {}
              const expires = 7
              commit('SET_AUTH', isCertificated)
              commit('SET_TOKEN', { accessToken, rememberMe, expires })
              commit('SET_REFRESH_TOKEN', { refreshToken, rememberMe, expires })
              commit('SET_IS_FIRSTLOGIN', true)
              resolve(res)
            }
            reject(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    //手机短信登录
    LoginByMobile({ commit, dispatch }, userInfo) {
      const { rememberMe, ...restForm } = userInfo
      return new Promise((resolve, reject) => {
        loginByMobile(restForm)
          .then((res) => {
            if ($SUC(res)) {
              const { accessToken, refreshToken, isCertificated } = res.detail || {}
              const expires = 7
              commit('SET_AUTH', isCertificated)
              commit('SET_TOKEN', { accessToken, rememberMe, expires })
              commit('SET_REFRESH_TOKEN', { refreshToken, rememberMe, expires })
              commit('SET_IS_FIRSTLOGIN', true)
              resolve(res)
            }
            reject(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        // getInfo()
          return Promise.resolve({
              detail: {
                  isSuperUser: 1
              }
          }).then((res) => {
            const {
              detail: {
                createTime,
                email,
                id,
                isSuperUser,
                is_admin,
                accountType = 2,
                accountName,
                iossDutyParagraph,
                britainDutyParagraph,
                company,
                mobile,
                isPayOrder,
                isSkipReferenceRecord,
                invitationCode,
                invitationName
              } = {}
            } = res || {}
            let isSuper = isSuperUser === 1
            let isMain = accountType === 1 || isSuper
            commit('SET_ID', id)
            commit('SET_NAME', accountName)
            commit('SET_EMAIL', email)
            commit('SET_SKIP_RECORD', isSkipReferenceRecord)
            commit('SET_CREATE_TIME', parseTime(createTime))
            commit('SET_IS_SUPER', isSuper)
            commit('SET_IS_ADMIN', is_admin)
            commit('SET_IS_MAIN', isMain)
            commit('SET_TYPE', accountType)
            commit('SET_IOSS', iossDutyParagraph)
            commit('SET_BRITAIN', britainDutyParagraph)
            commit('SET_COMPANY', company)
            commit('SET_MOBILE', mobile)
            commit('SET_CODE', invitationCode)
            commit('SET_INVITATION_NAME', invitationName)
            commit('SET_IS_PAY_ORDER', isPayOrder === 1)
            if (isSuper) {
              commit('SET_ROLES', ['admin'])
            }
            resolve(res)
          })
          .catch((err) => {
            reject(err)
            console.log(err)
          })
      })
    },

    // 刷新Token
    RefreshToken({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        if (!getToken()) {
          dispatch('GoLogin')
          reject()
          return
        }

        refreshToken()
          .then((res) => {
            if ($SUC(res)) {
              const { accessToken, refreshToken } = res.detail || {}
              const expires = 7
              commit('SET_TOKEN', { accessToken, expires })
              commit('SET_REFRESH_TOKEN', { refreshToken, expires })
              return resolve(res)
            } else {
              return Promise.reject(res)
            }
          })
          .catch((error) => {
            dispatch('GoLogin')
            reject(error)
          })
      })
    },

    // 登出
    LogOut({ commit, dispatch }) {
      return true
      return new Promise((resolve, reject) => {
        logoutting()
          .then((res) => {
            sessionStorage.removeItem('showDialog')
            commit('SET_IS_FIRSTLOGIN', true)
            const { code } = res
            if ($SUC({ code })) {
              resolve(true)
            }
          })
          .catch((err) => {
            resolve(false)
          })
          .finally(() => {
            dispatch('GoLogin')
          })
      })
    },

    // 返回登录页
    GoLogin({ commit }) {
      const timer = setInterval(() => {
        commit('CLEAR_TOKEN')
        commit('CLEAR_REFRESH_TOKEN')
        // 避免token未被清除
        if (!getToken()) {
          clearInterval(timer)
          location.reload() // 为了重新实例化vue-router对象 避免bug
        }
      })
    }
  }
}

export default user
