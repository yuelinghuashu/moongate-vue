# 更新日志

本文档记录 Moongate Vue 的版本变更。遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## [1.7.0] - 2026-09-06

### 🚀 新特性

- **`SeriesNav` 系列导航组件**：有序内容导航，按序编号、当前篇高亮、超阈值折叠；5 个 props，SSR 安全
- **Tooltip 定位改为 JS（useFloating）**：弃用 CSS Anchor Positioning（浏览器基线不足），统一 JS 定位；新增 `hideDelay`
- **Select 下拉 Teleport 化**：fixed 定位修复 overflow 容器裁剪；新增键盘 Home/End
- **`prefers-reduced-motion` 支持**：减弱动效时禁用 message/toast/skeleton/button 动画，浮层显隐过渡（Modal/Drawer/Dropdown/Popover/Tooltip/Select 下拉）归零
- **RTL 基础支持**：toast/message 方向、select（原生 + 可搜索）箭头镜像随 `[dir="rtl"]` 翻转

### 🐛 Bug 修复

- **Tooltip 悬浮不显示**（`mg-tooltip-visible` 漏绑）
- **Modal/Drawer 关闭后焦点不返回触发元素**（WCAG 2.4.3）
- **`useAttrsWithClass` 透传非响应式**（attrs 快照问题）
- **Select `aria-activedescendant` 绑定位置错误**；Tab 无法关闭下拉
- **Dropdown 触发容器 ARIA 语义修复**（消除 axe `aria-allowed-attr` / `nested-interactive` 违规，触发语义由插槽内元素承担）
- **Toast/Message 补播报语义**（Message `role="alert"`；Toast `role="status"`，error 提升为 alert）
- **CSS 变量语义修复**（`--ui-overlay-scrim` 缺失、skeleton 高光、硬编码 white 等）

### 🎨 设计令牌

- 新增 `--ui-overlay-scrim`；补全字号档（`size-xl/title/display` 系列）

### 🧪 工程与测试

- **代码去重**：抽取 `isBrowser` 共享常量（`src/utils/env.ts`）消除 5 处重复声明；抽取 `useClickOutside` composable 统一 Popover/Dropdown 的点击外部关闭逻辑，净减 ~50 行
- **scripts 迁移 TypeScript**：4 个脚本由 `.js/.mjs` 改为 `.ts`（Node 24 原生 type-stripping 运行，零新依赖）
- **axe 覆盖扩展至全部 29 个组件**：补齐 12 个静态/表单/交互组件的 a11y 用例（含 Dropdown 开闭两态、FormItem 错误态 aria 关联断言）
- 新增 `scripts/check-tokens.ts` 接入构建（token 引用/fallback 一致性护栏）
- e2e 新增键盘/焦点用例（select-keyboard / modal-focus），共 26 用例；单测 **534**（新增 useClickOutside / useNotification / Dropdown 键盘 / 全组件 a11y 用例）

## [1.6.0] - 2026-08-18

### 🚀 新特性

- **Dropdown 下拉菜单组件**：点击触发的弹出菜单，键盘导航（↑↓ Home End Enter Escape TypeAhead）、分隔线、危险操作高亮、9 方位定位、`v-model:open`、`role="menu"`；新增 `useMenuKeyboard` composable
- **`setConfig` 全局文案配置**：中英文自动适配，`setConfig({ locale / texts })` 部分合并，已挂载组件响应式更新
- **组件 Props 类型导出**：全部 28 个组件 Props 类型可从 `'moongate-vue'` 直接导入
- **Message/Toast 默认类型图标**：✓ ✗ ⚠ ℹ，可通过 `icon` prop 或 `#icon` 插槽覆盖
- **FormItem `for` prop**：关联 label 与 input，支持点击聚焦
- **`disposeConfig()` 导出**：断开 MutationObserver，适用于 SSR 清理和测试 teardown
- **Tooltip/Popover Escape 键关闭 + click-outside**

### 🐛 Bug 修复

- **Table 半选状态不生效**（`:indeterminate` 是 DOM property，改用 ref + watch）
- **Drawer 点击穿透**（遮罩层缺少 `.self`）
- **Popover 属性双重绑定**（缺少 `inheritAttrs: false`）

### ✨ 优化

- Switch 添加 `role="switch"` + `aria-checked`；Pagination/Hero 补充 `aria-label`/`aria-labelledby`；`:focus-visible` 焦点样式
- Form provide 响应式；Tabs 单向 watch；useOverlayComponent 支持动态 getter；useScrollLock trapFocus 修复
- 测试：449 个（32 文件）

### 📝 文档

- 新增 Dropdown 组件文档；design-tokens / install 更新；7 篇组件文档修正

---

<details>
<summary>## [1.5.0] - 2026-08-06</summary>

### 🐛 Bug 修复

- **Divider 拼写错误**：`hasDefaul` → `hasDefault`
- **Button 空 label 渲染**：`label=''` 时不再渲染空容器

### 🚀 新特性

- **`useForm` 表单校验**：复用 HTML5 校验，只补原生做不到的 4 个场景（状态管理、异步、关联、编排），零依赖
- **Select 多选**：`multiple` prop（需 `filterable`），标签 chip、连续多选、键盘友好
- **Table 行选择**：`selectable` prop + `v-model:selected-rows`，全选/半选
- **`Form` / `FormItem` 视图组件**：布局 + label/必填/错误/校验中展示，由 `useForm` 驱动

### ✨ 优化

- **WAI-ARIA 升级**：Tooltip/Select/Table/Modal/Tabs 补充 ARIA 属性与键盘导航，所有 ID 用 `useId()`
- **代码去重**：抽取 `useNotification`（Message/Toast）与 `useFormField`（Input/Textarea）
- **测试**：395 个（29 文件），覆盖率 95%+；新增 Playwright e2e 冒烟测试（14 用例）

### 📝 文档

- 新增 `form-validation.md`；Select/Table 文档更新

</details>

---

<details>
<summary>## [1.4.1] - 2026-08-06</summary>

### 🐛 Bug 修复

- **Card 缺少 `mg-card` 基础类**；**Tabs ARIA id 关联损坏**；**Select 无障碍缺陷**（role/aria 属性）；**SSR 测试过时 props**

### ✨ 优化

- 启用 TypeScript strict 模式；抽取 `useOverlayComponent` composable（统一 Modal/Drawer）
- Select 移除 200ms 硬编码延迟；Modal/Drawer 移除双重类型断言
- 抽取共享类型至 `types/components.ts`（消除 18 个组件重复定义）
- axe-core 可访问性扩展到 13 个组件；CSS reset 改为可选引入

</details>

---

<details>
<summary>## [1.4.0] - 2026-08-05</summary>

### 🐛 Bug 修复

- **Input `change` 事件丢失**；**createOverlay 孤儿引用**；**Modal/Drawer 滚动锁冲突**
- **Button 默认 type** 改为 `button`（防表单意外提交）；**Modal 补 ESC 关闭**；**Select 类型安全**

### 🚀 新特性

- **Message/Toast 消息堆叠**（`createOverlay` 统一管理，⚠️ 破坏性变更）
- **Table `row-key`**；**按需导出**（25 个组件独立入口）；**Modal/Drawer 焦点管理**；**CI/CD**

### ✨ 优化

- SSR：`useId()` 替换 `Math.random()`；Popover/Tooltip 全局 MutationObserver → ResizeObserver
- ESLint + Prettier + husky；测试体系建立（212 个，覆盖率 78.85%）

### ⚠️ 破坏性变更

- 最低 Vue `^3.5.0`；Button 默认 type 改为 `button`；Message/Toast 堆叠行为变化；新增子路径导出

</details>

---

<details>
<summary>## [1.3.1] - 2026-06-19</summary>

### 🐛 Bug 修复

- Modal/Drawer/Popover/Tooltip 的 SSR `document`/`window` 访问错误；Toast/Message SSR 命令式调用静默失败

</details>

---

<details>
<summary>## [1.3.0] - 2026-06-19</summary>

### 🚀 新特性

- 全部表单组件使用 `defineModel` 重构 v-model；Button 新增 `showLabelWhileLoading` / `loadingLabel`

### ✨ 优化

- Toast/Message 用 `<Transition>` 管理动画；Drawer 支持 ESC 关闭

### ⚠️ 破坏性变更

- Pagination v-model 改为 `v-model`；最低 Vue `^3.3.0`

</details>

---

<details>
<summary>## [1.2.1] - 2026-06-08</summary>

- 添加 npm 包关键词（`keywords`）

</details>

---

<details>
<summary>## [1.2.0] - 2026-06-07</summary>

- 新增 VitePress 文档站（`vue.moongate.top`）；所有组件添加 `defineOptions({ name, inheritAttrs: false })`
- 移除 `install`，仅支持按需导入；构建配置优化；配置 CI/CD 流水线

</details>

---

<details>
<summary>## [1.1.0] - 2026-06-02</summary>

- 新增 Table 组件；Pagination 支持快速跳转首尾页；Select 支持搜索过滤

</details>

---

<details>
<summary>## [1.0.0] - 2026-06-01</summary>

- 首次发布：24 个基础组件、2 个样式组件；浅色/深色主题；零依赖，10KB

</details>
