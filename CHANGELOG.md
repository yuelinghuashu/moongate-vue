# Changelog

**English** | [中文](./CHANGELOG.zh-CN.md)

## [1.4.1] - 2026-08-06

### 🐛 Bug Fixes

- **Card missing `mg-card` base class**: `mergedClass` only included dynamic classes (`mg-card-hoverable`/`mg-card--body-hidden`), missing the hardcoded `mg-card` base class — card background/radius/overflow styles never applied; fixed and covered by new test assertion
- **Tabs ARIA id mismatch**: Tab buttons lacked `id="mg-tab-{index}"` while panels' `aria-labelledby` referenced it — broken association for screen readers; fixed and covered by new aria tests
- **Select accessibility deficiencies**: Options lacked `role="option"`/`aria-selected`, dropdown lacked `role="listbox"`, and `aria-label`/`name`/`id` were bound to the outer wrapper instead of the actual `<input>`/`<select>` (axe flags `aria-input-field-name`/`label`) — all fixed; form/aria attrs now pass through to the native element, listbox reuses the accessible name
- **SSR test used outdated Pagination props**: `{ total, currentPage }` → `{ totalPages, modelValue }`, eliminating missing-required-prop warnings

### ✨ Improvements

- **Enable TypeScript strict mode**: `tsconfig.json` changed from `strict: false` to `strict: true`, improving overall type quality of the component library
- **Fix tsconfig.app.json**: Removed reference to the uninstalled `@vue/tsconfig` package, replaced with a self-contained config, fixing editor type-check errors
- **Extract `useOverlayComponent` composable**: Unified Modal/Drawer open/close event emission, title ID, attribute passthrough, scroll lock/ESC/focus trap logic, reducing ~40 lines of duplicate code per component
- **Select removes 200ms hardcoded delay**: Uses browser event ordering (`mousedown` → `blur` → `click`) instead — clicking an option keeps the dropdown open, clicking outside closes it immediately, faster and race-free
- **Modal/Drawer remove double type assertion**: `modelValue as unknown as Ref<boolean>` no longer needed; shared composable directly accepts type-safe `Ref<boolean>`
- **Extract shared types to `src/types/components.ts`**: Eliminated duplicate type definitions across 18 components (`Size`/`Placement`/`NotificationType`/`AddonColor`/`InputType` etc.), unified API type consistency across the library
- **Expand axe-core accessibility coverage to 13 components**: `a11y.test.ts` now covers Button/Checkbox/Input/Textarea/Select (native + searchable)/Tabs/Table/Pagination/Modal/Drawer/Tooltip/Popover with WCAG checks — violations fail the test; `region` rule disabled in unit tests as a testing-environment artifact
- **Global CSS reset made opt-in**: Removed the aggressive `* { margin: 0; padding: 0 }` + `ul/ol` reset from the default `style.css` (was forced on all consumers). New optional `moongate-vue/reset.css` entry provides a modern, non-invasive reset (only `box-sizing: border-box`), keeping browser-default margins/paddings intact — zero impact on consumer styles by default
- **README adds browser support declaration**: Aligns with VitePress baseline (Chrome 111+/Firefox 113+/Edge 111+/Safari 16.2+), with notes on `field-sizing: content` auto-grow browser requirements for Textarea

### 🔧 Build

- **Dockerfile pins pnpm version**: `pnpm@latest` → `pnpm@11.15.1`, consistent with `packageManager`, eliminating non-reproducible builds
- **package.json adds `engines` field**: Declares `node >= 20.0.0` and `pnpm >= 9.0.0`, clarifying runtime environment requirements
- **colors.css source comment updated**: Points to the upstream moongate-theme project path for traceability of auto-generated files

<details>
<summary>[1.4.0] - 2026-08-05</summary>

### 🐛 Bug Fixes

- **Input `change` event lost**: Component declared `change` emit but template missed `@change` binding, causing the event to be "swallowed" (neither emitted nor passed through) — discovered and fixed by new unit tests
- **createOverlay shared container orphan reference**: Module-level `Map` cache didn't check `isConnected`; after tests/apps cleared body, could return orphaned DOM nodes already detached
- **Modal / Drawer scroll lock conflict**: When multiple instances were open (multiple Modals, Modal + Drawer, etc.), closing any one restored body scrolling; introduced module-level counter, then extracted unified `useScrollLock` composable to share lock logic — scroll restores only when the last instance closes
- **Button missing default `type="button"`**: Original implementation didn't set `type`; using `<Button>` in a form defaulted to `submit` causing unintended submission. Now defaults to `type="button"` with support for explicit `submit`/`reset`
- **Modal missing ESC key close**: Drawer already supported ESC close but Modal didn't, inconsistent UX; now unified through `useOverlayBehavior`
- **Select heavy `any` types**: `options`, `getLabel`, `getValue` etc. used `any` causing type unsafety; switched to `SelectOption` union type and added `isOptionDisabled` helper

### 🚀 New Features

- **Message / Toast stacking**: Based on new `createOverlay` shared container mechanism, can display multiple messages/toasts concurrently (previously replaced the previous one)
- **New `createOverlay` / `closeAllOverlays` / `destroyAllOverlays` composables**: Reusable tools for dynamic overlay mounting, providing unified `close()` API with SSR safety and synchronous cleanup
- **Table adds `row-key` prop**: Uses stable key instead of index during sorting, avoiding DOM reuse issues
- **On-demand exports (Tree-shaking friendly)**: 25 independent component export entries (`moongate-vue/button`, `moongate-vue/table`, etc.), build produces per-component `.mjs` files, `package.json` exports supports all subpaths
- **Focus Trap**: Modal and Drawer keep keyboard Tab cycling within the component, can't escape the overlay
- **ARIA accessibility improvements**: Modal/Drawer add `aria-labelledby` dynamic title association, close button supports custom `closeAriaLabel`
- **CI/CD workflow**: Added GitHub Actions (with `pnpm test` and `build:types` steps), running lint, type check, format check, coverage tests and build on Node 20/22

### ✨ Improvements

- **Extract `useScrollLock` composable**: Unified Modal/Drawer body scroll locking, ESC close, focus trap logic, eliminating duplicate code
- **createOverlay import cleanup**: Removed unused `h`, `reactive` imports
- **Button/Toast/Modal/Drawer add `defineSlots` types**: Slot type safety
- **SSR compatibility enhancement**: Modal/Drawer switched to `useId()` (Vue 3.5+ built-in SSR-safe ID), replacing `Math.random()` to eliminate hydration mismatch warnings
- **Popover performance optimization**: Replaced global `MutationObserver` (watching entire body) with `ResizeObserver`, only observing its own size changes when visible
- **Tooltip performance optimization**: Replaced global `MutationObserver` (watching entire body) with `ResizeObserver`, only observing its own size changes when visible
- **New SSR regression tests**: Use `@vue/server-renderer` to `renderToString` all 25 components, preventing future changes from breaking SSR compatibility
- **Message / Toast decouple Teleport**: Removed inner `<Teleport>` from components, `createOverlay` unified container and leave-animation timing management
- **Code standards**: Introduced ESLint + Prettier, unified single-quote/no-semicolon style across the library, fixed 5 historical issues (Footer/Main missing `lang="ts"`, Table `prefer-const`, etc.)
- **Pre-commit hook**: husky + lint-staged, auto lint & format staged files before commit
- **Style cleanup**: Removed duplicate `table.css` import in `index.css`
- **Test infrastructure**: Vitest + jsdom, covering all 25 components, 5 composables and SSR regression tests, 212 test cases total, ~78.85% overall coverage
- **Coverage threshold raised**: statements/lines 60→76/78, branches 50→65, functions 60→76 (progressive target)
- **`.gitignore` improvement**: Ignore `coverage/` directory and `assets/` payment images
- **Select generic improvement**: Types narrowed from `any` to `SelectOption` / `SelectValue`, `labelKey`/`valueKey` type-safe

### ⚠️ Breaking Changes

- **Message / Toast behavior change**: From "replaces previous" to "stacks multiple". Callers relying on the old behavior (message exclusivity) can manually close existing instances before calling
- **Minimum Vue version**: Raised from `^3.3.0` to **`^3.5.0`** (`defineModel` requires Vue 3.4+, `useId` requires Vue 3.5+ for SSR-safe IDs); Vue 3.0 - 3.4 users should use `moongate-vue@1.2.x`
- **Button type behavior change**: Default `type` changed from (browser default) submit to `button`; if relying on `<Button>` submitting forms, explicitly pass `type="submit"`
- **On-demand export paths**: Added subpath exports `moongate-vue/button` etc., but main entry `moongate-vue` remains compatible

### 📝 Documentation

- README version requirement updated to Vue `^3.5.0`
- New blog post "Vue 3 Teleport Component Unit Testing Guide" (`docs/blog/`)

### 🔧 Build

- `@types/node` moved to `devDependencies` (preserving zero-dependency promise)
- `package.json` `main` field corrected to `./dist/index.mjs` (consistent with ESM output)
- Added `.dockerignore` to speed up Docker builds
- Added `pnpm-workspace.yaml` to resolve pnpm 11 build script approval issues
- Added `lint` / `format` / `prepare` scripts
- Build config supports multi-entry on-demand exports (vite.config.ts incremental entries)
- **Packaging hardening**: Added `clean` script (cleans dist before build to avoid stale artifacts), unified `build` to use pnpm (eliminating npm/pnpm mixing), added `prepublishOnly` running "build + test" safety check before publish

</details>

<details>
<summary>[1.3.1] - 2026-06-19</summary>

### 🐛 Bug Fixes

- **SSR compatibility**: Fixed `document is not defined` errors when Modal, Drawer, Popover, Tooltip etc. accessed `document` and `window` during server-side rendering
- **Toast / Message**: Imperative calls fail silently in SSR environment instead of throwing errors

</details>

<details>
<summary>[1.3.0] - 2026-06-19</summary>

### 🚀 New Features

- **All form components** (`Checkbox`, `Radio`, `Switch`, `Input`, `Textarea`, `Select`) refactored v-model implementation with `defineModel`, cleaner code and safer types
- `Button`: Added `showLabelWhileLoading` and `loadingLabel` props, optionally retain text while loading

### ✨ Improvements

- **Toast / Message animation optimization**: Use Vue built-in `<Transition>` component to manage enter/leave animations, no manual DOM removal timing needed
- **Drawer**: Supports ESC key close, improved accessibility
- **Toast / Message**: Auto-close timers properly cleaned up on component unmount, preventing memory leaks
- Reduced redundant reactive state, improved code maintainability

### ⚠️ Breaking Changes

- **Pagination**: v-model usage changed from `v-model:current-page` to `v-model` (old usage no longer compatible)
- **Minimum Vue version**: Raised from `^3.0.0` to `^3.3.0` (`defineModel` requires Vue 3.3+ compiler support)

### 📝 Documentation

- Removed `update:modelValue` event docs from Props tables (auto-handled by defineModel)
- Pagination documentation updated to `v-model` shorthand

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

- Added 25 component API docs
- Added design token docs

### 🔧 Build

- Removed global install function `install`, component library supports on-demand imports only, no longer provides `app.use()`
- Optimized build config, using `vite build && tsc --emitDeclarationOnly`
- Completed `package.json` export config (`exports`, `types`, `files`)
- Configured Alibaba Cloud ACR image registry
- Configured GitHub Actions CI/CD pipeline

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
