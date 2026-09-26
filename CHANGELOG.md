# Changelog

**English** | [中文](./CHANGELOG.zh-CN.md)

## [1.7.1] - 2026-09-26

### 🐛 Bug Fixes

- **Button's `sm` size did not exist, and `size` now defaults to `md`**: `.mg-button` hardcoded the `md` tier while `.mg-button-sm` and `.mg-button-md` were byte-for-byte identical, so `size="sm"` had no visual effect. The three tiers are now distinct (`padding` xs+sm / sm+md / md+lg; `font-size` `size-small`/`size-body`/`size-lg` — existing tokens only), and the base rule matches the prop default `md`, like the rest of the library. Measured heights (Chromium): sm 25px / md 37px / lg 49px. **Consumers that never passed `size` see no change**; `size="sm"`/`"md"`/`"lg"` (35/45/57px before) now match their names.
- **Control heights were decided by the host page's `line-height`** (Button / Input / Textarea / Badge / Select / Tabs / Pagination): none of these leaf rules declared `line-height` (and `Input`/`Textarea`/`Select` declared no `font-size` either) — VitePress rendered a 42px input and a 40px badge, **taller than the 37px default button**. Every interactive leaf rule now declares `line-height: 1.4` plus an explicit `font-size`; all tiers sit in one 37–39px band in both hosts (input-family controls stay 2px above Button because of their 1px border)
- **Tier alignment across controls**: `Input`/`Textarea` base rules used `padding: var(--ui-spacing-sm)` with no `font-size`, so a default input (33px) did not match its own `size="md"` (35px) — both are now the `md` tier; `Badge`'s `md` tier used `--ui-typography-size-code` (13px) instead of `size-body` (15px) like every other component; `Dropdown`'s `md` tier styled nothing (only `min-width`), so md items silently relied on the base rule
- **Dead class hooks removed**: `Card` rendered `mg-card--body-hidden` (no CSS) while the defined `.mg-card-footer--no-border` was never applied — `hideBody` now removes the footer's top border; `FormItem`'s `mg-form-item--error` / `--validating` and `Button`'s `mg-button-loading` had no CSS either and are gone

### 🧪 Engineering & Tests

- **New CSS-contract test suite** (`control-size-contract.test.ts`, backed by the new shared helper `src/__tests__/helpers/cssRules.ts`): every interactive leaf rule must declare `line-height`, a rule that declares `padding` must also declare `font-size`, base tier == default tier, and all three Dropdown tiers style their items
- **Button size-ladder assertions** (`button-size-ladder.test.ts`, `Button.test.ts`) plus a Playwright case that renders the `md` tier of Button / Input / Textarea / Select / Badge in one container and requires the spread to stay ≤ 4px

### 📝 Docs

- **`<Input label="…" />` examples were wrong**: `Input` has no `label` prop — the attribute was forwarded to `<input>` and rendered no visible label; examples now use `<label for>`

### 🎨 Design Tokens (sync from moongate-theme 2.7.1)

- `src/styles/tokens/colors.css` refreshed from the theme semantic layer: light text hierarchy de-collapsed — `comment` → `#55647c`, `textMuted`/`operator` → `#64748b`, `textInactive` → `#7a8c9e`; light ANSI white/bright colors are now readable ink grays (≥3:1, white ≥4.5:1)
- New semantic roles exported: `--ui-primary-solid`, `--ui-selection-foreground`, `--ui-code-dim` (theme 2.7.1 dark interactive-contrast fix)
- Component fallbacks aligned (`--ui-text-inactive` in `series-nav.css` / `switch.css` → `#7a8c9e`); `docs/guide/design-tokens.md` table updated
- `check-tokens.ts` and full build pass; `dist/style.css` rebuilt (dark-mode colors effectively unchanged)

<details>
<summary>## [1.7.0] - 2026-09-06</summary>

### 🚀 New Features

- **`SeriesNav` series navigation component**: ordered list for "article series / table of contents" — numbering, current-part highlight (`aria-current`), and one "N more parts…" collapse that always keeps first/last/active. Pure presentational (no sorting or data injection); 5 props, `#item`/`#title` slots, SSR-safe, axe-clean, plus types and a `'moongate-vue/series-nav'` entry
- **Tooltip positioning switched to JS (`useFloating`)**: CSS Anchor Positioning dropped — `anchor()` is outside the declared browser baseline and mispositioned on Firefox/old Safari; JS positioning adds viewport flipping and `awaitNextTick` calibration
- **Tooltip new `hideDelay` prop** (default 100ms, aligned with Popover)
- **Select dropdown Teleport**: moved from `position:absolute` (clipped by `overflow` ancestors) to Teleport-to-body + fixed positioning with JS-computed coordinates, following scroll/resize — same strategy as Dropdown/Popover
- **Select keyboard Home/End**: first/last option shortcuts (WAI-ARIA listbox keyboard convention)
- **`prefers-reduced-motion` support**: keyframe animations (message/toast/skeleton/button) disabled and overlay show-hide transitions (Modal/Drawer/Dropdown/Popover/Tooltip/Select) reduced to none, while hover color transitions are preserved
- **Basic RTL support**: toast container side, message/toast accent-border side, select (native + filterable) arrow & input padding mirrored under `[dir="rtl"]`

### 🐛 Bug Fixes

- **Tooltip never visible on hover**: floating layer never bound `mg-tooltip-visible`, so `opacity: 0` kept it permanently invisible (present before this version; jsdom unit tests missed the visual); binding added + visibility assertions
- **Modal/Drawer focus not returned to trigger on close** (WCAG 2.4.3): useScrollLock records the focused element on open and safely restores focus on close (`isConnected`/disabled guards)
- **`useAttrsWithClass` non-reactive passthrough**: `attrsWithoutClass` was a setup snapshot — later changes to `id`/`data-*`/`style` from the parent never reached the root element; now read reactively on demand
- **Select `aria-activedescendant` bound to the wrong element**: was on the listbox container instead of the focused input (screen readers miss it); moved to the input and removed the redundant listbox binding
- **Select Tab couldn't close the dropdown**: stale `mousedownInside=true` made blur be treated as "clicked an option", so the dropdown stayed open; reset on open
- **CSS semantic tokens tightened**: tooltip now uses the dedicated `--ui-surface-tooltip`, skeleton highlight `--ui-fill-medium`, switch thumb a neutral color, stale fallbacks synced, hardcoded `white` in button/checkbox/switch replaced with `--ui-white`
- **Dropdown trigger ARIA semantics fixed**: the wrapper no longer declares `role="button"`/`aria-expanded` (axe `aria-allowed-attr` without a role, `nested-interactive` with one around a real button); `role="menu"` plus the slot's own trigger now carry the semantics
- **Toast/Message missing announcement roles**: Message now renders `role="alert"`; Toast renders `role="status"` (`role="alert"` for `error` type) so screen readers announce notifications

### 🎨 Design Tokens

- **New `--ui-overlay-scrim` token** (light `#00000080` / dark `#000000b3`) via the moongate-theme semantic-layer generator
- **Typography tiers completed**: `--ui-typography-size-xl` (24px), `-title` (20px), `-display/-display-lg/-display-xl` (40/48/60px); modal/drawer titles, close buttons, message icons and hero titles migrated from hardcoded sizes to tokens
- **Semantic layer consumer annotations** added (hoverBg/selectedBg/surfaceFloating/borderFloating/fill family), clarifying workbench vs component-library ownership

### 🧪 Engineering & Tests

- **New `scripts/check-tokens.ts`**: every `var(--ui-*)` reference must be defined and its fallback must match the token (light/dark segments, duration units normalized); orphan tokens warn only. Runs on every `pnpm build` via `verify:build`
- **e2e keyboard/focus coverage**: added `select-keyboard.spec.ts` (activedescendant follows arrows, Home/End, no out-of-range after filtering, Enter/Esc/Tab) and `modal-focus.spec.ts` (focus enters dialog on open, returns to trigger on close)
- **Code de-duplication**: shared `isBrowser` constant (`src/utils/env.ts`) unifying 5 environment checks, and a `useClickOutside` composable unifying Popover/Dropdown listeners (~50 lines removed)
- **Scripts migrated to TypeScript**: `component-list` / `verify-build` / `clean-dts` / `check-tokens` are now `.ts`, run natively by Node.js 24 type-stripping — zero new dependencies
- **axe coverage completed**: Badge/Card/Container/Divider/Footer/Header/Hero/Main/Skeleton/Form/FormItem plus Dropdown (closed + open) — every component is now scanned; the FormItem case asserts `aria-describedby` resolves to the error element

### 📝 Docs

- New `series-nav.md` and `guide/accessibility.md` (WCAG 2.1 AA statement, keyboard-interaction table, reduced-motion / RTL matrix, Dropdown-trigger and Skeleton guidance)
- `tooltip.md` adds `hideDelay`; `design-tokens.md` adds the new token values; the "2-8 props per component" claim corrected (Button/Select have 11, with the rationale documented)
- Repeated style-import, native-validation and SSR notes consolidated into `install` / `philosophy`, each feature doc keeping only operational content

</details>

---

<details>
<summary>## [1.6.0] - 2026-08-18</summary>

### 🚀 New Features

- **Dropdown component**: click-triggered action menu with keyboard navigation (↑↓ Home End Enter Escape TypeAhead), dividers, danger highlighting, 9 placements, controlled `v-model:open`, and `role="menu"`/`role="menuitem"` semantics — plus the reusable `useMenuKeyboard` composable and `DropdownPlacement`/`DropdownOption` types
- **`setConfig` global text configuration**: Built-in texts auto-adapt to Chinese/English; `setConfig({ locale: 'en-US' })` switches language, `setConfig({ texts: {...} })` partially overrides; priority: **component prop > setConfig > built-in texts**, mounted components update reactively
- **Component Props type exports**: every component's Props type (`ButtonProps`, `TableProps`, …) is importable from `'moongate-vue'`; generic components (Table/Form) keep their types in standalone `.ts` files to avoid shim conflicts; adds `MenuItemBase`, `disposeConfig()`, `getDefaultIcon()`
- **Message/Toast default type icons**: Each notification type auto-displays a default icon (✓ ✗ ⚠ ℹ), overridable via `icon` prop or `#icon` slot
- **FormItem `for` prop**: Optional `for` prop to associate label with input, supporting click-to-focus
- **`disposeConfig()` export**: Disconnects MutationObserver listener, suitable for SSR cleanup and test teardown
- **Tooltip/Popover Escape key close + click-outside**: Both components support Escape key close; Popover adds click-outside-area auto-close

### 🐛 Bug Fixes

- **Table indeterminate state not working**: `:indeterminate` is a DOM property not an HTML attribute, Vue `:attr` binding can't set it; switched to template ref + watch
- **Drawer click-through**: Overlay click event lacked `.self` modifier, causing clicks on drawer content area to unexpectedly close it
- **Popover double attribute binding**: Missing `inheritAttrs: false`, external attributes applied twice

### 🚀 Quality

- **Accessibility**: Switch adds `role="switch"` + `aria-checked`; Pagination input adds `aria-label`; Hero `<section>` adds `aria-labelledby`; all keyboard-interactive components add `:focus-visible` focus styles
- **Form provide reactivity**: `provide()` values wrapped with `computed()`, `FormItem` correctly reflects parent changes
- **Tabs unidirectional watch**: Replaced bidirectional watch with unidirectional external→internal + direct `modelValue` sync
- **useOverlayComponent dynamic options**: `enableEsc`/`enableFocusTrap` support getters, prop changes after mount are reactive
- **useScrollLock trapFocus**: Tab key no longer escapes overlay when no focusable elements exist
- **Build optimization**: `package.json` exports verification script (verify-build adds consistency checks); removed `check:size` script to simplify workflow
- **CSS improvements**: eliminated Table `!important`; added `--ui-typography-size-lg` (18px)
- **Tests**: added Modal ESC, Popover click-outside and Dropdown/useMenuKeyboard cases; Form/Table add `resetConfig()` cleanup

### 📝 Documentation

- New Dropdown docs (6 interactive examples + keyboard navigation + API); `design-tokens.md` adds the new tokens; `install.md` adds a TypeScript types section; 7 component docs corrected (popover `delay`→`showDelay`, card `as` narrowing, tabs keyboard navigation, message/toast default icons, …)

</details>

---

<details>
<summary>## [1.5.0] - 2026-08-06</summary>

### 🐛 Bug Fixes

- **Divider typo**: `hasDefaul` → `hasDefault` (variable/computed/template, three places)
- **Button empty label rendering**: `label=""` no longer renders an empty `.mg-button-label` container (icon-only button scenarios); covered by new test assertion

### 🚀 New Features

- **`useForm` form validation composable**: Leverages HTML5 Constraint Validation (`required`/`email`/`min`/`pattern` etc. already native) instead of reimplementing it; only fills 4 gaps native API can't cover — centralized state (`values`/`errors`/`valid`), async validation (remote uniqueness), cross-field validation (confirm password), validation orchestration (`validate`/`validateField`/`reset`). Zero-dependency
- **Select multiple selection**: New `multiple` prop (pairs with `filterable`); tag chips with remove buttons, continuous multi-select (dropdown stays open after selection), keyboard-friendly (Enter selects without closing / Esc closes), `change` always emits array in multiple mode
- **Table row selection**: New `selectable` prop + `v-model:selected-rows`; header select-all with `indeterminate` half-check, `row-selectable` for disabling rows, `row-key` keeps selection stable across sorting
- **`Form` / `FormItem` view-layer components**: Layout container + per-field label/required-asterisk/error/validating display, fully driven by `useForm` (no duplicated validation logic); both together ~1KB gzipped

### 🚀 Quality

- **Accessibility overhaul (WAI-ARIA Patterns)**: Tooltip adds `aria-describedby` + keyboard focus trigger; Select adds per-option unique `id` + `aria-activedescendant`; Table sort headers expose `aria-sort` with keyboard support; Modal/Drawer add `aria-describedby` linking body content; Tabs add full keyboard navigation (`←`/`→`/Home/End) — all IDs SSR-safe via `useId()`
- **SSR hardening**: `useScrollLock` exported helpers guard against non-browser environments; `Message`/`Toast` skip timer creation during SSR rendering
- **Code deduplication**: Extracted `useNotification` (Message/Toast) and `useFormField` (Input/Textarea) composables; Select state-reset logic refactored into shared helpers
- **Test suite expanded**: coverage raised from 78.85% to 95%+ statements (branches/functions/lines all moved up by ~15 points)
- **Playwright e2e smoke suite introduced**: real-browser rendering + interaction tests for every component, using system Google Chrome via `channel: 'chrome'`; new `pnpm test:e2e` / `test:e2e:install` scripts
- **Table sort icon fix**: Sort indicator classes now use reactive `currentSortKey`/`currentSortOrder` instead of raw props
- **Docs**: new `guide/form-validation.md` (HTML5-native-first validation + `useForm` API); Select/Table docs cover multiple- and row-selection; Tooltip/Table/Select docs aligned with the new keyboard behavior

</details>

---

<details>
<summary>## [1.4.1] - 2026-08-06</summary>

### 🐛 Bug Fixes

- **Card missing `mg-card` base class**: Card background/radius/overflow styles never applied; fixed and covered by new test assertion
- **Tabs ARIA id mismatch**: Tab buttons lacked `id="mg-tab-{index}"`, breaking panels' `aria-labelledby` association; fixed
- **Select accessibility**: options lacked `role="option"`/`aria-selected`, the dropdown lacked `role="listbox"`, and form/ARIA attributes were bound to the wrapper instead of the native element (axe violations) — all fixed
- **SSR test used outdated Pagination props**: `{ total, currentPage }` → `{ totalPages, modelValue }`

### ✨ Improvements

- **TypeScript strict mode enabled**; `tsconfig.app.json` fixed (dropped an uninstalled `@vue/tsconfig` reference)
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

</details>

---

<details>
<summary>## [1.4.0] - 2026-08-05</summary>

### 🐛 Bug Fixes

- **Input `change` event lost**: Component declared `change` emit but template missed `@change` binding, causing the event to be "swallowed" — discovered and fixed by new unit tests
- **createOverlay shared container orphan reference**: Module-level `Map` cache didn't check `isConnected`, could return detached orphan nodes
- **Modal / Drawer scroll lock conflict**: Closing any one of multiple open instances restored body scrolling; extracted `useScrollLock` composable — scroll restores only when the last instance closes
- **Modal missing ESC key close**: Inconsistent with Drawer; now unified through `useOverlayBehavior`
- **Select type safety**: `options`, `getLabel` etc. used `any`; switched to `SelectOption`/`SelectValue` union types, `labelKey`/`valueKey` now type-safe

### 🚀 New Features

- **Message / Toast stacking**: Based on `createOverlay` shared container mechanism, changed from "replaces previous" to "stacks multiple"; also removed inner `<Teleport>`, unified container and animation timing via `createOverlay` (⚠️ breaking: callers relying on exclusivity must manually close existing instances)
- **New `createOverlay` / `closeAllOverlays` / `destroyAllOverlays` composables**: Reusable tools for dynamic overlay mounting, unified `close()` API with SSR safety and synchronous cleanup
- **Table adds `row-key` prop**: Uses stable key instead of index during sorting, avoiding DOM reuse issues
- **On-demand exports (Tree-shaking friendly)**: 25 independent component entries (`moongate-vue/button` etc.), per-component `.mjs` files; main entry `moongate-vue` remains compatible
- **Modal / Drawer accessibility & focus management**: Focus trap (keyboard Tab cycles within), `aria-labelledby` dynamic title association, customizable `closeAriaLabel`
- **CI/CD workflow**: Added GitHub Actions running lint, type check, format check, coverage tests and build on Node 20/22

### ✨ Improvements

- **SSR compatibility enhancement**: Modal/Drawer switched to `useId()` (Vue 3.5+ SSR-safe ID) replacing `Math.random()`; added `renderToString` regression tests for all 25 components
- **Popover / Tooltip performance optimization**: Global `MutationObserver` → `ResizeObserver`, only observing own size changes when visible
- **Test and code-quality infrastructure established**: Vitest + jsdom over every component plus composables and SSR regression, ESLint + Prettier with husky/lint-staged pre-commit checks, and `defineSlots` types for Button/Toast/Modal/Drawer
- **Style cleanup**: Removed duplicate `table.css` import in `index.css`; `.gitignore` ignores `coverage/` and `assets/` payment images

### ⚠️ Breaking Changes

- **Minimum Vue version**: Raised from `^3.3.0` to **`^3.5.0`** (`useId` for SSR-safe IDs); Vue 3.0 - 3.4 users should use `moongate-vue@1.2.x`
- **Button default `type`**: changed from `submit` to `button` (using `<Button>` in a form no longer submits it); pass `type="submit"` explicitly

### 📝 Documentation

- README version requirement updated to Vue `^3.5.0`

### 🔧 Build

- `@types/node` moved to `devDependencies` (preserving zero-dependency promise); `main` field corrected to `./dist/index.mjs`
- Added `.dockerignore`, `pnpm-workspace.yaml`, `lint`/`format`/`prepare` scripts
- **Packaging hardening**: Added `clean` script (cleans dist before build), `prepublishOnly` (auto "build + test" before publish), unified to pnpm

</details>

---

<details>
<summary>## [1.3.1] - 2026-06-19</summary>

### 🐛 Bug Fixes

- **SSR compatibility**: Modal / Drawer / Popover / Tooltip threw on `document`/`window` access during server-side rendering; imperative `Toast`/`Message` calls now fail silently instead of throwing (replaced by real guards in 1.4.0)

</details>

---

<details>
<summary>## [1.3.0] - 2026-06-19</summary>

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

---

<details>
<summary>## [1.2.1] - 2026-06-08</summary>

### 🔧 Build

- Added npm package keywords (`keywords`), improving discoverability in npm search

</details>

---

<details>
<summary>## [1.2.0] - 2026-06-07</summary>

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

---

<details>
<summary>## [1.1.0] - 2026-06-02</summary>

### 🚀 New Features

- Added Table component
- Pagination component supports quick jump to first/last page
- Select component supports search filtering (`filterable` prop)

</details>

---

<details>
<summary>## [1.0.0] - 2026-06-01</summary>

### 🎉 Initial Release

- Released 24 base components, 2 style components
- Light/dark theme support
- Zero dependencies, 10KB bundle size

</details>
