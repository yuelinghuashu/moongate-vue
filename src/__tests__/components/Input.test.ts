import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from '../../components/Input.vue'
import FormItem from '../../components/FormItem.vue'

describe('Input', () => {
  it('渲染基础 input', () => {
    const wrapper = mount(Input)
    expect(wrapper.element.tagName).toBe('INPUT')
    expect(wrapper.classes()).toContain('mg-input')
    expect(wrapper.classes()).toContain('mg-input-md')
  })

  it('渲染 type/placeholder/disabled/readonly', () => {
    const wrapper = mount(Input, {
      props: {
        type: 'password',
        placeholder: '请输入密码',
        disabled: true,
        readonly: true,
      },
    })
    expect(wrapper.attributes('type')).toBe('password')
    expect(wrapper.attributes('placeholder')).toBe('请输入密码')
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('readonly')).toBeDefined()
  })

  it('size 变体 class', () => {
    const wrapper = mount(Input, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('mg-input-lg')
  })

  it('error 状态添加 class', () => {
    const wrapper = mount(Input, { props: { error: true } })
    expect(wrapper.classes()).toContain('mg-input-error')
  })

  it('v-model 双向绑定', () => {
    const wrapper = mount(Input, { props: { modelValue: '初始值' } })
    expect((wrapper.element as HTMLInputElement).value).toBe('初始值')

    wrapper.setValue('新值')
    expect(wrapper.emitted('update:modelValue')).toEqual([['新值']])
  })

  it('input 事件透传', () => {
    const wrapper = mount(Input)
    wrapper.trigger('input')
    expect(wrapper.emitted('input')).toHaveLength(1)
  })

  it('blur/focus 事件透传', () => {
    const wrapper = mount(Input)
    wrapper.trigger('blur')
    wrapper.trigger('focus')
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(wrapper.emitted('focus')).toHaveLength(1)
  })

  it('change 事件透传', () => {
    const wrapper = mount(Input)
    wrapper.trigger('change')
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('透传原生属性', () => {
    const wrapper = mount(Input, {
      attrs: { id: 'email', name: 'email', autocomplete: 'off' },
    })
    expect(wrapper.attributes('id')).toBe('email')
    expect(wrapper.attributes('name')).toBe('email')
    expect(wrapper.attributes('autocomplete')).toBe('off')
  })

  it('包裹在 FormItem 内时自动获得字段 id', () => {
    const wrapper = mount(FormItem, {
      props: { name: 'username', label: '用户名' },
      slots: { default: Input },
    })

    const inputId = wrapper.find('input').attributes('id')
    const labelFor = wrapper.find('.mg-form-item__label').attributes('for')
    expect(inputId).toBeTruthy()
    expect(labelFor).toBe(inputId)
  })

  it('包裹在 FormItem 内时 aria-describedby 关联错误提示', async () => {
    const wrapper = mount(FormItem, {
      props: { name: 'username', label: '用户名' },
      slots: { default: Input },
    })

    // 无错误时无 aria-describedby
    expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined()

    // 设置错误后出现 aria-describedby，且指向错误提示元素
    await wrapper.setProps({ error: '用户名不能为空' })
    const describedBy = wrapper.find('input').attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(wrapper.find('.mg-form-item__error').text()).toBe('用户名不能为空')
  })
})
