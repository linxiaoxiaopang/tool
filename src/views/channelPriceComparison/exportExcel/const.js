import { validatorOptions } from '@/utils/validate/validateClass'

export const SORT_SHIPPING_METHOD_ASC = '1'
export const SORT_ALL_ASC = '2'

export const TYPE_BIG_GOOD = '1'
export const TYPE_SMALL_GOOD = '2'

export const list = {
  column: [
    {
      label: '大货',
      value: TYPE_BIG_GOOD,
      option: createOption()
    },
    {
      label: '小货',
      value: TYPE_SMALL_GOOD,
      option: createOption()
    }
  ]
}

function createOption(diffColumn = []) {
  const option = {
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
          validatorOptions.money
        ]
      },
      {
        label: '挂号费',
        prop: 'registrationFee',
        formatter(row) {
          return  row.registrationFee || 0
        }
      }
    ]
  }
  option.column.push(...diffColumn)
  return option
}
