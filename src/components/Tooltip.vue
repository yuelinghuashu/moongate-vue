<template>
  <div
    ref="triggerRef"
    v-bind="attrsWithoutClass"
    :class="['mg-tooltip-trigger', mergedClass]"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <slot name="trigger">
      <slot />
    </slot>

    <Teleport to="body">
      <div
        v-if="visible"
        ref="tooltipRef"
        class="mg-tooltip"
        :class="[
          { 'mg-tooltip-visible': visible },
          `mg-tooltip-${currentPlacement}`,
        ]"
        :style="tooltipStyle"
        role="tooltip"
      >
        <slot name="content">
          {{ content }}
        </slot>
        <div
          class="mg-tooltip-arrow"
          :class="`mg-tooltip-arrow-${currentPlacement}`"
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Tooltip', inheritAttrs: false })

import { ref, computed, onUnmounted, onMounted } from 'vue'
import { useAttrsWithClass } from '../composables/useAttrsWithClass'

// ==================== 类型定义 ====================

/** 提示框位置 */
type Placement = 'top' | 'bottom' | 'left' | 'right'

/** 组件 Props 接口 */
interface Props {
  /** 提示内容 */
  content?: string
  /** 提示框位置，默认 top */
  placement?: Placement
  /** 显示延迟时间（毫秒），避免鼠标划过时误弹，默认 0 */
  delay?: number
  /** 提示框与触发元素的偏移量（像素），默认 8 */
  offset?: number
}

// ==================== Props ====================

const props = withDefaults(defineProps<Props>(), {
  content: '',
  placement: 'top',
  delay: 0,
  offset: 8,
})

// ==================== SSR 环境判断 ====================

/** 是否在浏览器环境（SSR 安全） */
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

// ==================== 响应式状态 ====================

/** 提示框是否可见 */
const visible = ref(false)

/** 显示延时定时器 */
let timer: ReturnType<typeof setTimeout> | null = null

/** 触发元素的 DOM 引用 */
const triggerRef = ref<HTMLElement | null>(null)
/** 提示框元素的 DOM 引用 */
const tooltipRef = ref<HTMLElement | null>(null)

/** 当前实际使用的提示位置（可能因翻转而改变） */
const currentPlacement = ref<Placement>(props.placement)
/** 提示框的位置坐标（相对于视口） */
const tooltipPosition = ref({ top: 0, left: 0 })

/** 提示框的动态样式（固定定位） */
const tooltipStyle = computed(() => ({
  top: `${tooltipPosition.value.top}px`,
  left: `${tooltipPosition.value.left}px`,
}))

// ==================== 属性透传 ====================

// 处理外部属性透传（无内部动态类，仅合并外部 class）
const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({}))

// ==================== 显示/隐藏逻辑 ====================

/**
 * 显示提示框
 * 延迟后设置 visible=true，并更新位置
 */
const show = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    visible.value = true
    updatePosition()
  }, props.delay)
}

/**
 * 隐藏提示框
 * 清除定时器，立即隐藏
 */
const hide = () => {
  if (timer) clearTimeout(timer)
  visible.value = false
}

// ==================== 位置计算核心 ====================

/**
 * 根据目标方向重新计算位置（用于翻转后的修正）
 * @param placement - 目标放置方向
 * @param triggerRect - 触发元素的边界矩形
 * @param tooltipRect - 提示框的边界矩形
 */
const recalculatePosition = (
  placement: Placement,
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
) => {
  let top = 0
  let left = 0

  switch (placement) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - props.offset
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'bottom':
      top = triggerRect.bottom + props.offset
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.left - tooltipRect.width - props.offset
      break
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.right + props.offset
      break
  }

  tooltipPosition.value = { top, left }
}

/**
 * 更新提示框位置
 * 支持自动翻转和边界修正，确保提示框始终在视口内
 */
const updatePosition = () => {
  // SSR 环境或 DOM 未准备好时跳过
  if (!isBrowser || !triggerRef.value || !tooltipRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let top = 0
  let left = 0
  let finalPlacement = props.placement

  // 1. 根据期望方向计算初始位置，并检测是否超出视口
  switch (props.placement) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - props.offset
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      if (top < 0) finalPlacement = 'bottom'
      break
    case 'bottom':
      top = triggerRect.bottom + props.offset
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      if (top + tooltipRect.height > viewportHeight) finalPlacement = 'top'
      break
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.left - tooltipRect.width - props.offset
      if (left < 0) finalPlacement = 'right'
      break
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.right + props.offset
      if (left + tooltipRect.width > viewportWidth) finalPlacement = 'left'
      break
  }

  // 2. 如果需要翻转方向，重新计算位置
  if (finalPlacement !== props.placement) {
    currentPlacement.value = finalPlacement
    recalculatePosition(finalPlacement, triggerRect, tooltipRect)
    return
  }

  // 3. 使用计算后的位置
  currentPlacement.value = props.placement
  tooltipPosition.value = { top, left }
}

// ==================== 事件监听与生命周期 ====================

/** 滚动时更新提示框位置 */
const handleScroll = () => {
  if (visible.value) updatePosition()
}

/** 窗口大小变化时更新提示框位置 */
const handleResize = () => {
  if (visible.value) updatePosition()
}

/** DOM 变化观察器（监听内容变动导致尺寸改变） */
let observer: MutationObserver | null = null

onMounted(() => {
  // 只在浏览器环境执行
  if (!isBrowser) return

  window.addEventListener('scroll', handleScroll, true)
  window.addEventListener('resize', handleResize)

  // 监听 DOM 变化，内容变动时自动更新位置
  observer = new MutationObserver(() => {
    if (visible.value) updatePosition()
  })
  observer.observe(document.body, { childList: true, subtree: true })
})

onUnmounted(() => {
  // 只在浏览器环境执行清理
  if (!isBrowser) return

  window.removeEventListener('scroll', handleScroll, true)
  window.removeEventListener('resize', handleResize)

  if (observer) {
    observer.disconnect()
    observer = null
  }

  if (timer) clearTimeout(timer)
})
</script>