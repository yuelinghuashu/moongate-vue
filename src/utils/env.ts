/**
 * SSR 安全：是否在浏览器环境。
 *
 * 统一检测逻辑，避免各组件/composable 重复声明。
 * 同时检查 window 和 document，与原实现保持一致。
 */
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
