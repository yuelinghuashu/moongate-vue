/**
 * Form / FormItem 之间的 provide/inject 类型化 key
 *
 * 使用 InjectionKey + Symbol 替代裸字符串，确保：
 * - 拼写错误在编译期报错（而非静默降级）
 * - inject 自动获得完整类型
 * - SSR 安全（Symbol 在服务端/客户端一致）
 */
import type { InjectionKey, ComputedRef, Ref } from 'vue'

/** FormItem 注入给插槽内表单组件的字段上下文 */
export interface FormFieldContext {
  /** 字段唯一 id（label for 关联 + input id 自动对齐） */
  id: Ref<string>
  /** 错误/校验中提示的 id（aria-describedby 关联，无提示时为 undefined） */
  describedBy: ComputedRef<string | undefined>
}

export const formFieldContextKey: InjectionKey<FormFieldContext> = Symbol('mg-form-field')

/**
 * Form 注入的 errors 映射（useForm reactive 对象，响应式）。
 * 使用 Partial 以兼容 useForm 的 `errors`（字段可能缺失）。
 */
export const formErrorsKey: InjectionKey<ComputedRef<Partial<Record<string, string>> | undefined>> =
  Symbol('mg-form-errors')

/** Form 注入的布局/校验中状态 */
export interface FormInjectedOptions {
  layout: 'horizontal' | 'vertical' | 'inline'
  validatingFields?: Record<string, boolean>
}

export const formOptionsKey: InjectionKey<ComputedRef<FormInjectedOptions>> =
  Symbol('mg-form-options')
