// composables/useMessage.ts
import Message from '../components/Message.vue'
import { createOverlay } from './createOverlay'
import type { OverlayProps } from './createOverlay'

export interface MessageOptions extends OverlayProps {
  /** 消息内容 */
  message: string
  /** 消息类型 */
  type?: 'success' | 'error' | 'warning' | 'info'
  /** 持续时间（毫秒），0 表示不自动关闭，默认 3000 */
  duration?: number
  /** 是否显示关闭按钮，默认 false */
  closable?: boolean
  /** 自定义图标 */
  icon?: string
  /** 关闭回调 */
  onClose?: () => void
}

/**
 * 显示消息提示
 * 支持同时显示多条消息（堆叠）
 */
const showMessage = (options: MessageOptions) => {
  return createOverlay(Message, options, 'mg-message-container')
}

/**
 * 消息提示组合式函数
 */
export const useMessage = () => {
  return {
    /** 显示消息 */
    show: showMessage,
    /** 成功消息 */
    success: (message: string, options?: Partial<Omit<MessageOptions, 'message' | 'type'>>) =>
      showMessage({ message, type: 'success', ...options }),
    /** 错误消息 */
    error: (message: string, options?: Partial<Omit<MessageOptions, 'message' | 'type'>>) =>
      showMessage({ message, type: 'error', ...options }),
    /** 警告消息 */
    warning: (message: string, options?: Partial<Omit<MessageOptions, 'message' | 'type'>>) =>
      showMessage({ message, type: 'warning', ...options }),
    /** 信息消息 */
    info: (message: string, options?: Partial<Omit<MessageOptions, 'message' | 'type'>>) =>
      showMessage({ message, type: 'info', ...options }),
  }
}
