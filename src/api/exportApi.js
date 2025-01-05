import { createApi } from '@/utils/constant/requestConst'

const exportApi = createApi({
  orderListByToken: '/common/openService/temu/purchaseorderv2/get'
})

export default exportApi
