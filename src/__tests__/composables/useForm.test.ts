import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useForm } from '../../composables/useForm'
import { setConfig } from '../../config'

// 该测试文件依赖默认中文文案，显式设置
setConfig({ locale: 'zh-CN' })

describe('useForm', () => {
  it('初始化 values 为 initialValues 的副本', () => {
    const { values } = useForm({
      initialValues: { name: '张三', age: 18 },
    })
    expect(values.name).toBe('张三')
    expect(values.age).toBe(18)
  })

  it('初始状态 valid 为 true、无错误', () => {
    const { valid, hasErrors, errors } = useForm({
      initialValues: { name: '' },
    })
    expect(valid.value).toBe(true)
    expect(hasErrors.value).toBe(false)
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('validateField：规则通过时无错误', async () => {
    const { validateField, errors, valid } = useForm({
      initialValues: { name: '张三' },
      rules: {
        name: (v) => (v ? true : '请输入姓名'),
      },
    })
    const result = await validateField('name')
    expect(result).toBe(true)
    expect(errors.name).toBeUndefined()
    expect(valid.value).toBe(true)
  })

  it('validateField：规则返回 string 时设置错误信息', async () => {
    const { validateField, errors, valid } = useForm({
      initialValues: { name: '' },
      rules: {
        name: (v) => (v ? true : '请输入姓名'),
      },
    })
    const result = await validateField('name')
    expect(result).toBe(false)
    expect(errors.name).toBe('请输入姓名')
    expect(valid.value).toBe(false)
  })

  it('validateField：规则返回 false 时使用默认错误文案', async () => {
    const { validateField, errors } = useForm({
      initialValues: { name: '' },
      rules: {
        name: (v) => !!v,
      },
    })
    await validateField('name')
    expect(errors.name).toBe('校验未通过')
  })

  it('validateField：可通过 ruleMessage 自定义默认错误文案', async () => {
    const { validateField, errors } = useForm({
      initialValues: { name: '' },
      rules: {
        name: (v) => !!v,
      },
      ruleMessage: '字段无效',
    })
    await validateField('name')
    expect(errors.name).toBe('字段无效')
  })

  it('规则数组：依次执行，遇到第一个失败即停止', async () => {
    const firstRule = vi.fn((v: string) => (v ? true : '必填'))
    const secondRule = vi.fn((v: string) => (v.length >= 3 ? true : '至少 3 个字符'))
    const { validateField, errors } = useForm({
      initialValues: { name: 'a' },
      rules: {
        name: [firstRule, secondRule],
      },
    })
    await validateField('name')
    // 第一条通过，第二条失败
    expect(firstRule).toHaveBeenCalledTimes(1)
    expect(secondRule).toHaveBeenCalledTimes(1)
    expect(errors.name).toBe('至少 3 个字符')
  })

  it('关联字段校验：可访问其他字段值', async () => {
    const { validateField, values, errors } = useForm({
      initialValues: { password: '123456', confirm: '123456' },
      rules: {
        confirm: (v, values) => (v === values.password ? true : '两次密码不一致'),
      },
    })
    // 密码一致
    expect(await validateField('confirm')).toBe(true)
    expect(errors.confirm).toBeUndefined()

    // 修改确认密码后不一致
    values.confirm = '654321'
    expect(await validateField('confirm')).toBe(false)
    expect(errors.confirm).toBe('两次密码不一致')
  })

  it('异步校验：等待 Promise 完成', async () => {
    const checkUnique = vi.fn(async (v: string) => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      return v === 'admin' ? '用户名已被占用' : true
    })
    const { validateField, errors, isValidating } = useForm({
      initialValues: { username: 'admin' },
      rules: {
        username: checkUnique,
      },
    })

    // 校验中 isValidating 为 true
    const promise = validateField('username')
    expect(isValidating.value).toBe(true)

    const result = await promise
    expect(result).toBe(false)
    expect(errors.username).toBe('用户名已被占用')
    expect(isValidating.value).toBe(false)
  })

  it('validate：校验所有规则字段', async () => {
    const { validate, errors } = useForm({
      initialValues: { name: '', email: '' },
      rules: {
        name: (v) => (v ? true : '请输入姓名'),
        email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? true : '邮箱格式不正确'),
      },
    })
    expect(await validate()).toBe(false)
    expect(errors.name).toBe('请输入姓名')
    expect(errors.email).toBe('邮箱格式不正确')
  })

  it('validate：全部通过时返回 true 并清除已有错误', async () => {
    const { validate, errors, values } = useForm({
      initialValues: { name: '' },
      rules: {
        name: (v) => (v ? true : '请输入姓名'),
      },
    })
    expect(await validate()).toBe(false)

    values.name = '张三'
    expect(await validate()).toBe(true)
    expect(errors.name).toBeUndefined()
  })

  it('reset：恢复初始值并清空错误', async () => {
    const { values, errors, validateField, reset } = useForm({
      initialValues: { name: '' },
      rules: {
        name: (v) => (v ? true : '请输入姓名'),
      },
    })
    values.name = '张三'
    await validateField('name')

    reset()
    expect(values.name).toBe('')
    expect(errors.name).toBeUndefined()
  })

  it('reset：可传入新初始值', () => {
    const { values, reset } = useForm({
      initialValues: { name: '', age: 0 },
    })
    values.name = '李四'
    reset({ name: '王五', age: 30 })
    expect(values.name).toBe('王五')
    expect(values.age).toBe(30)
  })

  it('setValues：程序化更新表单值', () => {
    const { values, setValues } = useForm({
      initialValues: { name: '', age: 0 },
    })
    setValues({ name: '赵六', age: 25 })
    expect(values.name).toBe('赵六')
    expect(values.age).toBe(25)
  })

  it('setErrors：设置错误信息，空字符串清除错误', () => {
    const { errors, setErrors } = useForm<{ name: string }>({
      initialValues: { name: '' },
    })
    setErrors({ name: '错误信息' })
    expect(errors.name).toBe('错误信息')

    setErrors({ name: '' })
    expect(errors.name).toBeUndefined()
  })

  it('clearErrors：清空所有错误', async () => {
    const { validate, errors, clearErrors, values } = useForm({
      initialValues: { name: '' },
      rules: {
        name: (v) => (v ? true : '请输入姓名'),
      },
    })
    await validate()
    expect(errors.name).toBe('请输入姓名')

    clearErrors()
    expect(errors.name).toBeUndefined()
  })

  it('valid：任何字段失败时为 false', async () => {
    const { validate, valid, values } = useForm({
      initialValues: { name: '' },
      rules: {
        name: (v) => (v ? true : '请输入姓名'),
      },
    })
    await validate()
    expect(valid.value).toBe(false)

    values.name = '张三'
    await validate()
    expect(valid.value).toBe(true)
  })

  it('ruleMessage 支持响应式 ref', async () => {
    const messageRef = ref('默认错误')
    const { validateField, errors } = useForm({
      initialValues: { name: '' },
      rules: {
        name: (v) => !!v,
      },
      ruleMessage: messageRef,
    })
    await validateField('name')
    expect(errors.name).toBe('默认错误')

    messageRef.value = '自定义错误'
    await validateField('name')
    expect(errors.name).toBe('自定义错误')
  })

  it('无规则字段：validateField 直接返回 true', async () => {
    const { validateField, errors } = useForm({
      initialValues: { name: '张三', age: 18 },
      rules: {
        name: (v) => (v ? true : '请输入姓名'),
      },
    })
    expect(await validateField('age')).toBe(true)
    expect(errors.age).toBeUndefined()
  })

  // ==================== 回归：结构变更（新增/删除字段） ====================

  it('reset：传入含新字段的初始值时新增字段进入响应式追踪', () => {
    const { values, reset } = useForm<Record<string, any>>({
      initialValues: { name: '', age: 0 },
    })
    reset({ name: '王五', age: 30, email: 'wang@example.com' })
    expect(values.name).toBe('王五')
    expect(values.age).toBe(30)
    // 新增字段应可写入并参与响应式（reactive 能感知）
    expect(values.email).toBe('wang@example.com')
  })

  it('reset：传入不含旧字段的初始值时删除旧字段', () => {
    const { values, reset } = useForm<Record<string, any>>({
      initialValues: { name: '', age: 0 },
    })
    reset({ name: '王五' })
    expect(values.name).toBe('王五')
    expect('age' in values).toBe(false)
  })

  it('reset：在异步校验进行中调用时清除校验中标记', async () => {
    const { validateField, reset, isValidating } = useForm({
      initialValues: { name: '' },
      rules: {
        name: async (v) => {
          await new Promise((resolve) => setTimeout(resolve, 10))
          return v ? true : '请输入姓名'
        },
      },
    })

    const promise = validateField('name')
    expect(isValidating.value).toBe(true)

    // 校验完成前调用 reset
    reset()
    expect(isValidating.value).toBe(false)

    await promise
    // reset 后残留的 validatingFields 不阻塞 valid
    expect(isValidating.value).toBe(false)
  })

  it('setValues：可新增字段并删除被替换的旧字段', () => {
    const { values, setValues } = useForm<Record<string, any>>({
      initialValues: { name: '', age: 0 },
    })
    setValues({ name: '赵六', email: 'zhao@example.com' })
    expect(values.name).toBe('赵六')
    expect(values.email).toBe('zhao@example.com')
    // age 不在新值中，应从结构中移除
    expect('age' in values).toBe(false)
  })

  it('validateOnMount：挂载时自动校验字段', async () => {
    // 使用 vue-test-utils 挂载一个使用 useForm 的组件，验证 onMounted 自动校验
    const { mount } = await import('@vue/test-utils')
    const { defineComponent, h, nextTick } = await import('vue')

    let formApi: any = null

    const TestForm = defineComponent({
      setup() {
        formApi = useForm({
          initialValues: { name: '' },
          rules: {
            name: (v: string) => (v ? true : '姓名必填'),
          },
          validateOnMount: true,
        })
        return () => h('div', { class: 'test-form' })
      },
    })

    mount(TestForm)
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))

    expect(formApi.errors.name).toBe('姓名必填')
    expect(formApi.valid.value).toBe(false)
  })
})
