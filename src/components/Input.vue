<template>
  <input
    v-bind="$attrs"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    class="mg-input"
    :class="[`mg-input-${size}`, { 'mg-input-error': error }]"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
defineOptions({ name: "Input", inheritAttrs: false })

type Size = "sm" | "md" | "lg"
type InputType = "text" | "email" | "password" | "number" | "tel" | "url"

interface Props {
  /** 输入框类型 */
  type?: InputType
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 尺寸大小 */
  size?: Size
  /** 是否显示错误状态 */
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  disabled: false,
  readonly: false,
  size: "md",
  error: false,
})

/** v-model 双向绑定值 */
const modelValue = defineModel<string>({ default: "" })

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

/**
 * 处理输入事件
 * 更新 v-model 并透传原生 input 事件
 */
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  modelValue.value = target.value
  emit("input", event)
}

/**
 * 失去焦点事件透传
 */
const handleBlur = (event: FocusEvent) => {
  emit("blur", event)
}

/**
 * 获得焦点事件透传
 */
const handleFocus = (event: FocusEvent) => {
  emit("focus", event)
}
</script>
