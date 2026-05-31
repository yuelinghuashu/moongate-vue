<template>
  <!-- 默认：显示首尾页按钮 -->
  <Pagination v-model:current-page="page" :total-pages="50" size="ms" />

  <!-- 隐藏快速跳转按钮 -->
  <Pagination
    v-model:current-page="page"
    :total-pages="50"
    :show-quick-jump="false"
  />

  <!-- 自定义快速跳转按钮文字 -->
  <Pagination
    v-model:current-page="page"
    :total-pages="50"
    first-text="⏮"
    last-text="⏭"
  />

  <!-- 中文环境 -->
  <Pagination
    v-model:current-page="page"
    :total-pages="50"
    prev-text="上一页"
    next-text="下一页"
    first-text="首页"
    last-text="尾页"
  />
</template>

<script setup>
import { ref, computed } from "vue"
import Pagination from "./components/Pagination.vue"

const page = ref(1) // 当前页码
const total = ref(50) // 总页数
</script>
