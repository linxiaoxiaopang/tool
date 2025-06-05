const superRouter = [
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
