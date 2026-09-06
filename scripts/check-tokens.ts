/**
 * 设计令牌一致性检查（配合构建，防「引用未定义 token / fallback 陈旧」回归）
 *
 * 检查项：
 * 1. 所有 `var(--ui-*)` 引用都必须有定义（排除 utilities/index.css 自定义的 --ui-glow-alpha / --ui-radius）
 * 2. 每个 `var(--ui-*, <fallback>)` 的 fallback 值应与当前浅色 token 值一致
 *    （fallback 本应在 token 缺失时兜底，陈旧值会让主题化时行为漂移）
 * 3. 报告组件零引用的 token（仅警告，不阻断——其中部分为 VS Code 主题语义层专用）
 *
 * 退出码：0 通过；1 存在错误（未定义引用 / fallback 不一致）
 */
import { readFileSync, readdirSync } from 'node:fs'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))

/** 读取 token 定义（colors + layout） */
function readTokenDefs(): Record<string, string> {
  const defs: Record<string, string> = {}
  for (const file of ['src/styles/tokens/colors.css', 'src/styles/tokens/layout.css']) {
    const text = readFileSync(join(ROOT, file), 'utf8')
    for (const m of text.matchAll(/--(ui-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      defs[`--${m[1]}`] = m[2].trim()
    }
  }
  return defs
}

/** 组件样式文件列表 */
function componentCssFiles() {
  const dir = join(ROOT, 'src/styles/components')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => join(dir, f))
}

const normalize = (s: string): string => {
  // 时长单位归一：0.3s == 300ms
  const ms = s.replace(/^([\d.]+)s$/, (_, n) => `${Math.round(parseFloat(n) * 1000)}ms`)
  return ms.replace(/\s+/g, '')
}

/** utilities 中自定义的、无需在 tokens 定义的变量 */
const UTILITIES_CUSTOM = new Set(['--ui-glow-alpha', '--ui-radius'])

function main() {
  const defs = readTokenDefs()
  // layout token（无深浅之分，全局）——供 base 段的 fallback 校验
  const layoutText = readFileSync(join(ROOT, 'src/styles/tokens/layout.css'), 'utf8')
  const layoutTokenDefs: Record<string, string> = {}
  for (const m of layoutText.matchAll(/--(ui-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    layoutTokenDefs[`--${m[1]}`] = m[2].trim()
  }
  // 浅色/深色 token（colors.css 的 :root/.light 段与 .dark 段）
  const colorsText = readFileSync(join(ROOT, 'src/styles/tokens/colors.css'), 'utf8')
  const [lightSegment, darkSegment = ''] = colorsText.split('.dark')
  const parseSeg = (seg: string): Record<string, string> => {
    const out: Record<string, string> = {}
    for (const m of seg.matchAll(/--(ui-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      if (!(`--${m[1]}` in out)) out[`--${m[1]}`] = m[2].trim()
    }
    return out
  }
  const lightDefs = parseSeg(lightSegment)
  const darkDefs = parseSeg(darkSegment)

  const sources = [...componentCssFiles(), join(ROOT, 'src/styles/utilities/index.css')]

  const undefinedRefs: string[] = []
  const fallbackMismatches: string[] = []
  const usedSet = new Set<string>()

  for (const file of sources) {
    const text = readFileSync(file, 'utf8')
    const base = file.replace(ROOT + '/', '')

    // 引用检查
    for (const m of text.matchAll(/var\(--ui-[a-z0-9-]+/g)) {
      const tok = m[0].slice(4) // 去掉 'var('
      usedSet.add(tok)
      if (!(tok in defs) && !UTILITIES_CUSTOM.has(tok)) {
        undefinedRefs.push(`${base}: 引用未定义 token ${tok}`)
      }
    }

    // fallback 一致性：按块分段——通用/浅色段比 light token，.dark 段比 dark token
    const [baseSegment, ...darkBlocks] = text.split('.dark')
    const checkFallback = (
      segment: string,
      defsForSegment: Record<string, string>,
      label: string,
    ): void => {
      for (const m of segment.matchAll(/var\(--ui-([a-z0-9-]+),\s*([^)]+)\)/g)) {
        const tok = `--ui-${m[1]}`
        const fb = m[2].trim().replace(/^['"]|['"]$/g, '')
        const cur = defsForSegment[tok]
        if (!cur) continue
        if (
          normalize(fb) !== normalize(cur) &&
          !fb.startsWith('calc(') &&
          fb !== 'transparent' &&
          fb !== 'monospace' // 字体族降级属合理省略
        ) {
          fallbackMismatches.push(`${base}${label}: ${tok} fallback=${fb} ≠ token=${cur}`)
        }
      }
    }
    checkFallback(baseSegment, { ...lightDefs, ...layoutTokenDefs }, '')
    for (const block of darkBlocks) {
      checkFallback(block, darkDefs, ' (.dark)')
    }
  }

  // 输出
  let errors = 0
  console.log('\n🧩 设计令牌一致性检查')

  if (undefinedRefs.length) {
    errors += undefinedRefs.length
    console.log('\n❌ 引用未定义 token:')
    undefinedRefs.forEach((e) => console.log(`   - ${e}`))
  } else {
    console.log('✅ 所有 var(--ui-*) 引用均有定义')
  }

  if (fallbackMismatches.length) {
    errors += fallbackMismatches.length
    console.log('\n❌ fallback 与 token 不一致:')
    fallbackMismatches.forEach((e) => console.log(`   - ${e}`))
  } else {
    console.log('✅ 所有 fallback 与 token 一致')
  }

  // 孤儿报告（警告，不阻断）
  const allTok = Object.keys(defs)
  const orphans = allTok.filter((t) => !usedSet.has(t))
  if (orphans.length) {
    console.log(
      `\n⚠️ 组件零引用 token（${orphans.length} 个，多为 VS Code 主题语义层/语法色，不阻断）:`,
    )
    console.log(`   ${orphans.join(' ')}`)
  } else {
    console.log('✅ 无孤儿 token')
  }

  console.log(errors ? `\n检查失败: ${errors} 处错误\n` : '\n✅ 检查通过\n')
  process.exit(errors ? 1 : 0)
}

main()
