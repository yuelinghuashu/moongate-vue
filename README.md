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
- 🎨 **Code Styling** — Built-in inline code & code block styles, supports dark/light mode
- ⚡ **SSR Ready** — Perfect for Nuxt 4 / VitePress and other server-side rendering scenarios
- ✅ **Tested** — Vitest + jsdom full coverage: 25 components + 5 composables + SSR regression, 228 tests total
- 🔧 **Engineering Standards** — ESLint + Prettier unified style, husky pre-commit checks
- 📚 **Message Stacking** — Message / Toast support multiple concurrent messages, no extra config needed

## Installation

```bash
npm install moongate-vue
# or
pnpm add moongate-vue
```

> 💡 Moongate Vue fully supports server-side rendering (SSR) and integrates seamlessly with Nuxt 3 and VitePress — no additional configuration required.

### Version Requirements

- **Vue**: `^3.5.0` or higher (requires SSR-safe features like `useId`)

> If you're using Vue 3.0 - 3.4, please use `moongate-vue@1.2.x`.

### Browser Support

[![Browser Support](https://img.shields.io/badge/Browser-Chrome%20111%2B%20%7C%20Firefox%20113%2B%20%7C%20Edge%20111%2B%20%7C%20Safari%2016.2%2B-4FC08D)](<>)

Moongate Vue targets **ES2020** and requires CSS Custom Properties support. Browser support aligns with **VitePress** baseline (because the documentation site itself runs this library):

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 111+            |
| Edge    | 111+            |
| Firefox | 113+            |
| Safari  | 16.2+           |

> ⚠️ **Note**: The `Textarea` component's `field-sizing: content` auto-grow feature requires newer browser versions:
>
> - Chrome/Edge 123+
> - Firefox 128+
> - Safari 16.4+
>
> In older browsers, the component still works — you just need to set `rows` manually for auto-grow behavior.
>
> IE 11 is **not supported** (no CSS Custom Properties support).

## Quick Start

```vue
<script setup>
import { Button, Card, useMessage } from 'moongate-vue'
import 'moongate-vue/style.css'

const message = useMessage()
</script>

<template>
  <Button variant="filled" color="primary" @click="message.success('Welcome to Moongate')">
    Moonlight Button
  </Button>
</template>
```

## 🎨 Optional Global Reset

Moongate Vue's default `style.css` is **non-invasive** — it does not reset your global styles. Import the optional reset only if you need a consistent baseline:

```js
import 'moongate-vue/style.css'
// Optional: unify box-sizing to border-box across all elements
import 'moongate-vue/reset.css'
```

> The optional reset only applies `box-sizing: border-box` to all elements (keeping browser-default margins/paddings intact). It won't override your existing typography or spacing.

## 📖 Documentation

Visit the [**Moongate Vue Official Documentation**](https://vue.moongate.top) for:

- All component APIs and interactive examples
- Design tokens & theming guide

> The documentation site stays in sync with the library — we recommend consulting the online docs first.

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

## Style Utilities

These global style classes require no Vue component import — just use the class names directly:

| Utility | Class                                             | Description |
| ------- | ------------------------------------------------- | ----------- |
| Link    | `.mg-link` / `.nav-link`                          | Link styles |
| Code    | `.mg-code` / `.mg-code-inline` / `.mg-code-block` | Code styles |

> **Note**: **25 components + 2 style utilities** in total, covering most daily development scenarios.

## Design Tokens

Moongate Vue is built on a complete design token system:

- `colors.css` — light/dark mode color variables
- `layout.css` — spacing, typography, motion, and other layout variables

Customize the theme by overriding CSS variables:

```css
:root {
  --ui-primary: #3b82f6;
  --ui-spacing-md: 12px;
}
```

## Attribute Inheritance

All components pass through native attributes to the root element via `v-bind="$attrs"`:

- `id`, `name`, `data-*`, `aria-*`, `role`, etc.
- Input/Textarea pass through to the native input element
- Checkbox/Radio/Switch pass through to the hidden `<input>` (accessibility)
- Button passes through to the `<button>` element

Examples:

```vue
<!-- Attributes auto pass through to <input> -->
<Input id="email" name="email" type="email" autocomplete="off" />

<!-- Accessibility attributes -->
<Checkbox name="terms" aria-label="Agree to terms" />

<!-- Custom data attributes -->
<Card data-testid="article-card" hoverable>
  Article content
</Card>
```

## Notes

- Inherited attributes will not override props already declared in the component
- To override built-in behavior, use the corresponding props (e.g., `disabled`, `size`, etc.)

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

Your support gives me more motivation to keep maintaining, iterating on new components, and improving documentation.

<img src="./assets/ali-pay.jpg" width="200" height="280" alt="Alipay QR Code" />
<img src="./assets/wechat-pay.jpg" width="200" height="280" alt="WeChat Pay QR Code" />

> Donations are used for component maintenance, new feature development, and documentation improvements. Thank you for every bit of kindness ❤️

</details>
