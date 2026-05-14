<template>

  <Card style="margin-top: 5px;" hide-footer>
    <template #header>Header</template>
    <template #default>Default</template>
    <template #footer>Footer</template>
  </Card>
</template>

<script setup>
import { ref } from "vue"
import Card from "./components/Card.vue"

const isVisble = ref(false)
</script>
