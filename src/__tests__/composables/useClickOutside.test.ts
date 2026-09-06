import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, ref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useClickOutside } from '../../composables/useClickOutside'

/**
 * 创建测试宿主组件：包含 trigger + floating 两个元素，
 * 点击它们外部时调用 callback。
 */
function createHost(eventType: 'mousedown' | 'click' = 'mousedown') {
  return defineComponent({
    setup() {
      const triggerRef = ref<HTMLElement | null>(null)
      const floatingRef = ref<HTMLElement | null>(null)
      const callback = vi.fn()

      useClickOutside([triggerRef, floatingRef], callback, eventType)

      return { triggerRef, floatingRef, callback }
    },
    template: `
      <div>
        <div ref="triggerRef" class="trigger">触发区</div>
        <div ref="floatingRef" class="floating">浮层</div>
        <div class="outside">外部区域</div>
      </div>
    `,
  })
}

describe('useClickOutside', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('点击 refs 外部时触发 callback', async () => {
    const Host = createHost()
    const wrapper = mount(Host, { attachTo: document.body })

    document
      .querySelector('.outside')!
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(wrapper.vm.callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('点击 triggerRef 内部不触发 callback', async () => {
    const Host = createHost()
    const wrapper = mount(Host, { attachTo: document.body })

    document
      .querySelector('.trigger')!
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(wrapper.vm.callback).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('点击 floatingRef 内部不触发 callback', async () => {
    const Host = createHost()
    const wrapper = mount(Host, { attachTo: document.body })

    document
      .querySelector('.floating')!
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(wrapper.vm.callback).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('支持 click 事件类型', async () => {
    const Host = createHost('click')
    const wrapper = mount(Host, { attachTo: document.body })

    // mousedown 不应触发
    document
      .querySelector('.outside')!
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(wrapper.vm.callback).not.toHaveBeenCalled()

    // click 应触发
    document.querySelector('.outside')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(wrapper.vm.callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('组件卸载后不再触发 callback', async () => {
    const Host = createHost()
    const wrapper = mount(Host, { attachTo: document.body })

    wrapper.unmount()

    // 卸载后触发事件不应报错，callback 也不应被调用
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(wrapper.vm.callback).not.toHaveBeenCalled()
  })

  it('多个 refs 都排除在外', async () => {
    const Host = defineComponent({
      setup() {
        const ref1 = ref<HTMLElement | null>(null)
        const ref2 = ref<HTMLElement | null>(null)
        const ref3 = ref<HTMLElement | null>(null)
        const callback = vi.fn()

        useClickOutside([ref1, ref2, ref3], callback)

        return { ref1, ref2, ref3, callback }
      },
      template: `
        <div>
          <div ref="ref1" class="r1">区域1</div>
          <div ref="ref2" class="r2">区域2</div>
          <div ref="ref3" class="r3">区域3</div>
          <div class="outside">外部</div>
        </div>
      `,
    })

    const wrapper = mount(Host, { attachTo: document.body })

    // 点击任一 ref 内部不触发
    document.querySelector('.r2')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(wrapper.vm.callback).not.toHaveBeenCalled()

    // 点击外部触发
    document
      .querySelector('.outside')!
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(wrapper.vm.callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })
})
