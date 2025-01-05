import { createApi } from '@/utils/constant/requestConst'

const api = {
  create: '/channelPricesService/channelPrices/create',//渠道价格创建
  list: '/channelPricesService/channelPrices/list', //渠道价格列表
  exportShippingMethodPriceComparison: {
    url: '/channelPricesService/exportShippingMethodPriceComparison',
    responseType: 'blob'
  }, //导出渠道价格列表
}

export default createApi(api)
