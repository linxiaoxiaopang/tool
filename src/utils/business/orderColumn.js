/* eslint-disable */

export const orderSearchColumn = {
  importTime: {
    prop: 'importTime',
    hide: true,
    search: true,
    type: 'selectInput'
  },
  importTime1: {
    label: '导入时间',
    prop: 'importTime',
    hide: true,
    search: true,
    type: 'daterange'
  },
  userAccount: {
    label: '用户账号',
    prop: 'accountName',
    hide: true,
    search: true
  },
  userName: {
    label: '用户名',
    prop: 'nickName',
    hide: true,
    search: true
  },
  orderCode: {
    label: '订单号',
    prop: 'orderCodeList',
    hide: true,
    search: true,
    searchPlaceholder: '多个请用空格或逗号隔开'
  },
  expressWaybillCode: {
    label: '运单号',
    prop: 'expressWaybillCodeList',
    hide: true,
    search: true,
    searchPlaceholder: '多个请用空格或逗号隔开'
  },
  consigneeName: {
    label: '收件人',
    prop: 'consigneeName',
    hide: true,
    search: true
  },
  consigneeCountryCode: {
    label: '国家',
    prop: 'consigneeCountryCode',
    hide: true,
    search: true,
    type: 'select',
    filterable: true
  },
  orderStatus: {
    label: '订单状态',
    prop: 'orderStatus',
    hide: true,
    search: true,
    type: 'select'
  },
  logisticsChannel: {
    label: '物流渠道',
    prop: 'isDockApi',
    hide: true,
    search: true,
    type: 'cascader',
    lazy: true,
    emitPath: true,
    dicData: [],
    placeholder: '请选择'
  },
  inputList: {
    prop: 'inputList',
    hide: true,
    search: true,
    type: 'selectInput',
    searchContentWidth: 326
  }
}

export const orderColumn = {
  remark: {
    label: '备注/加急',
    prop: 'remark',
    minWidth: 100,
    formatter(row) {
      let tmpArr = []
      if (row.isUrgent) {
        tmpArr.push('<div class="text-danger"><i class="el-icon-circle-check text-large"></i> 已加急</div>')
      }
      if (row.remark) {
        tmpArr.push(`<div>${ row.remark }</div>`)
      }
      return tmpArr.join('')
    }
  }
}


export const orderDic = {
  importTime: {
    label: '导入日期',
    value: 'importTime',
    type: 'daterange'
  },
  sendTime: {
    label: '排单日期',
    value: 'sendTime',
    type: 'daterange'
  },
  exportTime: {
    label: '生产日期',
    value: 'exportTime',
    type: 'daterange'
  },
  
  productStructName: {
    label: '款式',
    value: 'productStructNameList',
    placeholder: '多个请用空格或逗号隔开'
  }
}
export const importTimeDic = [orderDic.importTime, orderDic.sendTime, orderDic.exportTime]