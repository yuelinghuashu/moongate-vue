<template>
  <div
    ref="triggerRef"
    v-bind="$attrs"
    class="mg-popover-trigger"
    @mouseenter="show"
    @mouseleave="startHideTimer"
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
import { useFloating } from '../composables/useFloating'
import type { Placement } from '../types/components'

defineOptions({ name: 'Popover' })

// ==================== 类型定义 ====================

interface Props {
  /** 弹出层位置，默认 bottom */
  placement?: Placement
  /** 显示延迟时间（毫秒），避免鼠标划过时误弹，默认 0 */
  showDelay?: number
  /** 隐藏延迟时间（毫秒），方便移入内容区，默认 100 */
  hideDelay?: number
  /** 弹出层与触发元素的偏移量（像素），默认 8 */
  offset?: number
}

// ==================== Props ====================

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom',
  showDelay: 0,
  hideDelay: 100,
  offset: 8,
})

// ==================== 共享浮层逻辑 ====================

const {
  triggerRef,
  floatingRef,
  visible,
  currentPlacement,
  floatStyle,
  show,
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
</script>
