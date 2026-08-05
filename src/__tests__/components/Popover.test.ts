import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Popover from '../../components/Popover.vue'

/** 模拟触发元素与弹出层的 DOMRect */
const mockRects = () => {
  vi.spyOn(window.HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.classList.contains('mg-popover')) {
      return { top: 0, left: 0, right: 150, bottom: 80, width: 150, height: 80 } as DOMRect
    }
    return { top: 200, left: 200, right: 300, bottom: 250, width: 100, height: 50 } as DOMRect
  })
  vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024)
  vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(768)
}

describe('Popover', () => {
  beforeEach(() => {
    mockRects()
  })

  it('初始不显示弹出层', () => {
    const wrapper = mount(Popover, {
      slots: { content: '弹出内容' },
    })
    expect(document.body.querySelector('.mg-popover')).toBeNull()
  })

  it('鼠标移入后显示弹出层', async () => {
    const wrapper = mount(Popover, {
      slots: {
        default: '<button>触发器</button>',
        content: '<span class="popover-content">弹出内容</span>',
      },
      attachTo: document.body,
    })
    await wrapper.find('.mg-popover-trigger').trigger('mouseenter')
    await new Promise((r) => setTimeout(r, 0))

    expect(document.body.querySelector('.mg-popover')).not.toBeNull()
    expect(document.body.querySelector('.popover-content')).not.toBeNull()
  })

  it('placement 添加对应 class', async () => {
    const wrapper = mount(Popover, {
      props: { placement: 'top' },
      slots: { content: '内容' },
      attachTo: document.body,
    })
    await wrapper.find('.mg-popover-trigger').trigger('mouseenter')
    await new Promise((r) => setTimeout(r, 0))

    const popover = document.body.querySelector('.mg-popover') as HTMLElement
    expect(popover.classList.contains('mg-popover-top')).toBe(true)
  })

  it('showDelay 延迟显示', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Popover, {
      props: { showDelay: 100 },
      slots: { content: '内容' },
      attachTo: document.body,
    })

    await wrapper.find('.mg-popover-trigger').trigger('mouseenter')
    expect(document.body.querySelector('.mg-popover')).toBeNull()

    vi.advanceTimersByTime(120)
    await vi.runOnlyPendingTimersAsync()
    expect(document.body.querySelector('.mg-popover')).not.toBeNull()
    vi.useRealTimers()
  })

  it('鼠标移出后延迟隐藏（hideDelay）', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Popover, {
      props: { hideDelay: 100 },
      slots: { content: '内容' },
      attachTo: document.body,
    })

    await wrapper.find('.mg-popover-trigger').trigger('mouseenter')
    vi.advanceTimersByTime(10)
    await vi.runOnlyPendingTimersAsync()
    expect(document.body.querySelector('.mg-popover')).not.toBeNull()

    await wrapper.find('.mg-popover-trigger').trigger('mouseleave')
    expect(document.body.querySelector('.mg-popover')).not.toBeNull()
    vi.advanceTimersByTime(120)
    await vi.runOnlyPendingTimersAsync()
    expect(document.body.querySelector('.mg-popover')).toBeNull()
    vi.useRealTimers()
  })

  it('trigger 插槽渲染', () => {
    const wrapper = mount(Popover, {
      slots: {
        trigger: '<button class="custom-trigger">自定义触发</button>',
      },
    })
    expect(wrapper.find('.custom-trigger').exists()).toBe(true)
  })

  it('设置位置样式', async () => {
    const wrapper = mount(Popover, {
      slots: { content: '内容' },
      attachTo: document.body,
    })
    await wrapper.find('.mg-popover-trigger').trigger('mouseenter')
    await new Promise((r) => setTimeout(r, 0))

    const popover = document.body.querySelector('.mg-popover') as HTMLElement
    expect(popover.style.top).toContain('px')
    expect(popover.style.left).toContain('px')
  })
})
