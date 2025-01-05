/* eslint-disable */

/**
 * 根据id获取物流公司的渠道的prop
 * @param id
 * @param prop
 * @returns {*}
 */
export function getShippingMethodListPropOfId(id, prop = 'accountId') {
  const list = store.getters.shippingMethodId || []
  const findItem = find(list, { id })
  return findItem && findItem[prop]
}