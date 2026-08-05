import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Textarea from '../../components/Textarea.vue'

describe('Textarea', () => {
  it('渲染基础 textarea', () => {
    const wrapper = mount(Textarea)
    expect(wrapper.element.tagName).toBe('TEXTAREA')
    expect(wrapper.classes()).toContain('mg-textarea')
    expect(wrapper.classes()).toContain('mg-textarea-md')
  })

  it('渲染 placeholder/disabled/readonly/rows', () => {
    const wrapper = mount(Textarea, {
      props: {
        placeholder: '请输入内容',
        disabled: true,
        readonly: true,
        rows: 5,
      },
    })
    expect(wrapper.attributes('placeholder')).toBe('请输入内容')
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('readonly')).toBeDefined()
    expect(wrapper.attributes('rows')).toBe('5')
  })

  it('size 变体 class', () => {
    const wrapper = mount(Textarea, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('mg-textarea-sm')
  })

  it('error 状态 class', () => {
    const wrapper = mount(Textarea, { props: { error: true } })
    expect(wrapper.classes()).toContain('mg-textarea-error')
  })

  it('v-model 双向绑定', () => {
    const wrapper = mount(Textarea, { props: { modelValue: '初始内容' } })
    expect((wrapper.element as HTMLTextAreaElement).value).toBe('初始内容')

    wrapper.setValue('新内容')
    expect(wrapper.emitted('update:modelValue')).toEqual([['新内容']])
  })

  it('input/blur/focus/change 事件透传', () => {
    const wrapper = mount(Textarea)
    wrapper.trigger('input')
    wrapper.trigger('blur')
    wrapper.trigger('focus')
    wrapper.trigger('change')
    expect(wrapper.emitted('input')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('change')).toHaveLength(1)
  })

  it('透传原生属性', () => {
    const wrapper = mount(Textarea, {
      attrs: { name: 'bio', 'data-test': 'bio-area' },
    })
    expect(wrapper.attributes('name')).toBe('bio')
    expect(wrapper.attributes('data-test')).toBe('bio-area')
  })
})
