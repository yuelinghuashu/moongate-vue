import { defineConfig } from 'vitepress'
import { demoblockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))


// 导航栏配置
const nav = [
  { text: '指南', link: '/guide/' },
  { text: '组件', link: '/components/' },
  { text: 'GitHub', link: 'https://github.com/yuelinghuashu/moongate-vue' },
]

// 侧边栏配置
const sidebar = {
  '/guide/': [
    {
      text: '开始',
      items: [
        { text: '介绍', link: '/guide/' },
        { text: '安装', link: '/guide/install' },
        { text: '快速开始', link: '/guide/getting-started' },
        { text: '设计令牌', link: '/guide/design-tokens' },
        { text: '表单校验', link: '/guide/form-validation' },
        { text: 'Nuxt 集成', link: '/guide/nuxt-integration' },
      ],
    },
  ],
  '/components/': [
    {
      text: '基础组件',
      items: [
        { text: 'Button 按钮', link: '/components/button' },
        { text: 'Card 卡片', link: '/components/card' },
        { text: 'Badge 徽章', link: '/components/badge' },
        { text: 'Divider 分割线', link: '/components/divider' },
      ],
    },
    {
      text: '表单组件',
      items: [
        { text: 'Form 表单', link: '/components/form' },
        { text: 'Input 输入框', link: '/components/input' },
        { text: 'Textarea 多行文本', link: '/components/textarea' },
        { text: 'Checkbox 复选框', link: '/components/checkbox' },
        { text: 'Radio 单选框', link: '/components/radio' },
        { text: 'Switch 开关', link: '/components/switch' },
        { text: 'Select 下拉选择', link: '/components/select' },
      ],
    },
    {
      text: '数据展示组件',
      items: [
        { text: 'Table 表格', link: '/components/table' },
        { text: 'Pagination 分页', link: '/components/pagination' },
        { text: 'Tabs 标签页', link: '/components/tabs' },
      ],
    },
    {
      text: '布局组件',
      items: [
        { text: 'Container 容器', link: '/components/container' },
        { text: 'Header 头部', link: '/components/header' },
        { text: 'Main 主体', link: '/components/main' },
        { text: 'Footer 底部', link: '/components/footer' },
        { text: 'Hero 英雄区', link: '/components/hero' },
      ],
    },
    {
      text: '反馈组件',
      items: [
        { text: 'Modal 模态框', link: '/components/modal' },
        { text: 'Toast 通知', link: '/components/toast' },
        { text: 'Message 消息提示', link: '/components/message' },
        { text: 'Tooltip 提示', link: '/components/tooltip' },
        { text: 'Popover 弹出层', link: '/components/popover' },
        { text: 'Drawer 抽屉', link: '/components/drawer' },
        { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
      ],
    },
    {
      text: '样式组件',
      items: [
        { text: 'Code 代码样式', link: '/components/code' },
        { text: 'Link 链接样式', link: '/components/link' },
      ],
    }
  ],
}

export default defineConfig({
  // 站点信息
  title: 'Moongate Vue',
  description: '极简 Vue 3 组件库',
  lang: 'zh-CN',

  // 主题配置
  themeConfig: {
    // 导航栏
    nav,

    // 侧边栏
    sidebar,

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yuelinghuashu/moongate-vue' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/moongate-vue' },
    ],

    // 搜索
    search: {
      provider: 'local',
    },

    // 页脚
    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2026-present Moongate Vue',
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/yuelinghuashu/moongate-vue/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    // 上次更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },

    // 大纲标题
    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 暗色模式切换
    darkModeSwitchLabel: '暗色模式',
    lightModeSwitchTitle: '切换到亮色模式',
    darkModeSwitchTitle: '切换到暗色模式',
  },

  // 头部额外标签
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  // Markdown 配置
  markdown: {
    theme: 'vitesse-dark',
    lineNumbers: true,
    config: (md) => md.use(demoblockPlugin)
  },

  // Vite 配置（让文档可以导入组件库）
  vite: {
    plugins: [demoblockVitePlugin()],
    resolve: {
      alias: {
        'moongate-vue': resolve(__dirname, '../../src/index.ts'),
      },
    },
    optimizeDeps: {
      include: ['moongate-vue'],
    },
  },
})
