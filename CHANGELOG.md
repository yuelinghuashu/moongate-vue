# Changelog

**English** | [中文](./CHANGELOG.zh-CN.md)

## [1.6.0] - 2026-08-18

### 🚀 New Features

- **Dropdown 下拉菜单组件**：点击触发的弹出操作菜单，支持键盘导航（↑↓ Home End Enter Escape TypeAhead）、分隔线、危险操作高亮、9 方位定位（含 start/end 对齐）、受控模式（`v-model:open`）、WAI-ARIA `role="menu"` + `role="menuitem"`；新增 `useMenuKeyboard` composable（泛型，可复用于自定义菜单）；新增 `DropdownPlacement`、`DropdownOption` 类型
- **`setConfig` 全局文案配置**：内置文案自动适配中英文；`setConfig({ locale: 'en-US' })` 切换语言，`setConfig({ texts: {...} })` 部分覆盖；优先级 **组件 prop > setConfig > 内置文案**，已挂载组件响应式更新
- **组件 Props 类型导出**：所有 28 个组件的 Props 类型（`ButtonProps`、`TableProps` 等）均可从 `'moongate-vue'` 直接导入；泛型组件（Table/Form）的类型定义在独立 `.ts` 文件中（`types/table.ts`、`types/form.ts`），避免 shim 冲突；新增 `MenuItemBase`、`disposeConfig()`、`getDefaultIcon()` 等公共类型/函数
- **Message/Toast 默认类型图标**：每种通知类型自动显示默认图标（✓ ✗ ⚠ ℹ），可通过 `icon` prop 或 `#icon` 插槽覆盖
- **FormItem `for` prop**：可选 `for` prop 关联 label 与 input，支持点击聚焦
- **`disposeConfig()` 导出**：断开 MutationObserver 监听，适用于 SSR 清理和测试 teardown
- **Tooltip/Popover Escape 键关闭 + click-outside**：两个组件支持 Escape 键关闭；Popover 新增点击外部区域自动关闭

### 🐛 Bug Fixes

- **Table 半选状态不生效**：`:indeterminate` 是 DOM property 而非 HTML attribute，Vue `:attr` 绑定无法设置；改用模板 ref + watch
- **Drawer 点击穿透**：遮罩层 click 事件缺少 `.self` 修饰符，导致点击抽屉内容区域意外关闭
- **Popover 属性双重绑定**：缺少 `inheritAttrs: false`，外部属性被应用两次

### 🚀 Quality

- **无障碍**：Switch 添加 `role="switch"` + `aria-checked`；Pagination 输入框添加 `aria-label`；Hero `<section>` 添加 `aria-labelledby`；所有键盘交互组件添加 `:focus-visible` 焦点样式
- **Form provide 响应式**：`provide()` 值用 `computed()` 包装，`FormItem` 正确反映父组件变化
- **Tabs 单向 watch**：替换双向 watch 为单向 external→internal + 直接 `modelValue` 同步
- **useOverlayComponent 动态选项**：`enableEsc`/`enableFocusTrap` 支持 getter，挂载后 prop 变化可响应
- **useScrollLock trapFocus**：无可聚焦元素时 Tab 键不再逃逸浮层
- **构建优化**：`package.json` exports 校验脚本（verify-build 新增一致性检查）；移除 `check:size` 脚本简化流程
- **CSS 改进**：消除 Table `!important`；新增 `--ui-typography-size-lg`（18px）和 `--ui-overlay-scrim`（light/dark）token
- **测试**：449 个测试（32 文件），新增 Modal ESC 测试、Popover click-outside 测试、Dropdown/useMenuKeyboard 测试；Form/Table 补充 `resetConfig()` 清理

### 📝 Documentation

- **文档全面更新**：新增 Dropdown 组件文档（6 个交互示例 + 键盘导航 + API）；`design-tokens.md` 补充新 token；`install.md` 新增 TypeScript 类型章节；7 篇组件文档修正（popover `delay`→`showDelay`、card `as` 类型收窄、tabs 键盘导航、message/toast 默认图标等）

## [1.5.0] - 2026-08-06

### 🐛 Bug Fixes

- **Divider typo**: `hasDefaul` → `hasDefault` (variable/computed/template)
- **Button empty label rendering**: `label=""` no longer renders an empty `.mg-button-label` container (icon-only button scenarios); covered by new test assertion

### 🚀 New Features

- **`useForm` form validation composable**: Leverages HTML5 Constraint Validation (`required`/`email`/`min`/`pattern` etc. already native) instead of reimplementing it; only fills 4 gaps native API can't cover — centralized state (`values`/`errors`/`valid`), async validation (remote uniqueness), cross-field validation (confirm password), validation orchestration (`validate`/`validateField`/`reset`). Zero-dependency, 19 unit tests
- **Select multiple selection**: New `multiple` prop (pairs with `filterable`); tag chips with remove buttons, continuous multi-select (dropdown stays open after selection), keyboard-friendly (Enter selects without closing / Esc closes), `change` always emits array in multiple mode. 8 unit tests
- **Table row selection**: New `selectable` prop + `v-model:selected-rows`; header select-all with `indeterminate` half-check, `row-selectable` for disabling rows, `row-key` keeps selection stable across sorting. 9 unit tests
- **`Form` / `FormItem` view-layer components**: Layout container + per-field label/required-asterisk/error/validating display, fully driven by `useForm` (no duplicated validation logic); both together ~1KB gzipped. 14 unit tests

### 🚀 Quality

- **Accessibility overhaul (WAI-ARIA Patterns)**: Tooltip adds `aria-describedby` + keyboard focus trigger; Select adds per-option unique `id` + `aria-activedescendant`; Table sort headers expose `aria-sort` with keyboard support; Modal/Drawer add `aria-describedby` linking body content; Tabs add full keyboard navigation (`←`/`→`/Home/End) — all IDs SSR-safe via `useId()`
- **SSR hardening**: `useScrollLock` exported helpers guard against non-browser environments; `Message`/`Toast` skip timer creation during SSR rendering
- **Code deduplication**: Extracted `useNotification` (Message/Toast) and `useFormField` (Input/Textarea) composables; Select state-reset logic refactored into shared helpers
- **Test suite expanded to 395 tests**: Coverage raised from 78.85% to 95%+ (statements `76→90`, branches `65→80`, functions `76→90`, lines `78→92`)
- **Playwright e2e smoke suite**: 14 real-browser tests covering all 25 components (rendering + key interactions), using system Google Chrome via `channel: 'chrome'`; new `pnpm test:e2e` / `test:e2e:install` scripts
- **Table sort icon fix**: Sort indicator classes now use reactive `currentSortKey`/`currentSortOrder` instead of raw props
- **Docs accuracy fixes**: Tooltip/Table/Select docs updated to reflect new keyboard & accessibility behavior

### 📝 Documentation

- New `docs/guide/form-validation.md` guide: HTML5-native-first validation philosophy + `useForm` API reference
- Select docs updated with multiple-selection examples; Table docs updated with row-selection examples

## [1.4.1] - 2026-08-06

### 🐛 Bug Fixes

- **Card missing `mg-card` base class**: Card background/radius/overflow styles never applied; fixed and covered by new test assertion
- **Tabs ARIA id mismatch**: Tab buttons lacked `id="mg-tab-{index}"`, breaking panels' `aria-labelledby` association; fixed
- **Select accessibility deficiencies**: Options lacked `role="option"`/`aria-selected`, dropdown lacked `role="listbox"`, form/aria attrs bound to wrapper instead of native element (axe violations) — all fixed
- **SSR test used outdated Pagination props**: `{ total, currentPage }` → `{ totalPages, modelValue }`

### ✨ Improvements

- **Enable TypeScript strict mode**, improving overall type quality; fixed tsconfig.app.json (removed uninstalled `@vue/tsconfig` reference)
- **Extract `useOverlayComponent` composable**: Unified Modal/Drawer open/close events, title ID, attribute passthrough, scroll lock/ESC/focus trap logic
- **Select removes 200ms hardcoded delay**: Uses browser event ordering — clicking an option keeps dropdown open, clicking outside closes immediately
- **Modal/Drawer remove double type assertion**: Shared composable directly accepts type-safe `Ref<boolean>`
- **Extract shared types to `src/types/components.ts`**: Eliminated duplicate type definitions across 18 components (`Size`/`Placement`/`NotificationType` etc.)
- **axe-core accessibility coverage expanded to 13 components**: WCAG checks, violations fail the test
- **Global CSS reset made opt-in**: New `moongate-vue/reset.css` (only `box-sizing`), zero impact on consumer styles by default
- **README adds browser support declaration**: Aligns with VitePress baseline (Chrome 111+/Firefox 113+/Edge 111+/Safari 16.2+)

### 🔧 Build

- **Dockerfile pins pnpm version**: `pnpm@latest` → `pnpm@11.15.1`
- **package.json adds `engines` field**: Declares `node >= 20.0.0` and `pnpm >= 9.0.0`
- **colors.css source comment updated**: Points to the upstream moongate-theme project path

<details>
<summary>[1.4.0] - 2026-08-05</summary>

### 🐛 Bug Fixes

- **Input `change` event lost**: Component declared `change` emit but template missed `@change` binding, causing the event to be "swallowed" — discovered and fixed by new unit tests
- **createOverlay shared container orphan reference**: Module-level `Map` cache didn't check `isConnected`, could return detached orphan nodes
- **Modal / Drawer scroll lock conflict**: Closing any one of multiple open instances restored body scrolling; extracted `useScrollLock` composable — scroll restores only when the last instance closes
- **Button missing default `type="button"`**: Using `<Button>` in a form defaulted to `submit` causing unintended submission; now defaults to `type="button"` with explicit override support
- **Modal missing ESC key close**: Inconsistent with Drawer; now unified through `useOverlayBehavior`
- **Select type safety**: `options`, `getLabel` etc. used `any`; switched to `SelectOption`/`SelectValue` union types, `labelKey`/`valueKey` now type-safe

### 🚀 New Features

- **Message / Toast stacking**: Based on `createOverlay` shared container mechanism, changed from "replaces previous" to "stacks multiple"; also removed inner `<Teleport>`, unified container and animation timing via `createOverlay` (⚠️ breaking: callers relying on exclusivity must manually close existing instances)
- **New `createOverlay` / `closeAllOverlays` / `destroyAllOverlays` composables**: Reusable tools for dynamic overlay mounting, unified `close()` API with SSR safety and synchronous cleanup
- **Table adds `row-key` prop**: Uses stable key instead of index during sorting
- **On-demand exports (Tree-shaking friendly)**: 25 independent component entries (`moongate-vue/button` etc.), per-component `.mjs` files; main entry `moongate-vue` remains compatible
- **Modal / Drawer accessibility & focus management**: Focus trap (keyboard Tab cycles within), `aria-labelledby` dynamic title association, customizable `closeAriaLabel`
- **CI/CD workflow**: Added GitHub Actions running lint, type check, format check, coverage tests and build on Node 20/22

### ✨ Improvements

- **SSR compatibility enhancement**: Modal/Drawer switched to `useId()` (Vue 3.5+ SSR-safe ID) replacing `Math.random()`; added `renderToString` regression tests for all 25 components
- **Popover / Tooltip performance optimization**: Global `MutationObserver` → `ResizeObserver`, only observing own size changes when visible
- **Code standards & engineering**: ESLint + Prettier unified style, husky + lint-staged pre-commit checks, `defineSlots` types for Button/Toast/Modal/Drawer
- **Test infrastructure established**: Vitest + jsdom, covering all 25 components, 5 composables and SSR regression tests, 212 test cases, ~78.85% coverage
- **Style cleanup**: Removed duplicate `table.css` import in `index.css`; `.gitignore` ignores `coverage/` and `assets/` payment images

### ⚠️ Breaking Changes

- **Minimum Vue version**: Raised from `^3.3.0` to **`^3.5.0`** (`useId` for SSR-safe IDs); Vue 3.0 - 3.4 users should use `moongate-vue@1.2.x`
- **Button type behavior change**: Default `type` changed from submit to `button`; explicitly pass `type="submit"` for form submission
- **Message / Toast behavior change**: See New Features above
- **On-demand export paths**: Added subpath exports, main entry remains compatible (see New Features above)

### 📝 Documentation

- README version requirement updated to Vue `^3.5.0`

### 🔧 Build

- `@types/node` moved to `devDependencies` (preserving zero-dependency promise); `main` field corrected to `./dist/index.mjs`
- Added `.dockerignore`, `pnpm-workspace.yaml`, `lint`/`format`/`prepare` scripts
- **Packaging hardening**: Added `clean` script (cleans dist before build), `prepublishOnly` (auto "build + test" before publish), unified to pnpm

</details>

<details>
<summary>[1.3.1] - 2026-06-19</summary>

### 🐛 Bug Fixes

- **SSR compatibility**: Fixed `document`/`window` access errors in Modal, Drawer, Popover, Tooltip etc. during server-side rendering
- **Toast / Message**: Imperative calls fail silently in SSR environment instead of throwing errors

</details>

<details>
<summary>[1.3.0] - 2026-06-19</summary>

### 🚀 New Features

- **All form components** (`Checkbox`/`Radio`/`Switch`/`Input`/`Textarea`/`Select`) refactored v-model implementation with `defineModel`, cleaner code and safer types
- `Button`: Added `showLabelWhileLoading` and `loadingLabel` props, optionally retain text while loading

### ✨ Improvements

- **Toast / Message**: Use Vue `<Transition>` to manage enter/leave animations; auto-close timers properly cleaned up on unmount, preventing memory leaks
- **Drawer**: Supports ESC key close, improved accessibility
- Reduced redundant reactive state, improved code maintainability

### ⚠️ Breaking Changes

- **Pagination**: v-model usage changed from `v-model:current-page` to `v-model` (old usage no longer compatible)
- **Minimum Vue version**: Raised from `^3.0.0` to `^3.3.0` (`defineModel` requires Vue 3.3+ compiler support)

### 📝 Documentation

- Removed `update:modelValue` event docs from Props tables (auto-handled by defineModel); Pagination docs updated to `v-model` shorthand

</details>

<details>
<summary>[1.2.1] - 2026-06-08</summary>

### 🔧 Build

- Added npm package keywords (`keywords`), improving discoverability in npm search

</details>

<details>
<summary>[1.2.0] - 2026-06-07</summary>

### 🎉 New Features

- Added VitePress documentation site (`vue.moongate.top`)

### 🐛 Bug Fixes

- All components add `defineOptions({ name, inheritAttrs: false })`
- Removed install

### 📝 Documentation

- Added 25 component API docs and design token docs

### 🔧 Build

- Removed global install function `install`, component library supports on-demand imports only
- Optimized build config (`vite build && tsc --emitDeclarationOnly`); completed `package.json` export config
- Configured Alibaba Cloud ACR image registry and GitHub Actions CI/CD pipeline

</details>

<details>
<summary>[1.1.0] - 2026-06-02</summary>

### 🚀 New Features

- Added Table component
- Pagination component supports quick jump to first/last page
- Select component supports search filtering (`filterable` prop)

</details>

<details>
<summary>[1.0.0] - 2026-06-01</summary>

### 🎉 Initial Release

- Released 24 base components, 2 style components
- Light/dark theme support
- Zero dependencies, 10KB bundle size

</details>
