# 更新日志

[English](./CHANGELOG.md) | **中文**

## [1.7.1] - 2026-09-26

### 🐛 缺陷修复

- **Button 的 `sm` 档不存在，且默认档正式定为 `md`**：`.mg-button` 基础样式写死了 md 档，而 `.mg-button-sm` 与 `.mg-button-md` 取值逐字相同，`size="sm"` 传了没有视觉效果。现将三档明确分离（`padding` xs+sm / sm+md / md+lg；`font-size` `size-small`/`size-body`/`size-lg`，全部为既有令牌），基础档与 prop 默认档 `md` 对齐，与全库一致。实测高度（Chromium）：sm 25px / md 37px / lg 49px。**未显式传 `size` 的消费方无感**；`size="sm"`/`"md"`/`"lg"`（原先 35/45/57px）现在与名称吻合
- **控件高度曾由宿主页面行高决定**（Button / Input / Textarea / Badge / Select / Tabs / Pagination）：这些叶子规则都没声明 `line-height`（`Input`/`Textarea`/`Select` 连 `font-size` 也没声明），VitePress 下输入框高 42px、徽章高 40px，**比 37px 的默认按钮还高**。现在每个交互叶子规则都显式声明 `line-height: 1.4` 与 `font-size`；两种宿主下三档都落在 37–39px 同一高度带（输入类因 1px 边框高 2px）
- **各控件档位对齐**：`Input`/`Textarea` 基础规则是 `padding: var(--ui-spacing-sm)` 且未声明 `font-size`，默认渲染 33px 与自身 `size="md"` 的 35px 不一致 —— 现两者统一为 `md` 档；`Badge` 的 md 档误用 `--ui-typography-size-code`(13px) 而非其他组件统一的 `size-body`(15px)；`Dropdown` 的 md 档只设了 `min-width`，菜单项靠「基础规则恰好等于 md 档」的隐含契约命中
- **清理无样式的死类名**：`Card` 渲染的 `mg-card--body-hidden` 全库无 CSS，而定义好的 `.mg-card-footer--no-border` 从未被挂上 —— 现 `hideBody` 会真正去掉页脚顶边；`FormItem` 的 `mg-form-item--error` / `--validating` 与 `Button` 的 `mg-button-loading` 同样没有任何 CSS，均已移除

### 🧪 工程与测试

- **新增 CSS 契约测试套件**（`control-size-contract.test.ts`，配套共用解析工具 `src/__tests__/helpers/cssRules.ts`）：每个交互叶子规则必须声明 `line-height`；声明了 `padding` 的规则必须同时声明 `font-size`；基础档 == 默认档；Dropdown 三档都必须覆写菜单项
- **Button 尺寸阶梯断言**（`button-size-ladder.test.ts`、`Button.test.ts`），外加一条 Playwright 断言：在同一容器内渲染 Button / Input / Textarea / Select / Badge 的 md 档，要求最大最小高度差 ≤ 4px

### 📝 文档

- **`<Input label="…" />` 示例是错的**：`Input` 没有 `label` prop，该属性会被透传到 `<input>`，页面上不会出现任何标签文字；示例改用 `<label for>`

### 🎨 设计令牌（同步自 moongate-theme 2.7.1）

- `src/styles/tokens/colors.css` 随主题语义层刷新：浅色文本层级去塌陷 —— `comment` → `#55647c`、`textMuted`/`operator` → `#64748b`、`textInactive` → `#7a8c9e`；浅色 ANSI 白/亮白改为可读墨色灰（≥3:1，白族 ≥4.5:1）
- 新增导出语义角色：`--ui-primary-solid`、`--ui-selection-foreground`、`--ui-code-dim`（主题 2.7.1 深色交互对比度修复）
- 组件 fallback 对齐（`series-nav.css`/`switch.css` 的 `--ui-text-inactive` → `#7a8c9e`）；`docs/guide/design-tokens.md` 数值表已更新
- `check-tokens.ts` 与完整构建通过；`dist/style.css` 已重建（深色视觉基本不变）

<details>
<summary>## [1.7.0] - 2026-09-06</summary>

### 🚀 新特性

- **`SeriesNav` 系列导航组件**：面向"文章系列 / 目录"的有序列表 —— 按序编号、当前篇高亮（`aria-current`）、超过阈值折叠为单个 "N more parts…" 占位（始终保留首/末/激活项）。纯展示组件（不排序、不注入数据）；5 个 props、`#item`/`#title` 插槽、SSR 安全、axe 零违规，并附带类型与 `'moongate-vue/series-nav'` 按需入口
- **Tooltip 定位改为 JS（useFloating）**：弃用 CSS Anchor Positioning（`anchor()` 超出声明浏览器基线，Firefox/旧 Safari 下错位），改为 JS 定位并补上视口翻转与 `awaitNextTick` 校准
- **Tooltip 新增 `hideDelay` prop**（默认 100ms，与 Popover 行为对齐）
- **Select 下拉 Teleport 化**：从 `position:absolute`（被 overflow 祖先裁剪）改为 Teleport 到 body + fixed 定位，坐标由 JS 计算并跟随滚动/窗口变化 —— 与 Dropdown/Popover 同一套策略
- **Select 键盘 Home/End**：新增首/末项快捷跳转（WAI-ARIA listbox 键盘约定）
- **`prefers-reduced-motion` 支持**：系统减弱动效时禁用 message/toast/skeleton/button 关键帧动画，并把 Modal/Drawer/Dropdown/Popover/Tooltip/Select 浮层的显隐过渡归零，hover 颜色过渡保留
- **RTL 基础支持**：toast 容器方位、message/toast 彩色边方向、select（原生 + 可搜索模式）箭头与输入内边距镜像随 `[dir="rtl"]` 翻转

### 🐛 Bug 修复

- **Tooltip 悬浮不显示**：浮层从未绑定 `mg-tooltip-visible`，`opacity: 0` 恒不可见（修改前版本即存在，jsdom 单测未覆盖视觉）；已补绑定 + 可见性断言
- **Modal/Drawer 关闭后焦点不返回触发元素**（违反 WCAG 2.4.3）：useScrollLock 打开时记录焦点元素，关闭时安全归还（isConnected/disabled 守卫）
- **`useAttrsWithClass` 透传非响应式**：`attrsWithoutClass` 是 setup 快照，父组件动态改 `id`/`data-*`/`style` 不透传到根元素；改为按需响应式读取
- **Select `aria-activedescendant` 绑定位置错误**：此前绑在 listbox 容器而非获得焦点的 input（屏幕阅读器读不到）；已移到 input 并移除 listbox 冗余绑定
- **Select Tab 键无法关闭下拉**：`mousedownInside` 残留 `true` 导致 blur 被误判为"点击选项"，下拉不关闭；打开时重置
- **CSS 语义 token 收敛**：tooltip 改用专用 `--ui-surface-tooltip`；skeleton 高光改为 `--ui-fill-medium`；switch 未选中滑块改用中性色；多处陈旧 fallback 同步为当前 token 值；按钮/复选框/开关硬编码 `white` 改用 `--ui-white`
- **Dropdown 触发容器 ARIA 语义修复**：容器不再声明 `role="button"`/`aria-expanded`（无 role 挂这些属性触发 axe `aria-allowed-attr`，加了 role 包裹真实按钮又触发 `nested-interactive`）；菜单语义改由 `role="menu"` 与插槽自身的触发元素承担
- **Toast/Message 缺失播报语义**：Message 补 `role="alert"`；Toast 补 `role="status"`（`error` 类型提升为 `role="alert"`），屏幕阅读器可感知通知的出现与类型

### 🎨 设计令牌

- **新增 `--ui-overlay-scrim` token**（浅 `#00000080` / 深 `#000000b3`），走 moongate-theme 语义层生成链
- **补全字号档**：`--ui-typography-size-xl`（24px）、`-title`（20px）、`-display/-display-lg/-display-xl`（40/48/60px）；modal/drawer 标题、关闭按钮、message 图标、hero 标题从硬编码字号改用 token
- **语义层补充消费者注释**（hoverBg/selectedBg/surfaceFloating/borderFloating/fill 系），明确 workbench 与组件库消费归属

### 🧪 工程与测试

- **新增 `scripts/check-tokens.ts`**：校验所有 `var(--ui-*)` 引用有定义、fallback 与 token 一致（浅/深段分开、时长单位归一），孤儿 token 仅警告；经 `verify:build` 在每次 `pnpm build` 执行
- **e2e 键盘/焦点覆盖**：新增 `select-keyboard.spec.ts`（activedescendant 跟随、Home/End、过滤不越界、Enter/Esc/Tab）与 `modal-focus.spec.ts`（打开焦点入弹层、关闭焦点回触发按钮）
- **代码去重**：抽取 `isBrowser` 共享常量（`src/utils/env.ts`）统一 5 处环境检测，抽取 `useClickOutside` composable 统一 Popover/Dropdown 的点击外部关闭（约减 50 行重复）
- **scripts 迁移 TypeScript**：`component-list` / `verify-build` / `clean-dts` / `check-tokens` 改为 `.ts`，由 Node.js 24 原生 type-stripping 运行，零新增依赖
- **axe 覆盖补全**：补齐 Badge/Card/Container/Divider/Footer/Header/Hero/Main/Skeleton/Form/FormItem 与 Dropdown（关闭/打开两态），至此全部组件均纳入扫描；FormItem 错误态验证 `aria-describedby` 实际指向错误元素

### 📝 文档

- 新增 `series-nav.md` 与 `accessibility.md`（WCAG 2.1 AA 声明、键盘交互对照表、reduced-motion / RTL 矩阵、Dropdown 触发语义与 Skeleton 建议）
- `tooltip.md` 补充 `hideDelay`；`design-tokens.md` 补充新 token 值；修正「每个组件 2-8 props」宣传口径（Button/Select 为 11 个，注明取舍边界）
- 重复的样式引入、原生校验理念、SSR 机制段落统一收敛到 `install` / `philosophy`，各功能文档只保留操作内容

</details>

---

<details>
<summary>## [1.6.0] - 2026-08-18</summary>

### 🚀 新特性

- **Dropdown 下拉菜单组件**：点击触发的操作菜单，支持键盘导航（↑↓ Home End Enter Escape TypeAhead）、分隔线、危险操作高亮、9 方位定位、`v-model:open` 受控与 `role="menu"`/`role="menuitem"` 语义 —— 并附带可复用的 `useMenuKeyboard` composable 与 `DropdownPlacement`/`DropdownOption` 类型
- **`setConfig` 全局文案配置**：内置文案自动适配中英文；`setConfig({ locale: 'en-US' })` 切换语言，`setConfig({ texts: {...} })` 部分覆盖；优先级 **组件 prop > setConfig > 内置文案**，已挂载组件响应式更新
- **组件 Props 类型导出**：所有组件的 Props 类型（`ButtonProps`、`TableProps` 等）均可从 `'moongate-vue'` 导入；泛型组件（Table/Form）类型独立放在 `.ts` 文件以规避 shim 冲突；新增 `MenuItemBase`、`disposeConfig()`、`getDefaultIcon()`
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
- **CSS 改进**：消除 Table `!important`；新增 `--ui-typography-size-lg`（18px）
- **测试**：新增 Modal ESC、Popover click-outside 与 Dropdown/useMenuKeyboard 用例；Form/Table 补充 `resetConfig()` 清理

### 📝 文档

- 新增 Dropdown 文档（6 个交互示例 + 键盘导航 + API）；`design-tokens.md` 补充新 token；`install.md` 新增 TypeScript 类型章节；7 篇组件文档修正（popover `delay`→`showDelay`、card `as` 收窄、tabs 键盘导航、message/toast 默认图标等）

</details>

---

<details>
<summary>## [1.5.0] - 2026-08-06</summary>

### 🐛 Bug 修复

- **Divider 拼写错误**：`hasDefaul` → `hasDefault`（变量/计算属性/模板三处）
- **Button 空 label 渲染**：`label=''` 时不再渲染空的 `.mg-button-label` 容器（纯图标按钮场景），新增测试断言

### 🚀 新特性

- **`useForm` 表单校验组合式函数**：复用 HTML5 Constraint Validation（`required`/`email`/`min`/`pattern` 等原生已有能力），只补 4 个原生做不到的场景——状态集中管理（`values`/`errors`/`valid`）、异步校验（远程唯一性）、关联字段校验（确认密码）、校验编排（`validate`/`validateField`/`reset`），零依赖
- **Select 多选**：新增 `multiple` prop（需配 `filterable`），标签 chip 展示 + 删除按钮、连续多选（选中后下拉保持打开）、键盘友好（Enter 选中不关闭/Esc 关闭）、多选时 `change` 始终 emit 数组
- **Table 行选择**：新增 `selectable` prop + `v-model:selected-rows`，表头全选/半选（indeterminate）、`row-selectable` 禁用行、`row-key` 稳定选中
- **`Form` / `FormItem` 表单视图组件**：布局容器 + 单字段 label/必填星号/错误/校验中展示，完全由 `useForm` 驱动（不重复校验逻辑）；两者合计约 1KB gzip

### 🚀 质量提升

- **可访问性全面升级（WAI-ARIA Patterns）**：Tooltip 新增 `aria-describedby` + 键盘 focus 触发；Select 新增选项唯一 `id` + `aria-activedescendant`；Table 排序表头暴露 `aria-sort` 并支持键盘排序；Modal/Drawer 新增 `aria-describedby` 关联正文；Tabs 新增完整键盘导航（`←`/`→`/Home/End）——所有 ID 均通过 SSR 安全的 `useId()` 生成
- **SSR 健壮性加固**：`useScrollLock` 导出函数增加非浏览器环境守卫；`Message`/`Toast` 在 SSR 渲染期间跳过创建定时器
- **代码去重**：抽取 `useNotification`（Message/Toast）与 `useFormField`（Input/Textarea）composable；Select 状态重置逻辑重构为共享方法
- **测试体系扩充**：语句覆盖率由 78.85% 提升至 95%+（分支/函数/行同步提升约 15 个百分点）
- **引入 Playwright 端到端冒烟测试**：真实浏览器覆盖全部组件的渲染与关键交互，使用系统 Google Chrome（`channel: 'chrome'`）；新增 `pnpm test:e2e` / `test:e2e:install` 脚本
- **Table 排序图标修复**：排序图标 class 改用响应式 `currentSortKey`/`currentSortOrder` 而非原始 props
- **文档**：新增 `guide/form-validation.md`（原生优先校验理念 + `useForm` API）；Select/Table 文档补充多选与行选择示例；Tooltip/Table/Select 文档同步新的键盘行为

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
- **测试与代码规范体系建立**：Vitest + jsdom 覆盖全部组件、composables 与 SSR 回归；引入 ESLint + Prettier 统一风格与 husky/lint-staged 提交前检查；Button/Toast/Modal/Drawer 增加 `defineSlots` 插槽类型
- **样式清理**：移除 `index.css` 中 `table.css` 重复导入；`.gitignore` 忽略 `coverage/` 与 `assets/` 支付图片

### ⚠️ 破坏性变更

- **最低 Vue 版本**：从 `^3.3.0` 提升至 **`^3.5.0`**（`useId` 需 Vue 3.5+，实现 SSR 安全 ID）；Vue 3.0 - 3.4 用户请使用 `moongate-vue@1.2.x`
- **Button 默认 `type`**：由 `submit` 改为 `button`（表单内使用不再误触发提交）；需要提交请显式传 `type="submit"`

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

- **SSR 兼容性**：Modal / Drawer / Popover / Tooltip 在服务端渲染时访问 `document`/`window` 会抛错；命令式 `Toast`/`Message` 调用改为静默失败而非抛错（1.4.0 起改为真实环境守卫）

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
