import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/main.ts',
        'src/App.vue',
        'src/shims-vue.d.ts',
        'src/vite-env.d.ts',
        'src/__tests__/**',
        // 按需导出入口（纯重导出，无业务逻辑）
        'src/exports/**',
        // 主入口（纯聚合 re-export，无业务逻辑）
        'src/index.ts',
        // 纯类型定义（无运行时代码）
        'src/types/**',
      ],
      // 渐进式覆盖率目标（当前实际：Stmts 95.01% / Branch 86.02% / Funcs 95.47% / Lines 97%）
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 92,
      },
    },
    css: true,
  },
})
