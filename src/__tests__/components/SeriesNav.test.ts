import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SeriesNav from '../../components/SeriesNav.vue'

const items = [
  { key: 'part-1', label: 'Part 1: 从自由叙事到契约约束', href: '/docs/part-1' },
  { key: 'part-2', label: 'Part 2: 快速上手', href: '/docs/part-2' },
  { key: 'part-3', label: 'Part 3: 完成示例', href: '/docs/part-3' },
]

describe('SeriesNav', () => {
  it('渲染 <nav role> 与 <ol> 列表', () => {
    const wrapper = mount(SeriesNav, { props: { items } })
    expect(wrapper.find('nav.mg-series-nav').exists()).toBe(true)
    expect(wrapper.find('ol.mg-series-nav-list').exists()).toBe(true)
    expect(wrapper.findAll('li.mg-series-nav-item')).toHaveLength(items.length)
  })

  it('默认渲染序号圆点（从 1 开始）', () => {
    const wrapper = mount(SeriesNav, { props: { items } })
    const indexes = wrapper.findAll('.mg-series-nav-index').map((w) => w.text())
    expect(indexes).toEqual(['1', '2', '3'])
  })

  it('numbered=false 时不渲染序号圆点', () => {
    const wrapper = mount(SeriesNav, { props: { items, numbered: false } })
    expect(wrapper.findAll('.mg-series-nav-index')).toHaveLength(0)
  })

  it('href 存在时渲染 <a>，否则渲染文本 span', () => {
    const noHref = [
      { key: 'a', label: '无链接' },
      { key: 'b', label: '有链接', href: '/x' },
    ]
    const wrapper = mount(SeriesNav, { props: { items: noHref } })
    expect(wrapper.findAll('a.mg-series-nav-link')).toHaveLength(1)
    expect(wrapper.findAll('span.mg-series-nav-label')).toHaveLength(1)
  })

  it('disabled 项不渲染为链接，且带 disabled class', () => {
    const disabled = [
      { key: 'a', label: '禁用', href: '/x', disabled: true },
      { key: 'b', label: '正常', href: '/y' },
    ]
    const wrapper = mount(SeriesNav, { props: { items: disabled } })
    // 禁用项不作为链接
    expect(wrapper.findAll('a.mg-series-nav-link')).toHaveLength(1)
    const firstLi = wrapper.findAll('li.mg-series-nav-item')[0]
    expect(firstLi.classes()).toContain('mg-series-nav-item-disabled')
  })

  it('active 对应项高亮并带 aria-current', () => {
    const wrapper = mount(SeriesNav, { props: { items, active: 'part-2' } })
    const lis = wrapper.findAll('li.mg-series-nav-item')
    expect(lis[1].classes()).toContain('mg-series-nav-item-active')
    expect(lis[1].attributes('aria-current')).toBe('true')
    expect(lis[0].attributes('aria-current')).toBeUndefined()
  })

  it('隐藏 title 时渲染标题插槽', () => {
    const wrapper = mount(SeriesNav, {
      props: { items, title: '叙事引擎（6 篇系列）' },
    })
    expect(wrapper.find('.mg-series-nav-head').text()).toContain('叙事引擎')
  })

  it('title 插槽优先级高于 title prop', () => {
    const wrapper = mount(SeriesNav, {
      props: { items, title: '来自 prop' },
      slots: { title: '<span class="custom-title">来自插槽</span>' },
    })
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.mg-series-nav-head').text()).toContain('来自插槽')
  })

  it('item 插槽可自定义行并拿到 item/index', () => {
    const wrapper = mount(SeriesNav, {
      props: { items },
      slots: {
        item: `<template #item="{ item, index }"><span class="custom-item" :data-index="index">{{ item.key }}</span></template>`,
      },
    })
    const custom = wrapper.findAll('.custom-item')
    expect(custom).toHaveLength(items.length)
    expect(custom[0].attributes('data-index')).toBe('0')
    expect(custom[0].text()).toBe('part-1')
  })
})

describe('SeriesNav 窗口化折叠', () => {
  // 7 项，激活第 4 项（下标 3）
  const many = Array.from({ length: 7 }, (_, i) => ({
    key: `p-${i + 1}`,
    label: `Part ${i + 1}`,
    href: `/p/${i + 1}`,
  }))

  it('未超过阈值时全部展示，无折叠占位', () => {
    const wrapper = mount(SeriesNav, { props: { items: many, visibleCount: 10 } })
    expect(wrapper.findAll('li.mg-series-nav-item')).toHaveLength(7)
    expect(wrapper.findAll('.mg-series-nav-toggle')).toHaveLength(0)
  })

  it('超过阈值时单一收缩：保留首/末/激活，其余折叠为一个占位', () => {
    const wrapper = mount(SeriesNav, {
      props: { items: many, active: 'p-4', visibleCount: 5 },
    })
    const visibleKeys = wrapper
      .findAll('li.mg-series-nav-item:not(.mg-series-nav-gap)')
      .map((li) => li.find('.mg-series-nav-link').text())
    // 保留：首(Part1)、激活(Part4)、末(Part7)；其余折叠
    expect(visibleKeys).toEqual(['Part 1', 'Part 4', 'Part 7'])
    // 只有**一个**收缩占位
    const toggles = wrapper.findAll('.mg-series-nav-toggle')
    expect(toggles).toHaveLength(1)
    expect(toggles[0].text()).toBe('4 more parts...')
    expect(toggles[0].attributes('aria-expanded')).toBe('false')
  })

  it('激活项居中时也只出现一个收缩占位（隐藏被拆两段仍合并为一）', () => {
    const wrapper = mount(SeriesNav, {
      props: { items: many, active: 'p-4', visibleCount: 3 },
    })
    // 只保留首/末/激活 → 3 个可见项 + 1 个占位
    const visibleKeys = wrapper
      .findAll('li.mg-series-nav-item:not(.mg-series-nav-gap)')
      .map((li) => li.find('.mg-series-nav-link').text())
    expect(visibleKeys).toEqual(['Part 1', 'Part 4', 'Part 7'])
    expect(wrapper.findAll('.mg-series-nav-toggle')).toHaveLength(1)
    expect(wrapper.find('.mg-series-nav-toggle').text()).toBe('4 more parts...')
  })

  it('点击折叠占位后展开完整列表', async () => {
    const wrapper = mount(SeriesNav, {
      props: { items: many, active: 'p-4', visibleCount: 5 },
    })
    const toggle = wrapper.find('.mg-series-nav-toggle')
    await toggle.trigger('click')
    await nextTick()
    expect(wrapper.findAll('li.mg-series-nav-item')).toHaveLength(7)
    expect(wrapper.find('.mg-series-nav-toggle').exists()).toBe(false)
  })

  it('无激活项时仍保留首项，避免整列表被折叠为空', () => {
    const wrapper = mount(SeriesNav, { props: { items: many, visibleCount: 3 } })
    const visibleKeys = wrapper
      .findAll('li.mg-series-nav-item:not(.mg-series-nav-gap)')
      .map((li) => li.find('.mg-series-nav-link').text())
    expect(visibleKeys).toContain('Part 1')
    expect(visibleKeys).toContain('Part 7')
  })

  it('项数不超过阈值时即使 visibleCount 大于项数也不折叠', () => {
    const small = items
    const wrapper = mount(SeriesNav, { props: { items: small, visibleCount: 5 } })
    expect(wrapper.findAll('li.mg-series-nav-item')).toHaveLength(3)
    expect(wrapper.find('.mg-series-nav-toggle').exists()).toBe(false)
  })
})
