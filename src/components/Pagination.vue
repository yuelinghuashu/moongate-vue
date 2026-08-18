<template>
  <nav
    v-bind="$attrs"
    class="mg-pagination"
    :class="`mg-pagination-${size}`"
    :aria-label="pageInfoLabel"
  >
    <!-- 跳转到第一页 -->
    <button
      v-if="showQuickJump"
      class="mg-pagination-btn"
      :disabled="currentPage === 1"
      :aria-label="firstTextValue"
      @click="goToFirst"
    >
      {{ firstTextValue }}
    </button>

    <!-- 上一页 -->
    <button
      class="mg-pagination-btn"
      :disabled="currentPage === 1"
      :aria-label="prevTextValue"
      @click="goToPrev"
    >
      {{ prevTextValue }}
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
      :aria-label="pageInfoLabel"
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
      :aria-label="nextTextValue"
      @click="goToNext"
    >
      {{ nextTextValue }}
    </button>

    <!-- 跳转到最后一页 -->
    <button
      v-if="showQuickJump"
      class="mg-pagination-btn"
      :disabled="currentPage === totalPages"
      :aria-label="lastTextValue"
      @click="goToLast"
    >
      {{ lastTextValue }}
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import type { PaginationProps } from '../types/props'
import { formatTemplate, useTexts } from '../config'

defineOptions({ name: 'Pagination', inheritAttrs: false })

const props = withDefaults(defineProps<PaginationProps>(), {
  size: 'md',
  showQuickJump: true,
})

/** v-model 双向绑定（当前页码）*/
const currentPage = defineModel<number>({ required: true })

const emit = defineEmits<{
  /** 页码变化时触发 */
  change: [page: number]
}>()

/** 全局文案（响应式） */
const texts = useTexts()

/** 最终生效文案：prop > 全局配置 */
const prevTextValue = computed(() => props.prevText ?? texts.value.paginationPrev)
const nextTextValue = computed(() => props.nextText ?? texts.value.paginationNext)
const firstTextValue = computed(() => props.firstText ?? texts.value.paginationFirst)
const lastTextValue = computed(() => props.lastText ?? texts.value.paginationLast)

/** 页码信息 aria-label：模板 + 当前页/总页数 */
const pageInfoLabel = computed(() =>
  formatTemplate(texts.value.paginationPageInfo, {
    current: currentPage.value,
    total: props.totalPages,
  }),
)

const isEditing = ref(false)
const inputPage = ref(currentPage.value)
const inputRef = ref<HTMLInputElement | null>(null)

/**
 * 跳转到指定页码
 * @param page - 目标页码
 */
const goToPage = (page: number) => {
  let newPage = page
  if (newPage < 1) newPage = 1
  if (newPage > props.totalPages) newPage = props.totalPages
  if (newPage === currentPage.value) return
  currentPage.value = newPage
  emit('change', newPage)
}

/**
 * 上一页
 */
const goToPrev = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

/**
 * 下一页
 */
const goToNext = () => {
  if (currentPage.value < props.totalPages) {
    goToPage(currentPage.value + 1)
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
 * 点击当前页码数字时，切换为输入框模式
 */
const startEdit = () => {
  isEditing.value = true
  inputPage.value = currentPage.value
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

/**
 * 提交跳转
 * 输入框失去焦点或按下回车时，校验并跳转
 */
const commitJump = () => {
  isEditing.value = false
  const newPage = parseInt(String(inputPage.value), 10)

  if (isNaN(newPage)) {
    inputPage.value = currentPage.value
    return
  }

  goToPage(newPage)
}
</script>
