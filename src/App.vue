<script setup lang="ts">
import { useForm } from 'moongate-vue'

// 模拟远程检查用户名是否已存在
const checkUsernameUnique = async (username: string) => {
  if (!username) return '请输入用户名'
  await new Promise((resolve) => setTimeout(resolve, 300))
  return username === 'admin' ? '该用户名已被占用' : true
}

const { values, errors, isValidating, validateField } = useForm({
  initialValues: { username: '' },
  rules: {
    username: checkUsernameUnique,
  },
})

// 失焦时触发单字段校验
const handleBlur = () => validateField('username')
</script>

<template>
  <div>
    <Input
      v-model="values.username"
      placeholder="输入用户名检测是否可用"
      :error="!!errors.username"
      @blur="handleBlur"
    />
    <span v-if="isValidating" style="font-size: 12px; color: var(--ui-text-dim)">检测中…</span>
    <span v-else-if="errors.username" style="color: var(--ui-error); font-size: 12px">
      {{ errors.username }}
    </span>
  </div>
</template>
