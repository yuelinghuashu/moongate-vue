import { vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { destroyAllOverlays } from '../composables/createOverlay'

// ==================== 浏览器 API Polyfill ====================

/** jsdom 未实现 ResizeObserver，需要 mock */
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock)

/** jsdom 未实现 matchMedia，部分组件可能依赖 */
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

/** jsdom 未实现 scrollTo */
if (typeof window.scrollTo !== 'function') {
  window.scrollTo = () => {}
}

// ==================== DOMRect mock（Tooltip 位置计算依赖） ====================

/** 默认 DOMRect mock：返回可控的尺寸与位置数据 */
export const createMockRect = (overrides: Partial<DOMRect> = {}) => {
  return {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 100,
    bottom: 50,
    width: 100,
    height: 50,
    toJSON: () => ({}),
    ...overrides,
  } as DOMRect
}

// ==================== 每测试用例后的清理 ====================

/**
 * 清理 body 中残留的 DOM（createOverlay 挂载的容器等）。
 * 必须先 flush Vue 的异步作业（Teleport 移除、wrapper 自动卸载），
 * 否则直接清空 body 会导致 Vue 尝试向已移除节点插入时报错。
 */
afterEach(async () => {
  destroyAllOverlays()
  await nextTick()
  await new Promise((r) => setTimeout(r, 0))
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})
