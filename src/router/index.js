import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../view/Home.vue'
import Welcome from '../view/Welcome.vue'
import Users from '../view/system/Users.vue'
import Rules from '../view/system/Rules.vue'
import Sheet from '../view/form/Sheet.vue'
import Product from '../view/form/Product.vue'
import OrderMain from '../view/form/OrderMain.vue'
import OrderWizard from '../view/form/OrderWizard.vue'
import OrderExpert from '../view/form/OrderExpert.vue'
import Tmp from '../view/form/tmp.vue'

Vue.use(VueRouter)

const routes = [
  {
    // 默认路由路由
    path: '/',
    redirect: '/login'
  },
  {
    // 登陆路由
    path: '/login',
    component: Login
  },
  {
    // 授权后的主页面
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      // 欢迎
      { path: '/welcome', component: Welcome },
      // 用户管理
      { path: '/users', component: Users },
      // 权限管理
      { path: '/rules', component: Rules },
      // 产品分类管理
      { path: '/product', component: Product },
      // 报价表
      { path: '/sheet', component: Sheet },
      // 订单向导
      { path: '/ordermain', component: OrderMain },
      // 向导模式
      { path: '/orderwizard', component: OrderWizard },
      // 专家模式
      { path: '/orderexpert', component: OrderExpert },
      // 测试
      { path: '/tmp', component: Tmp }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 判断用户是否已经登陆，没有登陆从新跳转到login路径
router.beforeEach((to, from, next) => {
  // to 目标 路由
  // 前路由
  // next 执行跳转动作
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  return next()
})

export default router
