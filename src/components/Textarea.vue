<template>
  <textarea
    ref="textareaRef"
    v-bind="$attrs"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :rows="rows"
    class="mg-textarea"
    :class="[`mg-textarea-${size}`, { 'mg-textarea-error': error }]"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'Textarea', inheritAttrs: false })

import { ref } from 'vue'

type Size = 'sm' | 'md' | 'lg'

interface Props {
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 尺寸大小 */
  size?: Size
  /** 显示行数（默认 3 行） */
  rows?: number
  /** 错误状态（仅控制边框样式） */
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  readonly: false,
  size: 'md',
  rows: 3,
  error: false,
})

/** v-model 双向绑定（文本框值） */
const modelValue = defineModel<string>({ default: '' })

const emit = defineEmits<{
  /** 输入时触发（原生事件透传） */
  input: [event: Event]
  /** 值变化时触发（原生事件透传） */
  change: [event: Event]
  /** 获得焦点时触发（原生事件透传） */
  focus: [event: FocusEvent]
  /** 失去焦点时触发（原生事件透传） */
  blur: [event: FocusEvent]
}>()

const textareaRef = ref<HTMLTextAreaElement>()

/**
 * 处理输入事件
 * 更新 v-model 并透传原生 input 事件
 */
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  modelValue.value = target.value
  emit('input', event)
}

/**
 * 值变化事件透传
 */
const handleChange = (event: Event) => {
  emit('change', event)
}

/**
 * 失去焦点事件透传
 */
const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

/**
 * 获得焦点事件透传
 */
const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

// 暴露 textarea 元素引用，方便外部操作（如手动聚焦）
defineExpose({
  textareaRef,
})
</script>