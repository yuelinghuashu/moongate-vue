<template>
  <form v-bind="$attrs" class="mg-form" :class="`mg-form--${layout}`" :style="formStyle">
    <slot />
  </form>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, provide } from 'vue'
import type { FormProps } from '../types/form'
import { formErrorsKey, formOptionsKey } from '../types/form-injection'

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
const props = withDefaults(defineProps<FormProps<T>>(), {
  layout: 'horizontal',
  labelWidth: '80px',
  validatingFields: undefined,
})

/** 布局样式：label 宽度通过 CSS 变量下发 */
const formStyle = computed(
  () =>
    ({
      '--mg-form-label-width': props.labelWidth,
    }) as Record<string, string>,
)

// 注入给 FormItem：错误映射 + 布局/校验中状态
// 使用 computed 包装以确保响应性：父组件整体替换 errors/layout 时 FormItem 能同步更新
provide(
  formErrorsKey,
  computed(() => props.errors),
)
provide(
  formOptionsKey,
  computed(() => ({
    layout: props.layout,
    validatingFields: props.validatingFields,
  })),
)
</script>
