import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Switch from '../../components/Switch.vue'

describe('Switch', () => {
  it('渲染标签与默认 class', () => {
    const wrapper = mount(Switch, { props: { label: '开启通知' } })
    expect(wrapper.classes()).toContain('mg-switch')
    expect(wrapper.classes()).toContain('mg-switch-md')
    expect(wrapper.text()).toContain('开启通知')
  })

  it('size 变体 class', () => {
    const wrapper = mount(Switch, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('mg-switch-lg')
  })

  it('disabled/error 状态 class', () => {
    const wrapper = mount(Switch, { props: { disabled: true, error: true } })
    expect(wrapper.classes()).toContain('mg-switch-disabled')
    expect(wrapper.classes()).toContain('mg-switch-error')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('modelValue=true 时选中', () => {
    const wrapper = mount(Switch, { props: { modelValue: true } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('切换时更新 v-model', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
        'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('change 事件透传', async () => {
    const wrapper = mount(Switch, { props: {} })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('label 具名插槽优先于 label prop', () => {
    const wrapper = mount(Switch, {
      props: { label: 'prop 标签' },
      slots: { label: '<span class="custom-switch-label">插槽标签</span>' },
    })
    expect(wrapper.find('.custom-switch-label').exists()).toBe(true)
    expect(wrapper.find('.custom-switch-label').text()).toBe('插槽标签')
    expect(wrapper.text()).not.toContain('prop 标签')
  })
})
