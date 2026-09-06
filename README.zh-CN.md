# 🌙 Moongate Vue

[![npm version](https://img.shields.io/npm/v/moongate-vue.svg)](https://www.npmjs.com/package/moongate-vue)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/moongate-vue)](https://bundlephobia.com/package/moongate-vue)
[![npm downloads](https://img.shields.io/npm/dm/moongate-vue.svg)](https://www.npmjs.com/package/moongate-vue)

[**English**](./README.md) | **中文**

Moongate Vue 是一个受月亮启发的极简 Vue 3 组件库。设计令牌驱动，CSS 优先，框架无关。

**完整组件库（JS + CSS）gzipped 体积保持 25KB 以内**。实时数据见上方 [Bundlephobia 徽章](https://bundlephobia.com/package/moongate-vue)。

## 特性

- 🌙 **月亮哲学** — 克制、冷静、秩序感
- 📦 **极致轻量** — 完整组件库（JS + CSS）在 **25KB** (gzipped) 以内
- 🎨 **设计令牌驱动** — 基于 CSS 变量，主题切换 effortless
- 🔧 **CSS 优先** — 样式与逻辑解耦，可跨框架复用
- ✨ **极简 API** — 绝大多数组件 2-8 个 props（少数复杂组件如 Button/Select 略多），易学易用
- 🚀 **零依赖** — 无需额外配置，开箱即用
- ⚡ **SSR 就绪** — 完美适配 Nuxt 4 / VitePress 等服务端渲染场景
- ✅ **测试保障** — Vitest + jsdom 全覆盖，29 个组件 + 3 个公开 composables（`useForm` / `useMessage` / `useToast`）+ SSR/a11y 回归 + Playwright e2e（26 用例），共 497 个测试（语句覆盖率 95% / 分支覆盖率 86%）
- 🔧 **工程规范** — ESLint + Prettier 统一风格，husky 提交前自动检查

## 安装

```bash
npm install moongate-vue
# 或
pnpm add moongate-vue
```

> 💡 **非侵入式样式**：默认 `style.css` 仅包含组件样式，不会重置你的全局样式。可选引入 `moongate-vue/reset.css` 为所有元素统一 `box-sizing: border-box`。
>
> **要求**：Vue `^3.5.0` 或更高版本。浏览器支持与 **VitePress** 基线保持一致（Chrome 111+ / Firefox 113+ / Edge 111+ / Safari 16.2+）。详见[完整安装指南](./docs/guide/install.md)。

## 快速开始

```vue
<script setup>
import { Button, useMessage } from 'moongate-vue'
import 'moongate-vue/style.css'

const message = useMessage()
</script>

<template>
  <Button variant="filled" color="primary" @click="message.success('欢迎使用 Moongate')">
    月光按钮
  </Button>
</template>
```

## 📖 在线文档

访问 [**Moongate Vue 官方文档**](https://vue.moongate.top) 查看所有组件 API、交互示例与主题定制指南。

## 组件列表

| 分类     | 组件                                                                         |
| -------- | ---------------------------------------------------------------------------- |
| 基础     | `Button` `Card` `Badge` `Divider`                                            |
| 表单     | `Form` `FormItem` `Input` `Textarea` `Checkbox` `Radio` `Switch` `Select`    |
| 数据展示 | `Table` `Pagination` `Tabs` `SeriesNav`                                      |
| 布局     | `Container` `Header` `Main` `Footer` `Hero`                                  |
| 反馈     | `Modal` `Toast` `Message` `Tooltip` `Popover` `Drawer` `Skeleton` `Dropdown` |
| 样式工具 | `Link` `Code`                                                                |

> **说明**：总计 **29 个组件 + 2 个样式工具**，覆盖日常开发绝大多数场景。

## TypeScript 类型

所有组件均导出其 Props 类型，并提供共享工具类型：

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

完整类型列表：每个组件的 `XxxProps`、`TableColumn`/`SortParams`/`CellSlotProps`/`ColumnSlotProps`、`DropdownOption`/`DropdownPlacement`、`SelectValue`/`SelectOption`、`TabItem`、`FormProps`、`Config`/`LocaleTexts`，以及 composable 类型（`Rule`/`FieldRules`/`UseFormOptions`/`MenuItemBase`）。

## 设计令牌

Moongate Vue 基于完整的设计令牌系统（`colors.css` 和 `layout.css`）。通过覆盖 CSS 变量即可完成主题定制：

```css
:root {
  --ui-primary: #3b82f6;
  --ui-spacing-md: 12px;
}
```

完整变量参考见[设计令牌指南](https://vue.moongate.top/guide/design-tokens)。

## 全局配置

内置文案默认跟随 `document.documentElement.lang` 自动适配中英文（仅支持中英双语，**非中文 lang 一律视为英文**），也可以通过 `setConfig` 全局覆盖：

```ts
import { setConfig } from 'moongate-vue'

// 切换为英文内置文案
setConfig({ locale: 'en-US' })

// 仅覆盖部分文案
setConfig({ texts: { empty: '没有数据', paginationPrev: '上一页' } })
```

优先级：**组件 prop > `setConfig` texts > 语言内置文案**。支持 `{current}`/`{total}`/`{label}` 等模板占位符，配置修改后已挂载组件会响应式更新。

覆盖的内置文案包括：Pagination 页码信息/上一页/下一页/首尾页、Select 空状态/移除标签、Table 空状态/全选/行选择/行标签兜底、FormItem 校验中、Modal/Drawer/Message/Toast 关闭按钮、`useForm` 默认校验失败文案。

## 属性透传

所有组件都支持通过 `v-bind="$attrs"` 透传原生属性到根元素：

- Input/Textarea 透传到原生输入元素
- Checkbox/Radio/Switch 透传到隐藏的 `<input>`（无障碍）
- Button 透传到 `<button>` 元素

> 透传属性不会覆盖组件 Props 中已声明的属性；如需覆盖组件内置行为，请使用对应的 Props（如 `disabled`、`size` 等）。

## 许可证

[MIT](./LICENSE)

## 相关链接

- [设计理念](https://moongate.top/docs/design-tokens-vs-atomic-css)
- [实现细节](https://moongate.top/docs/css-first-component-library)
- [Bundlephobia 分析](https://bundlephobia.com/package/moongate-vue)
- [在线文档](https://vue.moongate.top)

## ☕ 赞助支持

<details>
<summary>如果 Moongate Vue 帮你节省了开发时间，欢迎请我喝杯咖啡 ☕</summary>

<img src="./assets/ali-pay.jpg" width="200" height="280" alt="支付宝收款码" />
<img src="./assets/wechat-pay.jpg" width="200" height="280" alt="微信收款码" />

> 赞助费用将用于组件维护、新功能开发与文档完善。感谢每一份心意 ❤️

</details>
