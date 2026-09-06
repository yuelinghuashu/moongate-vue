// composables/useClickOutside.ts
import { onMounted, onUnmounted, type Ref } from 'vue'
import { isBrowser } from '../utils/env'

/**
 * 监听点击目标元素外部时触发回调。
 *
 * Popover / Dropdown 共享逻辑，消除各自手写的 addEventListener + removeEventListener。
 *
 * @param refs - 需要排除的元素引用数组（触发区 + 浮层）
 * @param callback - 点击外部时的回调（调用方自行判断是否处于打开状态）
 * @param eventType - 事件类型，默认 'mousedown'（Popover）；Dropdown 传 'click'
 */
export function useClickOutside(
  refs: Ref<HTMLElement | null>[],
  callback: () => void,
  eventType: 'mousedown' | 'click' = 'mousedown',
) {
  const handler = (event: Event) => {
    const target = event.target as Node
    for (const ref of refs) {
      if (ref.value?.contains(target)) return
    }
    callback()
  }

  onMounted(() => {
    if (isBrowser) {
      document.addEventListener(eventType, handler, true)
    }
  })

  onUnmounted(() => {
    if (isBrowser) {
      document.removeEventListener(eventType, handler, true)
    }
  })
}
