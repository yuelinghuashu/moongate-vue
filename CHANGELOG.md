# 更新日志

## [1.3.0] - 2026-06-19

### 🚀 新特性

- **所有表单组件**（`Checkbox`、`Radio`、`Switch`、`Input`、`Textarea`、`Select`）使用 `defineModel` 重构 v-model 实现，代码更简洁、类型更安全
- `Button`：新增 `showLabelWhileLoading` 和 `loadingLabel` 属性，加载时可选择保留文字

### ✨ 优化改进

- **Toast / Message 动画优化**：使用 Vue 内置 `<Transition>` 组件管理进入/离开动画，无需手动控制 DOM 移除时机
- **Drawer**：支持 ESC 键关闭，提升无障碍体验
- **Toast / Message**：自动关闭定时器在组件卸载时正确清理，防止内存泄漏
- 减少冗余响应式状态，提升代码可维护性

### ⚠️ 破坏性变更

- **Pagination**：v-model 用法从 `v-model:current-page` 改为 `v-model`（旧用法不再兼容）
- **最低 Vue 版本**：从 `^3.0.0` 提升至 `^3.3.0`（`defineModel` 需要 Vue 3.3+ 编译器支持）

### 📝 文档更新

- Props 表格中移除 `update:modelValue` 事件说明（由 defineModel 自动处理）
- Pagination 文档更新为 `v-model` 简写


## [1.2.1] - 2026-06-08

### 🔧 构建相关

- 添加 npm 包关键词（`keywords`），提升在 npm 搜索中的可发现性


## [1.2.0] - 2026-06-07

### 🎉 新特性

- 新增 VitePress 文档站（`vue.moongate.top`）

### 🐛 Bug 修复

- 所有组件添加 `defineOptions({ name, inheritAttrs: false })`
- 移除 install

### 📝 文档更新

- 新增 25 个组件 API 文档
- 新增设计令牌文档

### 🔧 构建相关

- 移除全局安装函数 `install`，组件库仅支持按需导入，不再提供 `app.use()` 方式
- 优化构建配置，使用 `vite build && tsc --emitDeclarationOnly`
- 完善 `package.json` 导出配置（`exports`、`types`、`files`）
- 配置阿里云 ACR 镜像仓库
- 配置 GitHub Actions CI/CD 流水线


## [1.1.0] - 2026-06-02

### 🚀 新特性

- 新增 Table 组件
- Pagination 组件支持快速跳转首尾页
- Select 组件支持搜索过滤（`filterable` 属性）


## [1.0.0] - 2026-06-01

### 🎉 首次发布

- 发布 24 个基础组件、2 个样式组件
- 支持浅色/深色主题
- 零依赖，体积 10KB