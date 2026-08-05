import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** 所有需要独立导出入口的组件名（kebab-case 与文件名的映射） */
const componentNames = [
  'Button',
  'Card',
  'Badge',
  'Divider',
  'Input',
  'Textarea',
  'Checkbox',
  'Radio',
  'Switch',
  'Select',
  'Pagination',
  'Modal',
  'Toast',
  'Message',
  'Tabs',
  'Skeleton',
  'Tooltip',
  'Container',
  'Header',
  'Main',
  'Footer',
  'Hero',
  'Popover',
  'Drawer',
  'Table',
]

/** 按需引入入口：从 src/exports/<name>.ts 导入，每个组件独立产出 */
const componentEntries = Object.fromEntries(
  componentNames.map((name) => {
    const kebab = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    return [`${kebab}`, resolve(__dirname, `src/exports/${name}.ts`)]
  }),
)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      // 主入口 + 每个组件独立入口
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...componentEntries,
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.mjs`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        // CSS 统一输出为一个 style.css（组件样式集中在 src/styles/index.css）
        assetFileNames: 'style.css',
      },
    },
    cssCodeSplit: false,
  },
})
