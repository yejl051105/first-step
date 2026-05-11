import Login from '@/views/Login/Login.vue'
import Home from '@/views/Home/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'
import UserList from '@/views/UserList/UserList.vue'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import Setting from '@/views/Setting/Settings.vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/home', component: Home, redirect: "/home/userlist", children: [
        { path: 'userlist', name: 'userlist', component: UserList },
        { path: 'settings', name: 'settings', component: Setting },
        { path: 'dashboard', name: 'dashboard', component: Dashboard },
      ]
    },
  ],
})

router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  const { token, userlist } = storeToRefs(userStore)

  if (to.name === 'login' && token.value) {
    return { path: '/home' }
  }

  if (to.name !== 'login' && !token.value) {
    ElMessage.error("没有登录权限")
    return { name: 'login' }
  }

  // 兜底：如果 userlist 为空（例如登录后跳转时 store 还未就绪），补拉一次
  if (to.name !== 'login' && !Array.isArray(userlist.value)) {
    const latestUserList = await userStore.getUserList()

    if (!latestUserList) {
      userStore.clearAuth()
      ElMessage.error("用户数据获取失败，请重新登录")
      return { name: 'login' }
    }
  }
})

export default router
