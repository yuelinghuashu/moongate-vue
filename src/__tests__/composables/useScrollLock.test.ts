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
})
