<template>
  <label
    class="mg-radio"
    :class="[`mg-radio-${size}`, { 'mg-radio-disabled': disabled, 'mg-radio-error': error }]"
  >
    <input
      type="radio"
      class="mg-radio-input"
      :checked="isChecked"
      :disabled="disabled"
      :value="value"
      v-bind="$attrs"
      @change="handleChange"
    />
    <span class="mg-radio-circle" />
    <span class="mg-radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
defineOptions({ name: 'Radio', inheritAttrs: false })

import { computed } from 'vue'

type Size = 'sm' | 'md' | 'lg'

interface Props {
  /** 单选框标签文字 */
  label?: string
  /** 单选框的值 */
  value?: string | number
  /** 尺寸大小 */
  size?: Size
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示错误状态 */
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  value: undefined,
  size: 'md',
  disabled: false,
  error: false,
})

/** v-model 双向绑定（当前选中的值） */
const modelValue = defineModel<string | number>()

const emit = defineEmits<{
  /** 值变化时触发（原生事件透传） */
  change: [event: Event]
}>()

/**
 * 计算当前单选框是否选中
 * 当 modelValue 等于当前 value 时选中
 */
const isChecked = computed(() => {
  return modelValue.value === props.value
})

/**
 * 处理单选框变化事件
 * 选中时更新 v-model 为当前 value
 */
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked && props.value !== undefined) {
    modelValue.value = props.value
  }
  emit('change', event)
}
</script>
