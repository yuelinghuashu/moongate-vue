import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import {
  createOverlay,
  closeAllOverlays,
  destroyAllOverlays,
} from '../../composables/createOverlay'

const TestOverlay = defineComponent({
  name: 'TestOverlay',
  props: {
    message: { type: String, default: '' },
  },
  emits: ['close', 'update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        'div',
        {
          class: 'test-overlay-content',
          'data-message': props.message,
          onClick: (e: MouseEvent) => {
            // 支持两种关闭方式：emit close（触发 onClose）或 update:modelValue=false
            if ((e.target as HTMLElement)?.classList.contains('close-btn')) {
              emit('close')
            } else {
              emit('update:modelValue', false)
            }
          },
        },
        [props.message, h('button', { class: 'close-btn', type: 'button' }, '关闭')],
      )
  },
})

describe('createOverlay', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    closeAllOverlays()
    document.body.innerHTML = ''
  })

  it('创建并挂载 overlay 到 body', () => {
    const instance = createOverlay(TestOverlay, { message: '测试消息' }, 'test-container')
    expect(instance).not.toBeNull()
    expect(document.body.querySelector('.test-overlay-content')).not.toBeNull()
    expect(document.body.querySelector('.test-overlay-content')?.textContent).toContain('测试消息')
    expect(document.body.querySelector('.test-overlay-content')?.getAttribute('data-message')).toBe(
      '测试消息',
    )
  })

  it('共享容器：多个实例堆叠', () => {
    createOverlay(TestOverlay, { message: '第一条' }, 'stack-container')
    createOverlay(TestOverlay, { message: '第二条' }, 'stack-container')

    const container = document.body.querySelector('.stack-container')
    expect(container).not.toBeNull()
    expect(container?.querySelectorAll('.test-overlay-content')).toHaveLength(2)
  })

  it('不同容器类名创建独立容器', () => {
    createOverlay(TestOverlay, { message: 'A' }, 'container-a')
    createOverlay(TestOverlay, { message: 'B' }, 'container-b')

    expect(document.body.querySelector('.container-a')).not.toBeNull()
    expect(document.body.querySelector('.container-b')).not.toBeNull()
  })

  it('close 清除实例，容器为空时移除', () => {
    const instance = createOverlay(TestOverlay, { message: '短暂消息' }, 'temp-container')
    expect(document.body.querySelector('.temp-container')).not.toBeNull()

    instance?.close()
    // close 是延迟销毁（等待动画），需要等待 TRANSITION_DURATION
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(document.body.querySelector('.temp-container')).toBeNull()
        resolve()
      }, 350)
    })
  })

  it('onUpdate:modelValue=false 触发延迟销毁', async () => {
    const instance = createOverlay(TestOverlay, {}, 'update-container')
    const content = document.body.querySelector('.test-overlay-content')
    ;(content as HTMLElement).click()
    await new Promise((r) => setTimeout(r, 350))
    expect(document.body.querySelector('.update-container')).toBeNull()
  })

  it('onClose 回调触发', async () => {
    let closed = false
    createOverlay(
      TestOverlay,
      {
        onClose: () => {
          closed = true
        },
      },
      'close-container',
    )
    const closeBtn = document.body.querySelector('.close-btn') as HTMLElement
    closeBtn.click()
    await new Promise((r) => setTimeout(r, 350))
    expect(closed).toBe(true)
  })

  it('closeAllOverlays 清理所有实例', () => {
    createOverlay(TestOverlay, {}, 'close-all-a')
    createOverlay(TestOverlay, {}, 'close-all-b')
    expect(document.body.querySelector('.close-all-a')).not.toBeNull()
    expect(document.body.querySelector('.close-all-b')).not.toBeNull()

    closeAllOverlays()
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(document.body.querySelector('.close-all-a')).toBeNull()
        expect(document.body.querySelector('.close-all-b')).toBeNull()
        resolve()
      }, 350)
    })
  })

  // ==================== 补充：destroyAllOverlays ====================

  it('destroyAllOverlays 立即销毁所有实例（跳过动画）', () => {
    createOverlay(TestOverlay, {}, 'destroy-all-a')
    createOverlay(TestOverlay, {}, 'destroy-all-b')
    expect(document.body.querySelector('.destroy-all-a')).not.toBeNull()
    expect(document.body.querySelector('.destroy-all-b')).not.toBeNull()

    destroyAllOverlays()

    // 同步销毁，无需等待
    expect(document.body.querySelector('.destroy-all-a')).toBeNull()
    expect(document.body.querySelector('.destroy-all-b')).toBeNull()
  })

  it('destroyAllOverlays 清理共享容器引用', () => {
    createOverlay(TestOverlay, {}, 'destroy-cleanup')
    destroyAllOverlays()

    // 再次创建应该使用新容器
    createOverlay(TestOverlay, {}, 'destroy-cleanup')
    expect(document.body.querySelector('.destroy-cleanup')).not.toBeNull()
    destroyAllOverlays()
  })

  it('destroyAllOverlays 后 close 不再重复清理', () => {
    const instance = createOverlay(TestOverlay, {}, 'destroy-close')
    destroyAllOverlays()
    // 实例已销毁，再调用 close 不应报错
    expect(() => instance?.close()).not.toThrow()
    expect(document.body.querySelector('.destroy-close')).toBeNull()
  })

  // ==================== 补充：重复 close ====================

  it('重复调用 close 只执行一次销毁', () => {
    const instance = createOverlay(TestOverlay, {}, 'double-close')
    expect(document.body.querySelector('.double-close')).not.toBeNull()

    instance?.close()
    instance?.close() // 第二次调用不应报错

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(document.body.querySelector('.double-close')).toBeNull()
        resolve()
      }, 350)
    })
  })

  it('close 后实例从 activeInstances 中移除（closeAllOverlays 不重复清理）', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const instance = createOverlay(TestOverlay, {}, 'post-close-clean')
    instance?.close()
    await new Promise((r) => setTimeout(r, 350))
    expect(document.body.querySelector('.post-close-clean')).toBeNull()
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  // ==================== 补充：onClose 联动 ====================

  it('onClose 回调后自动销毁实例', async () => {
    let closed = false
    createOverlay(
      TestOverlay,
      {
        message: '联动关闭',
        onClose: () => {
          closed = true
        },
      },
      'onclose-destroy',
    )
    const closeBtn = document.body.querySelector('.close-btn') as HTMLElement
    closeBtn.click()
    await new Promise((r) => setTimeout(r, 350))
    expect(closed).toBe(true)
    // 实例被自动销毁
    expect(document.body.querySelector('.onclose-destroy')).toBeNull()
  })

  // ==================== 补充：关闭回调联动 ====================

  it('onClose 中调用 close 不会重复销毁', async () => {
    let closeCount = 0
    const instance = createOverlay(
      TestOverlay,
      {
        onClose: () => {
          closeCount++
        },
      },
      'nested-close',
    )
    const closeBtn = document.body.querySelector('.close-btn') as HTMLElement
    closeBtn.click()
    // 等待动画后检查不报错
    await new Promise((r) => setTimeout(r, 350))
    expect(closeCount).toBe(1)
    expect(document.body.querySelector('.nested-close')).toBeNull()
  })

  // ==================== 补充：容器清理 ====================

  it('容器元素被外部移除后 close 不会报错', async () => {
    const instance = createOverlay(TestOverlay, {}, 'external-remove')
    // 外部移除容器
    document.body.innerHTML = ''
    // close 不应报错
    expect(() => instance?.close()).not.toThrow()
    await new Promise((r) => setTimeout(r, 350))
  })
})
