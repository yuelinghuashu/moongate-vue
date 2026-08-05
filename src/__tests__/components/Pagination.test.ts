import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '../../components/Pagination.vue'

describe('Pagination', () => {
  it('渲染基础分页', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 10, modelValue: 1 },
    })
    expect(wrapper.classes()).toContain('mg-pagination')
    expect(wrapper.find('.mg-pagination-total').text()).toBe('10')
    expect(wrapper.find('.mg-pagination-current').text()).toBe('1')
  })

  it('size 变体 class', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 1, size: 'lg' },
    })
    expect(wrapper.classes()).toContain('mg-pagination-lg')
  })

  it('第一页时上一页按钮禁用', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 1 },
    })
    const prevBtn = wrapper.findAll('button')[0] // showQuickJump 时第一个是 first
    const allBtns = wrapper.findAll('button')
    // showQuickJump=true： « 上一页 下一页 »
    expect(allBtns[0].attributes('disabled')).toBeDefined()
    expect(allBtns[1].attributes('disabled')).toBeDefined()
  })

  it('最后一页时下一页按钮禁用', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 5 },
    })
    const allBtns = wrapper.findAll('button')
    expect(allBtns[2].attributes('disabled')).toBeDefined()
    expect(allBtns[3].attributes('disabled')).toBeDefined()
  })

  it('点击下一页更新页码', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 10, modelValue: 1 },
    })
    const allBtns = wrapper.findAll('button')
    allBtns[2].trigger('click') // 下一页
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
    expect(wrapper.emitted('change')).toEqual([[2]])
  })

  it('showQuickJump=false 时不显示首尾按钮', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 5, modelValue: 1, showQuickJump: false },
    })
    expect(wrapper.findAll('button')).toHaveLength(2)
  })

  it('跳转第一页/最后一页', () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 10, modelValue: 5 },
    })
    const allBtns = wrapper.findAll('button')
    allBtns[0].trigger('click') // 第一页
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
    allBtns[3].trigger('click') // 最后一页
    expect(wrapper.emitted('update:modelValue')).toEqual([[1], [10]])
  })

  it('当前页点击进入编辑模式并提交跳转', async () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 10, modelValue: 3 },
    })
    await wrapper.find('.mg-pagination-current').trigger('click')
    expect(wrapper.find('.mg-pagination-input').exists()).toBe(true)

    const input = wrapper.find('.mg-pagination-input')
    await input.setValue('7')
    await input.trigger('keyup.enter')
    expect(wrapper.emitted('update:modelValue')).toEqual([[7]])
  })

  it('越界页码被限制在范围内', async () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 10, modelValue: 3 },
    })
    await wrapper.find('.mg-pagination-current').trigger('click')
    const input = wrapper.find('.mg-pagination-input')
    await input.setValue('99')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')).toEqual([[10]])
  })
})
