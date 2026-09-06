#!/usr/bin/env node
/**
 * 清理 vue-tsc 生成的 .d.ts 文件
 *
 * 问题：src/index.ts 中的 `import './styles/index.css'` 会被保留到
 * 生成的 index.d.ts 中，但实际产物 CSS 打包为 dist/style.css，
 * dist/styles/index.css 并不存在，导致消费者 TypeScript 解析报错。
 *
 * 此脚本递归遍历 dist 下所有 .d.ts 文件，删除纯 CSS 导入行。
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const distDir = new URL('../dist/', import.meta.url).pathname

/** 匹配 import/export 且路径以 .css 结尾的行 */
const CSS_IMPORT_RE = /^\s*(?:import|export)[^;]*?['"]\.\/.*?\.css['"];?\s*$/gm

function walk(dir: string): number {
  const entries = readdirSync(dir, { withFileTypes: true })
  let removed = 0

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      removed += walk(fullPath)
    } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
      const original = readFileSync(fullPath, 'utf8')
      const cleaned = original.replace(CSS_IMPORT_RE, '')

      if (cleaned !== original) {
        writeFileSync(fullPath, cleaned, 'utf8')
        removed += (original.match(CSS_IMPORT_RE) || []).length
        console.log(`  cleaned: ${fullPath.replace(distDir, 'dist/')}`)
      }
    }
  }

  return removed
}

const total = walk(distDir)
console.log(`✅ 清理完成，共删除 ${total} 行 CSS 导入`)
