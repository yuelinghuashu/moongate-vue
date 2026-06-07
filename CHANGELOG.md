# Changelog

## [1.2.1] - 2026-06-08

### 🔧 Chores

- 添加 npm 包关键词（`keywords`），提升在 npm 搜索中的可发现性

## [1.2.0] - 2026-06-07

### 🎉 Features
- 新增 VitePress 文档站（`vue.moongate.top`）

### 🐛 Bug Fixes
- 所有组件添加 `defineOptions({ name, inheritAttrs: false })`
- 移除 install

### 📝 Documentation
- 新增 25 个组件 API 文档
- 新增设计令牌文档

### 🔧 Chores
- 移除全局安装函数 `install`，组件库仅支持按需导入，不再提供 `app.use()` 方式
- 优化构建配置，使用 `vite build && tsc --emitDeclarationOnly`
- 完善 `package.json` 导出配置（`exports`、`types`、`files`）
- 配置阿里云 ACR 镜像仓库
- 配置 GitHub Actions CI/CD 流水线

## [1.1.0] - 2026-06-02

### ✨ Features

- 新增 Table 组件
- Pagination 组件支持快速跳转首尾页
- Select 组件支持搜索过滤 (`filterable` 属性)

## [1.0.0] - 2026-06-01

### 🎉 Initial Release

- 发布 24 个基础组件、2 个样式组件
- 支持浅色/深色主题
- 零依赖，体积 10KB
