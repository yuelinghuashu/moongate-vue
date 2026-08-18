<template>
  <div
    ref="triggerRef"
    v-bind="$attrs"
    class="mg-popover-trigger"
    @mouseenter="show"
    @mouseleave="startHideTimer"
    @focusin="show"
    @focusout="hide"
    @keydown.esc="hide"
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
        ref="floatingRef"
        class="mg-popover"
        :class="[`mg-popover-${currentPlacement}`, { 'mg-popover-visible': visible }]"
        :style="floatStyle"
        role="dialog"
        :aria-label="ariaLabel"
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
import { computed, useId, onMounted, onUnmounted } from 'vue'
import { useFloating } from '../composables/useFloating'
import type { PopoverProps } from '../types/props'

defineOptions({ name: 'Popover', inheritAttrs: false })

/** 弹出层唯一 ID（SSR 安全） */
const popoverId = useId()

defineSlots<{
  trigger: () => any
  content: () => any
  default: () => any
}>()

// ==================== 类型定义 ====================

// ==================== Props ====================

const props = withDefaults(defineProps<PopoverProps>(), {
  placement: 'bottom',
  showDelay: 0,
  hideDelay: 100,
  offset: 8,
  ariaLabel: '',
})

/** 弹出层的可访问名称：优先使用 ariaLabel prop，否则使用生成的 ID */
const ariaLabel = computed(() => props.ariaLabel || `popover-${popoverId}`)

// ==================== 共享浮层逻辑 ====================

const {
  triggerRef,
  floatingRef,
  visible,
  currentPlacement,
  floatStyle,
  show,
  hide,
  startHideTimer,
  cancelHideTimer,
} = useFloating({
  placement: () => props.placement,
  offset: () => props.offset,
  showDelay: () => props.showDelay,
  hideDelay: () => props.hideDelay,
  // Popover 翻转后做视口边界修正，且显示后先等下一帧再定位
  boundsCorrection: true,
  awaitNextTick: true,
})

// ==================== 点击外部关闭 ====================

/** SSR 安全 */
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

const handleClickOutside = (event: MouseEvent) => {
  if (!visible.value) return
  const target = event.target as Node
  // 点击触发区或弹出层内部不关闭
  if (
    (triggerRef.value && triggerRef.value.contains(target)) ||
    (floatingRef.value && floatingRef.value.contains(target))
  ) {
    return
  }
  hide()
}

onMounted(() => {
  if (isBrowser) {
    document.addEventListener('mousedown', handleClickOutside)
  }
})

onUnmounted(() => {
  if (isBrowser) {
    document.removeEventListener('mousedown', handleClickOutside)
  }
})
</script>
