import { v4 as uuidv4 } from 'uuid';
export const adminMenu = [
  {
    id: uuidv4(),
    name: 'home',
    path: '/home',
    redirect: '',
    component: '/home/index.vue',
    meta: {
      title: '首页',
      icon: 'HomeFilled',
    },
  },
  {
    id: uuidv4(),
    name: 'info',
    path: '/info',
    component: '/info/index.vue',
    meta: {
      title: '信息',
      icon: 'Goods',
    },
  },
  {
    id: uuidv4(),
    name: 'news',
    path: '/news',
    component: '/news/index.vue',
    meta: {
      title: '新闻资讯',
      icon: 'Goods',
    },
  },
  {
    id: uuidv4(),
    name: 'article',
    path: '/article',
    component: '/article/index.vue',
    meta: {
      title: '文章',
      icon: 'Edit',
    },
  },
  {
    id: uuidv4(),
    name: 'order',
    path: '/order',
    component: '/order/index.vue',
    meta: {
      title: '订单管理',
      icon: 'Document',
    },
    children: [
      {
        id: uuidv4(),
        name: 'orderList',
        path: '/order/orderList',
        component: '/order/orderList/index.vue',
        parentId: 2,
        meta: {
          title: '订单列表',
          icon: 'List',
          keepAlive: true,
        },
      },
      {
        id: uuidv4(),
        name: 'collect',
        path: '/order/collect',
        component: '/order/collect/index.vue',
        parentId: 2,
        meta: {
          title: '汇总清单',
          icon: 'Tickets',
          keepAlive: true,
        },
      },
    ],
  },
];
