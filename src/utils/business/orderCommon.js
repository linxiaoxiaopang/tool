/* eslint-disable */
import store from '@/store'
import { curryRight } from 'lodash'
import { getTimeDiff } from '@/utils'
import { getOrderStatus as getZdOrderStatus } from '@/views/zdcustom/order/order/utils/validate'
import { getOrderStatus as getZdFbaStatus } from '@/views/zdcustom/order/fba/utils'
import { getOrderStatus as getToOrderStatus } from '@/views/toaddit/order/order/utils/get'

// 获取订单生产超时文本
const options = {
  zdOrder: {
    prop: 'externalGeneralOrderDays',
    validate(row) {
      return ![
        'delivered',
        'finished',
        'expired',
        'cancelled'
      ].includes(getZdOrderStatus(row))
    }
  },
  zdFba: {
    prop: 'externalFbaOrderDays',
    validate(row) {
      return ![
        'delivered',
        'finished',
        'cancelled'
      ].includes(getZdFbaStatus(row))
    }
  },
  toOrder: {
    prop: 'toadditOrderDays',
    validate(row) {
      return ![
        'delivered',
        'sent',
        'finished',
        'cancelled'
      ].includes(getToOrderStatus(row))
    }
  }
}
export function getProductionTimeout(type) {
  return $GET(store.getters.productionTimeout, `0.${ options[type].prop }`)
}
export function getProductionTime(row, type) {
  const { validate } = options[type] || options.zdOrder
  if (validate && !validate(row)) return
  
  let template = ''
  const productionTime = row.sendTime
  const limitTime = getProductionTimeout(type)
  if (productionTime && limitTime) {
    const formatTime = getTimeDiff(productionTime)
    const index = formatTime.indexOf('天')
    const result = formatTime.substring(0, index)
    template = `<div class="text-danger">${
      Number(result) >= limitTime ? `生产已超过${ limitTime }天` : `已生产：${ formatTime }`
    }</div>`
  }
  
  return template
}
export const getProductionTimeCurried = curryRight(getProductionTime)


