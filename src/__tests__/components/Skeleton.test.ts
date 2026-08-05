import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Skeleton from '../../components/Skeleton.vue'

describe('Skeleton', () => {
  it('默认模式渲染行', () => {
    const wrapper = mount(Skeleton, { props: { rows: 3 } })
    expect(wrapper.classes()).toContain('mg-skeleton')
    expect(wrapper.classes()).toContain('mg-skeleton-default')
    expect(wrapper.findAll('.mg-skeleton-line')).toHaveLength(3)
  })

  it('title 模式第一行为标题', () => {
    const wrapper = mount(Skeleton, { props: { rows: 3, title: true } })
    expect(wrapper.find('.mg-skeleton-title').exists()).toBe(true)
  })

  it('rowSize 变体 class', () => {
    const wrapper = mount(Skeleton, { props: { rows: 2, rowSize: 'lg' } })
    const lines = wrapper.findAll('.mg-skeleton-line')
    expect(lines[1].classes()).toContain('mg-skeleton-line-lg')
  })

  it('card 模式渲染头像与内容', () => {
    const wrapper = mount(Skeleton, {
      props: { type: 'card', avatar: true, rows: 2 },
    })
    expect(wrapper.classes()).toContain('mg-skeleton-card')
    expect(wrapper.find('.mg-skeleton-avatar').exists()).toBe(true)
    expect(wrapper.find('.mg-skeleton-content').exists()).toBe(true)
  })

  it('card 模式无头像时不渲染', () => {
    const wrapper = mount(Skeleton, { props: { type: 'card', avatar: false } })
    expect(wrapper.find('.mg-skeleton-avatar').exists()).toBe(false)
  })

  it('avatarShape 圆角/方形 class', () => {
    const circle = mount(Skeleton, { props: { type: 'card', avatar: true, avatarShape: 'circle' } })
    expect(circle.find('.mg-skeleton-avatar').classes()).toContain('mg-skeleton-avatar-circle')

    const square = mount(Skeleton, { props: { type: 'card', avatar: true, avatarShape: 'square' } })
    expect(square.find('.mg-skeleton-avatar').classes()).toContain('mg-skeleton-avatar-square')
  })

  it('avatarSize 尺寸 class', () => {
    const wrapper = mount(Skeleton, { props: { type: 'list', avatar: true, avatarSize: 'lg' } })
    expect(wrapper.find('.mg-skeleton-avatar').classes()).toContain('mg-skeleton-avatar-lg')
  })

  it('list 模式渲染列表项', () => {
    const wrapper = mount(Skeleton, { props: { type: 'list', rows: 2 } })
    expect(wrapper.classes()).toContain('mg-skeleton-list')
    expect(wrapper.findAll('.mg-skeleton-list-item')).toHaveLength(2)
  })
})
