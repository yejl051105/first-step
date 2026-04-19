import Login from '@/Login/Login.vue'
import Home from '@/Home/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'
import UserList from '@/UserList/UserList.vue'
import Dashboard from '@/Dashboard/Dashboard.vue'
import Setting from '@/Setting/Settings.vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userlist'
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
  const { token } = storeToRefs(userStore)
  const isPermision = token.value
  if (to.name !== 'login' && !isPermision) {
    ElMessage.error("没有登录权限")
    return { name: 'login' }
  }
})

export default router
