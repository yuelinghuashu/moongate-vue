import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Radio from '../../components/Radio.vue'

describe('Radio', () => {
  it('渲染标签与默认 class', () => {
    const wrapper = mount(Radio, { props: { label: '选项A' } })
    expect(wrapper.classes()).toContain('mg-radio')
    expect(wrapper.classes()).toContain('mg-radio-md')
    expect(wrapper.text()).toContain('选项A')
  })

  it('size 变体 class', () => {
    const wrapper = mount(Radio, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('mg-radio-sm')
  })

  it('disabled/error 状态 class', () => {
    const wrapper = mount(Radio, { props: { disabled: true, error: true } })
    expect(wrapper.classes()).toContain('mg-radio-disabled')
    expect(wrapper.classes()).toContain('mg-radio-error')
  })

  it('modelValue 匹配 value 时选中', () => {
    const wrapper = mount(Radio, { props: { modelValue: 'b', value: 'b' } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('modelValue 不匹配 value 时未选中', () => {
    const wrapper = mount(Radio, { props: { modelValue: 'a', value: 'b' } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(false)
  })

  it('选中时更新 v-model 为当前 value', async () => {
    const wrapper = mount(Radio, {
      props: {
        value: 'b',
        modelValue: 'a',
        'onUpdate:modelValue': (v: string | number | undefined) =>
          wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
  })

  it('change 事件透传', async () => {
    const wrapper = mount(Radio, { props: { value: 'x' } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('label 插槽', () => {
    const wrapper = mount(Radio, {
      slots: { default: '<span class="custom-radio-label">自定义</span>' },
    })
    expect(wrapper.find('.custom-radio-label').exists()).toBe(true)
  })

  // ==================== 补充：分支测试 ====================

  it('value 为 undefined 时选中不更新 modelValue', async () => {
    const wrapper = mount(Radio, {
      props: {
        value: undefined,
        modelValue: 'a',
        'onUpdate:modelValue': (v: string | number | undefined) =>
          wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('input').setValue(true)
    // value undefined 时不更新 modelValue
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    // change 事件仍然透传
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('透传原生属性到 input', () => {
    const wrapper = mount(Radio, {
      props: { value: 'x' },
      attrs: { name: 'group1', 'aria-label': '选项' },
    })
    const input = wrapper.find('input')
    expect(input.attributes('name')).toBe('group1')
    expect(input.attributes('aria-label')).toBe('选项')
  })

  it('disabled 时 input 带 disabled attribute', () => {
    const wrapper = mount(Radio, { props: { value: 'x', disabled: true } })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('数字值类型正确比较', () => {
    const wrapper = mount(Radio, { props: { modelValue: 1, value: 1 } })
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)
  })
})
