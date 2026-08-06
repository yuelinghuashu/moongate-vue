<template>
  <div
    :class="[
      'mg-form-item',
      `mg-form-item--${layout}`,
      { 'mg-form-item--error': !!errorText },
      { 'mg-form-item--validating': isLoading },
    ]"
  >
    <label v-if="label != null" class="mg-form-item__label" :class="{ required }">
      <span v-if="required" class="mg-form-item__required" aria-hidden="true">*</span>
      {{ label }}
    </label>

    <div class="mg-form-item__content">
      <slot />
      <p v-if="errorText" class="mg-form-item__error" role="alert">
        {{ errorText }}
      </p>
      <p v-else-if="isLoading" class="mg-form-item__validating" aria-live="polite">校验中…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

defineOptions({ name: 'FormItem', inheritAttrs: false })

/**
 * FormItem 组件——单字段行：label + 必填星号 + 错误/校验中展示。
 *
 * 纯视图层，不包含校验逻辑：
 * - 错误文案来自 useForm 解构出的 `errors`（由外层 `<Form :errors>` 注入）
 * - 校验中状态来自 useForm 解构出的 `validatingFields`（由外层 `<Form :validating-fields>` 注入）
 * - 也可通过 `error` prop 自定义覆盖
 *
 * 若未包裹在 `<Form>` 内，静默降级：仅渲染 label + 内容（不显示错误）。
 */

/** 字段名（对应 useForm 的 errors[key]，必传） */
const props = withDefaults(
  defineProps<{
    name: string
    /** 标签文本 */
    label?: string
    /** 是否显示必填星号 */
    required?: boolean
    /** 自定义错误文案覆盖（不传则用注入的 errors[name]） */
    error?: string
  }>(),
  {
    required: false,
  },
)

/** Form 注入的 errors 映射（useForm reactive 对象，响应式）；未包裹时静默降级 */
const injectedErrors = inject<Record<string, string> | undefined>('mg-form-errors', undefined)

/** Form 注入的布局/校验中状态；未包裹时静默降级 */
const injectedOptions = inject<
  | {
      layout: 'horizontal' | 'vertical' | 'inline'
      validatingFields?: Record<string, boolean>
    }
  | undefined
>('mg-form-options', undefined)

/** 布局（默认 horizontal） */
const layout = computed(() => injectedOptions?.layout ?? 'horizontal')

/** 最终错误文案：自定义 error > 注入 errors[name] */
const errorText = computed(() => {
  if (props.error !== undefined) return props.error
  return injectedErrors?.[props.name] ?? ''
})

/** 单字段校验中状态：validatingFields[name] 为 true 时显示 loading */
const isLoading = computed(() => {
  return injectedOptions?.validatingFields?.[props.name] === true
})
</script>
