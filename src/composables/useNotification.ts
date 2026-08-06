// composables/useNotification.ts
import { ref, watch, onMounted, onUnmounted, toValue, type Ref } from 'vue'

/**
 * 通知型组件（Message/Toast）的共享逻辑。
 *
 * 统一处理：
 * - 自动关闭定时器（duration 控制，0 表示不自动关闭）
 * - 退出动画状态（leaving，配合 createOverlay 的延迟销毁）
 * - modelValue 变化监听控制定时器启停
 * - SSR 安全（服务端不创建定时器，避免资源泄漏）
 *
 * @param modelValue - `v-model` 双向绑定（由组件内 `defineModel` 传入）
 * @param duration - 持续时间（毫秒），0 表示不自动关闭；支持 getter 以便响应式读取 props
 * @param onClose - 关闭回调（组件 `emit('close')`）
 * @returns：
 * - `leaving`：是否正在退出（模板绑定到 CSS 类）
 * - `handleClose`：关闭方法（触发退场动画 + 关闭回调）
 */
export function useNotification(
  modelValue: Ref<boolean>,
  duration: number | (() => number),
  onClose: () => void,
) {
  /** 是否在浏览器环境（SSR 安全，防止服务端创建未清理的定时器） */
  const isBrowser = typeof window !== 'undefined'

  /** 是否正在退出（触发 CSS 退出动画） */
  const leaving = ref(false)

  let timer: ReturnType<typeof setTimeout> | null = null

  /** 清除自动关闭定时器 */
  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  /** 启动自动关闭定时器 */
  const startTimer = () => {
    clearTimer()
    // SSR 环境下不创建定时器（服务端渲染时 setTimeout 不会被清理）
    const durationMs = toValue(duration)
    if (isBrowser && durationMs > 0 && modelValue.value) {
      timer = setTimeout(() => {
        handleClose()
      }, durationMs)
    }
  }

  /** 关闭通知：先播放退出动画，外层的 createOverlay 会在动画结束后清理 DOM */
  const handleClose = () => {
    clearTimer()
    leaving.value = true
    onClose()
  }

  // 监听 modelValue 变化，控制定时器启停
  watch(
    () => modelValue.value,
    (val) => {
      if (val) {
        // 打开：启动自动关闭定时器
        startTimer()
      } else {
        // 关闭：清除定时器
        clearTimer()
      }
    },
    { immediate: true },
  )

  // 组件挂载时，如果初始为显示状态，启动定时器
  onMounted(() => {
    if (modelValue.value) {
      startTimer()
    }
  })

  // 组件卸载时清理定时器
  onUnmounted(() => {
    clearTimer()
  })

  return {
    /** 是否正在退出（触发 CSS 退出动画） */
    leaving,
    /** 关闭通知（播放退场动画 + 回调） */
    handleClose,
  }
}
