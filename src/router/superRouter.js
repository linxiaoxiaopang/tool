const superRouter = [
  // {
  //   path: '/channelPriceComparison',
  //   name: '/channelPriceComparison',
  //   component: 'Layout',
  //   redirect: '/channelPriceComparison/exportExcel',
  //   meta: { title: '物流部', icon: 'prototype' },
  //   children: [
  //     {
  //       name: 'exportExcel',
  //       path: 'exportExcel',
  //       component: 'channelPriceComparison/exportExcel',
  //       meta: { title: '导入渠道价格对比表', icon: 'prototype' },
  //       children: []
  //     },
  //     {
  //       name: 'exportExcelHistory',
  //       path: 'exportExcelHistory',
  //       component: 'channelPriceComparison/exportExcelHistory',
  //       meta: { title: '渠道价格对比表历史记录', icon: 'prototype' },
  //       children: []
  //     },
  //     {
  //       name: 'searchExcel',
  //       path: 'searchExcel',
  //       component: 'channelPriceComparison/searchExcel',
  //       meta: { title: '查看渠道价格对比表', icon: 'prototype' },
  //       children: []
  //     }
  //   ]
  // },
  // {
  //   path: '/mock',
  //   name: '/mock',
  //   component: 'Layout',
  //   redirect: '/mock/yApi',
  //   meta: { title: '物流部', icon: 'prototype' },
  //   children: [
  //     {
  //       name: 'yApi',
  //       path: 'yApi',
  //       component: 'mock/yApi',
  //       meta: { title: 'yApi', icon: 'prototype' },
  //       children: []
  //     }
  //   ]
  // },
  // {
  //   path: '/export',
  //   name: '/export',
  //   component: 'Layout',
  //   redirect: '/export/exportOrder',
  //   meta: { title: '导出', icon: 'prototype' },
  //   children: [
  //     {
  //       name: 'exportOrder',
  //       path: 'exportOrder',
  //       component: 'export/exportOrder',
  //       meta: { title: '导出订单导入模板', icon: 'prototype' },
  //       children: []
  //     }
  //   ]
  // },
  {
    path: '/xlsx',
    name: '/xlsx',
    component: 'Layout',
    redirect: '/xlsx/keyword',
    meta: { title: 'xlsx', icon: 'prototype' },
    children: [
      {
        name: 'keyword',
        path: 'keyword',
        component: 'xlsx/keyword',
        meta: { title: '关键词', icon: 'prototype' },
        children: []
      },
      {
        name: 'mangoerp',
        path: 'mangoerp',
        component: 'xlsx/mangoerp',
        meta: { title: '解析芒果店长表格', icon: 'prototype' },
        children: []
      },
      {
        name: 'translate',
        path: 'translate',
        component: 'xlsx/translate',
        meta: { title: '翻译', icon: 'prototype' },
        children: []
      },
      {
        name: 'price',
        path: 'price',
        component: 'xlsx/price',
        meta: { title: '价格测算', icon: 'prototype' },
        children: []
      }
    ]
  }
]
export default superRouter
