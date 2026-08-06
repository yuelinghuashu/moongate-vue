# 🌙 Moongate Vue

[![npm version](https://img.shields.io/npm/v/moongate-vue.svg)](https://www.npmjs.com/package/moongate-vue)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/moongate-vue)](https://bundlephobia.com/package/moongate-vue)
[![npm downloads](https://img.shields.io/npm/dm/moongate-vue.svg)](https://www.npmjs.com/package/moongate-vue)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

**English** | [**中文**](./README.zh-CN.md)

Moongate Vue is a moon-inspired, minimal Vue 3 component library. Design-token driven, CSS-first, framework-agnostic.

**The complete library is only 10KB (gzipped)** — over 10x lighter than mainstream component libraries.

## Features

- 🌙 **Moon Philosophy** — Restrained, calm, orderly
- 📦 **Ultra Lightweight** — Complete library only **10KB** (gzipped)
- 🎨 **Design-Token Driven** — CSS variables based, effortless theme switching
- 🔧 **CSS-First** — Styles decoupled from logic, reusable across frameworks
- ✨ **Minimal API** — 2-8 props per component, easy to learn and use
- 🚀 **Zero Dependencies** — No extra configuration, works out of the box
- ⚡ **SSR Ready** — Perfect for Nuxt 4 / VitePress and other server-side rendering scenarios
- ✅ **Tested** — Vitest + jsdom full coverage: 25 components + 2 public composables (`useMessage` / `useToast`) + SSR/a11y regression, 338 tests total (95% statements / 86% branches)
- 🔧 **Engineering Standards** — ESLint + Prettier unified style, husky pre-commit checks

## Installation

```bash
npm install moongate-vue
# or
pnpm add moongate-vue
```

> 💡 **Non-invasive styles**: The default `style.css` contains only component styles — it won't reset your global styles. Optionally import `moongate-vue/reset.css` to unify `box-sizing: border-box` across all elements.
>
> **Requirements**: Vue `^3.5.0` or higher. Browser support aligns with **VitePress** baseline (Chrome 111+ / Firefox 113+ / Edge 111+ / Safari 16.2+). See the [full install guide](https://vue.moongate.top/guide/install) for details.

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

### Basic Components

| Component | Description    |
| --------- | -------------- |
| Button    | Button         |
| Card      | Card container |
| Badge     | Badge          |
| Divider   | Divider line   |

### Form Components

| Component | Description         |
| --------- | ------------------- |
| Input     | Input field         |
| Textarea  | Multi-line textarea |
| Checkbox  | Checkbox            |
| Radio     | Radio button        |
| Switch    | Toggle switch       |
| Select    | Dropdown select     |

### Data Display

| Component  | Description |
| ---------- | ----------- |
| Table      | Data table  |
| Pagination | Pagination  |
| Tabs       | Tab panels  |

### Layout Components

| Component | Description            |
| --------- | ---------------------- |
| Container | Container              |
| Header    | Header container       |
| Main      | Main content container |
| Footer    | Footer container       |
| Hero      | Hero section           |

### Feedback Components

| Component | Description  |
| --------- | ------------ |
| Modal     | Modal dialog |
| Toast     | Toast        |
| Message   | Message      |
| Tooltip   | Tooltip      |
| Popover   | Popover      |
| Drawer    | Drawer panel |
| Skeleton  | Skeleton     |

### Style Utilities

| Utility | Class                                             | Description |
| ------- | ------------------------------------------------- | ----------- |
| Link    | `.mg-link` / `.nav-link`                          | Link styles |
| Code    | `.mg-code` / `.mg-code-inline` / `.mg-code-block` | Code styles |

> **Note**: **25 components + 2 style utilities** in total, covering most daily development scenarios.

## Design Tokens

Moongate Vue is built on a complete design token system (`colors.css` and `layout.css`). Customize the theme by overriding CSS variables:

```css
:root {
  --ui-primary: #3b82f6;
  --ui-spacing-md: 12px;
}
```

See the [design tokens guide](https://vue.moongate.top/guide/design-tokens) for the full variable reference.

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
