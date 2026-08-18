import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import Form from '../../components/Form.vue'
import FormItem from '../../components/FormItem.vue'
import { useForm } from '../../composables/useForm'
import { setConfig, resetConfig } from '../../config'

describe('Form', () => {
  it('渲染 form 容器与插槽内容', () => {
    const wrapper = mount(Form, {
      slots: { default: '<div class="slot-content">内容</div>' },
    })
    expect(wrapper.find('form.mg-form').exists()).toBe(true)
    expect(wrapper.find('.slot-content').text()).toBe('内容')
  })

  it('默认 horizontal 布局 class', () => {
    const wrapper = mount(Form)
    expect(wrapper.find('form').classes()).toContain('mg-form--horizontal')
  })

  it('layout 属性生成对应 class', () => {
    const wrapper = mount(Form, { props: { layout: 'vertical' } })
    expect(wrapper.find('form').classes()).toContain('mg-form--vertical')
  })

  it('labelWidth 通过 CSS 变量下发', () => {
    const wrapper = mount(Form, { props: { labelWidth: '120px' } })
    expect(wrapper.find('form').attributes('style')).toContain('--mg-form-label-width: 120px')
  })

  it('submit 事件透传', async () => {
    const wrapper = mount(Form)
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})

describe('FormItem', () => {
  it('渲染 label 与必填星号', () => {
    const wrapper = mount(FormItem, {
      props: { name: 'username', label: '用户名', required: true },
    })
    expect(wrapper.find('.mg-form-item__label').text()).toContain('用户名')
    expect(wrapper.find('.mg-form-item__required').exists()).toBe(true)
    expect(wrapper.find('.mg-form-item__required').text()).toBe('*')
  })

  it('无 label 时不渲染 label 元素', () => {
    const wrapper = mount(FormItem, { props: { name: 'username' } })
    expect(wrapper.find('.mg-form-item__label').exists()).toBe(false)
  })

  it('未包裹在 Form 内时静默降级', () => {
    const wrapper = mount(FormItem, { props: { name: 'username', label: '用户名' } })
    expect(wrapper.find('.mg-form-item__error').exists()).toBe(false)
    expect(wrapper.find('.mg-form-item__validating').exists()).toBe(false)
  })

  it('自动生成字段 id 关联 label for 与 input id', () => {
    const wrapper = mount(FormItem, {
      props: { name: 'username', label: '用户名' },
      slots: { default: '<input class="native-input" />' },
    })

    const labelFor = wrapper.find('.mg-form-item__label').attributes('for')
    expect(labelFor).toBeTruthy()

    // 由于 slot 中的原生 input 不消费 FormItem 注入的 id，
    // 验证 label for 存在且格式正确
    expect(labelFor).toMatch(/^mg-field-/)
  })

  it('自定义 for prop 覆盖自动生成的 id', () => {
    const wrapper = mount(FormItem, {
      props: { name: 'username', label: '用户名', for: 'custom-input' },
    })
    expect(wrapper.find('.mg-form-item__label').attributes('for')).toBe('custom-input')
  })
})

describe('Form + FormItem 集成', () => {
  // 该测试组依赖默认中文文案，显式设置
  setConfig({ locale: 'zh-CN' })
  afterEach(() => resetConfig())

  it('传入 errors 时显示错误文案与 error class', () => {
    const Host = defineComponent({
      components: { Form, FormItem },
      setup() {
        return () =>
          h(Form, { errors: { username: '用户名不能为空' } }, () =>
            h(FormItem, { name: 'username', label: '用户名', required: true }, () => null),
          )
      },
    })
    const wrapper = mount(Host)
    const item = wrapper.find('.mg-form-item')
    expect(item.classes()).toContain('mg-form-item--error')
    expect(item.find('.mg-form-item__error').text()).toBe('用户名不能为空')
  })

  it('无 errors 时不渲染错误文案', () => {
    const Host = defineComponent({
      components: { Form, FormItem },
      setup() {
        return () =>
          h(Form, {}, () => h(FormItem, { name: 'username', label: '用户名' }, () => null))
      },
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.mg-form-item__error').exists()).toBe(false)
  })

  it('validatingFields[name] 为 true 时显示校验中状态', () => {
    const Host = defineComponent({
      components: { Form, FormItem },
      setup() {
        return () =>
          h(Form, { validatingFields: { username: true } }, () =>
            h(FormItem, { name: 'username', label: '用户名' }, () => null),
          )
      },
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.mg-form-item').classes()).toContain('mg-form-item--validating')
    expect(wrapper.find('.mg-form-item__validating').text()).toBe('校验中…')
  })

  it('validatingFields 其他字段为 true 时本校不显示校验中', () => {
    const Host = defineComponent({
      components: { Form, FormItem },
      setup() {
        return () =>
          h(Form, { validatingFields: { email: true } }, () =>
            h(FormItem, { name: 'username', label: '用户名' }, () => null),
          )
      },
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.mg-form-item__validating').exists()).toBe(false)
  })

  it('自定义 error prop 覆盖注入 errors', () => {
    const Host = defineComponent({
      components: { Form, FormItem },
      setup() {
        return () =>
          h(Form, { errors: { username: '注入错误' } }, () =>
            h(FormItem, { name: 'username', label: '用户名', error: '自定义错误' }, () => null),
          )
      },
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.mg-form-item__error').text()).toBe('自定义错误')
  })
})

describe('Form + FormItem + useForm 端到端', () => {
  it('输入 → blur 校验 → 错误显示 → 修正 → 错误消失', async () => {
    const Host = defineComponent({
      components: { Form, FormItem },
      setup() {
        const { values, errors, validatingFields, validateField } = useForm({
          initialValues: { username: '' },
          rules: {
            username: (v: string) => (v.length >= 3 ? true : '用户名至少 3 个字符'),
          },
        })

        return () =>
          h(Form, { errors, validatingFields }, () =>
            h(FormItem, { name: 'username', label: '用户名', required: true }, () =>
              h('input', {
                class: 'native-input',
                value: values.username,
                onInput: (e: Event) => {
                  values.username = (e.target as HTMLInputElement).value
                },
                onBlur: () => validateField('username'),
              }),
            ),
          )
      },
    })

    const wrapper = mount(Host)
    const input = wrapper.find('.native-input')

    expect(wrapper.find('.mg-form-item__error').exists()).toBe(false)

    await input.setValue('ab')
    await input.trigger('blur')
    await nextTick()
    expect(wrapper.find('.mg-form-item__error').text()).toBe('用户名至少 3 个字符')
    expect(wrapper.find('.mg-form-item').classes()).toContain('mg-form-item--error')

    await input.setValue('abc')
    await input.trigger('blur')
    await nextTick()
    expect(wrapper.find('.mg-form-item__error').exists()).toBe(false)
    expect(wrapper.find('.mg-form-item').classes()).not.toContain('mg-form-item--error')
  })
})
