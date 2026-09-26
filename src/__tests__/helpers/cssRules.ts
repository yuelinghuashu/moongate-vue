/**
 * CSS 规则解析工具（供 `src/__tests__/styles/*.test.ts` 复用）
 *
 * jsdom 不做样式计算与层叠，因此组件尺寸契约只能通过解析 CSS 文本来断言。
 * 这里提供「剔除注释 → 花括号配对切分规则 → 解析声明」的最小实现：
 * - 正确处理嵌套的 `@media` 块（嵌套规则不会被误当作顶层规则）
 * - 正确处理多选择器规则（返回选择器列表）
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

export interface CssRule {
  /** 选择器列表（已去除多余空白） */
  selectors: string[]
  /** 声明表：属性名 → 值（空白已归一） */
  decls: Record<string, string>
}

/** 读取组件样式文件（`src/styles/components/<name>`） */
export function readComponentCss(name: string): string {
  return readFileSync(join(ROOT, 'src/styles/components', name), 'utf8')
}

/** 读取任意相对仓库根的文件 */
export function readRepoFile(relPath: string): string {
  return readFileSync(join(ROOT, relPath), 'utf8')
}

function parseDecls(body: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const decl of body.split(';')) {
    const idx = decl.indexOf(':')
    if (idx === -1) continue
    const prop = decl.slice(0, idx).trim()
    const value = decl
      .slice(idx + 1)
      .replace(/\s+/g, ' ')
      .trim()
    if (prop) out[prop] = value
  }
  return out
}

/** 把 CSS 文本切分为顶层规则列表 */
export function parseCss(css: string): CssRule[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const rules: CssRule[] = []
  let i = 0
  let selStart = 0
  while (i < text.length) {
    const ch = text[i]
    if (ch === '{') {
      const selectorText = text.slice(selStart, i).trim()
      let depth = 1
      let j = i + 1
      while (j < text.length && depth > 0) {
        if (text[j] === '{') depth++
        else if (text[j] === '}') depth--
        j++
      }
      const body = text.slice(i + 1, j - 1)
      if (selectorText.startsWith('@')) {
        // 嵌套（如 @media）：递归解析其内部规则
        rules.push(...parseCss(body))
      } else {
        rules.push({
          selectors: selectorText.split(',').map((s) => s.trim().replace(/\s+/g, ' ')),
          decls: parseDecls(body),
        })
      }
      i = j
      selStart = j
      continue
    }
    if (ch === '}') {
      i++
      selStart = i
      continue
    }
    i++
  }
  return rules
}

/** 取声明表：合并「选择器恰好是该单类」与「选择器列表中恰好包含该单类」两类规则的声明
 *  （后者用于 `.mg-input, .mg-input-sm, … { … }`、`.mg-pagination-btn, .mg-pagination-current, … { … }`
 *  这类分组声明；同名属性按 CSS 顺序后者覆盖前者）。同样跳过 `.mg-x:hover`、`.mg-x .child` 等复合选择器 */
export function ruleOf(css: string, className: string): CssRule | undefined {
  const token = `.${className}`
  const matched = parseCss(css).filter(
    (r) => (r.selectors.length === 1 && r.selectors[0] === token) || r.selectors.includes(token),
  )
  if (!matched.length) return undefined
  const decls: Record<string, string> = {}
  for (const r of matched) Object.assign(decls, r.decls)
  return { selectors: [token], decls }
}

/** 取「选择器里包含该单类」的全部规则（含复合选择器） */
export function rulesContaining(css: string, className: string): CssRule[] {
  const token = `.${className}`
  return parseCss(css).filter((r) => r.selectors.some((s) => s === token || s.includes(token)))
}

/** 单类规则的声明表；规则不存在时返回 undefined */
export function declsOf(css: string, className: string): Record<string, string> | undefined {
  return ruleOf(css, className)?.decls
}
