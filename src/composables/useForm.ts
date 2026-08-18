// composables/useForm.ts
import { reactive, computed, toValue, onMounted, type MaybeRefOrGetter } from 'vue'
import { useTexts } from '../config'

/**
 * 表单校验规则。
 *
 * 每个字段的规则是「纯函数式」的：`(value, values) => boolean | string`。
 * - 返回 `true` 表示校验通过
 * - 返回 `false` 表示校验失败（使用 ruleMessage 或默认文案）
 * - 返回 `string` 表示校验失败，该字符串即为错误信息
 *
 * 支持：
 * - 异步规则（返回 Promise，如远程唯一性检查）
 * - 关联字段规则（第二个参数 values 可访问其他字段值，如确认密码）
 * - 简单格式校验直接写一行正则，无需内置校验器
 *
 * 为什么不做内置规则（required/email/url/min/max/pattern）？
 * 这些均为 HTML5 Constraint Validation API 已覆盖的能力
 * （`<input required type="email">` + CSS `:invalid`），
 * 组件库用 JS 重复实现属于过度工程。useForm 只提供 HTML5 做不到的编排能力：
 * 状态集中管理、异步校验、关联校验、校验时机控制、重置/回填。
 */
export type Rule = (
  value: any,
  values: Record<string, any>,
) => boolean | string | Promise<boolean | string>

/** 字段规则：单条规则或规则数组 */
export type FieldRules = Rule | Rule[]

/** 表单字段键（保证为字符串键，方便索引响应式对象） */
type FormKey<T> = Extract<keyof T, string>

/** useForm 初始化参数 */
export interface UseFormOptions<T extends Record<string, any>> {
  /** 表单初始值 */
  initialValues: T
  /** 校验规则映射：字段名 → 规则或规则数组 */
  rules?: Partial<Record<FormKey<T>, FieldRules>>
  /** 可选的全局错误信息文案（不传则使用全局配置） */
  ruleMessage?: MaybeRefOrGetter<string>
  /** 首次调用 validate 前是否自动校验（默认 false） */
  validateOnMount?: boolean
}

/**
 * 轻量表单校验组合式函数。
 *
 * 不重复实现 HTML5 已有校验，只提供：
 * - `values` / `errors` / `valid` — 响应式表单状态集中管理
 * - `validate()` / `validateField()` — 全表单 / 单字段校验（异步规则自动等待）
 * - `reset()` — 恢复初始值并清空错误
 * - `setValues()` / `setErrors()` — 程序化更新
 *
 * @example
 * ```ts
 * const { values, errors, valid, validate, reset } = useForm({
 *   initialValues: { username: '', password: '', confirm: '' },
 *   rules: {
 *     username: async (v) => {
 *       const exists = await checkUsernameUnique(v)
 *       return exists ? '用户名已被占用' : true
 *     },
 *     confirm: (v, values) => (v === values.password ? true : '两次密码不一致'),
 *     email: (v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? true : '邮箱格式不正确'),
 *   },
 * })
 *
 * const submit = async () => {
 *   if (await validate()) {
 *     // 提交 values
 *   }
 * }
 * ```
 */
export function useForm<T extends Record<string, any>>(options: UseFormOptions<T>) {
  type Key = FormKey<T>

  const {
    initialValues,
    rules = {} as NonNullable<UseFormOptions<T>['rules']>,
    ruleMessage,
    validateOnMount = false,
  } = options

  /** 全局文案（响应式，用于默认校验失败文案） */
  const texts = useTexts()

  /** 表单值（响应式，直接绑定到组件 v-model） */
  const values = reactive({ ...initialValues }) as T

  /** 字段错误信息映射：字段名 → 错误文案 */
  const errors = reactive({}) as Partial<Record<Key, string>>

  /** 正在校验中的字段（异步校验时用于显示 loading 状态） */
  const validatingFields = reactive({}) as Record<Key, boolean>

  /** 是否正在校验中（异步规则未完成时为 true） */
  const isValidating = computed(() => Object.values(validatingFields).some(Boolean))

  /** 错误数量（valid/hasErrors 共享，避免重复遍历） */
  const errorCount = computed(() => Object.keys(errors).length)

  /** 表单是否通过校验（无错误且无正在进行的校验） */
  const valid = computed(() => !isValidating.value && errorCount.value === 0)

  /** 是否有任何错误 */
  const hasErrors = computed(() => errorCount.value > 0)

  /** 获取默认错误文案：自定义 ruleMessage > 全局配置 */
  const getRuleMessage = () =>
    ruleMessage !== undefined ? toValue(ruleMessage) : texts.value.formRuleMessage

  /** 单条规则校验（接收共享的 values 快照，避免每条规则重复拷贝） */
  async function runRule(
    key: Key,
    rule: Rule,
    snapshot: Record<string, any>,
  ): Promise<string | null> {
    const result = await rule(values[key], snapshot)
    if (result === true) return null
    // string 直接作为错误信息；false 使用默认文案
    return typeof result === 'string' ? result : getRuleMessage()
  }

  /** 校验单个字段 */
  async function validateField(key: Key): Promise<boolean> {
    const fieldRules = rules[key]
    if (!fieldRules) {
      return true
    }

    const ruleList = Array.isArray(fieldRules) ? fieldRules : [fieldRules]
    // 关联字段快照：每个字段校验只拷贝一次，供该字段所有规则共享
    // 浅拷贝避免规则内修改 values 触发额外响应式更新
    const snapshot = { ...values }
    validatingFields[key] = true

    try {
      // 依次执行规则，遇到第一个失败即返回
      for (const rule of ruleList) {
        const message = await runRule(key, rule, snapshot)
        if (message !== null) {
          errors[key] = message
          return false
        }
      }

      // 全部通过则清除该字段错误
      delete errors[key]
      return true
    } finally {
      validatingFields[key] = false
    }
  }

  /** 校验所有字段（并行执行，await 全部完成） */
  async function validate(): Promise<boolean> {
    const keys = Object.keys(rules) as Key[]
    const results = await Promise.all(keys.map((key) => validateField(key)))
    return results.every(Boolean)
  }

  /** 重置：恢复初始值并清空所有错误（支持新增/删除字段） */
  function reset(newValues?: T) {
    const next = newValues ?? initialValues
    // 1) 删除 next 中不存在的旧键，避免结构残留（reactive 无法感知运行时删除的键）
    for (const key of Object.keys(values) as Key[]) {
      if (!(key in next)) {
        delete values[key]
      }
    }
    // 2) 写入所有键（含新增字段，确保新字段进入 reactive 追踪）
    for (const [key, val] of Object.entries(next) as [Key, any][]) {
      values[key] = val
    }
    clearErrors()
    resetValidatingFields()
  }

  /** 清空所有字段错误 */
  function clearErrors() {
    for (const key of Object.keys(errors) as Key[]) {
      delete errors[key]
    }
  }

  /** 程序化设置表单值（支持新增字段） */
  function setValues(partial: Partial<T>) {
    // 先删除 partial 中不存在的旧键，防止结构残留
    for (const key of Object.keys(values) as Key[]) {
      if (!(key in partial)) {
        delete values[key]
      }
    }
    for (const [key, val] of Object.entries(partial) as [Key, any][]) {
      values[key] = val
    }
  }

  /** 程序化设置错误信息 */
  function setErrors(partial: Partial<Record<Key, string>>) {
    for (const [key, message] of Object.entries(partial) as [Key, string][]) {
      if (message) {
        errors[key] = message
      } else {
        delete errors[key]
      }
    }
  }

  /** 重置所有字段的校验中标记 */
  function resetValidatingFields() {
    for (const key of Object.keys(validatingFields)) {
      delete validatingFields[key]
    }
  }

  /** 挂载时自动校验（可选；仅在客户端执行，SSR 下无意义） */
  if (validateOnMount) {
    onMounted(() => {
      validate()
    })
  }

  return {
    /** 表单值（响应式） */
    values,
    /** 字段错误信息映射 */
    errors,
    /** 各字段是否正在校验中（异步校验时用于单字段 loading 状态） */
    validatingFields,
    /** 表单是否通过校验 */
    valid,
    /** 是否有任何错误 */
    hasErrors,
    /** 是否正在校验中 */
    isValidating,
    /** 校验全部字段，返回是否通过 */
    validate,
    /** 校验单个字段，返回是否通过 */
    validateField,
    /** 重置表单（可传入新初始值） */
    reset,
    /** 清空所有错误 */
    clearErrors,
    /** 程序化设置表单值 */
    setValues,
    /** 程序化设置错误信息 */
    setErrors,
  }
}
