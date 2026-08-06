// composables/useFormField.ts
import type { Ref } from 'vue'

/**
 * 表单字段组件（Input/Textarea）的共享事件处理。
 *
 * 统一处理：
 * - `input` 事件时更新 v-model 并透传原生事件
 * - `change` / `focus` / `blur` 原生事件透传
 *
 * @param modelValue - `v-model` 双向绑定（由组件内 `defineModel` 传入）
 * @param emit - 组件 `defineEmits` 返回值（input/change/focus/blur 事件透传）
 * @returns 组件模板绑定的事件处理方法
 */
export function useFormField<El extends HTMLInputElement | HTMLTextAreaElement>(
  modelValue: Ref<string>,
  emit: (event: string, ...args: any[]) => void,
) {
  /**
   * 处理输入事件
   * 更新 v-model 并透传原生 input 事件
   */
  const handleInput = (event: Event) => {
    const target = event.target as El
    modelValue.value = target.value
    emit('input', event)
  }

  /** 值变化事件透传（原生 change 事件） */
  const handleChange = (event: Event) => {
    emit('change', event)
  }

  /** 失去焦点事件透传 */
  const handleBlur = (event: FocusEvent) => {
    emit('blur', event)
  }

  /** 获得焦点事件透传 */
  const handleFocus = (event: FocusEvent) => {
    emit('focus', event)
  }

  return {
    /** 输入事件处理（更新 v-model + 透传） */
    handleInput,
    /** 值变化事件透传 */
    handleChange,
    /** 失去焦点事件透传 */
    handleBlur,
    /** 获得焦点事件透传 */
    handleFocus,
  }
}
