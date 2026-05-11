<script setup>
defineProps({
  searchMessage: { type: Object, required: true },
})

const emit = defineEmits(['search', 'reset', 'enter', 'role-change', 'open-add'])
</script>

<template>
  <div class="table-header">
    <div class="keyWord">
      <span class="title">Search:</span>
      <el-input placeholder="keyWord" @keyup.enter="$emit('enter')" v-model="searchMessage.keyWord"></el-input>
      <el-button @click="$emit('reset')">reset</el-button>
      <el-button @click="$emit('open-add')">Add User</el-button>
    </div>
    <div class="role">
      <span class="title">Role:</span>
      <el-dropdown split-button trigger="click" @command="(cmd) => $emit('role-change', cmd)">
        {{ searchMessage.role }}
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="All">All</el-dropdown-item>
            <el-dropdown-item command="User">User</el-dropdown-item>
            <el-dropdown-item command="Admin">Admin</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="search">
      <el-button @click="$emit('search')">Search</el-button>
    </div>
  </div>
</template>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  color: var(--app-text);
}

.title {
  margin-right: 5px;
  color: var(--app-text-muted);
}

.keyWord {
  display: flex;
  align-items: center;
}

.role {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search {
  display: flex;
  align-items: center;
}

.keyWord :deep(.el-button:nth-of-type(1)) {
  background-color: #eef2f7;
  border-color: var(--app-border);
  color: var(--app-text-muted);
}

.keyWord :deep(.el-button:nth-of-type(2)),
.search :deep(.el-button) {
  background-color: var(--app-primary);
  border-color: var(--app-primary);
  color: #ffffff;
}

.keyWord :deep(.el-button:nth-of-type(2)):hover,
.search :deep(.el-button):hover {
  background-color: #1e40af;
  border-color: #1e40af;
}
</style>
