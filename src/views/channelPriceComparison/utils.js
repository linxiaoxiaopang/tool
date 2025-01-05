import { uniq, map } from 'lodash'
import { validatorOptions } from '@/utils/validate/validateClass'

export const SORT_SHIPPING_METHOD_ASC = '1'
export const SORT_ALL_ASC = '2'

export const TYPE_BIG_GOOD = '1'
export const TYPE_SMALL_GOOD = '2'


export function getList(data, type) {
  return {
    column: [
      {
        label: '大货',
        value: TYPE_BIG_GOOD,
        option: createOption(data, type)
      },
      {
        label: '小货',
        value: TYPE_SMALL_GOOD,
        option: createOption(data, type)
      }
    ]
  }
}

export function createOption(data, type) {
  data = data || []
  const list = {
    searchExcel: {
      option: {
        border: true,
        menu: false,
        isOnePage: false,
        page: false,
        index: true,
        column: [
          {
            label: '导入时间',
            prop: 'createTime',
            search: true,
            $sort: 8,
          },
          {
            label: '排序方式',
            prop: 'sort',
            type: 'select',
            searchValue: SORT_SHIPPING_METHOD_ASC,
            dicData: [
              {
                label: '出货方式-价格递增',
                value: SORT_SHIPPING_METHOD_ASC
              },
              {
                label: '全部-价格递增',
                value: SORT_ALL_ASC
              }
            ],
            search: true,
            hide: true
          },
          {
            label: '出货方式',
            prop: 'deliveryShipping',
            type: 'select',
            search: true
          },
          {
            label: '国家',
            prop: 'countryCnName',
            type: 'select',
            search: true
          },
          {
            label: '渠道',
            prop: 'expressShippingMethod',
            type: 'select',
            search: true
          },
          {
            label: '货物属性',
            prop: 'cargoAttributes',
            type: 'select',
            search: true
          },
          {
            label: '重量',
            prop: 'weight',
            type: 'select',
            search: true,
            formatter(row) {
              const weight = row.weight
              let str = `${weight}`
              if (weight < 21) {
                str = `${str}<div class="text-primary mr10">特殊</div>`
              }
              return str
            }
          },
          {
            label: '价格/kg',
            prop: 'price',
            search: true,
            type: 'select'
          },
          {
            label: '挂号费',
            prop: 'registrationFee',
            formatter(row) {
              return row.registrationFee || 0
            }
          },
          {
            label: '备注',
            prop: 'remark'
          }
        ]
      }
    },
    exportExcel: {
      option: {
        border: true,
        menu: false,
        isOnePage: false,
        page: false,
        index: true,
        column: [
          {
            label: '排序方式',
            prop: 'sort',
            type: 'select',
            searchValue: SORT_SHIPPING_METHOD_ASC,
            dicData: [
              {
                label: '出货方式-价格递增',
                value: SORT_SHIPPING_METHOD_ASC
              },
              {
                label: '全部-价格递增',
                value: SORT_ALL_ASC
              }
            ],
            search: true,
            hide: true
          },
          {
            label: '出货方式',
            prop: 'deliveryShipping',
            search: true,
            rules: [
              {
                required: true
              }
            ]
          },
          {
            label: '国家',
            prop: 'countryCnName',
            search: true,
            rules: [
              {
                required: true
              }
            ]
          },
          {
            label: '货物属性',
            prop: 'cargoAttributes',
            search: true
          },
          {
            label: '渠道',
            prop: 'expressShippingMethod',
            search: true,
            rules: [
              {
                required: true
              }
            ]
          },
          {
            label: '重量',
            prop: 'weight',
            search: true,
            rules: [
              {
                required: true
              }
            ],
            formatter(row) {
              const weight = row.weight
              let str = `${weight}`
              if(weight < 21) {
                str = `${str}<div class="text-primary mr10">特殊</div>`
              }
              return str
            }
          },
          {
            label: '价格/kg',
            prop: 'price',
            rules: [
              {
                required: true
              },
              {
                validator(rule, value, callback, row) {
                 const isMoney = validatorOptions.money.pattern.test(row.formatPrice)
                  if(isMoney) {
                    callback()
                    return
                  }
                  debugger
                  callback(validatorOptions.money.message)
                }
              }
              // validatorOptions.money
            ]
          },
          {
            label: '挂号费',
            prop: 'registrationFee',
            formatter(row) {
              return  row.registrationFee || 0
            }
          },
          {
            label: '备注',
            prop: 'remark'
          }
        ]
      }
    }
  }
  const option = (list[type] || list.exportExcel).option
  const searchColumn = getSelectSearchColumn(option.column)
  searchColumn.map(item => {
    const prop = item.prop
    const values = uniq(map(data, prop)).filter(Boolean)
    item.multiple = true
    item.filterable = true
    item.dicData = values.map(sItem => {
      return {
        value: sItem,
        label: sItem
      }
    })
  })
  return option
}

export function getSelectSearchColumn(column) {
  return column.filter(item => {
    return item.search && item.type == 'select' && item.prop !== 'sort'
  })
}

export function getFormatPrice(data) {
  data = data || []
  return data.map(item => {
    const price = item.price.toString().split(/[\s,，'‘"“、]+/)[0]
    if (price == Number(price)) {
      item.formatPrice = Number(price)
    } else {
      item.formatPrice = item.price
    }
    return item
  })
}
