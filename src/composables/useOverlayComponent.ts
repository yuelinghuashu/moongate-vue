// composables/useOverlayComponent.ts
import { ref, watch, useId } from 'vue'
import type { Ref } from 'vue'
import { useAttrsWithClass } from './useAttrsWithClass'
import { useOverlayBehavior } from './useScrollLock'

/**
 * 浮层组件（Modal/Drawer 等）的共享逻辑。
 *
 * 统一处理：
 * - `open` / `close` 事件触发（通过回调）
 * - 标题元素唯一 ID（`aria-labelledby`，SSR 安全）
 * - 外部属性透传与 class 合并
 * - 滚动锁定 + ESC 关闭 + 焦点陷阱
 *
 * @param modelValue - `v-model` 双向绑定（由组件内 `defineModel` 传入）
 * @param callbacks - `open` / `close` 事件回调
 * @param className - 内部动态类名工厂函数（如 `() => ({ 'mg-modal-open': modelValue.value })`）
 * @param options - 可选项
 * @returns 共享的状态与方法
 */
export function useOverlayComponent(
  modelValue: Ref<boolean>,
  callbacks: {
    /** 浮层打开时触发 */
    onOpen?: () => void
    /** 浮层关闭时触发 */
    onClose?: () => void
  },
  className: () => Record<string, boolean>,
  options: {
    enableEsc?: Ref<boolean> | boolean
    enableFocusTrap?: Ref<boolean> | boolean
  } = {},
) {
  /** 浮层容器 DOM 引用（焦点陷阱作用域） */
  const overlayRef = ref<HTMLElement | null>(null)

  /** 标题元素的唯一 ID（用于 aria-labelledby，SSR 安全） */
  const titleId = useId()

  /** 处理外部属性透传（无内部动态类，仅合并外部 class） */
  const { attrsWithoutClass, mergedClass } = useAttrsWithClass(className)

  /** 关闭浮层 */
  function handleClose() {
    modelValue.value = false
  }

  // 统一管理滚动锁定 + ESC 关闭 + 焦点陷阱
  // 使用 getter 确保动态变化的 enableEsc/enableFocusTrap 能被实时读取
  useOverlayBehavior(modelValue, overlayRef, handleClose, {
    enableEsc: () =>
      typeof options.enableEsc === 'boolean'
        ? options.enableEsc
        : (options.enableEsc?.value ?? true),
    enableFocusTrap: () =>
      typeof options.enableFocusTrap === 'boolean'
        ? options.enableFocusTrap
        : (options.enableFocusTrap?.value ?? true),
  })

  /**
   * 监听 modelValue 变化
   * - 打开时：触发 onOpen 回调
   * - 关闭时：触发 onClose 回调
   */
  watch(
    () => modelValue.value,
    (val) => {
      if (val) {
        callbacks.onOpen?.()
      } else {
        callbacks.onClose?.()
      }
    },
    { immediate: true },
  )

  return {
    overlayRef,
    titleId,
    attrsWithoutClass,
    mergedClass,
    handleClose,
  }
}
