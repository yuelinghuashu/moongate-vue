// composables/useToast.ts
import Toast from '../components/Toast.vue'
import { createOverlay } from './createOverlay'
import type { OverlayProps } from './createOverlay'

export interface ToastOptions extends OverlayProps {
  /** 消息内容 */
  message: string
  /** 类型 */
  type?: 'success' | 'error' | 'warning' | 'info'
  /** 持续时间（毫秒），0 表示不自动关闭 */
  duration?: number
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 位置 */
  position?: 'top' | 'bottom'
  /** 自定义图标 */
  icon?: string
}

/**
 * 显示通知
 * 支持同时显示多条（堆叠）
 */
const showToast = (options: ToastOptions) => {
  const position = options.position || 'top'
  const containerClass =
    position === 'bottom' ? 'mg-toast-container mg-toast-container-bottom' : 'mg-toast-container'
  return createOverlay(Toast, options, containerClass)
}

/**
 * 通知组合式函数
 */
export const useToast = () => {
  return {
    /** 显示通知 */
    show: showToast,
    /** 成功通知 */
    success: (message: string, options?: Partial<Omit<ToastOptions, 'message' | 'type'>>) =>
      showToast({ message, type: 'success', ...options }),
    /** 错误通知 */
    error: (message: string, options?: Partial<Omit<ToastOptions, 'message' | 'type'>>) =>
      showToast({ message, type: 'error', ...options }),
    /** 警告通知 */
    warning: (message: string, options?: Partial<Omit<ToastOptions, 'message' | 'type'>>) =>
      showToast({ message, type: 'warning', ...options }),
    /** 信息通知 */
    info: (message: string, options?: Partial<Omit<ToastOptions, 'message' | 'type'>>) =>
      showToast({ message, type: 'info', ...options }),
  }
}
