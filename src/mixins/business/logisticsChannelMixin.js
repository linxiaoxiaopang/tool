/* eslint-disable */
import CacheApi from '@/components/base/baseTable/utils/cacheApi'
import { validatenull } from '@/components/avue/utils/validate'
import expressApi from '@/api/order/expressApi'
import { REQUEST_ALL_DATA } from '@/utils/constant'

export default {
  computed: {
    dic() {
      return {
        isDockApi: this.logisticsChannelDic
      }
    },
    logisticsChannelDic() {
      return [
        {
          label: '全部',
          value: 'all',
          leaf: true
        },
        {
          label: '已对接物流',
          value: 1,
          children: [],
          dicApi: this.logisticsApi
        },
        {
          label: '未对接物流',
          value: 0,
          children: [],
          dicApi: this.logisticsApi
        }
      ]
    },
    logisticsApi() {
      let api = new CacheApi(this.getLogisticsChannelList)
      return async ({ data }) => {
        let res = await api.getData()
        return res?.filter((item) => item.isDockApi === data.value)
      }
    },
    handleSearchFormProps() {
      return {
        isDockApi: this.isDockApiSearchFormHandler
      }
    }
  },
  methods: {
    isDockApiSearchFormHandler(value) {
      if (!Array.isArray(value) || !value.length) return
    
      const lastIndex = value.length - 1
      const finalValue = value[lastIndex]
      if (validatenull(finalValue) || finalValue === 'all') return
    
      let prop = ['isDockApi', 'expressCompanyId', 'expressShippingMethodId'][lastIndex]
      return {
        $isMergeData: true,
        [prop]: finalValue
      }
    },
    async getLogisticsChannelList() {
      let res = await awaitResolve(expressApi.expressCompanyStatistics(REQUEST_ALL_DATA))
      if (!res) return
      return res.detail?.map((item) => {
        item.label = item.companyName
        item.value = item.id
        if (item.expressShippingMethodDTOList) {
          item.children = item.expressShippingMethodDTOList.map((cItem) => {
            cItem.label = cItem.cnName
            cItem.value = cItem.id
            cItem.leaf = true
            return cItem
          })
        } else {
          item.leaf = true
        }
        return item
      })
    }
  }
}