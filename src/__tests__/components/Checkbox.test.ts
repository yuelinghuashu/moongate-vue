import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Checkbox from '../../components/Checkbox.vue'

describe('Checkbox', () => {
  it('渲染标签与默认 class', () => {
    const wrapper = mount(Checkbox, { props: { label: '同意协议' } })
    expect(wrapper.classes()).toContain('mg-checkbox')
    expect(wrapper.classes()).toContain('mg-checkbox-md')
    expect(wrapper.text()).toContain('同意协议')
  })

  it('size 变体 class', () => {
    const wrapper = mount(Checkbox, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('mg-checkbox-lg')
  })

  it('disabled/error 状态 class', () => {
    const wrapper = mount(Checkbox, { props: { disabled: true, error: true } })
    expect(wrapper.classes()).toContain('mg-checkbox-disabled')
    expect(wrapper.classes()).toContain('mg-checkbox-error')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('单选模式：选中状态与 v-model 更新', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: true,
        'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v }),
      },
    })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)

    await wrapper.find('input').setValue(false)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('单选模式：初始未选中', () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false)
  })

  it('多选模式：value 存在于数组中时选中', () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: ['a', 'b'], value: 'b' },
    })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('多选模式：勾选添加 value 到数组', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: ['a'],
        value: 'b',
        'onUpdate:modelValue': (v: string[]) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[['a', 'b']]])
  })

  it('多选模式：取消勾选移除 value', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: ['a', 'b'],
        value: 'b',
        'onUpdate:modelValue': (v: string[]) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('input').setValue(false)
    expect(wrapper.emitted('update:modelValue')).toEqual([[['a']]])
  })

  it('label 插槽', () => {
    const wrapper = mount(Checkbox, {
      slots: { default: '<span class="custom-checkbox-label">自定义</span>' },
    })
    expect(wrapper.find('.custom-checkbox-label').exists()).toBe(true)
  })

  it('透传原生属性到 input', () => {
    const wrapper = mount(Checkbox, {
      attrs: { name: 'terms', 'aria-label': '同意' },
    })
    const input = wrapper.find('input')
    expect(input.attributes('name')).toBe('terms')
    expect(input.attributes('aria-label')).toBe('同意')
  })
})
