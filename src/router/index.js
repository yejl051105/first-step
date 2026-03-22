import Login from '@/Login/Login.vue'
import Home from '@/Home/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:'/login',component:Login},
    {path:'/home',component:Home},
  ],
})

export default router
