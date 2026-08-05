import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../../components/Button.vue'

describe('Button', () => {
  it('渲染默认 props class', () => {
    const wrapper = mount(Button, { props: { label: '点击' } })
    expect(wrapper.classes()).toContain('mg-button')
    expect(wrapper.classes()).toContain('mg-button-filled-primary')
    expect(wrapper.classes()).toContain('mg-button-sm')
    expect(wrapper.text()).toContain('点击')
  })

  it('渲染 variant/color/size 变体 class', () => {
    const wrapper = mount(Button, {
      props: { variant: 'outline', color: 'error', size: 'lg' },
    })
    expect(wrapper.classes()).toContain('mg-button-outline-error')
    expect(wrapper.classes()).toContain('mg-button-lg')
  })

  it('block prop 添加块级 class', () => {
    const wrapper = mount(Button, { props: { block: true } })
    expect(wrapper.classes()).toContain('mg-button-block')
  })

  it('loading 时禁用并显示加载图标', () => {
    const wrapper = mount(Button, { props: { loading: true, label: '保存' } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.find('.mg-button-loading-icon').exists()).toBe(true)
    expect(wrapper.find('.mg-button-label').exists()).toBe(false)
  })

  it('loading + showLabelWhileLoading 显示 label', () => {
    const wrapper = mount(Button, {
      props: { loading: true, showLabelWhileLoading: true, label: '保存中' },
    })
    expect(wrapper.find('.mg-button-label').exists()).toBe(true)
    expect(wrapper.text()).toContain('保存中')
  })

  it('loadingLabel 覆盖默认 label', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
        showLabelWhileLoading: true,
        label: '保存',
        loadingLabel: '保存中…',
      },
    })
    expect(wrapper.text()).toContain('保存中…')
  })

  it('正常状态下点击触发 click 事件', () => {
    const wrapper = mount(Button, { props: { label: '按钮' } })
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('disabled 时不触发 click', () => {
    const wrapper = mount(Button, { props: { disabled: true, label: '按钮' } })
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('loading 时不触发 click', () => {
    const wrapper = mount(Button, { props: { loading: true, label: '按钮' } })
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('icon 插槽渲染', () => {
    const wrapper = mount(Button, {
      slots: { icon: '<span class="custom-icon">★</span>' },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })

  it('默认插槽渲染 label 内容', () => {
    const wrapper = mount(Button, {
      slots: { default: '自定义内容' },
    })
    expect(wrapper.text()).toContain('自定义内容')
  })

  it('透传原生属性', () => {
    const wrapper = mount(Button, {
      attrs: { id: 'submit-btn', 'data-test': 'test-id' },
    })
    expect(wrapper.attributes('id')).toBe('submit-btn')
    expect(wrapper.attributes('data-test')).toBe('test-id')
  })
})
