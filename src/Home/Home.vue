<script setup>
import router from '@/router';
import { ElMessage } from 'element-plus';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userlist';
import { storeToRefs } from 'pinia';

const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)
const { clearAuth } = userStore

const route = useRoute()
const activeIndex = computed(() => route.path)
const loginuser = computed(() => loginUser.value)

// 处理退出登录事件
const handleConfirm = () => {
  clearAuth()
  ElMessage.warning('即将退出至登录页面')
  setTimeout(() => {
    router.push({ name: 'login' })
  }, 1000);
}
</script>

  <template>
    <div class="container">
      <el-container class="body">
        <el-header class="header">
          <h2 class="left">Vue3 Admin System</h2>
          <div class="right">
            <div class="greeting">Welcome, <strong>{{ loginuser?.username }}</strong></div>
            <div class="logout">
              <el-popconfirm title="Are you sure to logout?" @confirm="handleConfirm">
                <template #reference>
                  <button class="logout-btn">logout</button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </el-header>
        <el-container class="footer">
          <el-aside class="aside">
            <el-menu class="menu" :default-active="activeIndex" router>
              <el-menu-item index="/home/dashboard"><el-icon><i-ep-Odometer /></el-icon>
                Dashboard</el-menu-item>
              <el-menu-item index="/home/userlist"><el-icon><i-ep-UserFilled /></el-icon>
                User
                Management</el-menu-item>
              <el-menu-item index="/home/settings"><el-icon><i-ep-Setting /></el-icon>
                Settings</el-menu-item>
            </el-menu>
          </el-aside>
          <el-main class="main">
            <RouterView></RouterView>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.container {
  height: 100vh;
  width: 100%;
}

.body {
  width: 100vw;
  height: 100vh;
  background-color: var(--app-bg);
  color: var(--app-text);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px;
  background-color: #0f172a;
  color: #f8fafc;
  border-bottom: 1px solid #1f2937;
}

.header .right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header .left {
  color: #f8fafc;
}

.header .right .greeting {
  padding: 10px;
  font-size: 18px;
  border-right: .5px solid #334155;
  color: #cbd5e1;

}

.header .right .logout {
  padding: 10px;
  font-size: 18px;
}

.logout-btn {
  padding: 10px;
  background-color: #111827;
  border: .3px solid #334155;
  color: #f8fafc;
}

.logout-btn:hover {
  cursor: pointer;
  background-color: #1f2937;
}

.footer {
  width: 100%;
}

.aside {
  background-color: #111827;
  width: 18%;
}

.menu {
  height: 100%;
  background-color: transparent;
}

.main {
  width: 85%;
  background-color: var(--app-bg);
}

:deep(.el-menu) {
  background-color: transparent;
  border-right: none;
}

:deep(.el-menu-item) {
  color: #cbd5e1;
}

:deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

:deep(.el-menu-item.is-active) {
  background-color: #1d4ed8;
  color: #ffffff;
}

:deep(.el-menu-item .el-icon) {
  color: inherit;
}
</style>
