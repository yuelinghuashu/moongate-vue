# 🌙 Moongate Vue

[![npm version](https://img.shields.io/npm/v/moongate-vue.svg)](https://www.npmjs.com/package/moongate-vue)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/moongate-vue)](https://bundlephobia.com/package/moongate-vue)
[![npm downloads](https://img.shields.io/npm/dm/moongate-vue.svg)](https://www.npmjs.com/package/moongate-vue)

[**English**](./README.md) | **中文**

Moongate Vue 是一个受月亮启发的极简 Vue 3 组件库。设计令牌驱动，CSS 优先，框架无关。

**完整组件库仅 10KB (gzipped)**，比主流组件库轻 10 倍以上。

## 特性

- 🌙 **月亮哲学** — 克制、冷静、秩序感
- 📦 **极致轻量** — 完整组件库仅 **10KB** (gzipped)
- 🎨 **设计令牌驱动** — 基于 CSS 变量，主题切换 effortless
- 🔧 **CSS 优先** — 样式与逻辑解耦，可跨框架复用
- ✨ **极简 API** — 每个组件 2-8 个 props，易学易用
- 🚀 **零依赖** — 无需额外配置，开箱即用
- 🎨 **代码美化** — 内置行内代码和代码块样式，适配深色/浅色模式
- ⚡ **SSR 就绪** — 完美适配 Nuxt 4 / VitePress 等服务端渲染场景
- ✅ **测试保障** — Vitest + jsdom 全覆盖，25 个组件 + 5 个 composables + SSR 回归，共 228 个测试
- 🔧 **工程规范** — ESLint + Prettier 统一风格，husky 提交前自动检查
- 📚 **消息堆叠** — Message / Toast 支持同时显示多条，无需额外配置

## 安装

```bash
npm install moongate-vue
# 或
pnpm add moongate-vue
```

> 💡 Moongate Vue 完全支持服务端渲染（SSR），可无缝集成 Nuxt 3 和 VitePress，无需额外配置。

### 版本要求

- **Vue**：`^3.5.0` 或更高版本（需要使用 `useId` 等 SSR 安全特性）

> 如果你在使用 Vue 3.0 - 3.4，请使用 `moongate-vue@1.2.x` 版本。

### 浏览器支持

[![Browser Support](https://img.shields.io/badge/Browser-Chrome%20111%2B%20%7C%20Firefox%20113%2B%20%7C%20Edge%20111%2B%20%7C%20Safari%2016.2%2B-4FC08D)](<>)

Moongate Vue 以 **ES2020** 为目标，要求支持 CSS 自定义属性（CSS Variables）。浏览器支持与 **VitePress** 保持一致（因为文档站本身运行本组件库）：

| 浏览器  | 最低版本 |
| ------- | -------- |
| Chrome  | 111+     |
| Edge    | 111+     |
| Firefox | 113+     |
| Safari  | 16.2+    |

> ⚠️ **注意**：`Textarea` 组件的 `field-sizing: content` 自动高度功能需要较新浏览器：
>
> - Chrome/Edge 123+
> - Firefox 128+
> - Safari 16.4+
>
> 在旧版浏览器中组件仍可正常使用——只需手动设置 `rows` 即可实现类似效果。
>
> 不支持 IE 11（无 CSS 自定义属性支持）。

## 快速开始

```vue
<script setup>
import { Button, Card, useMessage } from 'moongate-vue'
import 'moongate-vue/style.css'

const message = useMessage()
</script>

<template>
  <Button variant="filled" color="primary" @click="message.success('欢迎使用 Moongate')">
    月光按钮
  </Button>
</template>
```

## 🎨 可选全局重置

Moongate Vue 的默认 `style.css` **不包含全局重置**——不会侵入你项目的既有样式。如需统一基线，可显式引入可选重置：

```js
import 'moongate-vue/style.css'
// 可选：为所有元素统一 box-sizing: border-box
import 'moongate-vue/reset.css'
```

> 该可选重置仅对全部元素应用 `box-sizing: border-box`（保留浏览器默认的 margin/padding），不会覆盖你现有的排版与间距。

## 📖 在线文档

访问 [**Moongate Vue 官方文档**](https://vue.moongate.top) 查看：

- 所有组件 API 与交互示例
- 设计令牌与主题定制指南

> 文档站与组件库同步更新，建议优先查阅在线文档。

## 组件列表

### 基础组件

| 组件    | 说明   |
| ------- | ------ |
| Button  | 按钮   |
| Card    | 卡片   |
| Badge   | 徽章   |
| Divider | 分割线 |

### 表单组件

| 组件     | 说明     |
| -------- | -------- |
| Input    | 输入框   |
| Textarea | 多行文本 |
| Checkbox | 复选框   |
| Radio    | 单选框   |
| Switch   | 开关     |
| Select   | 下拉选择 |

### 数据展示组件

| 组件       | 说明   |
| ---------- | ------ |
| Table      | 表格   |
| Pagination | 分页   |
| Tabs       | 标签页 |

### 布局组件

| 组件      | 说明       |
| --------- | ---------- |
| Container | 容器       |
| Header    | 头部容器   |
| Main      | 主内容容器 |
| Footer    | 底部容器   |
| Hero      | 英雄区     |

### 反馈组件

| 组件     | 说明     |
| -------- | -------- |
| Modal    | 模态框   |
| Toast    | 通知     |
| Message  | 消息提示 |
| Tooltip  | 提示     |
| Popover  | 弹出层   |
| Drawer   | 抽屉     |
| Skeleton | 骨架屏   |

## 样式工具

以下为全局样式类，无需导入 Vue 组件，直接使用类名即可：

| 样式 | 类名                                              | 说明     |
| ---- | ------------------------------------------------- | -------- |
| Link | `.mg-link` / `.nav-link`                          | 链接样式 |
| Code | `.mg-code` / `.mg-code-inline` / `.mg-code-block` | 代码样式 |

> **说明**：总计 **25 个组件 + 2 个样式工具**，覆盖日常开发绝大多数场景。

## 设计令牌

Moongate Vue 基于完整的设计令牌系统：

- `colors.css` — 浅色/深色模式颜色变量
- `layout.css` — 间距、字体、动效等布局变量

通过覆盖 CSS 变量即可完成主题定制：

```css
:root {
  --ui-primary: #3b82f6;
  --ui-spacing-md: 12px;
}
```

## 属性透传

所有组件都支持通过 `v-bind="$attrs"` 透传原生属性到根元素：

- `id`、`name`、`data-*`、`aria-*`、`role` 等
- Input/Textarea 透传到原生输入元素
- Checkbox/Radio/Switch 透传到隐藏的 `<input>`（无障碍）
- Button 透传到 `<button>` 元素

示例：

```vue
<!-- 属性自动透传到 <input> -->
<Input id="email" name="email" type="email" autocomplete="off" />

<!-- 无障碍属性 -->
<Checkbox name="terms" aria-label="同意用户协议" />

<!-- 自定义数据属性 -->
<Card data-testid="article-card" hoverable>
  文章内容
</Card>
```

## 注意事项

- 透传属性不会覆盖组件 Props 中已声明的属性
- 若需覆盖组件内置行为，请使用对应的 Props（如 `disabled`、`size` 等）

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

你的支持会让我更有动力持续维护、迭代新组件、完善文档。

<img src="./assets/ali-pay.jpg" width="200" height="280" alt="支付宝收款码" />
<img src="./assets/wechat-pay.jpg" width="200" height="280" alt="微信收款码" />

> 赞助费用将用于组件维护、新功能开发与文档完善。感谢每一份心意 ❤️

</details>
