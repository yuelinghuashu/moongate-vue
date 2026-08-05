<template>
  <div>
    <Button @click="visible = !visible"></Button>
    <Drawer v-model="visible" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Button from './components/Button.vue'
import Drawer from './components/Drawer.vue'
import { useToast } from './composables/useToast'

const visible = ref(false)

const toast = useToast()
for (let i = 0; i < 10; i++) {
  toast.success(`Success ${i + 1}`)
}
</script>
