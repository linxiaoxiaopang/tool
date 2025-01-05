import { TYPE_BIG_GOOD, TYPE_SMALL_GOOD } from '@/views/channelPriceComparison/exportExcel/const'
import channelPriceComparisonApi from '@/api/channelPriceComparison'

const defaultOption = {
  resetMergeData: {
    orderItems: [
      {
        asc: false,
        column: 'create_time'
      }
    ]
  }
}

export const list = {
  column: [
    {
      label: '大货',
      value: TYPE_BIG_GOOD,
      getList: channelPriceComparisonApi.list,
      resetMergeData: {
        ...defaultOption.resetMergeData,
        type: TYPE_BIG_GOOD
      },
      option: createOption()
    },
    {
      label: '小货',
      getList: channelPriceComparisonApi.list,
      value: TYPE_SMALL_GOOD,
      resetMergeData: {
        ...defaultOption.resetMergeData,
        type: TYPE_SMALL_GOOD
      },
      option: createOption()
    }
  ]
}

function createOption(diffColumn = []) {
  const option = {
    border: true,
    menu: false,
    column: [
      {
        label: '导入时间',
        prop: 'createTime',
        search: true,
        type: 'dateTimePicker',
        $sort: 8
      },
      {
        label: '出货方式',
        prop: 'deliveryShipping'
      },
      {
        label: '国家',
        prop: 'countryCnName'
      },
      {
        label: '货物属性',
        prop: 'cargoAttributes'
      },
      {
        label: '渠道',
        prop: 'expressShippingMethod'
      },
      {
        label: '重量',
        prop: 'weight'
      },
      {
        label: '价格/kg',
        prop: 'price'
      },
      {
        label: '挂号费',
        prop: 'registrationFee',
        formatter(row) {
          return row.registrationFee || 0
        }
      }
    ]
  }
  option.column.push(...diffColumn)
  return option
}
