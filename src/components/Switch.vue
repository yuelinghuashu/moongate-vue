<template>
  <label
    class="mg-switch"
    :class="[`mg-switch-${size}`, { 'mg-switch-disabled': disabled, 'mg-switch-error': error }]"
  >
    <input
      type="checkbox"
      class="mg-switch-input"
      role="switch"
      :checked="modelValue"
      :aria-checked="modelValue"
      :disabled="disabled"
      v-bind="$attrs"
      @change="handleChange"
    />
    <span class="mg-switch-track" />
    <span class="mg-switch-label">
      <slot name="label">{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import type { SwitchProps } from '../types/props'

defineOptions({ name: 'Switch', inheritAttrs: false })

defineSlots<{
  /** 标签内容（优先于 label prop） */
  label: () => any
}>()

const props = withDefaults(defineProps<SwitchProps>(), {
  label: '',
  size: 'md',
  disabled: false,
  error: false,
})

/** v-model 双向绑定（开关状态） */
const modelValue = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  /** 值变化时触发（原生事件透传） */
  change: [event: Event]
}>()

/**
 * 处理开关变化事件
 * 更新 v-model 并透传原生 change 事件
 */
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  modelValue.value = target.checked
  emit('change', event)
}
</script>
