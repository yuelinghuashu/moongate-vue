/**
 * Moongate Vue 全局配置
 *
 * 用于覆盖组件内置默认文案。设计原则：
 * - 极简 API，兼容 SSR（惰性求值，服务端安全）
 * - 响应式：调用 `setConfig` 后已挂载组件文案同步更新
 * - 优先级：组件 prop > setConfig texts > 语言内置文案
 * - 语言自动检测：未显式指定 locale 时，跟随 `document.documentElement.lang`（仅支持中英双语，非中文默认英文）
 */
import { computed, ref } from 'vue'

/** 内置文案集合（中英） */
export interface LocaleTexts {
  /** 空状态文案（Select / Table） */
  empty: string
  /** 校验中文案（FormItem） */
  validating: string
  /** 分页上一页（Pagination） */
  paginationPrev: string
  /** 分页下一页（Pagination） */
  paginationNext: string
  /** 分页首部按钮（Pagination） */
  paginationFirst: string
  /** 分页尾部按钮（Pagination） */
  paginationLast: string
  /** 页码信息模板，支持 `{current}` 和 `{total}` 占位（Pagination aria-label） */
  paginationPageInfo: string
  /** 移除标签模板，支持 `{label}` 占位（Select 多选移除按钮 aria-label） */
  selectRemove: string
  /** 全选 checkbox 文案（Table） */
  tableSelectAll: string
  /** 选择行模板，支持 `{label}` 占位（Table 行选择 aria-label） */
  tableSelectRow: string
  /** 模态框关闭按钮 aria-label（Modal） */
  modalClose: string
  /** 抽屉关闭按钮 aria-label（Drawer） */
  drawerClose: string
  /** 消息关闭按钮 aria-label（Message） */
  messageClose: string
  /** 通知关闭按钮 aria-label（Toast） */
  toastClose: string
  /** Table 行可访问名称兜底（行标签无法确定时） */
  tableRowLabel: string
  /** useForm 默认校验失败文案（规则返回 false 时） */
  formRuleMessage: string
}

/** 中文内置文案 */
const zhCN: LocaleTexts = {
  empty: '暂无数据',
  validating: '校验中…',
  paginationPrev: '上一页',
  paginationNext: '下一页',
  paginationFirst: '«',
  paginationLast: '»',
  paginationPageInfo: '第 {current} 页，共 {total} 页',
  selectRemove: '移除 {label}',
  tableSelectAll: '全选',
  tableSelectRow: '选择 {label}',
  modalClose: '关闭',
  drawerClose: '关闭抽屉',
  messageClose: '关闭消息',
  toastClose: '关闭通知',
  tableRowLabel: '行',
  formRuleMessage: '校验未通过',
}

/** 英文内置文案 */
const enUS: LocaleTexts = {
  empty: 'No data',
  validating: 'Validating…',
  paginationPrev: 'Prev',
  paginationNext: 'Next',
  paginationFirst: '«',
  paginationLast: '»',
  paginationPageInfo: 'Page {current} of {total}',
  selectRemove: 'Remove {label}',
  tableSelectAll: 'Select all',
  tableSelectRow: 'Select {label}',
  modalClose: 'Close',
  drawerClose: 'Close drawer',
  messageClose: 'Close message',
  toastClose: 'Close notification',
  tableRowLabel: 'Row',
  formRuleMessage: 'Validation failed',
}

/** 内置语言表 */
const builtinTexts: Record<string, LocaleTexts> = { 'zh-CN': zhCN, 'en-US': enUS }

/** 全局配置 */
export interface Config {
  /** 语言，默认自动检测 document.documentElement.lang */
  locale?: 'zh-CN' | 'en-US'
  /** 文案部分覆盖（优先级高于语言内置） */
  texts?: Partial<LocaleTexts>
}

/** 当前全局配置（响应式） */
const config = ref<Config>({})

/**
 * 设置全局配置（可多次调用，部分合并）
 * @example
 * ```ts
 * // 设置语言为英文（自动切换内置文案）
 * setConfig({ locale: 'en-US' })
 *
 * // 仅覆盖部分文案
 * setConfig({ texts: { empty: '没有数据' } })
 * ```
 */
export function setConfig(options: Config) {
  config.value = {
    ...config.value,
    ...options,
    texts: {
      ...config.value.texts,
      ...options.texts,
    },
  }
}

/**
 * 重置全局配置为初始状态
 * 清除所有自定义文案覆盖，回到默认语言检测逻辑
 */
export function resetConfig() {
  config.value = {}
}

/**
 * html lang 的响应式触发器（SSR 安全）。
 * - `resolveLocale()` 实时读取 DOM，保证手动修改 lang 后立即反映
 * - MutationObserver 监听 <html lang> 变化并更新此 ref，触发 `useTexts()` 的 computed 重算
 */
const htmlLang = ref('')

/** MutationObserver 实例引用（用于 SSR/测试环境清理） */
let langObserver: MutationObserver | null = null

/** 监听 <html> 元素的 lang 属性变化（手动修改 lang 时触发组件文案响应式更新） */
if (typeof document !== 'undefined') {
  langObserver = new MutationObserver(() => {
    // 始终重新赋值以确保 computed 依赖失效（resolveLocale 会实时读 DOM 取最新值）
    htmlLang.value = document.documentElement.lang || ' '
  })
  langObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  })
}

/**
 * 断开 lang 属性的 MutationObserver 监听。
 * 用于 SSR 清理、测试环境重置等场景。
 */
export function disposeConfig(): void {
  if (langObserver) {
    langObserver.disconnect()
    langObserver = null
  }
}

/**
 * 获取最终生效的语言（仅支持中英双语）
 * 优先级：显式 locale > document.documentElement.lang > 默认 'en-US'
 * 检测规则：实时读取 DOM，非中文 lang 一律视为英文（英文更通用）
 */
export function resolveLocale(): 'zh-CN' | 'en-US' {
  if (config.value.locale) return config.value.locale
  if (typeof document !== 'undefined') {
    const lang = document.documentElement.lang?.toLowerCase() ?? ''
    return lang.startsWith('zh') ? 'zh-CN' : 'en-US'
  }
  return 'en-US'
}

/**
 * 获取最终生效的文案集合（响应式 computed）
 * 在组件内调用以获得响应式更新：
 * ```ts
 * const texts = useTexts()
 * ```
 */
export function useTexts() {
  return computed<LocaleTexts>(() => {
    // 访问 htmlLang 建立响应式依赖：MutationObserver 更新时触发本 computed 重算
    void htmlLang.value
    const locale = resolveLocale()
    const base = builtinTexts[locale] ?? enUS
    return { ...base, ...config.value.texts }
  })
}

/**
 * 模板占位替换：`第 {current} 页，共 {total} 页` → `第 3 页，共 10 页`
 * @param template - 含 `{key}` 占位符的模板字符串
 * @param params - 占位符替换值
 */
export function formatTemplate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key]
    return value !== undefined ? String(value) : match
  })
}

/** 通知类型对应的默认图标（Message/Toast 共享） */
const defaultIcons: Record<string, string> = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
}

/**
 * 获取通知类型的默认图标
 * @param type - 通知类型
 * @returns 对应的默认图标字符
 */
export function getDefaultIcon(type: string): string {
  return defaultIcons[type] ?? ''
}
