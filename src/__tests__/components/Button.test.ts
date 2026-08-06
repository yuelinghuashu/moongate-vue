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

  it('icon 为组件对象时渲染 component', () => {
    const IconComp = { template: '<svg class="custom-svg-icon" />' }
    const wrapper = mount(Button, {
      props: { icon: IconComp },
    })
    expect(wrapper.find('.custom-svg-icon').exists()).toBe(true)
    expect(wrapper.find('.mg-button-icon').exists()).toBe(true)
  })

  it('icon 为字符串时渲染文本', () => {
    const wrapper = mount(Button, {
      props: { icon: '★' },
    })
    expect(wrapper.find('.mg-button-icon').text()).toBe('★')
  })

  it('type prop 透传到原生 button', () => {
    const wrapper = mount(Button, {
      props: { type: 'submit', label: '提交' },
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('默认 type 为 button', () => {
    const wrapper = mount(Button, { props: { label: '默认' } })
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('loading-label 插槽覆盖默认加载文字', () => {
    const wrapper = mount(Button, {
      props: { loading: true, showLabelWhileLoading: true, label: '保存' },
      slots: { 'loading-label': '<span class="custom-loading">自定义加载</span>' },
    })
    expect(wrapper.find('.custom-loading').exists()).toBe(true)
  })

  it('label 为 undefined（未传或显式 undefined）时不渲染空 label 容器', () => {
    const wrapper = mount(Button, { props: { label: undefined } })
    // withDefaults 将 undefined 解析为默认值 ''，因此与空字符串行为一致：不渲染空容器
    expect(wrapper.find('.mg-button-label').exists()).toBe(false)
  })

  it('label 为空字符串时不渲染空 label 容器（纯图标按钮）', () => {
    const wrapper = mount(Button, { props: { label: '', icon: '★' } })
    // hasLabel 计算属性：label === '' 且无默认插槽时，不渲染 label 容器
    expect(wrapper.find('.mg-button-label').exists()).toBe(false)
    // 但图标仍然显示
    expect(wrapper.find('.mg-button-icon').exists()).toBe(true)
  })

  it('icon 插槽优先于 icon prop', () => {
    const IconComp = { template: '<svg class="prop-icon" />' }
    const wrapper = mount(Button, {
      props: { icon: IconComp },
      slots: { icon: '<span class="slot-icon">自定义</span>' },
    })
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
    expect(wrapper.find('.prop-icon').exists()).toBe(false)
  })
})
