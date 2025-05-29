export const ORDER_KEYS = {
  sku: 'SKU',
  consigneeCountryCode: '国家',
  consigneeDetailAddress: '收货人地址',
  consigneeCity: '收货人城市',
  consigneeName: '收货人',
  productCount: '产品数量',
  expressCompanyName: '物流方式',
  // expressCompanyId: '物流公司id',
  consigneeContactPhone: '收货人电话',
  consigneeContactMobilePhone: '收货人手机号码',
  consigneeProvince: '收货人州/省',
  orderCode: '订单号',
  expressWaybillCode: '运单号',
  consigneePostcode: '邮编',
  salesman: '业务员',
  dept: '部门',
  totalPrice: '销售金额',
  externalFreight: '运费',
  buyerId: '买家ID（非必填）'
}


export const MANGOERP_ORDER_KEYS = {
  orderCode: '订单号',
  sku: 'sku编码',
  productCount: '产品数量',
  consigneeName: '收货人名称',
  consigneeDetailAddress: ['地址', '收货人地址'],
  consigneeCity: '城市',
  consigneeProvince: '州/省',
  consigneePostcode: '邮编',
  consigneeCountryCode: '国家代码',
  consigneeContactPhone: '联系电话'
}

export const MANGOERP_MAP_ORDER_KEYS = {
  orderCode: '订单号',
  sku: 'sku编码',
  productCount: '产品数量'
}


export const option = {
  menu: false,
  column: [
    {
      label: 'SKU',
      prop: 'sku',
      minWidth: 200
    },
    {
      label: '国家',
      prop: 'consigneeCountryCode'
    },
    {
      label: '地址',
      prop: 'consigneeDetailAddress'
    },
    {
      label: '收货人城市',
      prop: 'consigneeDetailAddress'
    },
    {
      label: '收货人',
      prop: 'consigneeName'
    },
    {
      label: '产品数量',
      prop: 'productCount'
    },
    {
      label: '物流方式',
      prop: 'expressCompanyName'
    },
    {
      label: '收货人电话',
      prop: 'consigneeContactPhone'
    },
    {
      label: '收货人手机号码',
      prop: 'consigneeContactMobilePhone'
    },
    {
      label: '收货人州/省',
      prop: 'consigneeProvince'
    },
    {
      label: '订单号',
      prop: 'orderCode'
    },
    {
      label: '运单号',
      prop: 'expressWaybillCode'
    },
    {
      label: '邮编',
      prop: 'consigneePostcode'
    },
    {
      label: '业务员',
      prop: 'salesman'
    },
    {
      label: '部门',
      prop: 'dept'
    },
    {
      label: '销售金额',
      prop: 'totalPrice'
    },
    {
      label: '运费',
      prop: 'externalFreight'
    },
    {
      label: '买家ID（非必填）',
      prop: 'buyerId'
    }
  ]
}
