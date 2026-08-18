<template>
  <button
    v-bind="$attrs"
    :type="type"
    class="mg-button"
    :class="[
      `mg-button-${variant}-${color}`,
      `mg-button-${size}`,
      { 'mg-button-block': block, 'mg-button-loading': loading },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <template v-if="loading">
      <span class="mg-button-loading-icon" />
      <!-- 根据开关决定是否显示 label -->
      <span v-if="showLabelWhileLoading" class="mg-button-label">
        <slot name="loading-label">{{ loadingLabel || label }}</slot>
      </span>
    </template>

    <!-- 正常状态 -->
    <template v-else>
      <span v-if="hasIconSlot || icon" class="mg-button-icon">
        <slot name="icon">
          <component :is="icon" v-if="typeof icon !== 'string'" />
          <span v-else-if="icon">{{ icon }}</span>
        </slot>
      </span>
      <span v-if="hasLabel" class="mg-button-label">
        <slot>{{ label }}</slot>
      </span>
    </template>
  </button>
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue'
import type { ButtonProps } from '../types/props'

defineOptions({ name: 'Button', inheritAttrs: false })

const props = withDefaults(defineProps<ButtonProps>(), {
  label: '',
  variant: 'filled',
  color: 'primary',
  size: 'sm',
  type: 'button',
  disabled: false,
  loading: false,
  showLabelWhileLoading: false,
  block: false,
})

defineSlots<{
  /** 按钮文字内容（优先于 label prop） */
  default: () => any
  /** 按钮图标 */
  icon: () => any
  /** 加载状态下的文字（优先于 loadingLabel prop） */
  'loading-label': () => any
}>()

const slots = useSlots()
const hasIconSlot = computed(() => !!slots.icon)
/**
 * 是否渲染 label 容器。
 * 空字符串视为无 label（纯图标按钮场景，避免渲染空的 .mg-button-label 容器）。
 */
const hasLabel = computed(() => props.label !== '' || !!slots.default)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>
