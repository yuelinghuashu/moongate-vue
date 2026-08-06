<template>
  <form v-bind="$attrs" class="mg-form" :class="`mg-form--${layout}`" :style="formStyle">
    <slot />
  </form>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, provide } from 'vue'

defineOptions({ name: 'Form', inheritAttrs: false })

/**
 * Form 组件——表单布局容器 + 错误/校验中状态中转（视图层，不含校验逻辑）。
 *
 * 校验逻辑全部复用 useForm：
 * - `errors` prop 接收 `useForm` 解构出的响应式错误映射
 * - `validatingFields` prop 接收 `useForm` 解构出的单字段校验中状态
 * - 通过 `provide` 注入给内部 FormItem 使用
 *
 * @example
 * ```vue
 * <Form :errors="errors" :validating-fields="validatingFields" label-width="80px" @submit.prevent="validate()">
 *   <FormItem name="username" label="用户名" required>
 *     <Input v-model="values.username" />
 *   </FormItem>
 * </Form>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** useForm 解构出的 errors（响应式，必传） */
    errors?: Partial<Record<keyof T, string>>
    /** 布局方向：horizontal（label 左侧）/ vertical（label 上方）/ inline（行内） */
    layout?: 'horizontal' | 'vertical' | 'inline'
    /** label 宽度（仅 horizontal 生效，如 '80px'、'120px'） */
    labelWidth?: string
    /** useForm 解构出的 validatingFields（各字段校验中状态，供 FormItem 单字段 loading） */
    validatingFields?: Record<string, boolean>
  }>(),
  {
    layout: 'horizontal',
    labelWidth: '80px',
    validatingFields: undefined,
  },
)

/** 布局样式：label 宽度通过 CSS 变量下发 */
const formStyle = computed(
  () =>
    ({
      '--mg-form-label-width': props.labelWidth,
    }) as Record<string, string>,
)

// 注入给 FormItem：错误映射 + 布局/校验中状态
provide('mg-form-errors', props.errors)
provide('mg-form-options', {
  layout: props.layout,
  validatingFields: props.validatingFields,
})
</script>
