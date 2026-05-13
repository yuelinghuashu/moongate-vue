<template>
  <div
    ref="triggerRef"
    class="mg-tooltip-trigger"
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
import { ref, computed, onUnmounted, onMounted } from "vue"

type Placement = "top" | "bottom" | "left" | "right"

interface Props {
  content?: string
  placement?: Placement
  delay?: number
  offset?: number
}

const props = withDefaults(defineProps<Props>(), {
  content: "",
  placement: "top",
  delay: 0,
  offset: 8,
})

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const currentPlacement = ref<Placement>(props.placement)

const tooltipStyle = computed(() => ({
  top: `${tooltipPosition.value.top}px`,
  left: `${tooltipPosition.value.left}px`,
}))

const tooltipPosition = ref({ top: 0, left: 0 })

const show = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    visible.value = true
    updatePosition()
  }, props.delay)
}

const hide = () => {
  if (timer) clearTimeout(timer)
  visible.value = false
}

const updatePosition = () => {
  if (!triggerRef.value || !tooltipRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()

  let top = 0
  let left = 0
  let finalPlacement = props.placement

  // 计算位置，如果超出视口则自动调整
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  switch (props.placement) {
    case "top":
      top = triggerRect.top - tooltipRect.height - props.offset
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      if (top < 0) finalPlacement = "bottom"
      break
    case "bottom":
      top = triggerRect.bottom + props.offset
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      if (top + tooltipRect.height > viewportHeight) finalPlacement = "top"
      break
    case "left":
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.left - tooltipRect.width - props.offset
      if (left < 0) finalPlacement = "right"
      break
    case "right":
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.right + props.offset
      if (left + tooltipRect.width > viewportWidth) finalPlacement = "left"
      break
  }

  // 如果位置被调整，重新计算一次
  if (finalPlacement !== props.placement) {
    currentPlacement.value = finalPlacement
    recalculatePosition(finalPlacement, triggerRect, tooltipRect)
    return
  }

  currentPlacement.value = props.placement
  tooltipPosition.value = { top, left }
}

const recalculatePosition = (
  placement: Placement,
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
) => {
  let top = 0
  let left = 0

  switch (placement) {
    case "top":
      top = triggerRect.top - tooltipRect.height - props.offset
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case "bottom":
      top = triggerRect.bottom + props.offset
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case "left":
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.left - tooltipRect.width - props.offset
      break
    case "right":
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.right + props.offset
      break
  }

  tooltipPosition.value = { top, left }
}

// 监听滚动和窗口大小变化，更新位置
const handleScroll = () => {
  if (visible.value) {
    updatePosition()
  }
}

const handleResize = () => {
  if (visible.value) {
    updatePosition()
  }
}

// 使用 MutationObserver 监听 DOM 变化
let observer: MutationObserver | null = null

onMounted(() => {
  window.addEventListener("scroll", handleScroll, true)
  window.addEventListener("resize", handleResize)

  // 监听 DOM 变化，更新位置
  observer = new MutationObserver(() => {
    if (visible.value) {
      updatePosition()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll, true)
  window.removeEventListener("resize", handleResize)
  if (observer) {
    observer.disconnect()
  }
  if (timer) clearTimeout(timer)
})
</script>
