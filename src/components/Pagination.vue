<template>
  <nav
    v-bind="$attrs"
    class="mg-pagination"
    :class="`mg-pagination-${size}`"
    :aria-label="`第 ${currentPage} 页，共 ${totalPages} 页`"
  >
    <!-- 上一页 -->
    <button
      class="mg-pagination-btn"
      :disabled="currentPage === 1"
      aria-label="上一页"
      @click="goToPrev"
    >
      上一页
    </button>

    <!-- 编辑模式：输入框 -->
    <input
      v-if="isEditing"
      ref="inputRef"
      v-model="inputPage"
      type="number"
      class="mg-pagination-input"
      :min="1"
      :max="totalPages"
      @blur="commitJump"
      @keyup.enter="commitJump"
    />

    <!-- 显示模式：可点击的数字 -->
    <span v-else class="mg-pagination-current" @click="startEdit">
      {{ currentPage }}
    </span>

    <span class="mg-pagination-sep">/</span>
    <span class="mg-pagination-total">{{ totalPages }}</span>

    <!-- 下一页 -->
    <button
      class="mg-pagination-btn"
      :disabled="currentPage === totalPages"
      aria-label="下一页"
      @click="goToNext"
    >
      下一页
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"

type Size = "sm" | "md" | "lg"

interface Props {
  currentPage: number
  totalPages: number
  size?: Size
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
})

const emit = defineEmits<{
  "update:currentPage": [page: number]
  change: [page: number]
}>()

const isEditing = ref(false)
const inputPage = ref(props.currentPage)
const inputRef = ref<HTMLInputElement | null>(null)

const goToPage = (page: number) => {
  let newPage = page
  if (newPage < 1) newPage = 1
  if (newPage > props.totalPages) newPage = props.totalPages
  if (newPage === props.currentPage) return
  emit("update:currentPage", newPage)
  emit("change", newPage)
}

const goToPrev = () => {
  if (props.currentPage > 1) {
    goToPage(props.currentPage - 1)
  }
}

const goToNext = () => {
  if (props.currentPage < props.totalPages) {
    goToPage(props.currentPage + 1)
  }
}

const startEdit = () => {
  isEditing.value = true
  inputPage.value = props.currentPage
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

const commitJump = () => {
  isEditing.value = false
  const newPage = parseInt(String(inputPage.value), 10)
  if (!isNaN(newPage)) {
    goToPage(newPage)
  }
}
</script>
