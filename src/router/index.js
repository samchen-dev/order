import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../view/Home.vue'
import Welcome from '../view/Welcome.vue'
import Users from '../view/system/Users.vue'
import Rules from '../view/system/Rules.vue'

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
      { path: '/rules', component: Rules }
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
