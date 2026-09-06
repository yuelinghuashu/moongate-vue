# 🌙 Moongate Vue

[![npm version](https://img.shields.io/npm/v/moongate-vue.svg)](https://www.npmjs.com/package/moongate-vue)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/moongate-vue)](https://bundlephobia.com/package/moongate-vue)
[![npm downloads](https://img.shields.io/npm/dm/moongate-vue.svg)](https://www.npmjs.com/package/moongate-vue)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

**English** | [**中文**](./README.zh-CN.md)

Moongate Vue is a moon-inspired, minimal Vue 3 component library. Design-token driven, CSS-first, framework-agnostic.

**The complete library stays under 25KB (JS + CSS gzipped combined)**. See the live [bundle size badge](https://bundlephobia.com/package/moongate-vue) above.

## Features

- 🌙 **Moon Philosophy** — Restrained, calm, orderly
- 📦 **Ultra Lightweight** — Complete library (JS + CSS) under **25KB** (gzipped)
- 🎨 **Design-Token Driven** — CSS variables based, effortless theme switching
- 🔧 **CSS-First** — Styles decoupled from logic, reusable across frameworks
- ✨ **Minimal API** — 2-8 props for most components (a few complex ones like Button/Select have more), easy to learn and use
- 🚀 **Zero Dependencies** — No extra configuration, works out of the box
- ⚡ **SSR Ready** — Perfect for Nuxt 4 / VitePress and other server-side rendering scenarios
- ✅ **Tested** — Vitest + jsdom full coverage: 29 components + 3 public composables (`useForm` / `useMessage` / `useToast`) + SSR/a11y regression + Playwright e2e (26 cases), 497 tests total (95% statements / 86% branches)
- 🔧 **Engineering Standards** — ESLint + Prettier unified style, husky pre-commit checks

## Installation

```bash
npm install moongate-vue
# or
pnpm add moongate-vue
```

> 💡 **Non-invasive styles**: The default `style.css` contains only component styles — it won't reset your global styles. Optionally import `moongate-vue/reset.css` to unify `box-sizing: border-box` across all elements.
>
> **Requirements**: Vue `^3.5.0` or higher. Browser support aligns with **VitePress** baseline (Chrome 111+ / Firefox 113+ / Edge 111+ / Safari 16.2+). See the [full install guide](./docs/guide/install.md) for details.

## Quick Start

```vue
<script setup>
import { Button, useMessage } from 'moongate-vue'
import 'moongate-vue/style.css'

const message = useMessage()
</script>

<template>
  <Button variant="filled" color="primary" @click="message.success('Welcome to Moongate')">
    Moonlight Button
  </Button>
</template>
```

## 📖 Documentation

Visit the [**Moongate Vue Official Documentation**](https://vue.moongate.top) for all component APIs, interactive examples, and the theming guide.

## Components

| Category        | Components                                                                   |
| --------------- | ---------------------------------------------------------------------------- |
| Basic           | `Button` `Card` `Badge` `Divider`                                            |
| Form            | `Form` `FormItem` `Input` `Textarea` `Checkbox` `Radio` `Switch` `Select`    |
| Data Display    | `Table` `Pagination` `Tabs` `SeriesNav`                                      |
| Layout          | `Container` `Header` `Main` `Footer` `Hero`                                  |
| Feedback        | `Modal` `Toast` `Message` `Tooltip` `Popover` `Drawer` `Skeleton` `Dropdown` |
| Style Utilities | `Link` `Code`                                                                |

> **Note**: **29 components + 2 style utilities** in total, covering most daily development scenarios.

## TypeScript Types

All components export their Props types, plus shared utility types:

```ts
import type {
  ButtonProps,
  TableProps,
  SelectValue,
  SelectOption,
  TabItem,
  DropdownOption,
  FormProps,
} from 'moongate-vue'

function renderTable<T>(props: TableProps<T>) {
  /* ... */
}
```

Full type list: every component's `XxxProps`, `TableColumn`/`SortParams`/`CellSlotProps`/`ColumnSlotProps`, `DropdownOption`/`DropdownPlacement`, `SelectValue`/`SelectOption`, `TabItem`, `FormProps`, `Config`/`LocaleTexts`, and composable types (`Rule`/`FieldRules`/`UseFormOptions`/`MenuItemBase`).

## Design Tokens

Moongate Vue is built on a complete design token system (`colors.css` and `layout.css`). Customize the theme by overriding CSS variables:

```css
:root {
  --ui-primary: #3b82f6;
  --ui-spacing-md: 12px;
}
```

See the [design tokens guide](https://vue.moongate.top/guide/design-tokens) for the full variable reference.

## Global Config

Built-in texts automatically adapt between Chinese and English based on `document.documentElement.lang` (binary detection: **non-Chinese `lang` defaults to English**). Override them globally via `setConfig`:

```ts
import { setConfig } from 'moongate-vue'

// Switch to English built-in texts
setConfig({ locale: 'en-US' })

// Override individual texts
setConfig({ texts: { empty: 'No data', paginationPrev: 'Prev' } })
```

Priority: **component prop > `setConfig` texts > built-in locale texts**. Template placeholders like `{current}`, `{total}`, and `{label}` are supported. Mounted components update reactively when config changes.

Covered display texts include: Pagination page info / prev-next / first-last, Select empty state / remove tag, Table empty state / select-all / row-select / row label fallback, FormItem validating, Modal / Drawer / Message / Toast close buttons, and `useForm` default validation message.

## Attribute Inheritance

All components pass through native attributes to the root element via `v-bind="$attrs"`:

- Input/Textarea pass through to the native input element
- Checkbox/Radio/Switch pass through to the hidden `<input>` (accessibility)
- Button passes through to the `<button>` element

> Inherited attributes will not override props already declared in the component; use the corresponding props (e.g., `disabled`, `size`) to override built-in behavior.

## License

[MIT](./LICENSE)

## Related Links

- [Design Philosophy](https://moongate.top/docs/design-tokens-vs-atomic-css)
- [Implementation Details](https://moongate.top/docs/css-first-component-library)
- [Bundlephobia Analysis](https://bundlephobia.com/package/moongate-vue)
- [Online Documentation](https://vue.moongate.top)

## ☕ Support

<details>
<summary>If Moongate Vue saved you development time, feel free to buy me a coffee ☕</summary>

<img src="./assets/ali-pay.jpg" width="200" height="280" alt="Alipay QR Code" />
<img src="./assets/wechat-pay.jpg" width="200" height="280" alt="WeChat QR Code" />

> Donations are used for component maintenance, new feature development, and documentation improvements. Thank you for every bit of kindness ❤️

</details>
