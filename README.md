# 🌙 Moongate UI

以月为名，构建极简秩序。

Moongate UI 是一个受月亮启发的极简 Vue 3 组件库。设计令牌驱动，CSS 优先，框架无关。只需 12KB (gzipped)，让月光照进你的代码。

## 特性

- 🌙 **月亮哲学** — 克制、冷静、秩序感
- 📦 **极致轻量** — 完整组件库仅 ~12KB (gzipped)
- 🎨 **设计令牌驱动** — 基于 CSS 变量，主题切换 effortless
- 🔧 **CSS 优先** — 样式与逻辑解耦，可跨框架复用
- ✨ **极简 API** — 每个组件 2-8 个 props，易学易用
- 🎨 **代码美化** — 内置行内代码和代码块样式，适配深色/浅色模式
- 🚀 **零依赖** — 无需额外配置，开箱即用

## 安装

```bash
npm install moongate-vue
# 或
pnpm add moongate-vue
```

## 快速开始

```vue
<script setup>
import { Button, Card, useToast } from "moongate-vue"
import "moongate-vue/style.css"
</script>

<template>
  <Button variant="filled" color="primary" @click="toast.success('欢迎使用')">
    月光按钮
  </Button>
</template>
```

### 基础组件

| 组件       | 说明     |
| ---------- | -------- |
| Button     | 按钮     |
| Card       | 卡片     |
| Badge      | 徽章     |
| Divider    | 分割线   |

### 表单组件

| 组件     | 说明         |
| -------- | ------------ |
| Input    | 输入框       |
| Textarea | 多行文本     |
| Checkbox | 复选框       |
| Radio    | 单选框       |
| Switch   | 开关         |
| Select   | 下拉选择     |

### 数据展示组件

| 组件       | 说明         |
| ---------- | ------------ |
| Table      | 表格         |
| Pagination | 分页         |
| Tabs       | 标签页       |

### 布局组件

| 组件      | 说明         |
| --------- | ------------ |
| Container | 容器         |
| Header    | 头部容器     |
| Main      | 主内容容器   |
| Footer    | 底部容器     |
| Hero      | 英雄区       |

### 反馈组件

| 组件       | 说明  |
| -------- | --- |
| Modal    | 模态框 |
| Toast    | 通知  |
| Tooltip  | 提示  |
| Popover  | 弹出层 |
| Drawer   | 抽屉  |
| Skeleton | 骨架屏 |

## 样式工具（非组件）

以下为全局样式类，无需导入 Vue 组件，直接使用类名即可：

| 样式 | 类名 | 说明 |
|------|------|------|
| Link | `.mg-link` / `.nav-link` | 链接样式 |
| Code | `.mg-code` / `.mg-code-inline` / `.mg-code-block` | 代码样式 |

> **说明**：
> - **样式类（非组件）**：Link（`.mg-link`、`.nav-link`）、Code（`.mg-code`、`.mg-code-inline`、`.mg-code-block`）

总计 **24 个组件 + 2 个样式工具**，覆盖了个人博客所需的绝大多数场景。

## 设计令牌

Moongate UI 基于完整的设计令牌系统：

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

---

🌙 推开月之门，让月光照进你的代码。
