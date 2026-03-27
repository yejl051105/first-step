<!-- <script setup></script>

<template>
<h1>dashboar</h1>

</template>

<style scoped></style> -->


<template>
  <el-table :data="tableData" style="width: 100%">
    <!-- 基础数据列 -->
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    
    <!-- 可筛选列 (例如：状态筛选) -->
    <el-table-column
      prop="state"
      label="State"
      width="100"
      :filters="[
        { text: '成功', value: 'success' },
        { text: '失败', value: 'fail' },
      ]"
      :filter-method="filterState"
      filter-placement="bottom-end"
    >
      <!-- 可选：使用插槽自定义状态显示样式 -->
      <template #default="scope">
        <el-tag :type="scope.row.state === 'success' ? 'success' : 'danger'">
          {{ scope.row.state }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
// 定义数据格式
interface User {
  date: string
  name: string
  state: string
}

const tableData: User[] = [
  { date: '2024-03-24', name: 'Tom', state: 'success' },
  { date: '2024-03-25', name: 'Jerry', state: 'fail' },
  { date: '2024-03-26', name: 'Spike', state: 'success' },
]

// 筛选逻辑函数
const filterState = (value: string, row: User) => {
  return row.state === value
}
</script>
