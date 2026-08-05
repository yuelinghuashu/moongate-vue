import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from '../../components/Tooltip.vue'

/** 模拟触发元素与提示框的 DOMRect */
const mockRects = () => {
  vi.spyOn(window.HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.classList.contains('mg-tooltip')) {
      return { top: 0, left: 0, right: 100, bottom: 50, width: 100, height: 50 } as DOMRect
    }
    return { top: 200, left: 200, right: 300, bottom: 250, width: 100, height: 50 } as DOMRect
  })
}

describe('Tooltip', () => {
  beforeEach(() => {
    mockRects()
  })

  it('初始不显示 tooltip', () => {
    const wrapper = mount(Tooltip, { props: { content: '提示内容' } })
    expect(document.body.querySelector('.mg-tooltip')).toBeNull()
  })

  it('鼠标移入后显示 tooltip（无延迟）', async () => {
    const wrapper = mount(Tooltip, { props: { content: '提示内容' } })
    await wrapper.find('.mg-tooltip-trigger').trigger('mouseenter')
    await new Promise((r) => setTimeout(r, 0))

    const tooltip = document.body.querySelector('.mg-tooltip') as HTMLElement
    expect(tooltip).not.toBeNull()
    expect(tooltip.textContent).toContain('提示内容')
  })

  it('有 delay 时延迟显示', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Tooltip, {
      props: { content: '提示', delay: 100 },
      attachTo: document.body,
    })

    await wrapper.find('.mg-tooltip-trigger').trigger('mouseenter')
    expect(document.body.querySelector('.mg-tooltip')).toBeNull()

    vi.advanceTimersByTime(150)
    await vi.runOnlyPendingTimersAsync()
    expect(document.body.querySelector('.mg-tooltip')).not.toBeNull()
    vi.useRealTimers()
  })

  it('鼠标移出后隐藏', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Tooltip, {
      props: { content: '提示' },
      attachTo: document.body,
    })

    await wrapper.find('.mg-tooltip-trigger').trigger('mouseenter')
    vi.advanceTimersByTime(10)
    await vi.runOnlyPendingTimersAsync()
    expect(document.body.querySelector('.mg-tooltip')).not.toBeNull()

    await wrapper.find('.mg-tooltip-trigger').trigger('mouseleave')
    expect(document.body.querySelector('.mg-tooltip')).toBeNull()
    vi.useRealTimers()
  })

  it('placement 添加对应 class', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '提示', placement: 'bottom' },
      attachTo: document.body,
    })
    await wrapper.find('.mg-tooltip-trigger').trigger('mouseenter')
    await new Promise((r) => setTimeout(r, 0))

    const tooltip = document.body.querySelector('.mg-tooltip') as HTMLElement
    expect(tooltip.classList.contains('mg-tooltip-bottom')).toBe(true)
  })

  it('content 插槽覆盖默认内容', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '默认' },
      slots: { content: '<span class="custom-tip">自定义提示</span>' },
      attachTo: document.body,
    })
    await wrapper.find('.mg-tooltip-trigger').trigger('mouseenter')
    await new Promise((r) => setTimeout(r, 0))

    expect(document.body.querySelector('.custom-tip')).not.toBeNull()
  })

  it('设置固定位置样式', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '提示', placement: 'top' },
      attachTo: document.body,
    })
    await wrapper.find('.mg-tooltip-trigger').trigger('mouseenter')
    await new Promise((r) => setTimeout(r, 0))

    const tooltip = document.body.querySelector('.mg-tooltip') as HTMLElement
    expect(tooltip.style.position).toBe('')
    expect(tooltip.style.top).toContain('px')
    expect(tooltip.style.left).toContain('px')
  })
})
