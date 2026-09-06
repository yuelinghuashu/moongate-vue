import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useNotification } from '../../composables/useNotification'

/**
 * 创建测试宿主组件：包装 useNotification，暴露内部状态。
 */
function createHost(duration: number | (() => number) = 1000) {
  return defineComponent({
    setup() {
      const modelValue = ref(false)
      const onClose = vi.fn()
      const { leaving, handleClose } = useNotification(modelValue, duration, onClose)
      return { modelValue, leaving, handleClose, onClose }
    },
    template: `<div />`,
  })
}

describe('useNotification', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('初始状态：leaving 为 false', () => {
    const wrapper = mount(createHost())
    expect(wrapper.vm.leaving).toBe(false)
    wrapper.unmount()
  })

  it('modelValue=true 时启动自动关闭定时器', async () => {
    const wrapper = mount(createHost(500))
    wrapper.vm.modelValue = true
    await nextTick()

    expect(wrapper.vm.onClose).not.toHaveBeenCalled()

    vi.advanceTimersByTime(500)
    expect(wrapper.vm.onClose).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.leaving).toBe(true)

    wrapper.unmount()
  })

  it('duration=0 时不自动关闭', async () => {
    const wrapper = mount(createHost(0))
    wrapper.vm.modelValue = true
    await nextTick()

    vi.advanceTimersByTime(10000)
    expect(wrapper.vm.onClose).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('支持 duration 为 getter 函数', async () => {
    const durationRef = ref(300)
    const wrapper = mount(createHost(() => durationRef.value))
    wrapper.vm.modelValue = true
    await nextTick()

    vi.advanceTimersByTime(300)
    expect(wrapper.vm.onClose).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('handleClose 手动调用触发 leaving + onClose', async () => {
    const wrapper = mount(createHost(5000))
    wrapper.vm.modelValue = true
    await nextTick()

    wrapper.vm.handleClose()
    expect(wrapper.vm.leaving).toBe(true)
    expect(wrapper.vm.onClose).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('modelValue 从 true 变为 false 时清除定时器', async () => {
    const wrapper = mount(createHost(500))
    wrapper.vm.modelValue = true
    await nextTick()

    wrapper.vm.modelValue = false
    await nextTick()

    vi.advanceTimersByTime(1000)
    // 不应触发 onClose（定时器已被清除）
    expect(wrapper.vm.onClose).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('组件卸载时清除定时器', async () => {
    const wrapper = mount(createHost(500))
    wrapper.vm.modelValue = true
    await nextTick()

    wrapper.unmount()

    // 卸载后定时器不应触发
    vi.advanceTimersByTime(1000)
    // 如果定时器未清理，handleClose 会在已卸载组件上调用 onClose
    // 这里主要验证不会报错
  })
})
