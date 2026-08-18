import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { setConfig, resetConfig, useTexts, formatTemplate, resolveLocale } from '../config'

// 保存原始 document lang 以便恢复
const originalLang = document.documentElement.lang

describe('config - setConfig 全局文案配置', () => {
  beforeEach(() => {
    // 重置配置和 lang，避免跨测试污染
    resetConfig()
    document.documentElement.lang = ''
  })

  afterEach(() => {
    document.documentElement.lang = originalLang
  })

  it('默认英文文案（无 lang 时回退 en-US，英文更通用）', () => {
    const { value } = useTexts()
    expect(value.empty).toBe('No data')
    expect(value.paginationPageInfo).toBe('Page {current} of {total}')
    expect(value.tableSelectAll).toBe('Select all')
    expect(value.modalClose).toBe('Close')
    expect(value.messageClose).toBe('Close message')
    expect(value.toastClose).toBe('Close notification')
    expect(value.tableRowLabel).toBe('Row')
    expect(value.formRuleMessage).toBe('Validation failed')
  })

  it('setConfig 设置语言为中文', () => {
    setConfig({ locale: 'zh-CN' })
    const { value } = useTexts()
    expect(value.empty).toBe('暂无数据')
    expect(value.paginationPageInfo).toBe('第 {current} 页，共 {total} 页')
    expect(value.tableSelectAll).toBe('全选')
    expect(value.modalClose).toBe('关闭')
    expect(value.messageClose).toBe('关闭消息')
    expect(value.toastClose).toBe('关闭通知')
    expect(value.tableRowLabel).toBe('行')
    expect(value.formRuleMessage).toBe('校验未通过')
  })

  it('setConfig 部分覆盖文案', () => {
    setConfig({ texts: { empty: '没有数据' } })
    const { value } = useTexts()
    expect(value.empty).toBe('没有数据')
    // 未覆盖的文案保持默认英文
    expect(value.validating).toBe('Validating…')
  })

  it('setConfig 多次调用部分合并', () => {
    setConfig({ locale: 'zh-CN' })
    setConfig({ texts: { empty: '自定义空' } })
    const { value } = useTexts()
    expect(value.empty).toBe('自定义空')
    // zh-CN 的其他文案保持
    expect(value.validating).toBe('校验中…')
  })

  it('自动检测 document lang（en）', () => {
    document.documentElement.lang = 'en'
    const { value } = useTexts()
    expect(value.empty).toBe('No data')
    // 显式 locale 优先于 lang 检测
    setConfig({ locale: 'zh-CN' })
    expect(useTexts().value.empty).toBe('暂无数据')
  })

  it('自动检测 document lang（zh）', () => {
    document.documentElement.lang = 'zh-CN'
    const { value } = useTexts()
    expect(value.empty).toBe('暂无数据')
  })

  it('响应式：setConfig 后 computed 自动更新', () => {
    const texts = useTexts()
    expect(texts.value.empty).toBe('No data')
    setConfig({ locale: 'zh-CN' })
    expect(texts.value.empty).toBe('暂无数据')
  })

  it('响应式：MutationObserver 监听 documentElement.lang 变化后 computed 自动更新', async () => {
    // 确保初始为中文
    document.documentElement.lang = 'zh-CN'
    await nextTick()
    const texts = useTexts()
    expect(texts.value.empty).toBe('暂无数据')

    // 手动修改 html lang 为英文
    document.documentElement.lang = 'en'
    // MutationObserver 是异步触发的，等待宏任务 + Vue 微任务
    await new Promise((resolve) => setTimeout(resolve, 0))
    await nextTick()
    expect(texts.value.empty).toBe('No data')

    // 再改回中文
    document.documentElement.lang = 'zh-CN'
    await new Promise((resolve) => setTimeout(resolve, 0))
    await nextTick()
    expect(texts.value.empty).toBe('暂无数据')
  })

  it('resetConfig 清除所有配置回到默认', () => {
    setConfig({ locale: 'zh-CN', texts: { empty: '自定义' } })
    resetConfig()
    const { value } = useTexts()
    expect(value.empty).toBe('No data')
  })
})

describe('config - formatTemplate 模板替换', () => {
  it('替换单个占位符', () => {
    expect(formatTemplate('第 {current} 页', { current: 3 })).toBe('第 3 页')
  })

  it('替换多个占位符', () => {
    expect(formatTemplate('第 {current} 页，共 {total} 页', { current: 3, total: 10 })).toBe(
      '第 3 页，共 10 页',
    )
  })

  it('未知占位符保持原样', () => {
    expect(formatTemplate('第 {unknown} 页', { current: 1 })).toBe('第 {unknown} 页')
  })

  it('数字值转字符串', () => {
    expect(formatTemplate('Page {current}', { current: 5 })).toBe('Page 5')
  })
})

describe('config - resolveLocale 语言解析', () => {
  it('显式 locale 优先', () => {
    document.documentElement.lang = 'en'
    setConfig({ locale: 'zh-CN' })
    expect(resolveLocale()).toBe('zh-CN')
  })

  it('非中文 lang（fr/ja/de 等）一律回退到 en-US（英文更通用）', () => {
    document.documentElement.lang = 'fr-FR'
    // 仅支持中英双语：非中文 lang 一律视为英文
    expect(resolveLocale()).toBe('en-US')
  })

  it('非中文 lang（ja/en-GB 等）一律回退到 en-US', () => {
    // 清除显式 locale 让 lang 检测生效
    resetConfig()
    document.documentElement.lang = 'ja-JP'
    expect(resolveLocale()).toBe('en-US')
  })

  it('SSR 环境（document 未定义）返回默认 en-US', () => {
    // 清除显式 locale
    resetConfig()
    // mock document 为 undefined，模拟 SSR 无 DOM 环境
    const originalDocument = globalThis.document
    vi.stubGlobal('document', undefined)
    try {
      expect(resolveLocale()).toBe('en-US')
    } finally {
      // 恢复 document，避免影响其他测试
      vi.stubGlobal('document', originalDocument)
    }
  })
})
