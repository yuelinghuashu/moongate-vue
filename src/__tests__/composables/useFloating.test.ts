import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import { useFloating } from '../../composables/useFloating'
import type { Placement } from '../../types/components'

enableAutoUnmount(afterEach)

/**
 * 测试宿主组件：直接使用 useFloating。
 * 注意：Vue Test Utils 的 wrapper.vm 访问 expose() 的 ref 时会自动解包，
 * 因此 vm.visible 是 boolean，vm.triggerRef 是 HTMLElement。
 */
const Host = defineComponent({
  props: {
    placement: { type: String, default: 'bottom' },
    offset: { type: Number, default: 8 },
    showDelay: { type: Number, default: 0 },
    hideDelay: { type: Number, default: 0 },
    boundsCorrection: { type: Boolean, default: false },
    awaitNextTick: { type: Boolean, default: false },
  },
  setup(props, { expose }) {
    const {
      triggerRef,
      floatingRef,
      visible,
      currentPlacement,
      floatStyle,
      show,
      hide,
      startHideTimer,
      cancelHideTimer,
    } = useFloating({
      placement: () => props.placement as Placement,
      offset: () => props.offset,
      showDelay: () => props.showDelay,
      hideDelay: () => props.hideDelay,
      boundsCorrection: props.boundsCorrection,
      awaitNextTick: props.awaitNextTick,
    })

    expose({
      triggerRef,
      floatingRef,
      visible,
      currentPlacement,
      floatStyle,
      show,
      hide,
      startHideTimer,
      cancelHideTimer,
    })

    return () =>
      h('div', { class: 'host-test' }, [
        h('button', { ref: triggerRef, class: 'trigger' }, '触发'),
        h(
          'div',
          {
            ref: floatingRef,
            class: 'floating',
            style: { width: '100px', height: '50px' },
          },
          '浮层',
        ),
      ])
  },
})

/** mock 一个元素的 getBoundingClientRect（自动计算 bottom/right） */
function mockRect(el: Element | null, rect: Partial<DOMRect>) {
  if (!el) throw new Error('Element is null')
  const width = rect.width ?? 100
  const height = rect.height ?? 50
  const left = rect.left ?? 0
  const top = rect.top ?? 0
  const mock: DOMRect = {
    x: left,
    y: top,
    top,
    left,
    right: rect.right ?? left + width,
    bottom: rect.bottom ?? top + height,
    width,
    height,
    toJSON: () => ({}),
  }
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(mock)
}

/** 等待所有宏任务（setTimeout）和 Vue 微任务执行完成 */
const flushAll = async () => {
  await new Promise((resolve) => setTimeout(resolve, 10))
  await nextTick()
}

describe('useFloating', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('初始状态：不可见、当前位置为默认 placement', () => {
    const wrapper = mount(Host, { props: { placement: 'top' } })
    const vm = wrapper.vm as any
    expect(vm.visible).toBe(false)
    expect(vm.currentPlacement).toBe('top')
  })

  it('show() 后 visible 为 true，位置正确（bottom）', async () => {
    const wrapper = mount(Host, { props: { placement: 'bottom', offset: 8 } })
    const vm = wrapper.vm as any

    // 直接通过 wrapper.find 获取 DOM 元素
    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    mockRect(trigger, { top: 100, left: 50, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vm.show()
    await flushAll()

    expect(vm.visible).toBe(true)
    // bottom: top = trigger.bottom(130) + offset(8) = 138
    expect(vm.floatStyle.top).toBe('138px')
    // left = 50 + (200-100)/2 = 100
    expect(vm.floatStyle.left).toBe('100px')
  })

  it('show() 后位置正确（top）', async () => {
    const wrapper = mount(Host, { props: { placement: 'top', offset: 8 } })
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    mockRect(trigger, { top: 100, left: 50, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vm.show()
    await flushAll()

    expect(vm.visible).toBe(true)
    // top: 100 - 50 - 8 = 42
    expect(vm.floatStyle.top).toBe('42px')
  })

  it('show() 后位置正确（right）', async () => {
    const wrapper = mount(Host, { props: { placement: 'right', offset: 8 } })
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    mockRect(trigger, { top: 100, left: 50, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vm.show()
    await flushAll()

    // right: left = 250 + 8 = 258
    expect(vm.floatStyle.left).toBe('258px')
  })

  it('show() 后位置正确（left）', async () => {
    const wrapper = mount(Host, { props: { placement: 'left', offset: 8 } })
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    // left 方向需要足够的左侧空间（left >= floatWidth + offset）
    mockRect(trigger, { top: 100, left: 200, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vm.show()
    await flushAll()

    // left: 200 - 100 - 8 = 92
    expect(vm.floatStyle.left).toBe('92px')
  })

  it('top 空间不足时翻转到底部', async () => {
    const wrapper = mount(Host, { props: { placement: 'top', offset: 8 } })
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    mockRect(trigger, { top: 10, left: 50, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vm.show()
    await flushAll()

    expect(vm.currentPlacement).toBe('bottom')
    expect(vm.floatStyle.top).toBe('48px') // trigger.bottom(40) + offset(8)
  })

  it('bottom 空间不足时翻转到顶部', async () => {
    const wrapper = mount(Host, { props: { placement: 'bottom', offset: 8 } })
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    mockRect(trigger, { top: 500, left: 50, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(550)

    vm.show()
    await flushAll()

    expect(vm.currentPlacement).toBe('top')
  })

  it('boundsCorrection=true 时做边界修正（左侧溢出 clamp 到 0）', async () => {
    const wrapper = mount(Host, {
      props: { placement: 'left', offset: 8, boundsCorrection: true },
    })
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    mockRect(trigger, { top: 100, left: 50, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vm.show()
    await flushAll()

    const leftValue = Number.parseFloat(vm.floatStyle.left)
    expect(leftValue).toBeGreaterThanOrEqual(0)
  })

  it('boundsCorrection=true 时右侧溢出 clamp 到 viewport 边界', async () => {
    const wrapper = mount(Host, {
      props: { placement: 'right', offset: 8, boundsCorrection: true },
    })
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    mockRect(trigger, { top: 100, left: 800, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(900)

    vm.show()
    await flushAll()

    const leftValue = Number.parseFloat(vm.floatStyle.left)
    expect(leftValue).toBeLessThanOrEqual(900 - 100)
  })

  it('hide() 立即隐藏并清除定时器', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Host)
    const vm = wrapper.vm as any

    vm.show()
    vi.advanceTimersByTime(0)
    expect(vm.visible).toBe(true)

    vm.hide()
    vi.advanceTimersByTime(100)
    expect(vm.visible).toBe(false)
  })

  it('showDelay 延迟后显示', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Host, { props: { showDelay: 200 } })
    const vm = wrapper.vm as any

    vm.show()
    expect(vm.visible).toBe(false)
    vi.advanceTimersByTime(199)
    expect(vm.visible).toBe(false)
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(vm.visible).toBe(true)
  })

  it('startHideTimer 延迟隐藏，cancelHideTimer 取消隐藏', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Host, { props: { hideDelay: 300 } })
    const vm = wrapper.vm as any

    vm.show()
    vi.advanceTimersByTime(0)
    await nextTick()
    expect(vm.visible).toBe(true)

    vm.startHideTimer()
    expect(vm.visible).toBe(true)
    vi.advanceTimersByTime(299)
    expect(vm.visible).toBe(true)

    vm.cancelHideTimer()
    vi.advanceTimersByTime(1000)
    expect(vm.visible).toBe(true)

    vm.startHideTimer()
    vi.advanceTimersByTime(300)
    await nextTick()
    expect(vm.visible).toBe(false)
  })

  it('重复 show 只保留一个定时器', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Host, { props: { showDelay: 100 } })
    const vm = wrapper.vm as any

    vm.show()
    vm.show()
    vi.advanceTimersByTime(100)
    await nextTick()
    expect(vm.visible).toBe(true)
  })

  it('滚动事件触发时更新位置', async () => {
    const wrapper = mount(Host, { props: { placement: 'bottom', offset: 8 } })
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    mockRect(trigger, { top: 100, left: 50, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vm.show()
    await flushAll()
    expect(vm.floatStyle.top).toBe('138px')

    mockRect(trigger, { top: 200, left: 50, width: 200, height: 30 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(vm.floatStyle.top).toBe('238px')
  })

  it('窗口 resize 事件触发时更新位置', async () => {
    const wrapper = mount(Host, { props: { placement: 'bottom', offset: 8 } })
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    mockRect(trigger, { top: 100, left: 50, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vm.show()
    await flushAll()

    mockRect(trigger, { top: 300, left: 50, width: 200, height: 30 })
    window.dispatchEvent(new Event('resize'))
    await nextTick()
    expect(vm.floatStyle.top).toBe('338px')
  })

  it('不可见时滚动不更新位置', async () => {
    const wrapper = mount(Host)
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    mockRect(trigger, { top: 100, left: 50, width: 200, height: 30 })

    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(vm.floatStyle.top).toBe('0px')
  })

  it('onUnmounted 时清理事件监听', async () => {
    const removeScrollSpy = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(Host)
    wrapper.unmount()
    expect(removeScrollSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { capture: true })
    expect(removeScrollSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('awaitNextTick=true 时 show 先等待 nextTick 再更新位置', async () => {
    const wrapper = mount(Host, {
      props: { placement: 'bottom', offset: 8, awaitNextTick: true },
    })
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    mockRect(trigger, { top: 100, left: 50, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vm.show()
    await flushAll()
    expect(vm.visible).toBe(true)
    expect(vm.floatStyle.top).toBe('138px')
  })

  it('boundsCorrection=true 时顶部溢出 clamp 到 0', async () => {
    const wrapper = mount(Host, {
      props: { placement: 'top', offset: 8, boundsCorrection: true },
    })
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    // trigger 靠近视口顶部，top 方向会计算为负值
    mockRect(trigger, { top: 5, left: 50, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vm.show()
    await flushAll()

    // 顶部溢出时应 clamp 到 0
    const topValue = Number.parseFloat(vm.floatStyle.top)
    expect(topValue).toBeGreaterThanOrEqual(0)
  })

  it('boundsCorrection=true 时底部溢出 clamp 到视口高度边界', async () => {
    const wrapper = mount(Host, {
      props: { placement: 'bottom', offset: 8, boundsCorrection: true },
    })
    const vm = wrapper.vm as any

    const trigger = wrapper.find('.trigger').element as HTMLElement
    const floating = wrapper.find('.floating').element as HTMLElement
    // trigger 靠近视口底部
    mockRect(trigger, { top: 700, left: 50, width: 200, height: 30 })
    mockRect(floating, { width: 100, height: 50 })

    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800)

    vm.show()
    await flushAll()

    const topValue = Number.parseFloat(vm.floatStyle.top)
    expect(topValue).toBeLessThanOrEqual(800 - 50)
  })
})
