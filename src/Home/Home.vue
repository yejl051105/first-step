<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
    <!-- 1. prop 绑定规则字段 -->
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// 表单对象
const form = reactive({ username: '' })
const formRef = ref<FormInstance>()

// 2. 定义校验规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
  ],
})

// 3. 提交表单时校验
const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      console.log(valid,fields)
      console.log('校验通过!')
    } else {
      console.log(valid)
      console.log('校验失败!', fields)
    }
  })
}
</script>
