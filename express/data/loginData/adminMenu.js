// let nameList = ["home", "info", "news"];
// let res = [];
// nameList.forEach((item, index) => {
//   res.push({
//     id: `${item}-${index}`,
//     name: `${item}`,
//     path: `/${item}`,
//   });
// });

let menu = [
  {
    id: 0,
    name: "home",
    path: "/home",
    redirect: "",
    component: "/home/index.vue",
    meta: {
      title: "首页",
      icon: "HomeFilled",
    },
  },
  {
    id: 1,
    name: "info",
    path: "/info",
    component: "/info/index.vue",
    meta: {
      title: "车辆信息",
      icon: "Goods",
    },
  },
  {
    id: 2,
    name: "news",
    path: "/news",
    component: "/news/index.vue",
    meta: {
      title: "新闻资讯",
      icon: "Goods",
    },
  },
  {
    id: 3,
    name: "article",
    path: "/article",
    component: "/article/index.vue",
    meta: {
      title: "文章",
      icon: "Edit",
    },
  },
  {
    id: 4,
    name: "order",
    path: "/order",
    component: "/order/index.vue",
    meta: {
      title: "订单管理",
      icon: "Document",
    },
    children: [
      {
        id: 2.1,
        name: "orderList",
        path: "/order/orderList",
        component: "/order/orderList/index.vue",
        parentId: 2,
        meta: {
          title: "订单列表",
          icon: "List",
          keepAlive: true,
        },
      },
      {
        id: 2.2,
        name: "collect",
        path: "/order/collect",
        component: "/order/collect/index.vue",
        parentId: 2,
        meta: {
          title: "汇总清单",
          icon: "Tickets",
          keepAlive: true,
        },
      },
    ],
  },
];

module.exports = {
  menu,
};
