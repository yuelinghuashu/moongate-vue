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
import { computed } from 'vue'
import type { RadioProps } from '../types/props'

defineOptions({ name: 'Radio', inheritAttrs: false })

const props = withDefaults(defineProps<RadioProps>(), {
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
