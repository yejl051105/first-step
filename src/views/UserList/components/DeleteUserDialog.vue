<script setup>
defineProps({
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])
</script>

<template>
  <el-dialog :model-value="visible" @update:model-value="(val) => emit('update:visible', val)"
    title="Delete User" width="500" align-center>
    <span>Are you sure to delete this user?</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('cancel')">No</el-button>
        <el-button type="primary" @click="$emit('confirm')">Yes</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-footer :deep(.el-button:not(.el-button--primary)) {
  background-color: #eef2f7;
  border-color: var(--app-border);
  color: var(--app-text-muted);
}
</style>
