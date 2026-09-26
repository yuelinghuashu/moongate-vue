/**
 * Button 尺寸阶梯守卫（CSS 文本级断言）
 *
 * 背景：Button 的 size prop 默认值与 `.mg-button` 基础档必须指向同一档；历史上基础样式
 * 写死了 md 档的 padding/font-size，且 `.mg-button-sm` 与 `.mg-button-md` 取值完全相同 ——
 * 默认按钮与 md 无法区分、sm 档形同虚设（当时 prop 默认值还是 'sm'，默认档因此错位）。
 * jsdom 不做样式计算与层叠，因此这里直接校验 CSS 文本，锁死三档取值互异与
 * 「基础档 = 默认 prop 对应档（当前两侧均为 md）」的契约，防止该回归复发。
 *
 * 分工：本文件只覆盖 CSS 侧（取值、互异性、基础档跟随哪一档）；prop 默认值本身由
 * `../components/Button.test.ts` 断言（CSS 中读不到 prop 默认值，不做机制性交叉校验）。
 */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const css = readFileSync(join(ROOT, 'src/styles/components/button.css'), 'utf8')

/** 去掉注释，避免注释文本干扰选择器/声明匹配 */
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, '')

/** 取某个类选择器单类规则的规则体（不做字符串拼接构造正则，避免转义踩坑） */
function ruleBody(className: string): string {
  const token = `.${className}`
  let from = 0
  for (;;) {
    const at = cssNoComments.indexOf(token, from)
    if (at === -1) throw new Error(`未找到 .${className} 规则`)
    const after = cssNoComments.slice(at + token.length)
    // 仅接受“该选择器整体就是这一个类”（后接空白或 `{`），跳过 `.mg-button:hover` 等复合选择器
    const m = after.match(/^\s*\{([^{}]*)\}/)
    if (m) return m[1]
    from = at + token.length
  }
}

/** 解析规则体为 声明名 → 值（值做空白归一，便于比较） */
function declarations(className: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const decl of ruleBody(className).split(';')) {
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

const SIZE_CLASSES = ['mg-button-sm', 'mg-button-md', 'mg-button-lg'] as const

describe('Button 尺寸阶梯（src/styles/components/button.css）', () => {
  it('基础档与 md 档完全一致（默认 = 中号）', () => {
    const base = declarations('mg-button')
    const md = declarations('mg-button-md')
    expect(base['padding']).toBe(md['padding'])
    expect(base['font-size']).toBe(md['font-size'])
  })

  it('基础档不等于 sm / lg 档', () => {
    const base = declarations('mg-button')
    for (const cls of ['mg-button-sm', 'mg-button-lg'] as const) {
      const other = declarations(cls)
      expect(base['padding'], cls).not.toBe(other['padding'])
      expect(base['font-size'], cls).not.toBe(other['font-size'])
    }
  })

  it('sm 档不再与 md 档重复定义', () => {
    const sm = declarations('mg-button-sm')
    const md = declarations('mg-button-md')
    expect(sm['padding']).not.toBe(md['padding'])
    expect(sm['font-size']).not.toBe(md['font-size'])
  })

  it('三档的 (padding, font-size) 组合两两不同', () => {
    const combos = SIZE_CLASSES.map((c) => {
      const d = declarations(c)
      return `${d['padding']} | ${d['font-size']}`
    })
    expect(new Set(combos).size).toBe(SIZE_CLASSES.length)
  })

  it('三档取既有令牌且单调递进（xs/sm/md 内边距，small/body/lg 字号）', () => {
    const expected = [
      {
        cls: 'mg-button-sm',
        padding: 'var(--ui-spacing-xs) var(--ui-spacing-sm)',
        fontSize: 'var(--ui-typography-size-small)',
      },
      {
        cls: 'mg-button-md',
        padding: 'var(--ui-spacing-sm) var(--ui-spacing-md)',
        fontSize: 'var(--ui-typography-size-body)',
      },
      {
        cls: 'mg-button-lg',
        padding: 'var(--ui-spacing-md) var(--ui-spacing-lg)',
        fontSize: 'var(--ui-typography-size-lg)',
      },
    ]
    for (const { cls, padding, fontSize } of expected) {
      const d = declarations(cls)
      expect(d['padding'], cls).toBe(padding)
      expect(d['font-size'], cls).toBe(fontSize)
    }
  })

  it('加载图标为相对字号单位（随档位缩放）', () => {
    const spinner = declarations('mg-button-loading-icon')
    expect(spinner['width']).toBe('1em')
    expect(spinner['height']).toBe('1em')
  })

  it('基础档显式声明 line-height（不继承宿主 body 行高）', () => {
    // 宿主设置 body line-height（如 VitePress 的 24px）会把按钮整体抬高，
    // 使「默认档 = 小号」的视觉承诺随宿主漂移，因此必须显式声明。
    expect(declarations('mg-button')['line-height']).toBe('1.4')
  })
})
