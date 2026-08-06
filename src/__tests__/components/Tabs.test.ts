import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Tabs from '../../components/Tabs.vue'

const tabs = [
  { label: '概览', content: '概览内容' },
  { label: '详情', content: '详情内容' },
  { label: '设置', content: '设置内容' },
]

describe('Tabs', () => {
  it('渲染标签与默认内容', () => {
    const wrapper = mount(Tabs, { props: { tabs } })
    expect(wrapper.findAll('.mg-tab')).toHaveLength(3)
    expect(wrapper.find('.mg-tab').text()).toContain('概览')
    expect(wrapper.text()).toContain('概览内容')
  })

  it('第一个标签默认激活', () => {
    const wrapper = mount(Tabs, { props: { tabs } })
    const firstTab = wrapper.findAll('.mg-tab')[0]
    expect(firstTab.classes()).toContain('mg-tab-active')
  })

  it('tab 按钮与面板的 aria 关联正确', () => {
    const wrapper = mount(Tabs, { props: { tabs } })
    const firstTab = wrapper.findAll('.mg-tab')[0]
    const firstPanel = wrapper.findAll('.mg-tab-panel')[0]
    // tab 按钮拥有 id 和 aria-controls
    expect(firstTab.attributes('id')).toBe('mg-tab-0')
    expect(firstTab.attributes('aria-controls')).toBe('mg-tab-panel-0')
    // 面板 aria-labelledby 指向对应 tab 按钮
    expect(firstPanel.attributes('aria-labelledby')).toBe('mg-tab-0')
    // aria-selected 状态正确
    expect(firstTab.attributes('aria-selected')).toBe('true')
    expect(wrapper.findAll('.mg-tab')[1].attributes('aria-selected')).toBe('false')
  })

  it('size/variant class', () => {
    const wrapper = mount(Tabs, { props: { tabs, size: 'lg', variant: 'card' } })
    expect(wrapper.classes()).toContain('mg-tabs-lg')
    expect(wrapper.classes()).toContain('mg-tabs-card')
  })

  it('点击切换标签', async () => {
    const wrapper = mount(Tabs, {
      props: { tabs, 'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }) },
    })
    await wrapper.findAll('.mg-tab')[1].trigger('click')
    // 第二个面板激活
    const panels = wrapper.findAll('.mg-tab-panel')
    expect(panels[1].classes()).toContain('mg-tab-panel-active')
    expect(wrapper.findAll('.mg-tab')[1].classes()).toContain('mg-tab-active')
    expect(wrapper.emitted('change')).toEqual([[1, tabs[1]]])
  })

  it('点击已激活标签不触发 change', async () => {
    const wrapper = mount(Tabs, { props: { tabs } })
    await wrapper.findAll('.mg-tab')[0].trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('禁用标签不可点击', async () => {
    const disabledTabs = [
      { label: '概览', content: 'A' },
      { label: '禁用', content: 'B', disabled: true },
    ]
    const wrapper = mount(Tabs, { props: { tabs: disabledTabs } })
    const disabledTab = wrapper.findAll('.mg-tab')[1]
    expect(disabledTab.attributes('disabled')).toBeDefined()

    await disabledTab.trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('panel 插槽', () => {
    const wrapper = mount(Tabs, {
      props: { tabs },
      slots: { 'panel-1': '<span class="custom-panel">自定义面板</span>' },
    })
    expect(wrapper.find('.custom-panel').exists()).toBe(true)
  })

  it('懒加载模式只渲染激活面板', () => {
    const wrapper = mount(Tabs, {
      props: { tabs, lazy: true },
    })
    // 只渲染第一个面板
    expect(wrapper.findAll('.mg-tab-panel')).toHaveLength(1)
    expect(wrapper.text()).toContain('概览内容')
    expect(wrapper.text()).not.toContain('详情内容')
  })

  it('图标渲染', () => {
    const iconTabs = [{ label: '首页', icon: '🏠', content: 'A' }]
    const wrapper = mount(Tabs, { props: { tabs: iconTabs } })
    expect(wrapper.find('.mg-tab-icon').text()).toBe('🏠')
  })
})
