<script setup>
defineProps({
  tableList: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  searchMessage: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete', 'page-change'])
</script>

<template>
  <div class="table">
    <el-table :data="tableList" style="width: 100%;" stripe>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="Username" prop="username"></el-table-column>
      <el-table-column label="Email" prop="email"></el-table-column>
      <el-table-column label="Role" prop="role"></el-table-column>
      <el-table-column label="Status" prop="status"></el-table-column>
      <el-table-column label="Edit">
        <template #default="scope">
          <el-button size="small" @click="$emit('edit', scope.$index, scope.row)">
            Edit
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="Oporate">
        <template #default="scope">
          <el-button size="small" @click="$emit('delete', scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <div style="width: 100%; height: 100%;">数据为空</div>
      </template>
    </el-table>

    <div class="pagination">
      <el-pagination background layout="prev, pager, next"
        :page-size="searchMessage.pageSize"
        :total="total"
        @current-change="(page) => $emit('page-change', page)"
        v-model:current-page="searchMessage.currentPage" />
      <div class="records">Total:{{ total }} records</div>
    </div>
  </div>
</template>

<style scoped>
.table {
  margin-top: 20px;
  --el-table-border-color: var(--app-border);
  --el-table-header-bg-color: var(--app-surface-soft);
  --el-table-header-text-color: var(--app-text);
  --el-table-text-color: var(--app-text);
  --el-table-tr-bg-color: var(--app-surface);
  --el-table-row-hover-bg-color: #f8fbff;
  --el-table-current-row-bg-color: #eef4ff;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 20px;
  margin-top: 35px;
  border-top: 1px solid var(--app-border);
  color: var(--app-text-muted);
}

.records {
  margin-left: 10px;
  color: var(--app-text-muted);
}

.table :deep(.el-table__empty-text) {
  color: var(--app-text-muted);
}
</style>
