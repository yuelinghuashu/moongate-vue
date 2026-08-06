import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * e2e 冒烟测试专属 Vite 配置。
 * 入口为 e2e/index.html，聚合展示全部 25 个组件，供 Playwright 真实浏览器验证。
 */
export default defineConfig({
  plugins: [vue()],
  root: 'e2e',
  build: {
    outDir: '../dist-e2e',
    emptyOutDir: true,
  },
})
