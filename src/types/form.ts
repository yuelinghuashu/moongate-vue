/**
 * Form 组件 Props 类型
 *
 * 由于 vue-tsc 不支持 <script setup> 中导出带泛型默认参数的接口，
 * 泛型 Props 类型统一放在独立的 .ts 文件中（与 types/table.ts 同模式）。
 */

/**
 * Form 组件 Props
 * @template T - 表单数据类型
 */
export interface FormProps<T = Record<string, any>> {
  /** useForm 解构出的 errors（响应式，必传） */
  errors?: Partial<Record<keyof T, string>>
  /** 布局方向：horizontal（label 左侧）/ vertical（label 上方）/ inline（行内） */
  layout?: 'horizontal' | 'vertical' | 'inline'
  /** label 宽度（仅 horizontal 生效，如 '80px'、'120px'） */
  labelWidth?: string
  /** useForm 解构出的 validatingFields（各字段校验中状态，供 FormItem 单字段 loading） */
  validatingFields?: Record<string, boolean>
}
