import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../../components/Badge.vue'
import Card from '../../components/Card.vue'
import Divider from '../../components/Divider.vue'

// ==================== Badge ====================
describe('Badge', () => {
  it('渲染默认 class', () => {
    const wrapper = mount(Badge, { props: { label: '新' } })
    expect(wrapper.classes()).toContain('mg-badge')
    expect(wrapper.classes()).toContain('mg-badge-primary')
    expect(wrapper.classes()).toContain('mg-badge-md')
    expect(wrapper.text()).toContain('新')
  })

  it('color/size 变体 class', () => {
    const wrapper = mount(Badge, { props: { color: 'success', size: 'sm' } })
    expect(wrapper.classes()).toContain('mg-badge-success')
    expect(wrapper.classes()).toContain('mg-badge-sm')
  })

  it('默认插槽渲染', () => {
    const wrapper = mount(Badge, {
      slots: { default: '<span class="custom-badge">自定义</span>' },
    })
    expect(wrapper.find('.custom-badge').exists()).toBe(true)
  })
})

// ==================== Card ====================
describe('Card', () => {
  it('渲染默认 div 并带 mg-card 基础类', () => {
    const wrapper = mount(Card, {
      slots: { default: '卡片内容' },
    })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('mg-card')
    expect(wrapper.text()).toContain('卡片内容')
  })

  it('as prop 指定标签', () => {
    const wrapper = mount(Card, {
      props: { as: 'section' },
      slots: { default: '内容' },
    })
    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('hoverable 添加 class', () => {
    const wrapper = mount(Card, { props: { hoverable: true } })
    expect(wrapper.classes()).toContain('mg-card-hoverable')
  })

  it('header 插槽渲染', () => {
    const wrapper = mount(Card, {
      slots: { header: '<h3 class="custom-header">标题</h3>' },
    })
    expect(wrapper.find('.custom-header').exists()).toBe(true)
  })

  it('footer 插槽渲染且 hideFooter 隐藏', () => {
    const wrapper = mount(Card, {
      slots: { footer: '<span class="custom-footer">底部</span>' },
    })
    expect(wrapper.find('.custom-footer').exists()).toBe(true)

    const wrapper2 = mount(Card, {
      props: { hideFooter: true },
      slots: { footer: '<span class="custom-footer">底部</span>' },
    })
    expect(wrapper2.find('.custom-footer').exists()).toBe(false)
  })

  it('hideBody 隐藏 body 区', () => {
    const wrapper = mount(Card, {
      props: { hideBody: true },
      slots: { default: '正文' },
    })
    expect(wrapper.find('.mg-card-body').exists()).toBe(false)
  })

  it('外部 class 与内部 class 合并', () => {
    const wrapper = mount(Card, {
      attrs: { class: 'external-class' },
      props: { hoverable: true },
    })
    expect(wrapper.classes()).toContain('external-class')
    expect(wrapper.classes()).toContain('mg-card-hoverable')
  })
})

// ==================== Divider ====================
describe('Divider', () => {
  it('渲染水平分割线', () => {
    const wrapper = mount(Divider)
    expect(wrapper.classes()).toContain('mg-divider')
    expect(wrapper.attributes('role')).toBe('separator')
  })

  it('dashed 添加虚线 class', () => {
    const wrapper = mount(Divider, { props: { dashed: true } })
    expect(wrapper.classes()).toContain('mg-divider-dashed')
  })

  it('垂直分割线', () => {
    const wrapper = mount(Divider, { props: { vertical: true } })
    expect(wrapper.classes()).toContain('mg-divider-vertical')
  })

  it('有插槽时显示文本', () => {
    const wrapper = mount(Divider, {
      slots: { default: '分割文字' },
    })
    expect(wrapper.find('.mg-divider-text').exists()).toBe(true)
    expect(wrapper.text()).toContain('分割文字')
  })
})
