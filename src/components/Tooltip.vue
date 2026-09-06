<template>
  <div
    v-bind="attrsWithoutClass"
    ref="triggerRef"
    :class="['mg-tooltip-trigger', mergedClass]"
    :aria-describedby="visible ? tooltipId : undefined"
    @mouseenter="show"
    @mouseleave="startHideTimer"
    @focus="show"
    @blur="hide"
    @keydown.esc="hide"
  >
    <slot name="trigger">
      <slot />
    </slot>

    <Teleport to="body">
      <div
        v-if="visible"
        :id="tooltipId"
        ref="floatingRef"
        class="mg-tooltip"
        :class="[`mg-tooltip-${currentPlacement}`, { 'mg-tooltip-visible': visible }]"
        :style="floatStyle"
        role="tooltip"
        @mouseenter="cancelHideTimer"
        @mouseleave="startHideTimer"
      >
        <slot name="content">
          {{ content }}
        </slot>
        <div class="mg-tooltip-arrow" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { useAttrsWithClass } from '../composables/useAttrsWithClass'
import { useFloating } from '../composables/useFloating'
import type { TooltipProps } from '../types/props'

defineOptions({ name: 'Tooltip', inheritAttrs: false })

// 生成 tooltip 的唯一 ID（SSR 安全，用于 aria-describedby 关联）
const tooltipId = useId()

defineSlots<{
  trigger: () => any
  content: () => any
  default: () => any
}>()

const props = withDefaults(defineProps<TooltipProps>(), {
  content: '',
  placement: 'top',
  showDelay: 0,
  hideDelay: 100,
  offset: 8,
})

// ==================== 属性透传 ====================

// 处理外部属性透传（无内部动态类，仅合并外部 class）
const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({}))

// ==================== 共享浮层定位逻辑（JS，兼容声明浏览器基线） ====================

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
  // Tooltip 跟随触发元素，翻转后不做额外边界修正
  boundsCorrection: false,
  // 显示后等一帧再定位（浮层刚经 v-if 挂载，需渲染完成才能拿到尺寸）
  awaitNextTick: true,
})
</script>
