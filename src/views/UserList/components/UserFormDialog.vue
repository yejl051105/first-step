<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  mode: { type: String, default: 'add', validator: v => ['add', 'edit'].includes(v) },
  initialData: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:visible', 'save', 'cancel'])

const formRef = ref(null)

// 工厂函数
const defaultForm = () => ({
  username: '',
  email: '',
  role: '',
  status: '',
  id: '',
  profile: '',
  pwd: '',
})

const formData = ref(defaultForm())

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度需在 3 到 15 个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

const title = ref('')

watch(() => props.visible, (val) => {
  if (val) {
    title.value = props.mode === 'edit' ? 'Edit User' : 'Add User'
    formData.value = props.mode === 'edit' && props.initialData?.id
      ? { ...defaultForm(), ...props.initialData }
      : defaultForm()
  }
})

const handleCancel = () => {
  formRef.value?.resetFields()
  emit('update:visible', false)
  emit('cancel')
}

const handleSave = async () => {
  try {
    await formRef.value.validate()
    emit('save', { ...formData.value })
  } catch {
    // 校验失败
  }
}
</script>

<template>
  <el-dialog :model-value="visible" @update:model-value="(val) => emit('update:visible', val)" :title="title"
    width="500" align-center :show-close="false">
    <el-form class="form-container" ref="formRef" :rules="rules" label-position="top" :model="formData">
      <el-form-item label="Username" prop="username">
        <el-input v-model="formData.username" maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="Role" prop="role">
        <el-select v-model="formData.role" placeholder="Select" style="width: 240px">
          <el-option value="User">User</el-option>
          <el-option value="Admin">Admin</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="Active">Active</el-radio>
          <el-radio value="Inactive">Inactive</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSave">Save</el-button>
        <el-button @click="handleCancel">Cancel</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.form-container {
  border-top: 1px solid var(--app-border);
  border-bottom: 1px solid var(--app-border);
  padding: 20px;
  color: var(--app-text);
}

.dialog-footer :deep(.el-button:not(.el-button--primary)) {
  background-color: #eef2f7;
  border-color: var(--app-border);
  color: var(--app-text-muted);
}
</style>
