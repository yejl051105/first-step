import Login from '@/Login/Login.vue'
import Home from '@/Home/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'
import UserList from '@/UserList/UserList.vue'
import Dashboard from '@/Dashboard/Dashboard.vue'
import Setting from '@/Setting/Setting.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home, redirect: "/home/userlist", children: [
        { path: 'userlist', component: UserList },
        { path: 'settings', component: Setting },
        { path: 'dashboard', component: Dashboard },
      ]
    },
  ],
})

export default router
