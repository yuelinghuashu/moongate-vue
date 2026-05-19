<template>
  <div
    ref="triggerRef"
    v-bind="$attrs"
    class="mg-popover-trigger"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <!--
      触发元素插槽
      支持通过 #trigger 自定义触发内容，否则使用默认插槽
    -->
    <slot name="trigger">
      <slot />
    </slot>

    <!-- 使用 Teleport 将弹出层挂载到 body，避免被父容器裁剪 -->
    <Teleport to="body">
      <div
        v-if="visible"
        ref="popoverRef"
        class="mg-popover"
        :class="[
          `mg-popover-${currentPlacement}`,
          { 'mg-popover-visible': visible },
        ]"
        :style="popoverStyle"
        @mouseenter="cancelHideTimer"
        @mouseleave="startHideTimer"
      >
        <!-- 内容插槽 -->
        <slot name="content" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue"

// ==================== 类型定义 ====================
/**
 * 弹出位置
 * - top: 上方
 * - bottom: 下方
 * - left: 左侧
 * - right: 右侧
 */
type Placement = "top" | "bottom" | "left" | "right"

/**
 * 组件 Props 接口
 */
interface Props {
  /** 弹出位置，默认 bottom */
  placement?: Placement
  /** 显示延迟（毫秒），避免鼠标划过时误弹，默认 0 */
  delay?: number
  /** 隐藏延迟（毫秒），方便移入内容区，默认 100 */
  hideDelay?: number
  /** 与触发元素的偏移量（像素），默认 8 */
  offset?: number
}

// ==================== Props 默认值 ====================
const props = withDefaults(defineProps<Props>(), {
  placement: "bottom",
  delay: 0,
  hideDelay: 100,
  offset: 8,
})

// ==================== 响应式状态 ====================
/** 弹出层是否可见 */
const visible = ref(false)

/** 显示延时定时器 */
let showTimer: ReturnType<typeof setTimeout> | null = null
/** 隐藏延时定时器 */
let hideTimer: ReturnType<typeof setTimeout> | null = null

/** 触发元素的 DOM 引用 */
const triggerRef = ref<HTMLElement | null>(null)
/** 弹出层元素的 DOM 引用 */
const popoverRef = ref<HTMLElement | null>(null)

/** 当前实际使用的弹出位置（可能因翻转而改变） */
const currentPlacement = ref<Placement>(props.placement)

/** 弹出层的位置坐标（相对于视口） */
const popoverPosition = ref({ top: 0, left: 0 })

/** 弹出层的动态样式，用于固定定位 */
const popoverStyle = computed(() => ({
  top: `${popoverPosition.value.top}px`,
  left: `${popoverPosition.value.left}px`,
}))

// ==================== 定时器管理 ====================
/** 清除所有定时器 */
const clearTimers = () => {
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
}

/** 取消隐藏定时器（鼠标移入内容区时调用） */
const cancelHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

/** 启动隐藏定时器（鼠标离开内容区或触发区时调用） */
const startHideTimer = () => {
  cancelHideTimer()
  hideTimer = setTimeout(() => {
    visible.value = false
  }, props.hideDelay)
}

// ==================== 显示/隐藏逻辑 ====================
/**
 * 显示弹出层
 * 延迟后设置 visible=true，并在下一帧更新位置
 */
const show = () => {
  clearTimers()
  cancelHideTimer()
  showTimer = setTimeout(async () => {
    visible.value = true
    await nextTick()
    updatePosition()
  }, props.delay)
}

/**
 * 隐藏弹出层
 * 清除显示定时器，并启动隐藏延迟
 */
const hide = () => {
  clearTimers()
  startHideTimer()
}

/** 鼠标进入触发元素时显示 */
const onMouseEnter = () => show()

/** 鼠标离开触发元素时开始隐藏倒计时 */
const onMouseLeave = () => startHideTimer()

// ==================== 位置计算核心 ====================
/**
 * 根据当前放置方向重新计算位置（用于翻转后的修正）
 * @param placement 目标放置方向
 * @param triggerRect 触发元素的边界矩形
 * @param popoverRect 弹出层的边界矩形
 */
const recalculatePosition = (
  placement: Placement,
  triggerRect: DOMRect,
  popoverRect: DOMRect,
) => {
  let top = 0
  let left = 0
  switch (placement) {
    case "top":
      top = triggerRect.top - popoverRect.height - props.offset
      left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2
      break
    case "bottom":
      top = triggerRect.bottom + props.offset
      left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2
      break
    case "left":
      top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2
      left = triggerRect.left - popoverRect.width - props.offset
      break
    case "right":
      top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2
      left = triggerRect.right + props.offset
      break
  }
  popoverPosition.value = { top, left }
}

/**
 * 更新弹出层位置（支持自动翻转和边界修正）
 */
const updatePosition = () => {
  if (!triggerRef.value || !popoverRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const popoverRect = popoverRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let top = 0
  let left = 0
  let finalPlacement = props.placement

  // 1. 根据期望方向计算初始位置，并检测是否超出视口
  switch (props.placement) {
    case "top":
      top = triggerRect.top - popoverRect.height - props.offset
      left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2
      if (top < 0) finalPlacement = "bottom"
      break
    case "bottom":
      top = triggerRect.bottom + props.offset
      left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2
      if (top + popoverRect.height > viewportHeight) finalPlacement = "top"
      break
    case "left":
      top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2
      left = triggerRect.left - popoverRect.width - props.offset
      if (left < 0) finalPlacement = "right"
      break
    case "right":
      top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2
      left = triggerRect.right + props.offset
      if (left + popoverRect.width > viewportWidth) finalPlacement = "left"
      break
  }

  // 2. 如果需要翻转方向，重新计算位置
  if (finalPlacement !== props.placement) {
    currentPlacement.value = finalPlacement
    recalculatePosition(finalPlacement, triggerRect, popoverRect)
    top = popoverPosition.value.top
    left = popoverPosition.value.left
  } else {
    currentPlacement.value = props.placement
    popoverPosition.value = { top, left }
  }

  // 3. 边界修正（确保弹出层完全在视口内，不超出边缘）
  const finalRect = popoverRef.value.getBoundingClientRect()
  let finalTop = top
  let finalLeft = left

  // 水平方向修正
  if (finalLeft < 0) {
    finalLeft = 0
  } else if (finalLeft + finalRect.width > viewportWidth) {
    finalLeft = viewportWidth - finalRect.width
  }

  // 垂直方向修正
  if (finalTop < 0) {
    finalTop = 0
  } else if (finalTop + finalRect.height > viewportHeight) {
    finalTop = viewportHeight - finalRect.height
  }

  popoverPosition.value = { top: finalTop, left: finalLeft }
}

// ==================== 事件监听与生命周期 ====================
/**
 * 滚动时更新位置
 */
const handleScroll = () => {
  if (visible.value) updatePosition()
}

/**
 * 窗口大小变化时更新位置
 */
const handleResize = () => {
  if (visible.value) updatePosition()
}

let observer: MutationObserver | null = null

onMounted(() => {
  // 监听滚动和窗口大小变化
  window.addEventListener("scroll", handleScroll, true)
  window.addEventListener("resize", handleResize)

  // 监听 DOM 变化（例如内容变动导致尺寸改变）
  observer = new MutationObserver(() => {
    if (visible.value) updatePosition()
  })
  observer.observe(document.body, { childList: true, subtree: true })
})

onUnmounted(() => {
  // 清理事件监听和 MutationObserver
  window.removeEventListener("scroll", handleScroll, true)
  window.removeEventListener("resize", handleResize)
  if (observer) observer.disconnect()
  clearTimers()
})
</script>
