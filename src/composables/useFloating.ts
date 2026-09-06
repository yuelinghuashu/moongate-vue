// composables/useFloating.ts
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { Placement } from '../types/components'
import { isBrowser } from '../utils/env'

/**
 * 悬浮层定位组合式函数（Popover/Tooltip 共享）。
 *
 * 统一处理：
 * - 显示/隐藏（支持 show/hide 延迟、取消隐藏定时器）
 * - 位置计算（按方向定位 + 视口翻转）
 * - 滚动/窗口尺寸变化时重新定位
 * - ResizeObserver 仅监听悬浮层自身尺寸（避免全局 MutationObserver 性能开销）
 * - SSR 安全、生命周期清理
 *
 * 通过 options 参数化组件的细微行为差异
 * （见 Popover.vue / Tooltip.vue 的调用方式）。
 */
export interface UseFloatingOptions {
  /** 期望放置方向（响应式 getter，读取 props.placement） */
  placement: () => Placement
  /** 悬浮层与触发元素的偏移量（像素，响应式 getter） */
  offset: () => number
  /** 显示延迟（毫秒） */
  showDelay?: () => number
  /** 隐藏延迟（毫秒），配合基于定时器的卸载逻辑 */
  hideDelay?: () => number
  /**
   * 是否对翻转后的位置做最终视口边界修正（clamp）。
   * Popover: true；Tooltip: false（保持其在视口外的原始行为）。
   */
  boundsCorrection?: boolean
  /** 显示后是否 `await nextTick()` 再更新位置（确保浮层已渲染） */
  awaitNextTick?: boolean
}

/**
 * 创建悬浮层定位的共享逻辑。
 *
 * @param options - 配置项（见 UseFloatingOptions）
 * @returns：
 * - `triggerRef` / `floatingRef`：需要绑定到模板对应元素
 * - `visible` / `currentPlacement` / `floatStyle`：模板绑定
 * - `show` / `hide`：立即显示/隐藏
 * - `startHideTimer` / `cancelHideTimer`：延迟隐藏 / 取消延迟隐藏
 */
export function useFloating(options: UseFloatingOptions) {
  const {
    placement,
    offset,
    showDelay = () => 0,
    hideDelay = () => 0,
    boundsCorrection = false,
    awaitNextTick = false,
  } = options

  /** 悬浮层是否可见 */
  const visible = ref(false)

  /** 显示延时定时器 */
  let showTimer: ReturnType<typeof setTimeout> | null = null
  /** 隐藏延时定时器 */
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  /** 触发元素 DOM 引用（模板绑定） */
  const triggerRef = ref<HTMLElement | null>(null)
  /** 悬浮层元素 DOM 引用（模板绑定） */
  const floatingRef = ref<HTMLElement | null>(null)

  /** 当前实际使用的放置位置（可能因翻转而改变） */
  const currentPlacement = ref<Placement>(placement())
  /** 悬浮层位置坐标（相对于视口） */
  const position = ref({ top: 0, left: 0 })

  /** 悬浮层动态样式（固定定位） */
  const floatStyle = computed(() => ({
    top: `${position.value.top}px`,
    left: `${position.value.left}px`,
  }))

  // ==================== 定时器管理 ====================

  /** 清除所有定时器 */
  const clearTimers = () => {
    if (showTimer) clearTimeout(showTimer)
    if (hideTimer) clearTimeout(hideTimer)
    showTimer = null
    hideTimer = null
  }

  /** 取消隐藏定时器（鼠标移入浮层内容时调用，防止误关闭） */
  const cancelHideTimer = () => {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  /** 启动隐藏定时器（鼠标离开触发区或浮层内容时调用） */
  const startHideTimer = () => {
    cancelHideTimer()
    hideTimer = setTimeout(() => {
      hideTimer = null
      visible.value = false
      disableResizeObserver()
    }, hideDelay())
  }

  // ==================== 位置计算核心 ====================

  /**
   * 根据目标方向计算位置（无翻转检测）
   * @param targetPlacement - 目标放置方向
   * @param triggerRect - 触发元素边界矩形
   * @param floatRect - 悬浮层边界矩形
   * @returns 计算后的 top/left 坐标
   */
  const recalculatePosition = (
    targetPlacement: Placement,
    triggerRect: DOMRect,
    floatRect: DOMRect,
  ): { top: number; left: number } => {
    let top = 0
    let left = 0

    switch (targetPlacement) {
      case 'top':
        top = triggerRect.top - floatRect.height - offset()
        left = triggerRect.left + (triggerRect.width - floatRect.width) / 2
        break
      case 'bottom':
        top = triggerRect.bottom + offset()
        left = triggerRect.left + (triggerRect.width - floatRect.width) / 2
        break
      case 'left':
        top = triggerRect.top + (triggerRect.height - floatRect.height) / 2
        left = triggerRect.left - floatRect.width - offset()
        break
      case 'right':
        top = triggerRect.top + (triggerRect.height - floatRect.height) / 2
        left = triggerRect.right + offset()
        break
    }

    return { top, left }
  }

  /**
   * 更新悬浮层位置
   * 支持自动翻转（视口内检测），可按配置进行最终边界修正
   */
  const updatePosition = () => {
    // SSR 环境或 DOM 未准备好时跳过
    if (!isBrowser || !triggerRef.value || !floatingRef.value) return

    const triggerRect = triggerRef.value.getBoundingClientRect()
    const floatRect = floatingRef.value.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let finalPlacement = placement()
    let pos = recalculatePosition(finalPlacement, triggerRect, floatRect)

    // 1. 检测是否超出视口，决定是否翻转
    switch (placement()) {
      case 'top':
        if (pos.top < 0) finalPlacement = 'bottom'
        break
      case 'bottom':
        if (pos.top + floatRect.height > viewportHeight) finalPlacement = 'top'
        break
      case 'left':
        if (pos.left < 0) finalPlacement = 'right'
        break
      case 'right':
        if (pos.left + floatRect.width > viewportWidth) finalPlacement = 'left'
        break
    }

    // 2. 如果翻转了方向，重新计算位置
    if (finalPlacement !== placement()) {
      currentPlacement.value = finalPlacement
      pos = recalculatePosition(finalPlacement, triggerRect, floatRect)
      // 不做边界修正的组件（如 Tooltip）：翻转后直接结束
      if (!boundsCorrection) {
        position.value = pos
        return
      }
    } else {
      currentPlacement.value = placement()
    }

    // 3. 边界修正（确保悬浮层完全在视口内）——仅 boundsCorrection 启用时
    if (boundsCorrection) {
      const finalRect = floatingRef.value.getBoundingClientRect()
      if (pos.left < 0) {
        pos.left = 0
      } else if (pos.left + finalRect.width > viewportWidth) {
        pos.left = viewportWidth - finalRect.width
      }
      if (pos.top < 0) {
        pos.top = 0
      } else if (pos.top + finalRect.height > viewportHeight) {
        pos.top = viewportHeight - finalRect.height
      }
    }

    position.value = pos
  }

  // ==================== 显示/隐藏 ====================

  /**
   * 显示悬浮层
   * 延迟后设置 visible=true，并在（可选）下一帧更新位置
   */
  const show = () => {
    if (showTimer) clearTimeout(showTimer)
    cancelHideTimer()
    showTimer = setTimeout(async () => {
      showTimer = null
      visible.value = true
      if (awaitNextTick) await nextTick()
      updatePosition()
      enableResizeObserver()
    }, showDelay())
  }

  /**
   * 立即隐藏悬浮层（清除所有定时器）
   */
  const hide = () => {
    clearTimers()
    visible.value = false
    disableResizeObserver()
  }

  // ==================== 滚动/尺寸监听 ====================

  /** 滚动时更新位置 */
  const handleScroll = () => {
    if (visible.value) updatePosition()
  }

  /** 窗口大小变化时更新位置 */
  const handleResize = () => {
    if (visible.value) updatePosition()
  }

  /** 尺寸变化观察器（仅监听悬浮层自身，避免全局 MutationObserver 性能开销） */
  let resizeObserver: ResizeObserver | null = null

  const enableResizeObserver = () => {
    if (!isBrowser || resizeObserver || !floatingRef.value) return
    resizeObserver = new ResizeObserver(() => {
      if (visible.value) updatePosition()
    })
    resizeObserver.observe(floatingRef.value)
  }

  const disableResizeObserver = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  }

  // ==================== 生命周期 ====================

  onMounted(() => {
    if (!isBrowser) return
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true })
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    if (!isBrowser) return
    window.removeEventListener('scroll', handleScroll, { capture: true })
    window.removeEventListener('resize', handleResize)
    disableResizeObserver()
    clearTimers()
  })

  return {
    /** 触发元素 DOM 引用（模板绑定） */
    triggerRef,
    /** 悬浮层元素 DOM 引用（模板绑定） */
    floatingRef,
    /** 是否可见 */
    visible,
    /** 当前实际位置（可能因翻转改变） */
    currentPlacement,
    /** 动态样式 */
    floatStyle,
    /** 延迟显示 */
    show,
    /** 立即隐藏 */
    hide,
    /** 延迟隐藏（基于 hideDelay） */
    startHideTimer,
    /** 取消隐藏定时器 */
    cancelHideTimer,
  }
}
