// composables/useMessage.ts
import { createApp } from "vue"
import Message from "../components/Message.vue"

export interface MessageOptions {
  /** 消息内容 */
  message: string
  /** 消息类型 */
  type?: "success" | "error" | "warning" | "info"
  /** 持续时间（毫秒），0 表示不自动关闭，默认 3000 */
  duration?: number
  /** 是否显示关闭按钮，默认 false */
  closable?: boolean
  /** 自定义图标 */
  icon?: string
  /** 关闭回调 */
  onClose?: () => void
}

let messageContainer: HTMLDivElement | null = null
let currentMessageApp: ReturnType<typeof createApp> | null = null

/**
 * 显示消息提示
 */
const showMessage = (options: MessageOptions) => {
  // 完全销毁之前的实例和容器
  if (currentMessageApp) {
    currentMessageApp.unmount()
    currentMessageApp = null
  }

  if (messageContainer) {
    messageContainer.remove()
    messageContainer = null
  }

  // 创建新容器
  messageContainer = document.createElement("div")
  document.body.appendChild(messageContainer)

  // 创建 Message 组件实例
  const messageApp = createApp(Message, {
    modelValue: true,
    message: options.message,
    type: options.type || "info",
    duration: options.duration ?? 3000,
    closable: options.closable ?? false,
    icon: options.icon ?? "",
    onClose: () => {
      options.onClose?.()
      messageApp.unmount()
      if (messageContainer) {
        messageContainer.remove()
        messageContainer = null
      }
      currentMessageApp = null
    },
    "onUpdate:modelValue": (val: boolean) => {
      if (!val) {
        messageApp.unmount()
        if (messageContainer) {
          messageContainer.remove()
          messageContainer = null
        }
        currentMessageApp = null
      }
    },
  })

  messageApp.mount(messageContainer)
  currentMessageApp = messageApp
}

/**
 * 消息提示组合式函数
 */
export const useMessage = () => {
  return {
    /** 显示消息 */
    show: showMessage,
    /** 成功消息 */
    success: (message: string, options?: Partial<Omit<MessageOptions, "message" | "type">>) =>
      showMessage({ message, type: "success", ...options }),
    /** 错误消息 */
    error: (message: string, options?: Partial<Omit<MessageOptions, "message" | "type">>) =>
      showMessage({ message, type: "error", ...options }),
    /** 警告消息 */
    warning: (message: string, options?: Partial<Omit<MessageOptions, "message" | "type">>) =>
      showMessage({ message, type: "warning", ...options }),
    /** 信息消息 */
    info: (message: string, options?: Partial<Omit<MessageOptions, "message" | "type">>) =>
      showMessage({ message, type: "info", ...options }),
  }
}