<script setup lang="ts">
import Table from './components/Table.vue'
const columns = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色' },
]

const users: { name: string; email: string; role: string }[] = []
</script>

<template>
  <Table :columns="columns" :data="users" />
</template>
