<template>
  <label
    class="mg-checkbox"
    :class="[
      `mg-checkbox-${size}`,
      { 'mg-checkbox-disabled': disabled, 'mg-checkbox-error': error },
    ]"
  >
    <input
      type="checkbox"
      class="mg-checkbox-input"
      :checked="isChecked"
      :disabled="disabled"
      v-bind="$attrs"
      @change="handleChange"
    />
    <span class="mg-checkbox-box" />
    <span class="mg-checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Size } from '../types/components'

defineOptions({ name: 'Checkbox', inheritAttrs: false })

interface Props {
  /** 复选框标签文字 */
  label?: string
  /** 复选框的值（用于数组多选模式） */
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

/**
 * v-model 双向绑定值
 * - 单选模式：boolean
 * - 多选模式（配合 value 使用）：any[]
 */
const modelValue = defineModel<boolean | any[]>({ default: false })

/**
 * 计算当前复选框是否选中
 * - 多选模式：检查 value 是否存在于 modelValue 数组中
 * - 单选模式：直接使用 modelValue 的布尔值
 */
const isChecked = computed(() => {
  if (props.value !== undefined && Array.isArray(modelValue.value)) {
    return modelValue.value.includes(props.value)
  }
  return !!modelValue.value
})

/**
 * 处理复选框变化事件
 * - 多选模式：往数组中添加或移除当前 value
 * - 单选模式：直接更新为 checked 状态
 */
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (props.value !== undefined && Array.isArray(modelValue.value)) {
    // 多选模式：更新数组
    const newValue = target.checked
      ? [...modelValue.value, props.value] // 添加
      : modelValue.value.filter((v) => v !== props.value) // 移除
    modelValue.value = newValue
  } else {
    // 单选模式：直接更新布尔值
    modelValue.value = target.checked
  }
}
</script>
