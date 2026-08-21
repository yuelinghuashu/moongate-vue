<template>
  <div
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
        :id="tooltipId"
        class="mg-tooltip"
        :class="`mg-tooltip-${placement}`"
        :style="{ '--mg-tooltip-offset': `${offset}px` }"
        role="tooltip"
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
import { ref, useId } from 'vue'
import { useAttrsWithClass } from '../composables/useAttrsWithClass'
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
  offset: 8,
})

// ==================== 属性透传 ====================

// 处理外部属性透传（无内部动态类，仅合并外部 class）
const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({}))

// ==================== 显隐逻辑（内联，替代 useFloating） ====================

const visible = ref(false)
let showTimer: ReturnType<typeof setTimeout> | null = null

const show = () => {
  if (showTimer) clearTimeout(showTimer)
  showTimer = setTimeout(() => {
    showTimer = null
    visible.value = true
  }, props.showDelay)
}

const hide = () => {
  if (showTimer) clearTimeout(showTimer)
  showTimer = null
  visible.value = false
}
</script>
