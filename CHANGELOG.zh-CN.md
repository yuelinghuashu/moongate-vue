# 更新日志

[English](./CHANGELOG.md) | **中文**

## [1.4.1] - 2026-08-06

### 🐛 Bug 修复

- **Card 缺少 `mg-card` 基础类**：`mergedClass` 仅包含动态类（`mg-card-hoverable`/`mg-card--body-hidden`），缺少硬编码的 `mg-card` 基础类——卡片背景/圆角/overflow 样式从未生效；已修复并由新增测试断言覆盖
- **Tabs ARIA id 关联损坏**：tab 按钮缺少 `id="mg-tab-{index}"`，而面板 `aria-labelledby` 引用它——屏幕阅读器的关联被破坏；已修复并由新增 aria 测试覆盖
- **Select 无障碍缺陷**：选项缺少 `role="option"`/`aria-selected`，下拉面板缺少 `role="listbox"`，且 `aria-label`/`name`/`id` 绑定在外层 wrapper 而非实际 `<input>`/`<select>`（axe 报 `aria-input-field-name`/`label` 违规）——全部已修复：表单/aria 属性现透传到原生元素，listbox 复用了可访问名称
- **SSR 测试使用过时的 Pagination props**：`{ total, currentPage }` → `{ totalPages, modelValue }`，消除 missing-required-prop 警告

### ✨ 优化改进

- **启用 TypeScript strict 模式**：`tsconfig.json` 从 `strict: false` 改为 `strict: true`，组件库类型质量全面提升
- **修复 tsconfig.app.json**：移除对未安装的 `@vue/tsconfig` 包的引用，改为自包含配置，修复编辑器类型检查报错
- **抽取 `useOverlayComponent` composable**：统一 Modal/Drawer 的 open/close 事件触发、标题 ID、属性透传、滚动锁定/ESC/焦点陷阱逻辑，各减少约 40 行重复代码
- **Select 移除 200ms 硬编码延迟**：改用浏览器事件顺序（`mousedown` → `blur` → `click`）判断，点击选项时不关闭下拉、点击外部立即关闭，响应更快且无事件竞态
- **Modal/Drawer 移除双重类型断言**：`modelValue as unknown as Ref<boolean>` 不再需要，共享 composable 直接接收类型安全的 `Ref<boolean>`
- **抽取共享类型至 `src/types/components.ts`**：消除 18 个组件中的重复类型定义（`Size`/`Placement`/`NotificationType`/`AddonColor`/`InputType` 等），统一组件库 API 类型一致性
- **axe-core 可访问性覆盖扩展到 13 个组件**：`a11y.test.ts` 现覆盖 Button/Checkbox/Input/Textarea/Select（原生+可搜索）/Tabs/Table/Pagination/Modal/Drawer/Tooltip/Popover，执行 WCAG 检查，违规即失败；`region` 规则在单测中作为测试环境 artifact 禁用
- **全局 CSS reset 改为可选引入**：从默认 `style.css` 中移除激进的 `* { margin: 0; padding: 0 }` + `ul/ol` reset（此前强制作用于所有使用方）。新增可选的 `moongate-vue/reset.css` 入口，提供现代化、无侵入的重置（仅统一 `box-sizing: border-box`），保留浏览器默认 margin/padding——默认对使用方样式零影响
- **README 新增浏览器支持声明**：与 VitePress 基线保持一致（Chrome 111+/Firefox 113+/Edge 111+/Safari 16.2+），并注明 Textarea `field-sizing: content` 自动高度所需的浏览器版本

### 🔧 构建相关

- **Dockerfile 固定 pnpm 版本**：`pnpm@latest` → `pnpm@11.15.1`，与 `packageManager` 保持一致，消除构建不可复现问题
- **package.json 新增 `engines` 字段**：声明 `node >= 20.0.0`、`pnpm >= 9.0.0`，明确运行环境要求
- **colors.css 来源注释更新**：标明上游 moongate-theme 项目路径，方便追溯自动生成来源

<details>
<summary>[1.4.0] - 2026-08-05</summary>

### 🐛 Bug 修复

- **Input `change` 事件丢失**：组件声明了 `change` emit 但模板漏绑 `@change`，导致事件被"吞掉"（既不触发、也不透传）——由新增的单元测试发现并修复
- **createOverlay 共享容器孤儿引用**：模块级 `Map` 缓存未检查 `isConnected`，测试/应用清空 body 后可能拿到已脱离 DOM 的孤儿节点
- **Modal / Drawer 滚动锁冲突**：多实例同时打开时（多个 Modal、Modal + Drawer 等），关闭任意一个都会恢复 body 滚动；先引入模块级计数器，再统一抽取 `useScrollLock` composable 共享锁逻辑，仅最后一个关闭时恢复
- **Button 缺少默认 `type="button"`**：原实现未设置 `type`，在表单内使用 `<Button>` 会默认为 `submit` 导致意外提交，现默认 `type="button"` 并支持 `submit`/`reset` 显式指定
- **Modal 缺少 ESC 键关闭**：Drawer 已支持 ESC 关闭但 Modal 未实现，体验不一致；现统一通过 `useOverlayBehavior` 支持
- **Select 大量 `any` 类型**：`options`、`getLabel`、`getValue` 等使用 `any` 导致类型不安全；改用 `SelectOption` 联合类型并新增 `isOptionDisabled` 辅助函数

### 🚀 新特性

- **Message / Toast 支持堆叠**：基于新增的 `createOverlay` 共享容器机制，可同时显示多条消息/通知（此前为替换前一条）
- **新增 `createOverlay` / `closeAllOverlays` / `destroyAllOverlays` composable**：动态挂载覆盖层的可复用工具，提供统一 `close()` 接口与 SSR 安全、同步清理 API
- **Table 新增 `row-key` prop**：排序时使用稳定 key 替代索引，避免 DOM 复用错乱
- **按需导出（Tree-shaking 友好）**：新增 25 个组件的独立导出入口（`moongate-vue/button`、`moongate-vue/table` 等），构建产出每个组件独立 `.mjs` 文件，`package.json` exports 支持全部子路径
- **焦点陷阱（Focus Trap）**：Modal 和 Drawer 打开时键盘 Tab 循环在组件内，无法逃出遮罩层
- **ARIA 可访问性提升**：Modal/Drawer 增加 `aria-labelledby` 动态标题关联，关闭按钮支持自定义 `closeAriaLabel`
- **CI/CD 工作流**：新增 GitHub Actions（含 `pnpm test` 与 `build:types` 步骤），在 Node 20/22 上执行 lint、类型检查、格式检查、覆盖率测试与构建

### ✨ 优化改进

- **抽取 `useScrollLock` composable**：统一 Modal/Drawer 的 body 滚动锁定、ESC 关闭、焦点陷阱逻辑，消除重复代码
- **createOverlay 清理导入**：移除未使用的 `h`、`reactive` 导入
- **Button/Toast/Modal/Drawer 增加 `defineSlots` 类型**：插槽类型安全化
- **SSR 兼容性增强**：Modal/Drawer 改用 `useId()`（Vue 3.5+ 内置 SSR 安全 ID），替换 `Math.random()` 消除 hydration mismatch 警告
- **Popover 性能优化**：将全局 `MutationObserver`（监听整个 body）替换为 `ResizeObserver`，仅在 popover 可见时监听自身尺寸变化
- **Tooltip 性能优化**：将全局 `MutationObserver`（监听整个 body）替换为 `ResizeObserver`，仅在 tooltip 可见时监听自身尺寸变化
- **新增 SSR 回归测试**：使用 `@vue/server-renderer` 对所有 25 个组件执行 `renderToString`，防止未来改动破坏 SSR 兼容性
- **Message / Toast 解耦 Teleport**：移出组件内层 `<Teleport>`，由 `createOverlay` 统一管理容器与离开动画时序
- **代码规范落地**：引入 ESLint + Prettier，统一全库单引号、无分号风格，修复 5 个历史问题（Footer/Main 缺 `lang="ts"`、Table `prefer-const` 等）
- **pre-commit 钩子**：husky + lint-staged，提交前自动对暂存文件执行 lint 与 format
- **样式清理**：移除 `index.css` 中 `table.css` 重复导入
- **测试体系落地**：Vitest + jsdom，覆盖全部 25 个组件、5 个 composables 与 SSR 回归测试，共 212 个测试用例，整体覆盖率约 78.85%
- **测试覆盖率阈值提升**：statements/lines 60→76/78，branches 50→65，functions 60→76（渐进式目标）
- **`.gitignore` 完善**：忽略 `coverage/` 目录与 `assets/` 支付图片
- **Select 泛型改进**：类型从 `any` 收窄为 `SelectOption` / `SelectValue`，`labelKey`/`valueKey` 类型安全

### ⚠️ 破坏性变更

- **Message / Toast 行为变化**：从"替换前一条"改为"叠加显示多条"。依赖旧行为（消息互斥）的调用方如有需要，可在调用前手动关闭已有实例
- **最低 Vue 版本**：从 `^3.3.0` 提升至 **`^3.5.0`**（`defineModel` 需 Vue 3.4+、`useId` 需 Vue 3.5+，实现 SSR 安全 ID）；Vue 3.0 - 3.4 用户请使用 `moongate-vue@1.2.x`
- **Button type 行为变化**：默认 `type` 从（浏览器默认的 submit）改为 `button`；如依赖 `<Button>` 在表单中提交的行为，需显式传入 `type="submit"`
- **按需导出路径**：新增子路径导出 `moongate-vue/button` 等，但主入口 `moongate-vue` 保持兼容

### 📝 文档更新

- README 版本要求更新为 Vue `^3.5.0`
- 新增技术博客《Vue 3 Teleport 组件单元测试指南》（`docs/blog/`）

### 🔧 构建相关

- `@types/node` 移入 `devDependencies`（守住零依赖承诺）
- `package.json` 的 `main` 字段修正为 `./dist/index.mjs`（与 ESM 产物一致）
- 新增 `.dockerignore`，加速 Docker 构建
- 新增 `pnpm-workspace.yaml`，解决 pnpm 11 构建脚本审批问题
- 新增 `lint` / `format` / `prepare` 脚本
- 构建配置支持多入口按需导出（vite.config.ts 增量入口）
- **打包流程加固**：新增 `clean` 脚本（构建前清理 dist 避免旧产物残留），`build` 统一使用 pnpm（消除 npm/pnpm 混用），新增 `prepublishOnly` 发布前自动执行「构建 + 测试」安全检查

</details>

<details>
<summary>[1.3.1] - 2026-06-19</summary>

### 🐛 Bug 修复

- **SSR 兼容性**：修复 Modal、Drawer、Popover、Tooltip 等组件在服务端渲染时访问 `document` 和 `window` 对象导致的 `document is not defined` 错误
- **Toast / Message**：命令式调用在 SSR 环境下静默失败，不再抛出错误

</details>

<details>
<summary>[1.3.0] - 2026-06-19</summary>

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

</details>

<details>
<summary>[1.2.1] - 2026-06-08</summary>

### 🔧 构建相关

- 添加 npm 包关键词（`keywords`），提升在 npm 搜索中的可发现性

</details>

<details>
<summary>[1.2.0] - 2026-06-07</summary>

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

</details>

<details>
<summary>[1.1.0] - 2026-06-02</summary>

### 🚀 新特性

- 新增 Table 组件
- Pagination 组件支持快速跳转首尾页
- Select 组件支持搜索过滤（`filterable` 属性）

</details>

<details>
<summary>[1.0.0] - 2026-06-01</summary>

### 🎉 首次发布

- 发布 24 个基础组件、2 个样式组件
- 支持浅色/深色主题
- 零依赖，体积 10KB

</details>
