import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'

const Login = () => import('@/views/Login/Login.vue')
const Home = () => import('@/views/Home/Home.vue')
const UserList = () => import('@/views/UserList/UserList.vue')
const Setting = () => import('@/views/Setting/Settings.vue')
const Dashboard = () => import('@/views/Dashboard/Dashboard.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/home', component: Home, redirect: '/home/userlist', children: [
        { path: 'userlist', name: 'userlist', component: UserList },
        { path: 'settings', name: 'settings', component: Setting },
      ]
    },
  ],
})

const isDashboardRegistered = () => {
  return router.getRoutes().some(r => r.name === 'dashboard')
}

const addDashboardRoute = () => {
  if (!isDashboardRegistered()) {
    router.addRoute('home', {
      path: 'dashboard',
      name: 'dashboard',
      component: Dashboard,
    })
  }
}

const removeDashboardRoute = () => {
  if (isDashboardRegistered()) {
    router.removeRoute('dashboard')
  }
}

router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  const { token, userlist } = storeToRefs(userStore)

  if (to.name === 'login' && token.value) {
    return { path: '/home' }
  }

  if (to.name !== 'login' && !token.value) {
    ElMessage.error('没有登录权限')
    return { name: 'login' }
  }

  // 登录后按角色注册 Dashboard 路由
  if (token.value && userStore.loginUser) {
    if (userStore.loginUser.role === 'Admin') {
      addDashboardRoute()
    } else {
      removeDashboardRoute()
    }
  }

  // 普通用户无法访问 Dashboard
  if (to.name === 'dashboard' && userStore.loginUser?.role !== 'Admin') {
    ElMessage.warning('无权访问该页面')
    return { path: '/home/userlist' }
  }

  // 兜底：如果 userlist 为空（例如登录后跳转时 store 还未就绪），补拉一次
  if (to.name !== 'login' && !Array.isArray(userlist.value)) {
    const latestUserList = await userStore.getUserList()

    if (!latestUserList) {
      userStore.clearAuth()
      ElMessage.error('用户数据获取失败，请重新登录')
      return { name: 'login' }
    }
  }
})

export default router
