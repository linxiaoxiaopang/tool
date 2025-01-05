const superRouter = [
  {
    path: '/channelPriceComparison',
    name: '/channelPriceComparison',
    component: 'Layout',
    redirect: '/channelPriceComparison/searchExcel',
    meta: { title: '物流部', icon: 'prototype' },
    children: [
      {
        name: 'searchExcel',
        path: 'searchExcel',
        component: 'channelPriceComparison/searchExcel',
        meta: { title: '查看渠道价格对比表', icon: 'prototype' },
        children: []
      }
    ]
  }
]
export default superRouter
