  <script setup>
  import router from '@/router';
  import { ElMessage } from 'element-plus';
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute()
  const activeIndex = computed(() => route.path)

  // 处理退出登录事件
  const handleConfirm = () => {
    localStorage.removeItem("Token")
    ElMessage.warning('即将退出至登录页面')
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 1000);
  }

</script>

  <template>
    <div class="contaier">
      <el-container class="body">
        <el-header class="header">
          <h2 class="left">Vue3 Demo Admin</h2>
          <div class="right">
            <div class="greeting">Welcome, Admin</div>
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
  background-color: green;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px;
  background-color: pink;
}

.header .right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header .right .greeting {
  padding: 10px;
  font-size: 18px;
  border-right: .5px solid black;

}

.header .right .logout {
  padding: 10px;
  font-size: 18px;
}

.logout-btn {
  padding: 10px;
  background-color: pink;
  border: .3px black solid;
}

.logout-btn:hover {
  cursor: pointer;
}

.footer {
  width: 100%;
}

.aside {
  background-color: blue;
  width: 18%;
}

.menu {
  height: 100%;
}

.main {
  width: 85%;
  background-color: yellow;
}
</style>