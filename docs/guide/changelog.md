# 更新日志

本文档记录 Moongate Vue 的版本变更。遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## [1.6.0] - 2026-08-18

### 🚀 新特性

- **Dropdown 下拉菜单组件**：点击触发的弹出操作菜单，支持键盘导航（↑↓ Home End Enter Escape TypeAhead）、分隔线、危险操作高亮、9 方位定位（含 start/end 对齐）、受控模式（`v-model:open`）、WAI-ARIA `role="menu"` + `role="menuitem"`；新增 `useMenuKeyboard` composable（泛型，可复用于自定义菜单）；新增 `DropdownPlacement`、`DropdownOption` 类型
- **`setConfig` 全局文案配置**：内置文案自动适配中英文；`setConfig({ locale: 'en-US' })` 切换语言，`setConfig({ texts: {...} })` 部分覆盖；优先级 **组件 prop > setConfig > 内置文案**，已挂载组件响应式更新
- **组件 Props 类型导出**：所有 28 个组件的 Props 类型（`ButtonProps`、`TableProps` 等）均可从 `'moongate-vue'` 直接导入；泛型组件（Table/Form）的类型定义在独立 `.ts` 文件中（`types/table.ts`、`types/form.ts`），避免 shim 冲突；新增 `MenuItemBase`、`disposeConfig()`、`getDefaultIcon()` 等公共类型/函数
- **Message/Toast 默认类型图标**：每种通知类型自动显示默认图标（✓ ✗ ⚠ ℹ），可通过 `icon` prop 或 `#icon` 插槽覆盖
- **FormItem `for` prop**：可选 `for` prop 关联 label 与 input，支持点击聚焦
- **`disposeConfig()` 导出**：断开 MutationObserver 监听，适用于 SSR 清理和测试 teardown
- **Tooltip/Popover Escape 键关闭 + click-outside**：两个组件支持 Escape 键关闭；Popover 新增点击外部区域自动关闭

### 🐛 Bug 修复

- **Table 半选状态不生效**：`:indeterminate` 是 DOM property 而非 HTML attribute，Vue `:attr` 绑定无法设置；改用模板 ref + watch
- **Drawer 点击穿透**：遮罩层 click 事件缺少 `.self` 修饰符，导致点击抽屉内容区域意外关闭
- **Popover 属性双重绑定**：缺少 `inheritAttrs: false`，外部属性被应用两次

### 🚀 质量提升

- **无障碍**：Switch 添加 `role="switch"` + `aria-checked`；Pagination 输入框添加 `aria-label`；Hero `<section>` 添加 `aria-labelledby`；所有键盘交互组件添加 `:focus-visible` 焦点样式
- **Form provide 响应式**：`provide()` 值用 `computed()` 包装，`FormItem` 正确反映父组件变化
- **Tabs 单向 watch**：替换双向 watch 为单向 external→internal + 直接 `modelValue` 同步
- **useOverlayComponent 动态选项**：`enableEsc`/`enableFocusTrap` 支持 getter，挂载后 prop 变化可响应
- **useScrollLock trapFocus**：无可聚焦元素时 Tab 键不再逃逸浮层
- **构建优化**：`package.json` exports 校验脚本（verify-build 新增一致性检查）；移除 `check:size` 脚本简化流程
- **CSS 改进**：消除 Table `!important`；新增 `--ui-typography-size-lg`（18px）和 `--ui-overlay-scrim`（light/dark）token
- **测试**：449 个测试（32 文件），新增 Modal ESC 测试、Popover click-outside 测试、Dropdown/useMenuKeyboard 测试；Form/Table 补充 `resetConfig()` 清理

### 📝 文档

- **文档全面更新**：新增 Dropdown 组件文档（6 个交互示例 + 键盘导航 + API）；`design-tokens.md` 补充新 token；`install.md` 新增 TypeScript 类型章节；7 篇组件文档修正（popover `delay`→`showDelay`、card `as` 类型收窄、tabs 键盘导航、message/toast 默认图标等）

---

<details>
<summary>## [1.5.0] - 2026-08-06</summary>

### 🐛 Bug 修复

- **Divider 拼写错误**：`hasDefaul` → `hasDefault`（变量/计算属性/模板三处）
- **Button 空 label 渲染**：`label=''` 时不再渲染空的 `.mg-button-label` 容器（纯图标按钮场景），新增测试断言

### 🚀 新特性

- **`useForm` 表单校验组合式函数**：复用 HTML5 Constraint Validation（`required`/`email`/`min`/`pattern` 等原生已有能力），只补 4 个原生做不到的场景——状态集中管理（`values`/`errors`/`valid`）、异步校验（远程唯一性）、关联字段校验（确认密码）、校验编排（`validate`/`validateField`/`reset`），零依赖，19 个单元测试
- **Select 多选**：新增 `multiple` prop（需配 `filterable`），标签 chip 展示 + 删除按钮、连续多选（选中后下拉保持打开）、键盘友好（Enter 选中不关闭/Esc 关闭）、多选时 `change` 始终 emit 数组，8 个单元测试
- **Table 行选择**：新增 `selectable` prop + `v-model:selected-rows`，表头全选/半选（indeterminate）、`row-selectable` 禁用行、`row-key` 稳定选中，9 个单元测试
- **`Form` / `FormItem` 表单视图组件**：布局容器 + 单字段 label/必填星号/错误/校验中展示，完全由 `useForm` 驱动（不重复校验逻辑）；两者合计约 1KB gzip。14 个单元测试

### 🚀 质量提升

- **可访问性全面升级（WAI-ARIA Patterns）**：Tooltip 新增 `aria-describedby` + 键盘 focus 触发；Select 新增选项唯一 `id` + `aria-activedescendant`；Table 排序表头暴露 `aria-sort` 并支持键盘排序；Modal/Drawer 新增 `aria-describedby` 关联正文；Tabs 新增完整键盘导航（`←`/`→`/Home/End）——所有 ID 均通过 SSR 安全的 `useId()` 生成
- **SSR 健壮性加固**：`useScrollLock` 导出函数增加非浏览器环境守卫；`Message`/`Toast` 在 SSR 渲染期间跳过创建定时器
- **代码去重**：抽取 `useNotification`（Message/Toast）与 `useFormField`（Input/Textarea）composable；Select 状态重置逻辑重构为共享方法
- **测试扩展至 395 个（29 个测试文件）**：覆盖率从 78.85% 提升至 95%+（statements `76→90`、branches `65→80`、functions `76→90`、lines `78→92`）
- **Playwright 端到端冒烟测试**：14 个真实浏览器用例覆盖全部 25 个组件（渲染 + 关键交互），使用系统 Google Chrome（`channel: 'chrome'`）；新增 `pnpm test:e2e` / `test:e2e:install` 脚本
- **Table 排序图标修复**：排序图标 class 改用响应式 `currentSortKey`/`currentSortOrder` 而非原始 props
- **文档准确性修正**：Tooltip/Table/Select 文档更新至与键盘/无障碍行为一致

### 📝 文档更新

- 新增 `docs/guide/form-validation.md` 表单校验指南：原生优先校验理念 + `useForm` API 参考
- Select 文档更新多选示例；Table 文档更新行选择示例

</details>

---

<details>
<summary>## [1.4.1] - 2026-08-06</summary>

### 🐛 Bug 修复

- **Card 缺少 `mg-card` 基础类**：卡片背景/圆角/overflow 样式从未生效；已修复并由新增测试断言覆盖
- **Tabs ARIA id 关联损坏**：tab 按钮缺少 `id="mg-tab-{index}"`，面板 `aria-labelledby` 关联失效；已修复
- **Select 无障碍缺陷**：选项缺少 `role="option"`/`aria-selected`、下拉面板缺少 `role="listbox"`、表单/aria 属性绑定在外层 wrapper 而非原生元素（axe 违规）——全部已修复
- **SSR 测试使用过时的 Pagination props**：`{ total, currentPage }` → `{ totalPages, modelValue }`

### ✨ 优化改进

- **启用 TypeScript strict 模式**，组件库类型质量全面提升；修复 tsconfig.app.json（移除未安装的 `@vue/tsconfig` 引用）
- **抽取 `useOverlayComponent` composable**：统一 Modal/Drawer 的 open/close 事件、标题 ID、属性透传、滚动锁定/ESC/焦点陷阱逻辑
- **Select 移除 200ms 硬编码延迟**：改用浏览器事件顺序判断，点击选项不关闭、点击外部立即关闭
- **Modal/Drawer 移除双重类型断言**：共享 composable 直接接收类型安全的 `Ref<boolean>`
- **抽取共享类型至 `src/types/components.ts`**：消除 18 个组件中的重复类型定义（`Size`/`Placement`/`NotificationType` 等）
- **axe-core 可访问性覆盖扩展到 13 个组件**：执行 WCAG 检查，违规即失败
- **全局 CSS reset 改为可选引入**：新增 `moongate-vue/reset.css`（仅统一 `box-sizing`），默认对使用方样式零影响
- **README 新增浏览器支持声明**：与 VitePress 基线保持一致（Chrome 111+/Firefox 113+/Edge 111+/Safari 16.2+）

### 🔧 构建相关

- **Dockerfile 固定 pnpm 版本**：`pnpm@latest` → `pnpm@11.15.1`
- **package.json 新增 `engines` 字段**：声明 `node >= 20.0.0`、`pnpm >= 9.0.0`
- **colors.css 来源注释更新**：标明上游 moongate-theme 项目路径

</details>

---

<details>
<summary>## [1.4.0] - 2026-08-05</summary>

### 🐛 Bug 修复

- **Input `change` 事件丢失**：组件声明了 `change` emit 但模板漏绑 `@change`，导致事件被"吞掉"——由新增的单元测试发现并修复
- **createOverlay 共享容器孤儿引用**：模块级 `Map` 缓存未检查 `isConnected`，可能返回已脱离 DOM 的孤儿节点
- **Modal / Drawer 滚动锁冲突**：多实例同时打开时关闭任意一个都会恢复 body 滚动；抽取 `useScrollLock` composable 共享锁逻辑，仅最后一个关闭时恢复
- **Button 缺少默认 `type="button"`**：表单内使用会默认为 `submit` 导致意外提交，现默认 `type="button"` 并支持显式指定
- **Modal 缺少 ESC 键关闭**：体验与 Drawer 不一致，现统一通过 `useOverlayBehavior` 支持
- **Select 类型安全**：`options`、`getLabel` 等使用 `any` 导致类型不安全；改用 `SelectOption`/`SelectValue` 联合类型，`labelKey`/`valueKey` 类型安全

### 🚀 新特性

- **Message / Toast 消息堆叠**：基于 `createOverlay` 共享容器机制，从"替换前一条"改为"叠加显示多条"；同时解耦组件内层 `<Teleport>`，由 `createOverlay` 统一管理容器与动画时序（⚠️ 破坏性变更：依赖旧行为的调用方需手动关闭已有实例）
- **新增 `createOverlay` / `closeAllOverlays` / `destroyAllOverlays` composable**：动态挂载覆盖层的可复用工具，提供统一 `close()` 接口与 SSR 安全、同步清理 API
- **Table 新增 `row-key` prop**：排序时使用稳定 key 替代索引，避免 DOM 复用错乱
- **按需导出（Tree-shaking 友好）**：新增 25 个组件的独立导出入口（`moongate-vue/button` 等），构建产出每个组件独立 `.mjs` 文件；主入口 `moongate-vue` 保持兼容
- **Modal / Drawer 无障碍与焦点管理**：新增焦点陷阱（键盘 Tab 循环在组件内）、`aria-labelledby` 动态标题关联、可自定义的 `closeAriaLabel`
- **CI/CD 工作流**：新增 GitHub Actions，在 Node 20/22 上执行 lint、类型检查、格式检查、覆盖率测试与构建

### ✨ 优化改进

- **SSR 兼容性增强**：Modal/Drawer 改用 `useId()`（Vue 3.5+ SSR 安全 ID）替换 `Math.random()`；新增对全部 25 个组件的 `renderToString` 回归测试
- **Popover / Tooltip 性能优化**：全局 `MutationObserver` → `ResizeObserver`，仅可见时监听自身尺寸变化
- **代码规范与工程化**：引入 ESLint + Prettier 统一风格、husky + lint-staged 提交前检查、Button/Toast/Modal/Drawer 增加 `defineSlots` 插槽类型
- **测试体系建立**：Vitest + jsdom，覆盖全部 25 个组件、5 个 composables 与 SSR 回归测试，共 212 个测试用例，覆盖率约 78.85%
- **样式清理**：移除 `index.css` 中 `table.css` 重复导入；`.gitignore` 忽略 `coverage/` 与 `assets/` 支付图片

### ⚠️ 破坏性变更

- **最低 Vue 版本**：从 `^3.3.0` 提升至 **`^3.5.0`**（`useId` 需 Vue 3.5+，实现 SSR 安全 ID）；Vue 3.0 - 3.4 用户请使用 `moongate-vue@1.2.x`
- **Button type 行为变化**：默认 `type` 从 submit 改为 `button`；如需在表单中提交请显式传入 `type="submit"`
- **Message / Toast 行为变化**：见上方新特性说明
- **按需导出路径**：新增子路径导出，主入口保持兼容（见上方新特性说明）

### 📝 文档更新

- README 版本要求更新为 Vue `^3.5.0`

### 🔧 构建相关

- `@types/node` 移入 `devDependencies`（守住零依赖承诺）；`main` 字段修正为 `./dist/index.mjs`
- 新增 `.dockerignore`、`pnpm-workspace.yaml`、`lint`/`format`/`prepare` 脚本
- **打包流程加固**：新增 `clean` 脚本（构建前清理 dist）、`prepublishOnly`（发布前自动「构建 + 测试」），统一使用 pnpm

</details>

---

<details>
<summary>## [1.3.1] - 2026-06-19</summary>

### 🐛 Bug 修复

- **SSR 兼容性**：修复 Modal、Drawer、Popover、Tooltip 等组件在服务端渲染时访问 `document`/`window` 导致的错误
- **Toast / Message**：命令式调用在 SSR 环境下静默失败，不再抛出错误

</details>

---

<details>
<summary>## [1.3.0] - 2026-06-19</summary>

### 🚀 新特性

- **所有表单组件**（`Checkbox`/`Radio`/`Switch`/`Input`/`Textarea`/`Select`）使用 `defineModel` 重构 v-model 实现，代码更简洁、类型更安全
- `Button`：新增 `showLabelWhileLoading` 和 `loadingLabel` 属性，加载时可选择保留文字

### ✨ 优化改进

- **Toast / Message**：使用 Vue `<Transition>` 管理进入/离开动画；自动关闭定时器在组件卸载时正确清理，防止内存泄漏
- **Drawer**：支持 ESC 键关闭，提升无障碍体验
- 减少冗余响应式状态，提升代码可维护性

### ⚠️ 破坏性变更

- **Pagination**：v-model 用法从 `v-model:current-page` 改为 `v-model`（旧用法不再兼容）
- **最低 Vue 版本**：从 `^3.0.0` 提升至 `^3.3.0`（`defineModel` 需要 Vue 3.3+ 编译器支持）

### 📝 文档更新

- Props 表格中移除 `update:modelValue` 事件说明（由 defineModel 自动处理）；Pagination 文档更新为 `v-model` 简写

</details>

---

<details>
<summary>## [1.2.1] - 2026-06-08</summary>

### 🔧 构建相关

- 添加 npm 包关键词（`keywords`），提升在 npm 搜索中的可发现性

</details>

---

<details>
<summary>## [1.2.0] - 2026-06-07</summary>

### 🎉 新特性

- 新增 VitePress 文档站（`vue.moongate.top`）

### 🐛 Bug 修复

- 所有组件添加 `defineOptions({ name, inheritAttrs: false })`
- 移除 install

### 📝 文档更新

- 新增 25 个组件 API 文档与设计令牌文档

### 🔧 构建相关

- 移除全局安装函数 `install`，组件库仅支持按需导入，不再提供 `app.use()` 方式
- 优化构建配置（`vite build && tsc --emitDeclarationOnly`）；完善 `package.json` 导出配置
- 配置阿里云 ACR 镜像仓库与 GitHub Actions CI/CD 流水线

</details>

---

<details>
<summary>## [1.1.0] - 2026-06-02</summary>

### 🚀 新特性

- 新增 Table 组件
- Pagination 组件支持快速跳转首尾页
- Select 组件支持搜索过滤（`filterable` 属性）

</details>

---

<details>
<summary>## [1.0.0] - 2026-06-01</summary>

### 🎉 首次发布

- 发布 24 个基础组件、2 个样式组件
- 支持浅色/深色主题
- 零依赖，体积 10KB

</details>
