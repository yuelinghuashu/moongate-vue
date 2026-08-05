import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Container from '../../components/Container.vue'
import Header from '../../components/Header.vue'
import Main from '../../components/Main.vue'
import Footer from '../../components/Footer.vue'
import Hero from '../../components/Hero.vue'

// ==================== Container ====================
describe('Container', () => {
  it('渲染默认 class', () => {
    const wrapper = mount(Container, {
      slots: { default: '主体内容' },
    })
    expect(wrapper.classes()).toContain('mg-container')
    expect(wrapper.classes()).toContain('mg-container-lg')
    expect(wrapper.text()).toContain('主体内容')
  })

  it('size 变体 class', () => {
    const wrapper = mount(Container, { props: { size: 'xl' } })
    expect(wrapper.classes()).toContain('mg-container-xl')
  })

  it('透传属性', () => {
    const wrapper = mount(Container, {
      attrs: { id: 'main-container' },
    })
    expect(wrapper.attributes('id')).toBe('main-container')
  })
})

// ==================== Header ====================
describe('Header', () => {
  it('渲染默认 class', () => {
    const wrapper = mount(Header, {
      slots: { default: '头部' },
    })
    expect(wrapper.classes()).toContain('mg-layout-header')
    expect(wrapper.text()).toContain('头部')
  })

  it('sticky 添加吸顶 class', () => {
    const wrapper = mount(Header, { props: { sticky: true } })
    expect(wrapper.classes()).toContain('mg-layout-header-sticky')
  })
})

// ==================== Main ====================
describe('Main', () => {
  it('渲染默认 class 与内容', () => {
    const wrapper = mount(Main, {
      slots: { default: '主区域' },
    })
    expect(wrapper.classes()).toContain('mg-layout-main')
    expect(wrapper.text()).toContain('主区域')
  })
})

// ==================== Footer ====================
describe('Footer', () => {
  it('渲染默认 class 与内容', () => {
    const wrapper = mount(Footer, {
      slots: { default: '页脚' },
    })
    expect(wrapper.classes()).toContain('mg-layout-footer')
    expect(wrapper.text()).toContain('页脚')
  })
})

// ==================== Hero ====================
describe('Hero', () => {
  it('渲染标题与描述', () => {
    const wrapper = mount(Hero, {
      props: { title: 'Moongate Vue', description: '极简组件库' },
    })
    expect(wrapper.classes()).toContain('mg-hero')
    expect(wrapper.find('.mg-hero-title').text()).toContain('Moongate Vue')
    expect(wrapper.find('.mg-hero-description').text()).toContain('极简组件库')
  })

  it('title/description 插槽覆盖', () => {
    const wrapper = mount(Hero, {
      slots: {
        title: '<span class="custom-title">自定义标题</span>',
        description: '<span class="custom-desc">自定义描述</span>',
      },
    })
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.custom-desc').exists()).toBe(true)
  })

  it('actions 插槽渲染', () => {
    const wrapper = mount(Hero, {
      slots: { actions: '<button class="custom-action">开始使用</button>' },
    })
    expect(wrapper.find('.custom-action').exists()).toBe(true)
  })
})
