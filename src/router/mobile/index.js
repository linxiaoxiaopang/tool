export default [
  {
    path: '/biyadi',
    name: '/biyadi',
    component: 'Layout',
    redirect: '/biyadi/price',
    meta: { title: 'xlsx', icon: 'prototype' },
    children: [
      {
        name: 'price',
        path: 'price',
        component: 'biyadi/mobile/price',
        meta: { title: '价格测算', icon: 'prototype' },
        children: []
      },
      {
        name: 'dataBase',
        path: 'dataBase',
        component: 'biyadi/mobile/dataBase',
        meta: { title: '数据库', icon: 'prototype' },
        children: []
      }
    ]
  }
]
