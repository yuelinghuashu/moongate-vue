// composables/useScrollLock.ts
import { watch, onBeforeUnmount, type Ref } from 'vue'

/**
 * 模块级滚动锁定计数器。
 *
 * 多个 Modal/Drawer 同时打开时，每个实例都会 `lockCount + 1`；
 * 只有最后一个关闭（计数归零）时才恢复 body 滚动。
 * 避免单个组件关闭导致其他组件打开时页面可滚动。
 */
let lockCount = 0

/** 是否在浏览器环境（SSR 安全） */
const isBrowser = typeof document !== 'undefined' && typeof window !== 'undefined'

const lockBodyScroll = () => {
  lockCount += 1
  // SSR 环境下不操作 DOM
  if (isBrowser) {
    document.body.style.overflow = 'hidden'
  }
}

const unlockBodyScroll = () => {
  lockCount = Math.max(0, lockCount - 1)
  // SSR 环境下不操作 DOM
  if (isBrowser && lockCount === 0) {
    document.body.style.overflow = ''
  }
}

/** 可聚焦元素选择器（用于焦点陷阱） */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
].join(',')

/**
 * 获取容器内所有可聚焦元素
 */
const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  )
}

/**
 * 在容器内循环焦点（焦点陷阱）
 */
const trapFocus = (event: KeyboardEvent, container: HTMLElement) => {
  if (event.key !== 'Tab') return

  const focusableElements = getFocusableElements(container)
  if (focusableElements.length === 0) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

/**
 * 管理滚动锁定 + ESC 关闭 + 焦点陷阱的组合式函数。
 *
 * 适用于 Modal、Drawer 等浮层组件，统一处理：
 * - body 滚动锁定（支持多实例计数）
 * - ESC 键关闭
 * - 焦点陷阱（键盘 Tab 循环）
 *
 * @param isOpen - 控制显示/关闭的 Ref（如 `defineModel<boolean>()`）
 * @param overlayRef - 浮层容器 DOM 引用（焦点陷阱作用域）
 * @param onClose - 关闭回调（ESC 键触发）
 * @param options - 可选项
 */
export function useOverlayBehavior(
  isOpen: Ref<boolean>,
  overlayRef: Ref<HTMLElement | null>,
  onClose: () => void,
  options: { enableEsc?: boolean; enableFocusTrap?: boolean } = {},
) {
  const { enableEsc = true, enableFocusTrap = true } = options

  /** 处理键盘事件（ESC 关闭 + Tab 焦点陷阱） */
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && enableEsc && isOpen.value) {
      event.stopPropagation()
      onClose()
    }
    if (enableFocusTrap && overlayRef.value && isOpen.value) {
      trapFocus(event, overlayRef.value)
    }
  }

  watch(
    () => isOpen.value,
    (val) => {
      if (!isBrowser) return

      if (val) {
        lockBodyScroll()
        document.addEventListener('keydown', handleKeydown)
        // 等过渡/渲染完成后聚焦容器内的第一个可聚焦元素
        window.requestAnimationFrame(() => {
          const container = overlayRef.value
          if (!container) return
          const focusableElements = getFocusableElements(container)
          if (focusableElements.length > 0 && enableFocusTrap) {
            focusableElements[0].focus()
          } else if (container) {
            container.setAttribute('tabindex', '-1')
            container.focus()
          }
        })
      } else {
        unlockBodyScroll()
        document.removeEventListener('keydown', handleKeydown)
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    if (!isBrowser) return
    if (isOpen.value) unlockBodyScroll()
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    lockBodyScroll,
    unlockBodyScroll,
    handleKeydown,
  }
}
