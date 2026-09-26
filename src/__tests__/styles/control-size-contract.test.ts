/**
 * 交互控件尺寸契约守卫
 *
 * 背景：除 Button 外，其余交互控件的规则既未声明 `font-size` 也未声明 `line-height`，
 * 于是控件高度由宿主决定：宿主给表单控件设 `line-height: inherit`（如 VitePress 的
 * `button,input,select,textarea { line-height: inherit }` + `body { line-height: 24px }`）
 * 时，文档站的 Input/Badge 高达 42/40px，比默认按钮（37px，已显式声明行高）还高；
 * 未声明字号时浏览器还会退回 UA 默认字号（Chromium 13.33px）。
 *
 * 本文件锁死四条契约：
 * 1. 每个交互叶子控件的基础规则必须显式声明 `font-size` 与 `line-height`；
 * 2. 每个尺寸档位规则必须显式声明 `padding`（以及 `font-size`），不得依赖基础规则「恰好等于某档」；
 * 3. 「size prop 默认档」必须与基础规则同值（Input/Textarea 基础档 = md 档），
 *    即默认渲染高度 == 显式传默认档的高度；
 * 4. 同一档位跨组件取同一字号令牌（md → `--ui-typography-size-body`）。
 */
import { describe, it, expect } from 'vitest'
import { readComponentCss, declsOf, parseCss } from '../helpers/cssRules'

/** 交互叶子控件：这些规则的高度直接决定控件盒高 */
const LEAF_CONTROLS: Array<{ file: string; cls: string; label: string }> = [
  { file: 'button.css', cls: 'mg-button', label: 'Button' },
  { file: 'input.css', cls: 'mg-input', label: 'Input' },
  { file: 'textarea.css', cls: 'mg-textarea', label: 'Textarea' },
  { file: 'select.css', cls: 'mg-select-native', label: 'Select(原生)' },
  { file: 'select.css', cls: 'mg-select-input', label: 'Select(可搜索输入)' },
  { file: 'badge.css', cls: 'mg-badge', label: 'Badge' },
  { file: 'tabs.css', cls: 'mg-tab', label: 'Tabs 标签项' },
  { file: 'pagination.css', cls: 'mg-pagination-btn', label: 'Pagination 按钮' },
  { file: 'pagination.css', cls: 'mg-pagination-current', label: 'Pagination 当前页' },
  { file: 'pagination.css', cls: 'mg-pagination-input', label: 'Pagination 输入框' },
]

/** 仅承载文本的控件：无需 padding/font-size 声明，但行高必须显式（否则高度随宿主漂移） */
const TEXT_ONLY_CONTROLS: Array<{ file: string; cls: string; label: string }> = [
  { file: 'pagination.css', cls: 'mg-pagination-sep', label: 'Pagination 分隔符' },
  { file: 'pagination.css', cls: 'mg-pagination-total', label: 'Pagination 总页数' },
]

/** 档位类 → 必须显式声明 padding 与 font-size */
const TIER_CLASSES: Array<{ file: string; cls: string; label: string }> = [
  ...[
    ['button.css', 'mg-button', ['sm', 'md', 'lg']],
    ['input.css', 'mg-input', ['sm', 'md', 'lg']],
    ['textarea.css', 'mg-textarea', ['sm', 'md', 'lg']],
    ['select.css', 'mg-select', ['sm', 'md', 'lg']],
    ['badge.css', 'mg-badge', ['sm', 'md']],
    ['tabs.css', 'mg-tabs', ['sm', 'md', 'lg']],
    ['pagination.css', 'mg-pagination', ['sm', 'md', 'lg']],
  ].flatMap(([file, base, tiers]) =>
    (tiers as string[]).map((t) => ({
      file: file as string,
      cls: `${base as string}-${t}`,
      label: `${base as string}-${t}`,
    })),
  ),
  { file: 'dropdown.css', cls: 'mg-dropdown-menu-sm', label: 'dropdown 菜单 sm' },
  { file: 'dropdown.css', cls: 'mg-dropdown-menu-md', label: 'dropdown 菜单 md' },
  { file: 'dropdown.css', cls: 'mg-dropdown-menu-lg', label: 'dropdown 菜单 lg' },
]

/** 档位声明可能落在该档位下的子元素上（如 `.mg-pagination-sm .mg-pagination-btn`） */
function tierDecls(file: string, tierCls: string): Record<string, string> | undefined {
  const css = readComponentCss(file)
  const decls: Record<string, string> = {}
  let found = false
  for (const r of parseCss(css)) {
    for (const sel of r.selectors) {
      if (
        sel === `.${tierCls}` ||
        sel.startsWith(`.${tierCls} `) ||
        sel.startsWith(`.${tierCls}.`) ||
        sel.startsWith(`.${tierCls}:`)
      ) {
        found = true
        Object.assign(decls, r.decls)
      }
    }
  }
  return found ? decls : undefined
}

describe('交互控件尺寸契约：显式声明 font-size 与 line-height', () => {
  for (const { file, cls, label } of [...LEAF_CONTROLS, ...TEXT_ONLY_CONTROLS]) {
    it(`${label} 的 .${cls} 声明了 line-height`, () => {
      const decls = declsOf(readComponentCss(file), cls)
      expect(decls, `.${cls} 规则不存在`).toBeDefined()
      expect(decls!['line-height'], '缺少 line-height').toBeDefined()
    })
  }

  for (const { file, cls, label } of LEAF_CONTROLS) {
    it(`${label} 的 .${cls} 的字号可解析（基础规则声明，或由档位规则声明）`, () => {
      const css = readComponentCss(file)
      const base = declsOf(css, cls)!
      // 基础规则一旦声明 padding，就必须同时声明 font-size
      // （否则字号会退回 UA 默认值，如 Chromium 对 input 的 13.33px）
      if (base['padding'] !== undefined) {
        expect(
          base['font-size'],
          '基础规则声明了 padding 却未声明 font-size：字号会退回 UA 默认值',
        ).toBeDefined()
      }
      // 兜底：至少某个档位规则声明了字号
      const tierHasFontSize = TIER_CLASSES.some(
        (t) => t.file === file && tierDecls(file, t.cls)?.['font-size'] !== undefined,
      )
      expect(
        base['font-size'] ?? (tierHasFontSize ? 'tier' : undefined),
        '全库找不到字号声明',
      ).toBeDefined()
    })
  }

  it('全库交互控件的行高统一为 1.4（与 select/form 既有取值一致）', () => {
    for (const { file, cls } of [...LEAF_CONTROLS, ...TEXT_ONLY_CONTROLS]) {
      expect(declsOf(readComponentCss(file), cls)!['line-height'], cls).toBe('1.4')
    }
  })
})

describe('尺寸档位规则自洽（不依赖基础规则「恰好等于某档」）', () => {
  for (const { file, cls, label } of TIER_CLASSES) {
    it(`${label} 声明了 padding 与 font-size`, () => {
      const decls = tierDecls(file, cls)
      expect(decls, `.${cls} 规则不存在`).toBeDefined()
      expect(decls!['padding'], `缺少 padding`).toBeDefined()
      expect(decls!['font-size'], `缺少 font-size`).toBeDefined()
    })
  }
})

describe('默认档 = 基础规则（默认渲染高度 == 显式传默认档）', () => {
  const pairs = [
    { file: 'button.css', base: 'mg-button', tier: 'mg-button-md', label: 'Button（默认 md）' },
    { file: 'input.css', base: 'mg-input', tier: 'mg-input-md', label: 'Input（默认 md）' },
    {
      file: 'textarea.css',
      base: 'mg-textarea',
      tier: 'mg-textarea-md',
      label: 'Textarea（默认 md）',
    },
    {
      file: 'select.css',
      base: 'mg-select-native',
      tier: 'mg-select-md',
      label: 'Select（默认 md）',
    },
  ]

  for (const { file, base, tier, label } of pairs) {
    it(`${label}：基础规则的 padding / font-size 等于档位规则`, () => {
      const css = readComponentCss(file)
      const b = declsOf(css, base)!
      const t = tierDecls(file, tier)!
      expect(b['padding'], `${base} padding`).toBe(t['padding'])
      expect(b['font-size'], `${base} font-size`).toBe(t['font-size'])
    })
  }
})

describe('档位字号统一（同档位跨组件取同一令牌）', () => {
  const mdFontSize: Array<{ file: string; tier: string; label: string }> = [
    { file: 'badge.css', tier: 'mg-badge-md', label: 'Badge' },
    { file: 'input.css', tier: 'mg-input-md', label: 'Input' },
    { file: 'textarea.css', tier: 'mg-textarea-md', label: 'Textarea' },
    { file: 'select.css', tier: 'mg-select-md', label: 'Select' },
    { file: 'button.css', tier: 'mg-button-md', label: 'Button' },
  ]

  for (const { file, tier, label } of mdFontSize) {
    it(`${label} 的 md 档字号取 --ui-typography-size-body`, () => {
      expect(tierDecls(file, tier)!['font-size']).toBe('var(--ui-typography-size-body)')
    })
  }
})

describe('Dropdown 菜单项三档均有显式覆盖', () => {
  for (const tier of ['sm', 'md', 'lg'] as const) {
    it(`.mg-dropdown-menu-${tier} .mg-dropdown-item 声明了 padding 与 font-size`, () => {
      const rule = parseCss(readComponentCss('dropdown.css')).find((r) =>
        r.selectors.includes(`.mg-dropdown-menu-${tier} .mg-dropdown-item`),
      )
      expect(rule, `缺少 .mg-dropdown-menu-${tier} .mg-dropdown-item 规则`).toBeDefined()
      expect(rule!.decls['padding'], 'padding').toBeDefined()
      expect(rule!.decls['font-size'], 'font-size').toBeDefined()
    })
  }
})
