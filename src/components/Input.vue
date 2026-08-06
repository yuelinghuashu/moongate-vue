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
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { useFormField } from '../composables/useFormField'
import type { Size, InputType } from '../types/components'

defineOptions({ name: 'Input', inheritAttrs: false })

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
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  size: 'md',
  error: false,
})

/** v-model 双向绑定值 */
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

// 共享表单字段逻辑：v-model 更新 + 原生事件透传
const { handleInput, handleChange, handleBlur, handleFocus } = useFormField(
  modelValue,
  emit as (event: string, ...args: any[]) => void,
)
</script>
