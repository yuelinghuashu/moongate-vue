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
- ⚡ **SSR 就绪** — 完美适配 Nuxt 4 / VitePress 等服务端渲染场景
- ✅ **测试保障** — Vitest + jsdom 全覆盖，27 个组件 + 3 个公开 composables（`useForm` / `useMessage` / `useToast`）+ SSR/a11y 回归 + Playwright e2e，共 395 个测试（语句覆盖率 95% / 分支覆盖率 86%）
- 🔧 **工程规范** — ESLint + Prettier 统一风格，husky 提交前自动检查

## 安装

```bash
npm install moongate-vue
# 或
pnpm add moongate-vue
```

> 💡 **非侵入式样式**：默认 `style.css` 仅包含组件样式，不会重置你的全局样式。可选引入 `moongate-vue/reset.css` 为所有元素统一 `box-sizing: border-box`。
>
> **要求**：Vue `^3.5.0` 或更高版本。浏览器支持与 **VitePress** 基线保持一致（Chrome 111+ / Firefox 113+ / Edge 111+ / Safari 16.2+）。详见[完整安装指南](https://vue.moongate.top/guide/install)。

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

### 基础组件

| 组件    | 说明   |
| ------- | ------ |
| Button  | 按钮   |
| Card    | 卡片   |
| Badge   | 徽章   |
| Divider | 分割线 |

### 表单组件

| 组件     | 说明                               |
| -------- | ---------------------------------- |
| Form     | 表单容器与校验展示（配合 useForm） |
| FormItem | 单字段：label / 必填星号 / 错误    |
| Input    | 输入框                             |
| Textarea | 多行文本                           |
| Checkbox | 复选框                             |
| Radio    | 单选框                             |
| Switch   | 开关                               |
| Select   | 下拉选择                           |

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

### 样式工具

| 样式 | 类名                                              | 说明     |
| ---- | ------------------------------------------------- | -------- |
| Link | `.mg-link` / `.nav-link`                          | 链接样式 |
| Code | `.mg-code` / `.mg-code-inline` / `.mg-code-block` | 代码样式 |

> **说明**：总计 **27 个组件 + 2 个样式工具**，覆盖日常开发绝大多数场景。

## 设计令牌

Moongate Vue 基于完整的设计令牌系统（`colors.css` 和 `layout.css`）。通过覆盖 CSS 变量即可完成主题定制：

```css
:root {
  --ui-primary: #3b82f6;
  --ui-spacing-md: 12px;
}
```

完整变量参考见[设计令牌指南](https://vue.moongate.top/guide/design-tokens)。

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
