const personProp = [
  {
    prop: '个人信息',
    url: '/personalCenter/account/personalInfo',
    parent: 'account',
    permission: ['externalbusiness:personalCenter:permission:personalInfo'],
    isMain: false
  },
  {
    prop: '收货地址',
    url: '/personalCenter/account/myAddress',
    parent: 'account',
    permission: ['externalbusiness:personalCenter:permission:myAddress'],
    isMain: true
  },
  {
    prop: '我的收藏',
    url: '/personalCenter/account/myCollect',
    parent: 'account',
    permission: ['externalbusiness:personalCenter:permission:myCollect'],
    isMain: false
  },
  {
    prop: '操作日志',
    url: '/personalCenter/account/faker',
    parent: 'account',
    permission: ['externalbusiness:personalCenter:permission:faker'],
    isMain: false
  },
  {
    prop: '角色权限',
    key: 'systemRole',
    url: '/personalCenter/permission/systemRole',
    parent: 'permission',
    permission: ['externalbusiness:personalCenter:permission:role'],
    isMain: true
  },
  {
    prop: '子账号管理',
    key: 'user',
    url: '/personalCenter/permission/user',
    parent: 'permission',
    permission: ['externalbusiness:personalCenter:permission:user'],
    isMain: true
  },
  {
    prop: '我的店铺',
    key: 'shopManage',
    url: '/personalCenter/shopManage',
    parent: 'store',
    permission: ['externalbusiness:personalCenter:store:manage'],
    isMain: true
  },
  {
    prop: '我的余额',
    key: 'balance',
    url: '/personalCenter/myAssets/balance',
    parent: 'assets',
    permission: ['externalbusiness:personalCenter:account:myAssets:balance'],
    isMain: true
  },
  {
    prop: '信用额度',
    key: 'myCredit',
    url: '/personalCenter/myAssets/myCredit',
    parent: 'assets',
    permission: ['externalbusiness:personalCenter:account:myCredit'],
    isMain: true
  },
  {
    prop: '进入充值',
    url: '/personalCenter/myAssets/recharge',
    parent: 'assets',
    permission: ['externalbusiness:personalCenter:account:recharge'],
    isMain: true
  },
  {
    prop: '申请开票',
    url: '/personalCenter/myAssets/invoice',
    parent: 'assets',
    permission: ['externalbusiness:personalCenter:account:invoice'],
    isMain: false
  }
]

const menuGroups = {
  '/order': {
    allOrder: 0,
    pending: 1,
    waybillRequest: 1,
    inOrder: 1,
    inProduction: 2,
    delivered: 2,
    finished: 2,
    expired: 3,
    cancelled: 3,
    afterSale: 3,
    changeOrder: 3,
    returnGoods: 3
  }
}

export { personProp, menuGroups }
