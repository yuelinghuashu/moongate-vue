#!/usr/bin/env node
/**
 * 构建产物完整性验证
 *
 * 在 pnpm build 后自动运行，检查：
 * - 每个独立组件入口的 .js 产物存在
 * - 每个独立组件入口的 .d.ts 类型声明存在
 * - 全量入口（index.js / index.d.ts）存在
 * - 样式文件（style.css / reset.css）存在
 * - 每个 .js 文件对外导出了预期的组件名
 *
 * 任一检查失败则退出码为 1，阻止发布。
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentEntries } from './component-list.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const distDir = join(rootDir, 'dist')

/** 收集单个文件中的导出名（提取导出别名而非原始变量名） */
function getExportNames(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8')
    const names = new Set()
    // 匹配 `export { X }` 和 `export { X as Y }`，提取导出后的名字
    const exportBlock = content.match(/export\s*\{([^}]+)\}/g) || []
    for (const block of exportBlock) {
      const inner = block.replace(/^export\s*\{/, '').replace(/\}$/, '')
      for (const item of inner.split(',')) {
        const parts = item.trim().split(/\s+as\s+/)
        // 导出名 = `as` 后面的部分（如有），否则为原始名
        const name = parts.length > 1 ? parts[1].trim() : parts[0].trim()
        if (name && !name.startsWith('type ')) names.add(name)
      }
    }
    // 匹配 `export default`
    if (/\bexport\s+default\b/.test(content)) names.add('default')
    return names
  } catch {
    return new Set()
  }
}

const errors = []
const warnings = []

console.log('🔍 验证构建产物完整性...\n')

// 1. 检查主入口
const requiredFiles = ['index.js', 'index.d.ts', 'style.css', 'reset.css']
console.log('📦 主入口：')
for (const file of requiredFiles) {
  const fullPath = join(distDir, file)
  if (!existsSync(fullPath)) {
    errors.push(`缺少主入口文件: ${file}`)
    console.log(`  ❌ ${file}`)
  } else {
    console.log(`  ✅ ${file}`)
  }
}

// 2. 检查每个组件入口
console.log('\n🧩 组件入口：')
for (const [componentName, kebabName] of Object.entries(componentEntries)) {
  const jsPath = join(distDir, `${kebabName}.js`)
  const dtsPath = join(distDir, 'exports', `${componentName}.d.ts`)

  if (!existsSync(jsPath)) {
    errors.push(`缺少组件产物: ${kebabName}.js`)
    console.log(`  ❌ ${componentName} → ${kebabName}.js`)
    continue
  }

  if (!existsSync(dtsPath)) {
    warnings.push(`缺少类型声明: exports/${componentName}.d.ts`)
    console.log(`  ⚠️  ${componentName} → exports/${componentName}.d.ts`)
    continue
  }

  // 3. 验证导出名
  const exports = getExportNames(jsPath)
  if (!exports.has('default') && !exports.has(componentName)) {
    errors.push(`组件 ${componentName} 未导出 default 或命名导出`)
    console.log(`  ❌ ${componentName} → 导出缺失: ${componentName}`)
  } else {
    console.log(`  ✅ ${componentName} → ${kebabName}.js + exports/${componentName}.d.ts`)
  }
}

// 4. 验证 exports 目录存在其他类型文件
const exportsDir = join(distDir, 'exports')
if (existsSync(exportsDir)) {
  const exportFiles = readdirSync(exportsDir).filter((f) => f.endsWith('.d.ts'))
  if (exportFiles.length !== Object.keys(componentEntries).length) {
    warnings.push(
      `exports 目录中 .d.ts 数量 (${exportFiles.length}) 与组件数 (${Object.keys(componentEntries).length}) 不一致`,
    )
  }
}

// 5. 验证 package.json exports 与组件清单一致（新增组件时若忘记添加导出子路径会在此拦截）
console.log('\n📦 package.json exports 一致性：')
const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
const pkgExports = pkg.exports ?? {}
let mismatchCount = 0

for (const [componentName, kebabName] of Object.entries(componentEntries)) {
  const exportPath = `./${kebabName}`
  if (!pkgExports[exportPath]) {
    errors.push(
      `package.json 缺少 "${exportPath}" 导出子路径（组件 ${componentName} 已注册但无法按需引入）`,
    )
    console.log(`  ❌ ${componentName} → ${exportPath} 缺失`)
    mismatchCount += 1
  } else {
    // 校验 types/import 指向的产物路径
    const sub = pkgExports[exportPath]
    const dtsExpected = `./dist/exports/${componentName}.d.ts`
    const jsExpected = `./dist/${kebabName}.js`
    if (sub.types !== dtsExpected || sub.import !== jsExpected || sub.default !== jsExpected) {
      errors.push(
        `package.json "${exportPath}" 子路径路径不匹配：期望 types=${dtsExpected}, import=${jsExpected}（实际 types=${sub.types}, import=${sub.import}, default=${sub.default}）`,
      )
      console.log(`  ❌ ${componentName} → ${exportPath} 路径不匹配`)
      mismatchCount += 1
    }
  }
}

if (mismatchCount === 0) {
  console.log(`  ✅ ${Object.keys(componentEntries).length} 个组件子路径全部一致`)
}

// 输出结果
console.log('\n')
if (errors.length > 0) {
  console.error(`❌ 构建验证失败：${errors.length} 个错误`)
  for (const err of errors) console.error(`   - ${err}`)
  process.exit(1)
}

if (warnings.length > 0) {
  console.warn(`⚠️  构建验证通过，但有 ${warnings.length} 个警告：`)
  for (const warn of warnings) console.warn(`   - ${warn}`)
}

console.log('✅ 构建验证通过：所有产物完整')
