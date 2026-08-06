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
        ref="floatingRef"
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
import { useAttrsWithClass } from '../composables/useAttrsWithClass'
import { useFloating } from '../composables/useFloating'
import type { Placement } from '../types/components'

defineOptions({ name: 'Tooltip', inheritAttrs: false })

// ==================== 类型定义 ====================

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

// ==================== 属性透传 ====================

// 处理外部属性透传（无内部动态类，仅合并外部 class）
const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({}))

// ==================== 共享浮层逻辑 ====================

const { triggerRef, floatingRef, visible, currentPlacement, floatStyle, show, hide } = useFloating({
  placement: () => props.placement,
  offset: () => props.offset,
  // Tooltip 使用单一延迟；翻转后不进行视口边界修正，隐藏为立即
  showDelay: () => props.delay,
})
</script>
