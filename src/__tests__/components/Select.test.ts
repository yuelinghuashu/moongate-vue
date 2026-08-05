import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from '../../components/Select.vue'

const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
]

describe('Select', () => {
  it('原生模式：渲染 options', () => {
    const wrapper = mount(Select, { props: { options } })
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.findAll('option')).toHaveLength(3)
    expect(wrapper.text()).toContain('苹果')
  })

  it('原生模式：placeholder 显示为 disabled option', () => {
    const wrapper = mount(Select, { props: { options, placeholder: '请选择' } })
    const placeholder = wrapper.find('option[value=""]')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.attributes('disabled')).toBeDefined()
    expect(placeholder.text()).toContain('请选择')
  })

  it('原生模式：change 事件更新 modelValue', async () => {
    const wrapper = mount(Select, {
      props: { options, 'onUpdate:modelValue': (v: string) => wrapper.setProps({ modelValue: v }) },
    })
    await wrapper.find('select').setValue('banana')
    expect(wrapper.emitted('update:modelValue')).toEqual([['banana']])
    expect(wrapper.emitted('change')).toEqual([['banana']])
  })

  it('原生模式：数字类型回溯', async () => {
    const numOptions = [1, 2, 3]
    const wrapper = mount(Select, {
      props: {
        options: numOptions,
        'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('select').setValue('2')
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('原生模式：size/error class', () => {
    const wrapper = mount(Select, { props: { options, size: 'lg', error: true } })
    expect(wrapper.find('select').classes()).toContain('mg-select-lg')
    expect(wrapper.find('.mg-select-wrapper').classes()).toContain('mg-select-error')
  })

  it('原生模式：disabled', () => {
    const wrapper = mount(Select, { props: { options, disabled: true } })
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
  })

  it('可搜索模式：聚焦打开下拉', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    expect(wrapper.find('.mg-select-filterable').exists()).toBe(true)
    await wrapper.find('.mg-select-input').trigger('focus')
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(true)
    expect(wrapper.findAll('.mg-select-option')).toHaveLength(3)
  })

  it('可搜索模式：选中选项更新 modelValue', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        filterable: true,
        'onUpdate:modelValue': (v: string) => wrapper.setProps({ modelValue: v }),
      },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.findAll('.mg-select-option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['banana']])
  })

  it('可搜索模式：搜索过滤选项', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.find('.mg-select-input').setValue('苹')
    expect(wrapper.findAll('.mg-select-option')).toHaveLength(1)
    expect(wrapper.text()).toContain('苹果')
  })

  it('可搜索模式：空状态显示 emptyText', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true, emptyText: '无匹配选项' },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.find('.mg-select-input').setValue('不存在')
    expect(wrapper.find('.mg-select-empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('无匹配选项')
  })

  it('可搜索模式：搜索事件', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.find('.mg-select-input').setValue('苹')
    expect(wrapper.emitted('search')).toEqual([['苹']])
  })
})
