<template>
  <div>
    <Button @click="visible = !visible"></Button>
    <Drawer v-model="visible" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import Button from "./components/Button.vue"
import Drawer from "./components/Drawer.vue"
import Toast from "components/Toast.vue"
import { useToast } from "./composables/useToast"

const visible = ref(false)

const toast = useToast()
toast.success("这是一条成功消息")
</script>
