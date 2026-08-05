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
import type { Component } from 'vue'

defineOptions({ name: 'Button', inheritAttrs: false })

type Variant = 'filled' | 'outline'
type Color = 'primary' | 'success' | 'warning' | 'error'
type Size = 'sm' | 'md' | 'lg'
type ButtonType = 'button' | 'submit' | 'reset'

interface Props {
  /** 按钮文字 */
  label?: string
  /** 按钮样式 */
  variant?: Variant
  /** 按钮颜色 */
  color?: Color
  /** 按钮大小 */
  size?: Size
  /** 原生按钮类型，默认 button 防止表单意外提交 */
  type?: ButtonType
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 加载时是否保留文字 */
  showLabelWhileLoading?: boolean
  /** 加载时的文字（可选，默认使用 label） */
  loadingLabel?: string
  /** 是否为块级按钮 */
  block?: boolean
  /** 按钮图标 */
  icon?: string | Component
}

const props = withDefaults(defineProps<Props>(), {
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
const hasLabel = computed(() => props.label !== undefined || !!slots.default)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>
