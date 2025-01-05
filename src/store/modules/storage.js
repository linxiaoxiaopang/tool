/* eslint-disable */
import Cookies from 'js-cookie'

const isShowProductOfOrder = Cookies.get('isShowProductOfOrder')
const isShowProductOfFBA = Cookies.get('isShowProductOfFBA')
const storage = {
  state: {
    isShowProductOfOrder: isShowProductOfOrder ? JSON.parse(isShowProductOfOrder) : { all: false },
    isShowProductOfFBA: isShowProductOfFBA ? JSON.parse(isShowProductOfFBA) : { all: false }
  },
  
  mutations: {
    SET_ORDER_SHOW_ALL_PRODUCT: setExpandedAll.bind(null, 'isShowProductOfOrder'),
    SET_ORDER_SHOW_PRODUCT: setExpanded.bind(null, 'isShowProductOfOrder'),
    SET_FBA_SHOW_ALL_PRODUCT: setExpandedAll.bind(null, 'isShowProductOfFBA'),
    SET_FBA_SHOW_PRODUCT: setExpanded.bind(null, 'isShowProductOfFBA'),
  }
}

function setExpandedAll(key, state, expanded) {
  state[key] = { all: expanded }
  Cookies.set(key, state[key], { expires: 5 })
}
function setExpanded(key, state, { id, expanded }) {
  const data = state[key]
  if (data.all === expanded) {
    if (data[id] !== undefined) {
      delete data[id]
      Cookies.set(key, data, { expires: 5 })
    }
  } else {
    data[id] = expanded
    Cookies.set(key, data, { expires: 5 })
  }
}

export default storage