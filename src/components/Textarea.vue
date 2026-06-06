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
defineOptions({ name: "Textarea", inheritAttrs: false })

import { ref } from "vue"

type Size = "sm" | "md" | "lg"

interface Props {
  /** 输入框的值（v-model） */
  modelValue?: string
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 尺寸 */
  size?: Size
  /** 显示行数（默认 3 行） */
  rows?: number
  /** 错误状态（仅控制边框样式） */
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "",
  disabled: false,
  readonly: false,
  size: "md",
  rows: 3,
  error: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const textareaRef = ref<HTMLTextAreaElement>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit("update:modelValue", target.value)
  emit("input", event)
}

const handleChange = (event: Event) => {
  emit("change", event)
}

const handleBlur = (event: FocusEvent) => {
  emit("blur", event)
}

const handleFocus = (event: FocusEvent) => {
  emit("focus", event)
}

// 暴露 textarea 元素引用，方便外部操作（如手动聚焦）
defineExpose({
  textareaRef,
})
</script>
