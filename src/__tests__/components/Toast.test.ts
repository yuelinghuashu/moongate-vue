import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Toast from '../../components/Toast.vue'

describe('Toast', () => {
  it('modelValue=false 时不渲染', () => {
    const wrapper = mount(Toast, { props: { modelValue: false } })
    expect(wrapper.find('.mg-toast').exists()).toBe(false)
  })

  it('渲染消息内容与类型', () => {
    const wrapper = mount(Toast, {
      props: { modelValue: true, message: '操作成功', type: 'success' },
    })
    expect(wrapper.find('.mg-toast').exists()).toBe(true)
    expect(wrapper.text()).toContain('操作成功')
    expect(wrapper.find('.mg-toast').classes()).toContain('mg-toast-success')
    expect(wrapper.text()).toContain('✓')
  })

  it('各类型渲染对应符号', () => {
    const types = [
      { type: 'error', icon: '✗' },
      { type: 'warning', icon: '⚠' },
      { type: 'info', icon: 'ℹ' },
    ] as const

    for (const { type, icon } of types) {
      const wrapper = mount(Toast, {
        props: { modelValue: true, type, message: '测试' },
      })
      expect(wrapper.text()).toContain(icon)
      expect(wrapper.find('.mg-toast').classes()).toContain(`mg-toast-${type}`)
    }
  })

  it('closable 时显示关闭按钮，点击后触发 leaving 与 close', async () => {
    const wrapper = mount(Toast, {
      props: { modelValue: true, closable: true },
    })
    const closeBtn = wrapper.find('.mg-toast-close')
    expect(closeBtn.exists()).toBe(true)

    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.find('.mg-toast').classes()).toContain('mg-toast-leave')
  })

  it('duration=0 时不自动关闭', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toast, {
      props: { modelValue: true, duration: 0 },
    })

    vi.advanceTimersByTime(5000)
    await vi.runOnlyPendingTimersAsync()
    expect(wrapper.emitted('close')).toBeUndefined()
    vi.useRealTimers()
  })

  it('duration 到期后自动关闭', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Toast, {
      props: { modelValue: true, duration: 100 },
    })

    vi.advanceTimersByTime(150)
    await vi.runOnlyPendingTimersAsync()
    expect(wrapper.emitted('close')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('自定义 icon 插槽', () => {
    const wrapper = mount(Toast, {
      props: { modelValue: true, icon: '★' },
    })
    expect(wrapper.text()).toContain('★')
  })

  it('消息插槽覆盖 message prop', () => {
    const wrapper = mount(Toast, {
      props: { modelValue: true },
      slots: { default: '<span class="custom-toast-content">自定义</span>' },
    })
    expect(wrapper.find('.custom-toast-content').exists()).toBe(true)
  })

  it('icon 插槽', () => {
    const wrapper = mount(Toast, {
      props: { modelValue: true },
      slots: { icon: '<span class="custom-toast-icon">▲</span>' },
    })
    expect(wrapper.find('.custom-toast-icon').exists()).toBe(true)
  })
})
