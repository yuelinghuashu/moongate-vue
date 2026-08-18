<template>
  <div
    :class="[
      'mg-form-item',
      `mg-form-item--${layout}`,
      { 'mg-form-item--error': !!errorText },
      { 'mg-form-item--validating': isLoading },
    ]"
  >
    <label v-if="label != null" class="mg-form-item__label" :class="{ required }" :for="forAttr">
      <span v-if="required" class="mg-form-item__required" aria-hidden="true">*</span>
      {{ label }}
    </label>

    <div class="mg-form-item__content">
      <slot />
      <p v-if="errorText" class="mg-form-item__error" role="alert" :id="errorId">
        {{ errorText }}
      </p>
      <p
        v-else-if="isLoading"
        class="mg-form-item__validating"
        aria-live="polite"
        :id="validatingId"
      >
        {{ validatingTextValue }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, provide, useId } from 'vue'
import { useTexts } from '../config'
import type { FormItemProps } from '../types/props'
import { formFieldContextKey, formErrorsKey, formOptionsKey } from '../types/form-injection'

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
 *
 * 无障碍：自动生成字段唯一 id，并通过 provide 注入给插槽内的表单组件，
 * 实现 label for 关联、input id 自动对齐、错误/校验中提示的 aria-describedby 关联。
 */

const props = withDefaults(defineProps<FormItemProps>(), {
  required: false,
})

/** 全局文案（响应式） */
const texts = useTexts()

// ==================== 字段唯一 id（自动关联 label for + input id） ====================

/** 本字段的唯一 id（SSR 安全，useId 在服务端/客户端一致） */
const autoFieldId = useId()

/** 最终生效的 input id：props.for > 自动生成 */
const fieldId = computed(() => props.for || `mg-field-${autoFieldId}`)

/** 错误提示的 id（用于 aria-describedby 关联） */
const errorId = `mg-field-error-${autoFieldId}`

/** 校验中提示的 id */
const validatingId = `mg-field-validating-${autoFieldId}`

/** 提供给插槽内表单组件的字段上下文 */
provide(formFieldContextKey, {
  id: fieldId,
  describedBy: computed(() => {
    if (errorText.value) return errorId
    if (isLoading.value) return validatingId
    return undefined
  }),
})

// ==================== 注入的 Form 状态 ====================

/** Form 注入的 errors 映射（useForm reactive 对象，响应式）；未包裹时静默降级 */
const injectedErrors = inject(formErrorsKey, undefined)
const injectedErrorsValue = computed(() => injectedErrors?.value)

/** Form 注入的布局/校验中状态；未包裹时静默降级 */
const injectedOptions = inject(formOptionsKey, undefined)
const injectedOptionsValue = computed(() => injectedOptions?.value)

/** 布局（默认 horizontal） */
const layout = computed(() => injectedOptionsValue.value?.layout ?? 'horizontal')

/** label 的 for 属性（关联输入框 id，点击 label 聚焦 input） */
const forAttr = computed(() => fieldId.value)

/** 最终错误文案：自定义 error > 注入 errors[name] */
const errorText = computed(() => {
  if (props.error !== undefined) return props.error
  return injectedErrorsValue.value?.[props.name] ?? ''
})

/** 单字段校验中状态：validatingFields[name] 为 true 时显示 loading */
const isLoading = computed(() => {
  return injectedOptionsValue.value?.validatingFields?.[props.name] === true
})

/** 校验中文案：prop > 全局配置 */
const validatingTextValue = computed(() => props.validatingText ?? texts.value.validating)
</script>
