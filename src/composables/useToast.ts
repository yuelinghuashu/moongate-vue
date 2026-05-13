import { createApp } from "vue"
import Toast from "../components/Toast.vue"

export interface ToastOptions {
  /** 消息内容 */
  message: string
  /** 类型 */
  type?: "success" | "error" | "warning" | "info"
  /** 持续时间（毫秒），0 表示不自动关闭 */
  duration?: number
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 位置 */
  position?: "top" | "bottom"
  /** 自定义图标 */
  icon?: string
}

let toastContainer: HTMLDivElement | null = null
let currentToastApp: ReturnType<typeof createApp> | null = null

const showToast = (options: ToastOptions) => {
  // 完全销毁之前的实例和容器
  if (currentToastApp) {
    currentToastApp.unmount()
    currentToastApp = null
  }

  if (toastContainer) {
    toastContainer.remove()
    toastContainer = null
  }

  // 创建新容器
  toastContainer = document.createElement("div")
  document.body.appendChild(toastContainer)

  // 创建 Toast 组件实例
  const toastApp = createApp(Toast, {
    modelValue: true,
    message: options.message,
    type: options.type || "info",
    duration: options.duration ?? 3000,
    closable: options.closable ?? false,
    position: options.position ?? "top",
    icon: options.icon ?? "",
    onClose: () => {
      toastApp.unmount()
      if (toastContainer) {
        toastContainer.remove()
        toastContainer = null
      }
      currentToastApp = null
    },
    "onUpdate:modelValue": (val: boolean) => {
      if (!val) {
        toastApp.unmount()
        if (toastContainer) {
          toastContainer.remove()
          toastContainer = null
        }
        currentToastApp = null
      }
    },
  })

  toastApp.mount(toastContainer)
  currentToastApp = toastApp
}

// 便捷方法
export const useToast = () => {
  return {
    /** 显示通知 */
    show: showToast,
    /** 成功通知 */
    success: (message: string, options?: Partial<Omit<ToastOptions, "message" | "type">>) =>
      showToast({ message, type: "success", ...options }),
    /** 错误通知 */
    error: (message: string, options?: Partial<Omit<ToastOptions, "message" | "type">>) =>
      showToast({ message, type: "error", ...options }),
    /** 警告通知 */
    warning: (message: string, options?: Partial<Omit<ToastOptions, "message" | "type">>) =>
      showToast({ message, type: "warning", ...options }),
    /** 信息通知 */
    info: (message: string, options?: Partial<Omit<ToastOptions, "message" | "type">>) =>
      showToast({ message, type: "info", ...options }),
  }
}