<template>
  <Table :columns="columns" :data="users" fixed-header max-height="400px" />
</template>

<script lang="ts" setup>
import { ref } from "vue"
import Table from "./components/Table.vue"

const columns = ref([
  { key: "id", title: "ID" },
  { key: "name", title: "Name" },
  { key: "age", title: "Age" },
  { key: "email", title: "Email" },
])

const users = ref([
  { id: 1, name: "John Doe", age: 30, email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", age: 25, email: "jane.smith@example.com" },
  { id: 3, name: "Alice Johnson", age: 35, email: "alice.johnson@example.com" },
  { id: 4, name: "Bob Brown", age: 40, email: "bob.brown@example.com" },
])
</script>
