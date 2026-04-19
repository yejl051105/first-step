<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { getEchart } from '@/api/getEchart';
import { useUserStore } from "@/stores/userlist"
import { storeToRefs } from 'pinia';

const userStore = useUserStore()
const { userlist } = storeToRefs(userStore)

const chartDom = ref(null)
let chartInstance = null

const safeUserList = computed(() => userlist.value ?? [])
const totalLength = computed(() => safeUserList.value.length)
const activeUsers = computed(() => {
  return safeUserList.value.filter(item => item.status === 'Active').length
})
const adminUsers = computed(() => {
  return safeUserList.value.filter(item => item.role === 'Admin').length
})
const inActiveUsers = computed(() => totalLength.value - activeUsers.value)

const updateChart = () => {
  if (!chartDom.value) return

  chartInstance = getEchart(
    chartDom.value,
    totalLength.value,
    activeUsers.value,
    inActiveUsers.value,
    adminUsers.value,
    chartInstance
  )
}

onMounted(async () => {
  await nextTick()
  updateChart()
})

watch([totalLength, activeUsers, inActiveUsers, adminUsers], () => {
  updateChart()
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<template>
  <div class="container">
    <h2 class="header">Dashboard</h2>
    <div class="data">
      <div class="total-users item">
        <div class="number">
          <div class="title">Total Users</div>
          <h1 class="digit">{{ totalLength }}</h1>
        </div>
        <div class="icon">
          <el-avatar size="large">
            <i-ep-user id="icon"></i-ep-user>
          </el-avatar>
        </div>
      </div>
      <div class="active-users item">
        <div class="number">
          <div class="title">Active Users</div>
          <h1 class="digit">{{ activeUsers }}</h1>
        </div>
        <div class="icon">
          <el-avatar size="large">
            <i-ep-user id="icon"></i-ep-user>
          </el-avatar>
        </div>
      </div>
      <div class="inactive-users item">
        <div class="number">
          <div class="title">Inactive Users</div>
          <h1 class="digit">{{ inActiveUsers }}</h1>
        </div>
        <div class="icon">
          <el-avatar size="large">
            <i-ep-user id="icon"></i-ep-user>
          </el-avatar>
        </div>
      </div>
      <div class="admin-accounts item">
        <div class="number">
          <div class="title">Admin Accounts</div>
          <h1 class="digit">{{ adminUsers }}</h1>
        </div>
        <div class="icon">
          <el-avatar size="large">
            <i-ep-user id="icon"></i-ep-user>
          </el-avatar>
        </div>
      </div>
    </div>
    <div id="visualize-data" ref="chartDom"> </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 15px;
  color: var(--app-text);
}

.header {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--app-border);
  color: var(--app-text);
}

.data {
  margin: 30px 0;
  display: grid;
  height: 50%;
  /* 两种写法都是一样的效果 */
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: 20px;
}

.data>div {
  color: var(--app-text);
}

.item {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  color: var(--app-text-muted);
}

.digit {
  color: var(--app-primary);
}

.total-users {
  background-color: #eff6ff;
}

.active-users {
  background-color: #ecfdf5;
}

.inactive-users {
  background-color: #fff7ed;
}

.admin-accounts {
  background-color: #f5f3ff;
}

.total-users .digit {
  color: #1d4ed8;
}

.active-users .digit {
  color: #0f766e;
}

.inactive-users .digit {
  color: #b45309;
}

.admin-accounts .digit {
  color: #6d28d9;
}

#icon {
  width: 100%;
  height: 100%;
  color: currentColor;
}

.total-users :deep(.el-avatar) {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.active-users :deep(.el-avatar) {
  background-color: #d1fae5;
  color: #0f766e;
}

.inactive-users :deep(.el-avatar) {
  background-color: #ffedd5;
  color: #b45309;
}

.admin-accounts :deep(.el-avatar) {
  background-color: #ede9fe;
  color: #6d28d9;
}

#visualize-data {
  background-color: var(--app-surface);
  flex: 1;
}
</style>
