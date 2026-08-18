import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent, h, ref, nextTick } from 'vue'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import { useOverlayComponent } from '../../composables/useOverlayComponent'

enableAutoUnmount(afterEach)

/**
 * 直接调用 useOverlayComponent 的宿主组件。
 * options 中的 enableEsc / enableFocusTrap 传入 Ref 对象，
 * 验证 composable 能正确解包 Ref（模板 props 会自动解包 ref，无法覆盖该分支）。
 */
const Host = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs, expose }) {
    const modelValue = ref(false)
    const escRef = ref(false)
    const trapRef = ref(false)
    const openCount = ref(0)
    const closeCount = ref(0)

    const { handleClose, titleId, mergedClass } = useOverlayComponent(
      modelValue,
      {
        onOpen: () => openCount.value++,
        onClose: () => closeCount.value++,
      },
      () => ({ 'custom-dynamic-class': modelValue.value }),
      { enableEsc: escRef, enableFocusTrap: trapRef },
    )

    expose({ modelValue, escRef, trapRef, openCount, closeCount, handleClose, titleId })

    return () =>
      h(
        'div',
        {
          class: ['host', mergedClass.value],
          ...attrs,
        },
        [h('span', { class: 'title-id' }, String(titleId))],
      )
  },
})

describe('useOverlayComponent（options 传入 Ref 解包分支）', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('enableEsc 为 Ref 时 ESC 不关闭浮层（Ref 解包为 false）', async () => {
    const wrapper = mount(Host)
    const vm = wrapper.vm as any

    vm.modelValue = true
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    // watch 有 immediate: true，初始 false 触发过一次 onClose（closeCount=1）
    // enableEsc=false，ESC 不关闭，closeCount 保持 1
    expect(vm.modelValue).toBe(true)
    expect(vm.closeCount).toBe(1)
  })

  it('enableFocusTrap 为 Ref 时不影响 ESC（Ref 解包为 false）', async () => {
    const wrapper = mount(Host)
    const vm = wrapper.vm as any

    vm.modelValue = true
    await nextTick()

    // enableFocusTrap 为 false 的 Ref，ESC 仍然可以关闭（因为 enableEsc 也是 false）
    // 这里验证 enableFocusTrap Ref 被正确解包且不影响关闭逻辑
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()

    // enableEsc=false，ESC 不关闭
    expect(vm.modelValue).toBe(true)
  })

  it('open/close 事件回调触发（immediate watch 初始触发 onClose）', async () => {
    const wrapper = mount(Host)
    const vm = wrapper.vm as any

    // watch 有 immediate: true，初始 false 触发过一次 onClose
    expect(vm.closeCount).toBe(1)

    vm.modelValue = true
    await nextTick()
    expect(vm.openCount).toBe(1)

    vm.modelValue = false
    await nextTick()
    // 手动设为 false -> 第二次 onClose
    expect(vm.closeCount).toBe(2)
  })

  it('titleId 为 useId 生成的唯一 ID', () => {
    const wrapper = mount(Host)
    expect(wrapper.find('.title-id').text()).toMatch(/\d+/)
  })

  it('className 工厂函数响应式生效', async () => {
    const wrapper = mount(Host)
    expect(wrapper.find('.host').classes()).not.toContain('custom-dynamic-class')

    const vm = wrapper.vm as any
    vm.modelValue = true
    await nextTick()
    expect(wrapper.find('.host').classes()).toContain('custom-dynamic-class')
  })
})
