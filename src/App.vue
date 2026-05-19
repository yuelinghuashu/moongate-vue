<template>
  <Container size="lg">
    <!-- 启用自动高度 -->
    <Textarea
      v-model="comment"
      auto-resize
      placeholder="支持多行输入，高度会自动增长"
    />

    <!-- 固定行数（默认行为） -->
    <Textarea v-model="content" :rows="5" placeholder="固定 5 行高度" />
  </Container>
</template>

<script setup>
import { ref } from "vue"
import Textarea from "./components/Textarea.vue"

const content = ref('Learn Vue')
</script>

