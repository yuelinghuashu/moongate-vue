import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import Tooltip from '../../components/Tooltip.vue'

/** 自动卸载挂载的 wrapper，清理 useFloating 注册的 window 监听 */
enableAutoUnmount(afterEach)

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
    // 可见性：必须带 mg-tooltip-visible（否则 opacity:0 看不到）
    expect(tooltip.classList.contains('mg-tooltip-visible')).toBe(true)
  })

  it('显示期间带 mg-tooltip-visible，移出后移除', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '提示' },
      attachTo: document.body,
    })
    const trigger = wrapper.find('.mg-tooltip-trigger')

    // 移入显示 → 可见
    await trigger.trigger('mouseenter')
    await new Promise((r) => setTimeout(r, 0))
    let tooltip = document.body.querySelector('.mg-tooltip') as HTMLElement
    expect(tooltip.classList.contains('mg-tooltip-visible')).toBe(true)

    // 移出后（默认 hideDelay=100）→ 隐藏并移除可见 class
    await trigger.trigger('mouseleave')
    await new Promise((r) => setTimeout(r, 150))
    tooltip = document.body.querySelector('.mg-tooltip') as HTMLElement
    expect(tooltip).toBeNull()
  })

  it('有 showDelay 时延迟显示', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Tooltip, {
      props: { content: '提示', showDelay: 100 },
      attachTo: document.body,
    })

    await wrapper.find('.mg-tooltip-trigger').trigger('mouseenter')
    expect(document.body.querySelector('.mg-tooltip')).toBeNull()

    vi.advanceTimersByTime(150)
    await vi.runOnlyPendingTimersAsync()
    expect(document.body.querySelector('.mg-tooltip')).not.toBeNull()
    vi.useRealTimers()
  })

  it('鼠标移出后延迟隐藏（hideDelay）', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Tooltip, {
      props: { content: '提示', hideDelay: 100 },
      attachTo: document.body,
    })

    await wrapper.find('.mg-tooltip-trigger').trigger('mouseenter')
    vi.advanceTimersByTime(10)
    await vi.runOnlyPendingTimersAsync()
    expect(document.body.querySelector('.mg-tooltip')).not.toBeNull()

    // 移出后经过 hideDelay 才隐藏
    await wrapper.find('.mg-tooltip-trigger').trigger('mouseleave')
    expect(document.body.querySelector('.mg-tooltip')).not.toBeNull()
    vi.advanceTimersByTime(120)
    await vi.runOnlyPendingTimersAsync()
    expect(document.body.querySelector('.mg-tooltip')).toBeNull()
    vi.useRealTimers()
  })

  it('键盘聚焦后显示 tooltip，失焦后隐藏', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '提示内容' },
      attachTo: document.body,
    })
    const trigger = wrapper.find('.mg-tooltip-trigger')

    // 键盘 Tab 聚焦（focus 事件）
    await trigger.trigger('focus')
    await new Promise((r) => setTimeout(r, 0))
    expect(document.body.querySelector('.mg-tooltip')).not.toBeNull()

    // 失焦（blur 事件）
    await trigger.trigger('blur')
    expect(document.body.querySelector('.mg-tooltip')).toBeNull()
  })

  it('显示时触发元素具备 aria-describedby 关联 tooltip', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '提示内容' },
      attachTo: document.body,
    })
    const trigger = wrapper.find('.mg-tooltip-trigger')

    // 初始未显示时无 aria-describedby
    expect(trigger.attributes('aria-describedby')).toBeUndefined()

    // 聚焦显示后
    await trigger.trigger('focus')
    await new Promise((r) => setTimeout(r, 0))

    const tooltip = document.body.querySelector('.mg-tooltip') as HTMLElement
    expect(tooltip).not.toBeNull()

    // aria-describedby 应指向 tooltip 的 id
    const describedby = trigger.attributes('aria-describedby')
    expect(describedby).toBeDefined()
    expect(tooltip.id).toBe(describedby)

    // 隐藏后移除 aria-describedby
    await trigger.trigger('blur')
    expect(trigger.attributes('aria-describedby')).toBeUndefined()
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

  it('定位由 useFloating JS 坐标控制', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '提示', placement: 'top', offset: 12 },
      attachTo: document.body,
    })
    await wrapper.find('.mg-tooltip-trigger').trigger('mouseenter')
    await new Promise((r) => setTimeout(r, 0))

    // JS 定位版：浮层带内联 top/left 坐标（useFloating 计算）
    const tooltip = document.body.querySelector('.mg-tooltip') as HTMLElement
    expect(tooltip.style.top).not.toBe('')
    expect(tooltip.style.left).not.toBe('')
    // placement 类用于箭头方向
    expect(tooltip.classList.contains('mg-tooltip-top')).toBe(true)
  })
})
