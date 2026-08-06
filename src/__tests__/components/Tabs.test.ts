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

  // ==================== 补充：懒加载模式切换 ====================

  it('懒加载模式：切换标签后渲染新面板', async () => {
    const wrapper = mount(Tabs, { props: { tabs, lazy: true } })
    // 初始只渲染第一个面板
    expect(wrapper.findAll('.mg-tab-panel')).toHaveLength(1)

    // 点击第二个标签
    await wrapper.findAll('.mg-tab')[1].trigger('click')
    // 懒加载记录第二个面板，现在有 2 个面板
    expect(wrapper.findAll('.mg-tab-panel')).toHaveLength(2)
    expect(wrapper.text()).toContain('详情内容')
  })

  it('懒加载模式：外部 modelValue 变化时记录并渲染对应面板', async () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs,
        lazy: true,
        'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }),
      },
    })
    // 外部直接更新 modelValue 到索引 2
    await wrapper.setProps({ modelValue: 2 })
    // 第 0 个 + 第 2 个面板被渲染
    expect(wrapper.findAll('.mg-tab-panel')).toHaveLength(2)
    expect(wrapper.text()).toContain('设置内容')
    // 点击第 2 个标签应该已激活
    expect(wrapper.findAll('.mg-tab')[2].classes()).toContain('mg-tab-active')
  })

  it('非懒加载模式：所有面板都渲染但只显示激活的', () => {
    const wrapper = mount(Tabs, { props: { tabs } })
    expect(wrapper.findAll('.mg-tab-panel')).toHaveLength(3)
    const visiblePanels = wrapper.findAll('.mg-tab-panel').filter((p) => p.isVisible())
    expect(visiblePanels).toHaveLength(1)
  })

  // ==================== 补充：键盘导航（WAI-ARIA Tabs Pattern） ====================

  it('roving tabindex：仅激活标签可被 Tab 聚焦', () => {
    const wrapper = mount(Tabs, { props: { tabs } })
    const tabButtons = wrapper.findAll('.mg-tab')
    // 激活的 tab（索引 0）tabindex=0，其余为 -1
    expect(tabButtons[0].attributes('tabindex')).toBe('0')
    expect(tabButtons[1].attributes('tabindex')).toBe('-1')
    expect(tabButtons[2].attributes('tabindex')).toBe('-1')
  })

  it('▶ 方向键切换到下一个标签，◀ 方向键切换到上一个', async () => {
    const wrapper = mount(Tabs, {
      props: { tabs, 'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }) },
    })
    const tabButtons = wrapper.findAll('.mg-tab')

    // 初始激活索引 0
    expect(tabButtons[0].classes()).toContain('mg-tab-active')

    // ▶ 切换到索引 1
    await tabButtons[0].trigger('keydown.right')
    expect(wrapper.findAll('.mg-tab')[1].classes()).toContain('mg-tab-active')
    expect(wrapper.emitted('change')).toEqual([[1, tabs[1]]])

    // ▶ 再切换到索引 2
    await wrapper.findAll('.mg-tab')[1].trigger('keydown.right')
    expect(wrapper.findAll('.mg-tab')[2].classes()).toContain('mg-tab-active')

    // ◀ 回到索引 1
    await wrapper.findAll('.mg-tab')[2].trigger('keydown.left')
    expect(wrapper.findAll('.mg-tab')[1].classes()).toContain('mg-tab-active')
  })

  it('方向键在最后一个标签时循环到第一个（反之亦然）', async () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs,
        modelValue: 0,
        'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }),
      },
    })

    // 从第一个 ▶ 到最后一个，再 ▶ 循环回第一个
    await wrapper.findAll('.mg-tab')[0].trigger('keydown.right')
    await wrapper.findAll('.mg-tab')[1].trigger('keydown.right')
    expect(wrapper.findAll('.mg-tab')[2].classes()).toContain('mg-tab-active')

    // 在最后一个 ▶ 循环回第一个
    await wrapper.findAll('.mg-tab')[2].trigger('keydown.right')
    expect(wrapper.findAll('.mg-tab')[0].classes()).toContain('mg-tab-active')

    // 在第一个 ◀ 循环到最后一个
    await wrapper.findAll('.mg-tab')[0].trigger('keydown.left')
    expect(wrapper.findAll('.mg-tab')[2].classes()).toContain('mg-tab-active')
  })

  it('Home 键跳转到第一个标签，End 键跳转到最后一个', async () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs,
        modelValue: 1,
        'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }),
      },
    })
    const tabButtons = wrapper.findAll('.mg-tab')

    // Home 跳转到第一个
    await tabButtons[1].trigger('keydown.home')
    expect(wrapper.findAll('.mg-tab')[0].classes()).toContain('mg-tab-active')

    // End 跳转到最后一个
    await wrapper.findAll('.mg-tab')[0].trigger('keydown.end')
    expect(wrapper.findAll('.mg-tab')[2].classes()).toContain('mg-tab-active')
  })

  it('键盘导航跳过禁用标签', async () => {
    const tabsWithDisabled = [
      { label: '概览', content: 'A' },
      { label: '禁用', content: 'B', disabled: true },
      { label: '设置', content: 'C' },
    ]
    const wrapper = mount(Tabs, { props: { tabs: tabsWithDisabled } })
    const tabButtons = wrapper.findAll('.mg-tab')

    // 激活索引 0，▶ 应跳过禁用的索引 1，直接到索引 2
    await tabButtons[0].trigger('keydown.right')
    expect(wrapper.findAll('.mg-tab')[2].classes()).toContain('mg-tab-active')
    expect(wrapper.findAll('.mg-tab')[1].classes()).not.toContain('mg-tab-active')
  })

  it('键盘切换后激活标签的 tabindex 更新为 0，其他为 -1', async () => {
    const wrapper = mount(Tabs, {
      props: { tabs, 'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v }) },
    })

    // 键盘 ▶ 切换到索引 1
    await wrapper.findAll('.mg-tab')[0].trigger('keydown.right')

    // 新激活的索引 1 的 tabindex=0
    expect(wrapper.findAll('.mg-tab')[1].attributes('tabindex')).toBe('0')
    // 其他变为 -1
    expect(wrapper.findAll('.mg-tab')[0].attributes('tabindex')).toBe('-1')
    expect(wrapper.findAll('.mg-tab')[2].attributes('tabindex')).toBe('-1')
  })
})
