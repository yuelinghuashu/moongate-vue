import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent, h, ref, nextTick } from 'vue'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import { useOverlayBehavior } from '../../composables/useScrollLock'

enableAutoUnmount(afterEach)

const Host = defineComponent({
  setup(_, { expose }) {
    const isOpen = ref(false)
    const overlayRef = ref<HTMLElement | null>(null)
    const closeCount = ref(0)

    useOverlayBehavior(isOpen, overlayRef, () => {
      closeCount.value++
      isOpen.value = false
    })

    expose({ isOpen, closeCount })

    return () =>
      h(
        'div',
        {
          ref: overlayRef,
          class: 'host-container',
          ...(isOpen.value ? { 'data-open': 'true' } : {}),
        },
        [h('button', { class: 'focus-btn' }, '关闭')],
      )
  },
})

describe('useOverlayBehavior', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('打开时锁定 body 滚动，关闭时恢复', async () => {
    const wrapper = mount(Host)
    const vm = wrapper.vm as any

    expect(document.body.style.overflow).toBe('')

    vm.isOpen = true
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    vm.isOpen = false
    await nextTick()
    expect(document.body.style.overflow).toBe('')
  })

  it('ESC 键关闭浮层', async () => {
    const wrapper = mount(Host)
    const vm = wrapper.vm as any

    vm.isOpen = true
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    expect(vm.isOpen).toBe(false)
    expect(vm.closeCount).toBe(1)
  })

  it('浮层打开时渲染状态正确', async () => {
    const wrapper = mount(Host)
    const vm = wrapper.vm as any

    vm.isOpen = true
    await nextTick()

    expect(wrapper.find('.host-container').attributes('data-open')).toBe('true')
  })

  // ==================== 补充：焦点陷阱 ====================

  it('打开时聚焦第一个可聚焦元素', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    const vm = wrapper.vm as any

    const btn = wrapper.find('.focus-btn').element as HTMLElement

    vm.isOpen = true
    await nextTick()
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
      setTimeout(() => resolve(), 50)
    })
    await nextTick()

    expect(document.activeElement).toBe(btn)
  })

  it('Tab 到最后一个元素时循环到第一个', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    const vm = wrapper.vm as any

    const firstBtn = wrapper.find('.focus-btn').element as HTMLElement

    vm.isOpen = true
    await nextTick()
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
      setTimeout(() => resolve(), 50)
    })
    await nextTick()

    firstBtn.focus()

    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(tabEvent)

    expect(tabEvent.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(firstBtn)
  })

  it('Shift+Tab 在第一个元素时循环到最后一个', async () => {
    const MultiHost = defineComponent({
      setup(_, { expose }) {
        const isOpen = ref(false)
        const overlayRef = ref<HTMLElement | null>(null)

        useOverlayBehavior(isOpen, overlayRef, () => {
          isOpen.value = false
        })

        expose({ isOpen, overlayRef })

        return () =>
          h('div', { ref: overlayRef, class: 'multi-host-container' }, [
            h('button', { class: 'first-btn' }, '第一个'),
            h('button', { class: 'last-btn' }, '最后一个'),
          ])
      },
    })

    const wrapper = mount(MultiHost, { attachTo: document.body })
    const vm = wrapper.vm as any

    const firstBtn = wrapper.find('.first-btn').element as HTMLElement
    const lastBtn = wrapper.find('.last-btn').element as HTMLElement

    vm.isOpen = true
    await nextTick()
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
      setTimeout(() => resolve(), 50)
    })
    await nextTick()

    firstBtn.focus()

    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(shiftTabEvent)

    expect(shiftTabEvent.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(lastBtn)
  })

  it('Tab 不在边界时不阻止默认行为', async () => {
    const MultiHost = defineComponent({
      setup(_, { expose }) {
        const isOpen = ref(false)
        const overlayRef = ref<HTMLElement | null>(null)

        useOverlayBehavior(isOpen, overlayRef, () => {
          isOpen.value = false
        })

        expose({ isOpen, overlayRef })

        return () =>
          h('div', { ref: overlayRef, class: 'multi-host-container' }, [
            h('button', { class: 'first-btn' }, '第一个'),
            h('button', { class: 'middle-btn' }, '中间'),
            h('button', { class: 'last-btn' }, '最后一个'),
          ])
      },
    })

    const wrapper = mount(MultiHost, { attachTo: document.body })
    const vm = wrapper.vm as any

    const middleBtn = wrapper.find('.middle-btn').element as HTMLElement

    vm.isOpen = true
    await nextTick()
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
      setTimeout(() => resolve(), 50)
    })
    await nextTick()

    middleBtn.focus()

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    document.dispatchEvent(tabEvent)

    expect(tabEvent.defaultPrevented).toBe(false)
  })

  // ==================== 补充：选项配置 ====================

  it('enableEsc=false 时 ESC 不关闭浮层', async () => {
    const HostNoEsc = defineComponent({
      setup(_, { expose }) {
        const isOpen = ref(true)
        const overlayRef = ref<HTMLElement | null>(null)
        const closeCount = ref(0)

        useOverlayBehavior(
          isOpen,
          overlayRef,
          () => {
            closeCount.value++
            isOpen.value = false
          },
          { enableEsc: false },
        )

        expose({ isOpen, closeCount })

        return () => h('div', { ref: overlayRef, class: 'no-esc-host' })
      },
    })

    const wrapper = mount(HostNoEsc)
    const vm = wrapper.vm as any

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    expect(vm.isOpen).toBe(true)
    expect(vm.closeCount).toBe(0)
  })

  it('enableFocusTrap=false 时不参与焦点管理', async () => {
    const HostNoTrap = defineComponent({
      setup(_, { expose }) {
        const isOpen = ref(false)
        const overlayRef = ref<HTMLElement | null>(null)

        useOverlayBehavior(
          isOpen,
          overlayRef,
          () => {
            isOpen.value = false
          },
          { enableFocusTrap: false },
        )

        expose({ isOpen, overlayRef })

        return () =>
          h('div', { ref: overlayRef, class: 'no-trap-host' }, [
            h('button', { class: 'only-btn' }, '按钮'),
          ])
      },
    })

    const wrapper = mount(HostNoTrap)
    const vm = wrapper.vm as any

    vm.isOpen = true
    await nextTick()
    await new Promise((resolve) => requestAnimationFrame(resolve))

    // 不应自动聚焦第一个元素
    expect(document.activeElement?.classList.contains('only-btn')).toBe(false)

    const btn = wrapper.find('.only-btn').element as HTMLElement
    btn.focus()
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    document.dispatchEvent(tabEvent)
    expect(tabEvent.defaultPrevented).toBe(false)
  })

  it('enableEsc=false 且 enableFocusTrap=false 时完全不需要焦点管理', async () => {
    const HostDisabled = defineComponent({
      setup(_, { expose }) {
        const isOpen = ref(true)
        const overlayRef = ref<HTMLElement | null>(null)

        useOverlayBehavior(
          isOpen,
          overlayRef,
          () => {
            isOpen.value = false
          },
          { enableEsc: false, enableFocusTrap: false },
        )

        expose({ isOpen, overlayRef })

        return () => h('div', { ref: overlayRef, class: 'disabled-host' })
      },
    })

    const wrapper = mount(HostDisabled)
    const vm = wrapper.vm as any

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(vm.isOpen).toBe(true)

    vm.isOpen = false
    await nextTick()
    expect(document.body.style.overflow).toBe('')
  })

  it('多实例计数：两个浮层同时打开时，关闭一个 body 仍锁定', async () => {
    const Host1 = defineComponent({
      setup(_, { expose }) {
        const isOpen = ref(false)
        const overlayRef = ref<HTMLElement | null>(null)

        useOverlayBehavior(isOpen, overlayRef, () => {
          isOpen.value = false
        })

        expose({ isOpen })

        return () => h('div', { ref: overlayRef, class: 'host-1' })
      },
    })

    const Host2 = defineComponent({
      setup(_, { expose }) {
        const isOpen = ref(false)
        const overlayRef = ref<HTMLElement | null>(null)

        useOverlayBehavior(isOpen, overlayRef, () => {
          isOpen.value = false
        })

        expose({ isOpen })

        return () => h('div', { ref: overlayRef, class: 'host-2' })
      },
    })

    const wrapper1 = mount(Host1)
    const wrapper2 = mount(Host2)
    const vm1 = wrapper1.vm as any
    const vm2 = wrapper2.vm as any

    vm1.isOpen = true
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    vm2.isOpen = true
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    vm1.isOpen = false
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    vm2.isOpen = false
    await nextTick()
    expect(document.body.style.overflow).toBe('')
  })

  it('卸载未关闭的浮层时解锁 body 滚动', async () => {
    const wrapper = mount(Host)
    const vm = wrapper.vm as any

    vm.isOpen = true
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()
    await nextTick()
    expect(document.body.style.overflow).toBe('')
  })
})
