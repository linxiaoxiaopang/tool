<template>
  <base-button @click="exportHandler">导出订单导入模板</base-button>
</template>
<script>
import { XlsxClass } from '@/utils/utils/classUtils/xlsxClass'

export default {
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    exportHandler() {
      console.log('writeFile')
      const requiredS = { // 设置A1单元格的样式
        font: {
          color: { rgb: '70AD47' }
        }
      }
      XlsxClass.writeFile({
        data: this.data,
        filename: '订单导入模板（微定制）',
        width: 80,
        column: [
          {
            label: '订单基础信息',
            prop: 'orderInfo',
            s: {
              alignment: {
                vertical: 'center',
                horizontal: 'center'
              }
            },
            children: [
              { label: '*订单号', prop: 'subPurchaseOrderSn', s: requiredS, width: 150 },
              { label: '*SKU', prop: 'extCode', s: requiredS, width: 150 },
              { label: '*产品数量', prop: 'purchaseQuantity', s: requiredS },
              { label: '变体编号', prop: 'variantCode', width: 150 },
              { label: '销售金额', prop: 'importSalesAmount' },
              { label: '运费', prop: 'externalFreight' },
              { label: '*收货人', prop: 'consigneeName', s: requiredS, width: 150 },
              { label: '*地址1', prop: 'consigneeDetailAddress', s: requiredS, width: 188 },
              { label: '地址2', prop: 'consigneeDetailAddress1', width: 188 },
              { label: '*收货人城市', prop: 'consigneeCity', s: requiredS, width: 150 },
              { label: '收货人州/省', prop: 'consigneeProvince' },
              { label: '*邮编', prop: 'consigneePostcode', s: requiredS },
              { label: '*国家', prop: 'consigneeCountryCode', s: requiredS },
              { label: '收货人电话', prop: 'consigneeContactPhone', width: 100 },
              { label: '收货人手机号码', prop: 'consigneeContactMobilePhone', width: 100 },
              { label: '物流方式', prop: 'expressCompanyName' },
              { label: '运单号', prop: 'expressWaybillCode', width: 150 },
              { label: '业务员', prop: 'salesman' },
              { label: '部门', prop: 'dept' },
              { label: '买家ID（非必填）', prop: 'buyerId', width: 100 },
              { label: '税号', prop: 'consigneeDutyParagraph', width: 150 },
              { label: '收货人邮箱', prop: 'consigneeEmail', width: 150 }
            ]
          }
        ]
      })
    }
  }
}
</script>
