import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Message from '../../components/Message.vue'

describe('Message', () => {
  it('modelValue=false 时不渲染', () => {
    const wrapper = mount(Message, { props: { modelValue: false } })
    expect(wrapper.find('.mg-message').exists()).toBe(false)
  })

  it('渲染消息内容与类型', () => {
    const wrapper = mount(Message, {
      props: { modelValue: true, message: '保存成功', type: 'success' },
    })
    expect(wrapper.find('.mg-message').exists()).toBe(true)
    expect(wrapper.text()).toContain('保存成功')
    expect(wrapper.find('.mg-message').classes()).toContain('mg-message-success')
    expect(wrapper.text()).toContain('✓')
  })

  it('各类型渲染对应符号', () => {
    const types = [
      { type: 'error', icon: '✗' },
      { type: 'warning', icon: '⚠' },
      { type: 'info', icon: 'ℹ' },
    ] as const

    for (const { type, icon } of types) {
      const wrapper = mount(Message, {
        props: { modelValue: true, type, message: '测试' },
      })
      expect(wrapper.text()).toContain(icon)
      expect(wrapper.find('.mg-message').classes()).toContain(`mg-message-${type}`)
    }
  })

  it('自定义 icon 覆盖默认符号', () => {
    const wrapper = mount(Message, {
      props: { modelValue: true, type: 'success', icon: '★' },
    })
    expect(wrapper.text()).toContain('★')
  })

  it('closable 时显示关闭按钮，点击后触发 leaving 与 close 事件', async () => {
    const wrapper = mount(Message, {
      props: { modelValue: true, closable: true },
    })
    const closeBtn = wrapper.find('.mg-message-close')
    expect(closeBtn.exists()).toBe(true)

    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.find('.mg-message').classes()).toContain('mg-message-leave')
  })

  it('duration=0 时不自动关闭', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Message, {
      props: { modelValue: true, duration: 0 },
    })

    vi.advanceTimersByTime(5000)
    await vi.runOnlyPendingTimersAsync()
    expect(wrapper.emitted('close')).toBeUndefined()
    vi.useRealTimers()
  })

  it('duration 到期后自动关闭', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Message, {
      props: { modelValue: true, duration: 100 },
    })

    vi.advanceTimersByTime(150)
    await vi.runOnlyPendingTimersAsync()
    expect(wrapper.emitted('close')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('消息插槽覆盖 message prop', () => {
    const wrapper = mount(Message, {
      props: { modelValue: true },
      slots: { default: '<span class="custom-content">自定义消息</span>' },
    })
    expect(wrapper.find('.custom-content').exists()).toBe(true)
  })

  it('icon 插槽', () => {
    const wrapper = mount(Message, {
      props: { modelValue: true },
      slots: { icon: '<span class="custom-icon">▲</span>' },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })
})
