import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    // 使用系统已安装的 Google Chrome，无需下载 Playwright 捆绑的 chromium
    channel: 'chrome',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'vite build --config vite.e2e.config.ts && vite preview --config vite.e2e.config.ts',
    // vite preview 默认 4173 端口
    url: 'http://localhost:4173',
    reuseExistingServer: true,
  },
})
