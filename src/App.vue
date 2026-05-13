<template>
  <Button @click="isVisble = !isVisble">{{
    isVisble ? "hide" : "show"
  }}</Button>
  <Drawer v-model="isVisble" title="标题" placement="bottom">
    <template #header>Header</template>
    <template #default>Main</template>
    <template #footer>Footer</template>
  </Drawer>
</template>

<script setup>
import { ref } from "vue"
import Button from "./components/Button.vue"
import Drawer from "./components/Drawer.vue"

const isVisble = ref(false)
</script>
