<template>
  <textarea
    ref="textareaRef"
    v-bind="$attrs"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :rows="autoResize ? undefined : rows"
    class="mg-textarea"
    :class="[`mg-textarea-${size}`, { 'mg-textarea-error': error }]"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'

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
  /** 显示行数（仅在 autoResize 为 false 时生效） */
  rows?: number
  /** 错误状态 */
  error?: boolean
  /** 是否启用自动高度（根据内容自动调整） */
  autoResize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "",
  disabled: false,
  readonly: false,
  size: "md",
  rows: 3,
  error: false,
  autoResize: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const textareaRef = ref<HTMLTextAreaElement>()

/**
 * 调整 textarea 高度（仅当 autoResize 为 true 时）
 */
const resize = () => {
  if (!props.autoResize || !textareaRef.value) return
  // 重置高度为 auto，以便获取正确的 scrollHeight
  textareaRef.value.style.height = 'auto'
  // 设置高度为内容高度，同时确保不低于最小行高
  const minHeight = props.rows ? props.rows * 1.5 : 3 * 1.5 // 假设行高约为 1.5em
  const newHeight = Math.max(textareaRef.value.scrollHeight, minHeight * 16) // 粗略转换，实际建议用 CSS 控制
  textareaRef.value.style.height = `${newHeight}px`
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit("update:modelValue", target.value)
  emit("input", event)
  nextTick(resize)
}

const handleBlur = (event: FocusEvent) => {
  emit("blur", event)
}

const handleFocus = (event: FocusEvent) => {
  emit("focus", event)
}

// 监听 modelValue 变化（例如程序清空内容）
watch(() => props.modelValue, () => {
  nextTick(resize)
})

// 组件挂载后调整高度
onMounted(resize)
</script>