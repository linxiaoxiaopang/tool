import {
  SORT_SHIPPING_METHOD_ASC,
  TYPE_BIG_GOOD,
  TYPE_SMALL_GOOD
} from '../utils'
import { validatenull } from '@/components/avue/utils/validate'
import { escapeRegexpString } from 'element-ui/src/utils/util'
import { createSpanMethod } from '@/utils'
import { groupBy, orderBy, isArray } from 'lodash'

function sortData(data, type) {
  const tmpData = []
  if (!type) return data
  if (type == SORT_SHIPPING_METHOD_ASC) {
    let stack = []
    const shippingMethodObj = groupBy(data, (item) => {
      const curShippingMethod = item.deliveryShipping
      let fIndex = stack.findIndex(sItem => sItem === curShippingMethod)
      if (fIndex < 0) {
        stack.push(curShippingMethod)
        fIndex = stack.length - 1
      }
      return `${fIndex}_${curShippingMethod}`
    })

    Object.values(shippingMethodObj).map(item => {
      const orderItem = orderBy(item, ['formatPrice', 'deliveryShipping', 'countryCnName'])
      tmpData.push(...orderItem)
    })

    return tmpData
  }
  return orderBy(data, ['formatPrice', 'deliveryShipping', 'countryCnName'])
}

function searchAfterData(data, searchForm) {
  return Object.keys(searchForm).reduce((cur, prev) => {
    cur = cur.filter((item) => {
      let searchValue = searchForm[prev]
      if (validatenull(searchValue)) return true
      searchValue = isArray(searchValue) ? searchValue : [searchValue]
      return searchValue.some(sItem => {
        return new RegExp(escapeRegexpString(sItem), 'i').test(item[prev])
      })
    })
    return cur
  }, data)
}

export default function () {
  return {
    data() {
      return {
        dataObj: {
          [TYPE_BIG_GOOD]: [],
          [TYPE_SMALL_GOOD]: []
        }
      }
    },

    computed: {
      currentValue({ curTabItem }) {
        return curTabItem.value || TYPE_SMALL_GOOD
      },

      data: {
        get({ dataObj, currentValue }) {
          return dataObj[currentValue]
        },

        set(data) {
          this.dataObj[this.currentValue] = data
        }
      },

      filterData({ searchForm, data }) {
        const { sort, createTime, ...resetSearchForm } = searchForm
        data = sortData(data, sort)
        return searchAfterData(data, resetSearchForm)
      }
    },

    methods: {
      spanMethod(params) {
        return createSpanMethod(params, this.filterData, {
          props: [
            [
              {
                deliveryShipping: ['deliveryShipping']
              },
              {
                countryCnName: ['countryCnName']
              },
              {
                expressShippingMethod: ['expressShippingMethod']
              },
              {
                cargoAttributes: ['cargoAttributes']
              }
            ]
          ]
        })
      }
    }
  }
}
