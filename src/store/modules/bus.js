/* eslint-disable */
import router from '@/router'
import { cloneDeep, pick } from 'lodash'

let debounceLock = {}

let imgCount = {
  myStorage: 0,
  shareStorage: 0,
  tortImg: 0
}


let tabs = sessionStorage.getItem('tabs')
try {
  tabs = JSON.parse(tabs) || {}
} catch (e) {
  tabs = {}
}

const bus = {
  state: {
    tabs,
    BUS: {},

    websocketEvent: {},

    imgCount: cloneDeep(imgCount)
  },
  mutations: {
    SET_BUS(state, data) {
      Object.assign(state.BUS, data)
    },
    SET_TAB(state, { type, value }) {
      state.tabs[type] = value
      sessionStorage.setItem('tabs', JSON.stringify(state.tabs))
    },

    EMIT_WEBSOCKET_EVENT(state, { type, message }) {
      state.websocketEvent[type] && state.websocketEvent[type](message)
    },

    SET_IMG_COUNT(state, countObj) {
      state.imgCount = Object.assign(cloneDeep(orderCount), countObj)
    }
  },
  actions: {
    GetWebsocketMessage({ state }, type) {
      return new Promise((resolve) => {
        state.websocketEvent[type] = resolve
      })
    },
    RouterPush({ commit, dispatch }, location) {
      commit('SET_BUS', { [location.name]: location.params })
      router.push(location)
    },
    TabRouterReplace({ commit, dispatch }, location) {
      commit('SET_TAB', pick(location, ['type', 'value']))
      router.replace({
        name: location.name,
        query: {
          timestamp: +new Date()
        }
      })
    }
  }
}
export default bus
