<template>
  <textarea
    ref="textareaRef"
    v-bind="textareaAttrs"
    :id="textareaId"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :rows="rows"
    :aria-describedby="describedBy"
    class="mg-textarea"
    :class="[`mg-textarea-${size}`, { 'mg-textarea-error': error }]"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, computed, inject, useAttrs } from 'vue'
import { useFormField } from '../composables/useFormField'
import type { FormFieldEvents } from '../composables/useFormField'
import type { TextareaProps } from '../types/props'
import { formFieldContextKey } from '../types/form-injection'

defineOptions({ name: 'Textarea', inheritAttrs: false })

const props = withDefaults(defineProps<TextareaProps>(), {
  placeholder: '',
  disabled: false,
  readonly: false,
  size: 'md',
  rows: 3,
  error: false,
})

/** v-model 双向绑定（文本框值） */
const modelValue = defineModel<string>({ default: '' })

const emit = defineEmits<FormFieldEvents>()

const textareaRef = ref<HTMLTextAreaElement>()

// ==================== FormItem 字段上下文（自动 id + aria-describedby） ====================

/** 外层 FormItem 注入的字段上下文；未包裹时静默降级 */
const fieldContext = inject(formFieldContextKey, undefined)

/** 文本域 id：显式 id > FormItem 提供的字段 id */
const textareaId = computed(() => {
  const attrs = useAttrs()
  return (attrs.id as string | undefined) ?? fieldContext?.id.value
})

/** aria-describedby：关联 FormItem 的错误/校验中提示 */
const describedBy = computed(() => fieldContext?.describedBy.value)

// 剥离 attrs 中的 id（已由 textareaId 处理），避免重复
const textareaAttrs = computed(() => {
  const attrs = useAttrs()
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (key !== 'id') rest[key] = value
  }
  return rest
})

// 共享表单字段逻辑：v-model 更新 + 原生事件透传
const { handleInput, handleChange, handleBlur, handleFocus } = useFormField(modelValue, emit)

// 暴露 textarea 元素引用，方便外部操作（如手动聚焦）
defineExpose({
  textareaRef,
})
</script>
