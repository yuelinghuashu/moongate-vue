// composables/createOverlay.ts
import { createApp, type Component } from 'vue'

/**
 * 覆盖层（Overlay）实例
 * 每个实例对应一个独立的动态挂载的组件（如 Message、Toast）
 */
export interface OverlayInstance {
  /** 关闭当前实例（等待离开动画结束后清理 DOM） */
  close: () => void
  /** Vue 应用实例（可用于调试或手动控制） */
  app: ReturnType<typeof createApp>
  /** 组件挂载的元素节点 */
  element: HTMLElement
}

/** 动态挂载组件的通用 Props（与 Message/Toast 共享的字段） */
export interface OverlayProps {
  /** 消息内容 */
  message?: string
  /** 消息类型 */
  type?: string
  /** 持续时间（毫秒），0 表示不自动关闭 */
  duration?: number
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 自定义图标 */
  icon?: string
  /** 关闭回调 */
  onClose?: () => void
  /** 额外的组件特有属性 */
  [key: string]: unknown
}

/** 检查是否在浏览器环境（SSR 安全） */
const isBrowser = typeof document !== 'undefined' && typeof window !== 'undefined'

/** 离开动画时长（毫秒），需与 CSS 中 leave 动画时长一致 */
const TRANSITION_DURATION = 300

/** 共享容器缓存：容器类名 → 容器元素 */
const sharedContainers = new Map<string, HTMLDivElement>()

/** 所有活动的覆盖层实例（用于统一清理） */
const activeInstances = new Set<OverlayInstance>()

/**
 * 获取（或创建）共享容器。
 *
 * 同一类型的覆盖层（如 Message、Toast-top）共用同一个容器，
 * 多个实例会被加进容器的 flex 列布局中，从而实现「堆叠」效果。
 *
 * @param containerClass - 容器的 CSS 类名（如 'mg-message-container'）
 */
function getSharedContainer(containerClass: string): HTMLDivElement {
  let container = sharedContainers.get(containerClass)
  if (!container) {
    container = document.createElement('div')
    container.className = containerClass
    document.body.appendChild(container)
    sharedContainers.set(containerClass, container)
  }
  return container
}

/**
 * 动态创建并挂载一个覆盖层组件（如 Message、Toast）。
 *
 * 相比直接使用 `createApp`，本工具提供：
 * - 每个实例独立的容器，支持同时显示多条（堆叠）
 * - 统一的 `close()` 接口和 `v-model:modelValue` 关闭联动
 * - 活动实例的集中管理
 * - SSR 环境自动跳过
 *
 * @param component - 要挂载的组件（如 Message.vue、Toast.vue）
 * @param props - 传递给组件的属性，`modelValue` 默认设为 `true`（显示状态）
 * @param containerClass - 共享容器的 CSS 类名，用于堆叠与定位
 * @returns 覆盖层实例；在 SSR 或非浏览器环境下返回 `null`
 *
 * @example
 * ```ts
 * const instance = createOverlay(Message, {
 *   message: 'Hello',
 *   type: 'success',
 *   duration: 3000,
 * }, 'mg-message-container')
 *
 * // 手动关闭（等待动画结束后自动清理）
 * instance?.close()
 * ```
 */
export function createOverlay(
  component: Component,
  props: OverlayProps = {},
  containerClass = 'mg-overlay-container',
): OverlayInstance | null {
  // SSR 环境下不执行
  if (!isBrowser) return null

  const container = getSharedContainer(containerClass)
  const element = document.createElement('div')
  container.appendChild(element)

  let app: ReturnType<typeof createApp> | null = null
  let destroyTimer: number | null = null

  /** 立即销毁实例（同步清理 DOM） */
  const destroy = () => {
    if (destroyTimer !== null) {
      clearTimeout(destroyTimer)
      destroyTimer = null
    }
    if (!app) return

    app.unmount()
    app = null
    if (element.parentNode === container) {
      container.removeChild(element)
    }

    // 容器为空、或已被外部移除（如测试中清空 body）时，从 DOM 中移除容器
    if (container.childElementCount === 0 || !container.isConnected) {
      container.remove()
      sharedContainers.delete(containerClass)
    }

    activeInstances.delete(instance)
  }

  /** 延迟销毁：等待离开动画播放完成 */
  const scheduleDestroy = () => {
    if (destroyTimer !== null || !app) return
    destroyTimer = window.setTimeout(() => {
      destroyTimer = null
      destroy()
    }, TRANSITION_DURATION)
  }

  const instance: OverlayInstance = {
    close: scheduleDestroy,
    app: null as unknown as ReturnType<typeof createApp>,
    element,
  }

  app = createApp(component, {
    modelValue: true,
    ...props,
    onClose: () => {
      props.onClose?.()
      scheduleDestroy()
    },
    'onUpdate:modelValue': (val: boolean) => {
      if (!val) scheduleDestroy()
    },
  })

  app.mount(element)
  instance.app = app
  activeInstances.add(instance)

  return instance
}

/**
 * 关闭所有活动的覆盖层实例（等待离开动画结束后销毁）
 * 每个实例的 destroy() 回调会自行从 activeInstances 中移除
 */
export function closeAllOverlays(): void {
  // 复制一份避免迭代中 Set 变化
  const instances = [...activeInstances]
  for (const instance of instances) {
    instance.close()
  }
}

/**
 * 立即销毁所有活动的覆盖层实例（跳过离开动画）。
 * 适用于应用卸载、测试清理等需要同步清理的场景。
 */
export function destroyAllOverlays(): void {
  // 先收集所有容器，避免 Set 在迭代中变化
  const containersToCheck = new Set<HTMLDivElement>(sharedContainers.values())

  activeInstances.forEach((instance) => {
    const app = instance.app
    if (app) {
      app.unmount()
      instance.element.remove()
      activeInstances.delete(instance)
    }
  })

  // 清理所有已脱离 DOM 或已空的容器
  containersToCheck.forEach((container) => {
    if (!container.isConnected || container.childElementCount === 0) {
      container.remove()
    }
  })

  // 移除所有缓存引用，下次调用会重新创建
  sharedContainers.clear()
  activeInstances.clear()
}
