import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
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
import SupplyAgentList from '../view/supply/SupplyAgentList.vue'
import FactoryList from '../view/factory/FactoryList.vue'
import Personal from '../view/personal/Personal.vue'
import OrderInfo from '../view/form/OrderInfo'

axios.defaults.baseURL = 'http://192.168.2.66:3000/api/'

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
      {
        path: '/users',
        component: Users,
        // 前置守卫
        beforeEnter: async (to, from, next) => {
          console.log('ordermain-beforeEnter守卫')
          const haveRoles = window.sessionStorage.getItem('user.roles').split(',')
          console.log(haveRoles)
          const { data: res } = await axios.post('/user/verifyRole/v1', {
            haveRoles,
            // 管理员权限比较
            roleName: OrderInfo.RoleName.get('ADMIN')
          })
          console.log(res)
          if (res.meta.status !== 200) {
            return next({ path: '/welcome', query: { msg: res.meta.msg } })
          }
          next()
        }
      },
      // 权限管理
      {
        path: '/rules',
        component: Rules,
        // 前置守卫
        beforeEnter: async (to, from, next) => {
          console.log('ordermain-beforeEnter守卫')
          const haveRoles = window.sessionStorage.getItem('user.roles').split(',')
          console.log(haveRoles)
          const { data: res } = await axios.post('/user/verifyRole/v1', {
            haveRoles,
            // 管理员权限比较
            roleName: OrderInfo.RoleName.get('ADMIN')
          })
          console.log(res)
          if (res.meta.status !== 200) {
            return next({ path: '/welcome', query: { msg: res.meta.msg } })
          }
          next()
        }
      },
      // 产品分类管理
      {
        path: '/product',
        component: Product,
        // 前置守卫
        beforeEnter: async (to, from, next) => {
          console.log('ordermain-beforeEnter守卫')
          const haveRoles = window.sessionStorage.getItem('user.roles').split(',')
          console.log(haveRoles)
          const { data: res } = await axios.post('/user/verifyRole/v1', {
            haveRoles,
            // 经理权限比较
            roleName: OrderInfo.RoleName.get('MANAGER')
          })
          console.log(res)
          if (res.meta.status !== 200) {
            return next({ path: '/welcome', query: { msg: res.meta.msg } })
          }
          next()
        }
      },
      // 报价表
      {
        path: '/sheet',
        component: Sheet,
        // 前置守卫
        beforeEnter: async (to, from, next) => {
          console.log('ordermain-beforeEnter守卫')
          const haveRoles = window.sessionStorage.getItem('user.roles').split(',')
          console.log(haveRoles)
          const { data: res } = await axios.post('/user/verifyRole/v1', {
            haveRoles,
            // 经理权限比较
            roleName: OrderInfo.RoleName.get('MANAGER')
          })
          console.log(res)
          if (res.meta.status !== 200) {
            return next({ path: '/welcome', query: { msg: res.meta.msg } })
          }
          next()
        }
      },
      // 订单向导
      {
        path: '/ordermain',
        component: OrderMain,
        // 前置守卫
        beforeEnter: async (to, from, next) => {
          console.log('ordermain-beforeEnter守卫')
          const haveRoles = window.sessionStorage.getItem('user.roles').split(',')
          console.log(haveRoles)
          const { data: res } = await axios.post('/user/verifyRole/v1', {
            haveRoles,
            // 业务员权限
            roleName: OrderInfo.RoleName.get('SALESMAN')
          })
          console.log(res)
          if (res.meta.status !== 200) {
            return next({ path: '/welcome', query: { msg: res.meta.msg } })
          }
          next()
        }
      },
      // 向导模式
      {
        path: '/orderwizard',
        component: OrderWizard,
        // 前置守卫
        beforeEnter: async (to, from, next) => {
          console.log('ordermain-beforeEnter守卫')
          const haveRoles = window.sessionStorage.getItem('user.roles').split(',')
          console.log(haveRoles)
          const { data: res } = await axios.post('/user/verifyRole/v1', {
            haveRoles,
            // 业务员权限比较
            roleName: OrderInfo.RoleName.get('SALESMAN')
          })
          console.log(res)
          if (res.meta.status !== 200) {
            return next({ path: '/welcome', query: { msg: res.meta.msg } })
          }
          next()
        }
      },
      // 专家模式
      {
        path: '/orderexpert',
        component: OrderExpert,
        // 前置守卫
        beforeEnter: async (to, from, next) => {
          console.log('ordermain-beforeEnter守卫')
          const haveRoles = window.sessionStorage.getItem('user.roles').split(',')
          console.log(haveRoles)
          const { data: res } = await axios.post('/user/verifyRole/v1', {
            haveRoles,
            // 业务员权限比较
            roleName: OrderInfo.RoleName.get('SALESMAN')
          })
          console.log(res)
          if (res.meta.status !== 200) {
            return next({ path: '/welcome', query: { msg: res.meta.msg } })
          }
          next()
        }
      },
      // 货源代办列表
      {
        path: '/supplyAgentList',
        component: SupplyAgentList,
        // 前置守卫
        beforeEnter: async (to, from, next) => {
          console.log('ordermain-beforeEnter守卫')
          const haveRoles = window.sessionStorage.getItem('user.roles').split(',')
          console.log(haveRoles)
          const { data: res } = await axios.post('/user/verifyRole/v1', {
            haveRoles,
            // 货源权限比较
            roleName: OrderInfo.RoleName.get('SUPPLY')
          })
          console.log(res)
          if (res.meta.status !== 200) {
            return next({ path: '/welcome', query: { msg: res.meta.msg } })
          }
          next()
        }
      },
      // 工厂信息列表
      {
        path: '/factoryList',
        component: FactoryList,
        // 前置守卫
        beforeEnter: async (to, from, next) => {
          console.log('ordermain-beforeEnter守卫')
          const haveRoles = window.sessionStorage.getItem('user.roles').split(',')
          console.log(haveRoles)
          const { data: res } = await axios.post('/user/verifyRole/v1', {
            haveRoles,
            // 货源权限比较
            roleName: OrderInfo.RoleName.get('SUPPLY')
          })
          console.log(res)
          if (res.meta.status !== 200) {
            return next({ path: '/welcome', query: { msg: res.meta.msg } })
          }
          next()
        }
      },
      // 个人信息
      { path: '/personal', component: Personal }
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
  console.log('全局守卫:beforeEach')
  // to 目标 路由
  // from 前路由
  // next 执行跳转动作

  // 登录页面
  if (to.path === '/login') return next()

  // 用的token为null 跳转到/login
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  return next()
})

export default router
