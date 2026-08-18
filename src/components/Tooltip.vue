<template>
  <div
    ref="triggerRef"
    v-bind="attrsWithoutClass"
    :class="['mg-tooltip-trigger', mergedClass]"
    :aria-describedby="visible ? tooltipId : undefined"
    @mouseenter="show"
    @mouseleave="hide"
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
        ref="floatingRef"
        :id="tooltipId"
        class="mg-tooltip"
        :class="[{ 'mg-tooltip-visible': visible }, `mg-tooltip-${currentPlacement}`]"
        :style="floatStyle"
        role="tooltip"
      >
        <slot name="content">
          {{ content }}
        </slot>
        <div class="mg-tooltip-arrow" :class="`mg-tooltip-arrow-${currentPlacement}`" />
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

// ==================== 类型定义 ====================

// ==================== Props ====================

const props = withDefaults(defineProps<TooltipProps>(), {
  content: '',
  placement: 'top',
  showDelay: 0,
  offset: 8,
})

// ==================== 属性透传 ====================

// 处理外部属性透传（无内部动态类，仅合并外部 class）
const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({}))

// ==================== 共享浮层逻辑 ====================

const { triggerRef, floatingRef, visible, currentPlacement, floatStyle, show, hide } = useFloating({
  placement: () => props.placement,
  offset: () => props.offset,
  // Tooltip 使用单一延迟；翻转后不进行视口边界修正，隐藏为立即
  showDelay: () => props.showDelay,
})
</script>
