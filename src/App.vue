<template>
  <!-- <Card class="mt-4">
    <template #header>Header</template>
    <template #default>Default</template>
    <template #footer>Footer</template>
  </Card> -->

  <Button @click="isVisble = !isVisble">Click</Button>
  <Drawer v-model="isVisble">
  </Drawer>
</template>

<script setup>
import { ref } from "vue"
import Card from "./components/Card.vue"
import Drawer from "./components/Drawer.vue"
import Button from "./components/Button.vue"

const isVisble = ref(false)
</script>

<style>
.mt-4 {
  margin-top: 5rem;
}

.border {
  border: 1px solid red;
}
</style>
