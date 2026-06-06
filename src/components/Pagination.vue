<template>
  <nav
    v-bind="$attrs"
    class="mg-pagination"
    :class="`mg-pagination-${size}`"
    :aria-label="`第 ${currentPage} 页，共 ${totalPages} 页`"
  >
    <!-- 跳转到第一页 -->
    <button
      v-if="showQuickJump"
      class="mg-pagination-btn"
      :disabled="currentPage === 1"
      :aria-label="firstText"
      @click="goToFirst"
    >
      {{ firstText }}
    </button>

    <!-- 上一页 -->
    <button
      class="mg-pagination-btn"
      :disabled="currentPage === 1"
      :aria-label="prevText"
      @click="goToPrev"
    >
      {{ prevText }}
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
      :aria-label="nextText"
      @click="goToNext"
    >
      {{ nextText }}
    </button>

    <!-- 跳转到最后一页 -->
    <button
      v-if="showQuickJump"
      class="mg-pagination-btn"
      :disabled="currentPage === totalPages"
      :aria-label="lastText"
      @click="goToLast"
    >
      {{ lastText }}
    </button>
  </nav>
</template>

<script setup lang="ts">
defineOptions({ name: "Pagination", inheritAttrs: false })


import { ref, nextTick } from "vue"

type Size = "sm" | "md" | "lg"

interface Props {
  /** 当前页码 */
  currentPage: number
  /** 总页数 */
  totalPages: number
  /** 尺寸 */
  size?: Size
  /** 上一页按钮文字 */
  prevText?: string
  /** 下一页按钮文字 */
  nextText?: string
  /** 是否显示快速跳转按钮（首尾页） */
  showQuickJump?: boolean
  /** 第一页按钮文字 */
  firstText?: string
  /** 最后一页按钮文字 */
  lastText?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  prevText: "上一页",
  nextText: "下一页",
  showQuickJump: true,
  firstText: "«",
  lastText: "»",
})

const emit = defineEmits<{
  "update:currentPage": [page: number]
  change: [page: number]
}>()

const isEditing = ref(false)
const inputPage = ref(props.currentPage)
const inputRef = ref<HTMLInputElement | null>(null)

/**
 * 跳转到指定页码
 * @param page - 目标页码
 */
const goToPage = (page: number) => {
  let newPage = page
  if (newPage < 1) newPage = 1
  if (newPage > props.totalPages) newPage = props.totalPages
  if (newPage === props.currentPage) return
  emit("update:currentPage", newPage)
  emit("change", newPage)
}

/**
 * 上一页
 */
const goToPrev = () => {
  if (props.currentPage > 1) {
    goToPage(props.currentPage - 1)
  }
}

/**
 * 下一页
 */
const goToNext = () => {
  if (props.currentPage < props.totalPages) {
    goToPage(props.currentPage + 1)
  }
}

/**
 * 跳转到第一页
 */
const goToFirst = () => {
  goToPage(1)
}

/**
 * 跳转到最后一页
 */
const goToLast = () => {
  goToPage(props.totalPages)
}

/**
 * 开始编辑页码
 */
const startEdit = () => {
  isEditing.value = true
  inputPage.value = props.currentPage
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

/**
 * 提交跳转
 */
const commitJump = () => {
  isEditing.value = false
  const newPage = parseInt(String(inputPage.value), 10)

  if (isNaN(newPage)) {
    inputPage.value = props.currentPage
    return
  }

  goToPage(newPage)
}
</script>