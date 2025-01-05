/* eslint-disable */
import request from '@/service/request'
import { GET_REQUEST_PREFIX, getXMenuType } from '@/utils/constant/menuConst'

export const REQUEST_ALL_DATA = {
  page: {
    pageIndex: 1,
    pageSize: 0
  }
}
export function apiFactory(option) {
  typeof option === 'string' && (option = { url: option })
  option.url = GET_REQUEST_PREFIX(option.url)
  function api(data, menuType = option.menuType) {
    return request({
      headers: menuType ? getXMenuType(menuType) : menuType,
      url: option.url,
      method: option.method || 'post',
      responseType: option.responseType,
      data: option.mergeData
        ? {
          ...option.mergeData,
          ...data
        }
        : data
    })
  }

  return option.dicName
    ? function (...args) {
      return refreshDic(api(...args), option.dicName)
    }
    : api
}

export function createApi(option, awaitOption) {
  for (const key in option) {
    option[key] = apiFactory(option[key], awaitOption)
  }
  return option
}