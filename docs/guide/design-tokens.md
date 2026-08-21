# 设计令牌

Moongate Vue 的所有样式都基于 CSS 变量（设计令牌）构建。你可以通过覆盖这些变量来定制主题。

## 快速参考

::: details 常用变量速查（点击展开）

**颜色**

| 变量               | 说明     | 浅色值    | 深色值    |
| ------------------ | -------- | --------- | --------- |
| `--ui-primary`     | 主题色   | `#1e40af` | `#3b82f6` |
| `--ui-text`        | 主要文本 | `#0f172a` | `#e28f0`  |
| `--ui-bg`          | 页面背景 | `#f9fafb` | `#0f172a` |
| `--ui-bg-elevated` | 浮层背景 | `#ffffff` | `#131c31` |
| `--ui-border`      | 默认边框 | `#cbd5e1` | `#2d3748` |

**间距**

| 变量              | 值     | 说明     |
| ----------------- | ------ | -------- |
| `--ui-spacing-sm` | `8px`  | 小间距   |
| `--ui-spacing-md` | `12px` | 中间距   |
| `--ui-spacing-lg` | `16px` | 大间距   |
| `--ui-spacing-xl` | `24px` | 超大间距 |

**排版**

| 变量                          | 值                                     | 说明     |
| ----------------------------- | -------------------------------------- | -------- |
| `--ui-typography-family-sans` | `Inter, system-ui, sans-serif`         | 正文字体 |
| `--ui-typography-family-mono` | `JetBrains Mono, Fira Code, monospace` | 代码字体 |
| `--ui-typography-size-body`   | `15px`                                 | 正文字号 |

**动效**

| 变量                          | 值                              | 说明     |
| ----------------------------- | ------------------------------- | -------- |
| `--ui-motion-duration-neural` | `150ms`                         | 快速过渡 |
| `--ui-motion-duration-fluid`  | `300ms`                         | 流畅过渡 |
| `--ui-motion-easing-lunar`    | `cubic-bezier(0.25, 1, 0.5, 1)` | 月晕缓动 |

:::

## 颜色

### 主题色

| 变量             | 说明   | 浅色模式  | 深色模式  |
| ---------------- | ------ | --------- | --------- |
| `--ui-primary`   | 主题色 | `#0284c7` | `#3b82f6` |
| `--ui-success`   | 成功色 | `#059669` | `#34d399` |
| `--ui-warning`   | 警告色 | `#b45309` | `#fbbf24` |
| `--ui-error`     | 错误色 | `#b91c1c` | `#f87171` |
| `--ui-highlight` | 高亮色 | `#0369a1` | `#7dd3fc` |

### 文本颜色

| 变量                 | 说明          | 浅色模式  | 深色模式  |
| -------------------- | ------------- | --------- | --------- |
| `--ui-text`          | 主要文本      | `#0f172a` | `#e2e8f0` |
| `--ui-text-dim`      | 次要文本      | `#475569` | `#cbd5e1` |
| `--ui-text-muted`    | 占位/禁用文本 | `#475569` | `#7a8c9e` |
| `--ui-text-inactive` | 非活跃文本    | `#94a3b8` | `#94a3b8` |

### 背景颜色

| 变量               | 说明                  | 浅色模式    | 深色模式    |
| ------------------ | --------------------- | ----------- | ----------- |
| `--ui-bg`          | 页面背景              | `#f9fafb`   | `#0f172a`   |
| `--ui-bg-elevated` | 浮层背景（卡片/弹窗） | `#ffffff`   | `#131c31`   |
| `--ui-bg-muted`    | 弱背景（表头/悬停）   | `#f1f5f9`   | `#1e293b`   |
| `--ui-bg-hover`    | 悬停背景（半透明）    | `#0284c715` | `#3b82f620` |
| `--ui-bg-active`   | 激活背景（半透明）    | `#0284c725` | `#3b82f640` |

### 边框颜色

| 变量                 | 说明     | 浅色模式  | 深色模式  |
| -------------------- | -------- | --------- | --------- |
| `--ui-border`        | 默认边框 | `#cbd5e1` | `#2d3748` |
| `--ui-border-dim`    | 弱边框   | `#94a3b8` | `#475569` |
| `--ui-border-hover`  | 悬停边框 | `#0284c7` | `#3b82f6` |
| `--ui-border-subtle` | 极弱边框 | `#cbd5e1` | `#2d3748` |

### 叠加层

| 变量                 | 说明              | 浅色模式          | 深色模式          |
| -------------------- | ----------------- | ----------------- | ----------------- |
| `--ui-overlay-scrim` | 模态框/抽屉遮罩色 | `rgba(0,0,0,0.5)` | `rgba(0,0,0,0.7)` |

### 语法高亮（代码块）

| 变量               | 说明   | 浅色模式  | 深色模式  |
| ------------------ | ------ | --------- | --------- |
| `--ui-function`    | 函数   | `#0369a1` | `#87cefa` |
| `--ui-operator`    | 运算符 | `#475569` | `#475569` |
| `--ui-comment`     | 注释   | `#475569` | `#a5b4cb` |
| `--ui-variable`    | 变量   | `#0f172a` | `#e2e8f0` |
| `--ui-punctuation` | 标点   | `#94a3b8` | `#94a3b8` |

### 括号颜色（配对标亮）

| 变量            | 浅色模式  | 深色模式  |
| --------------- | --------- | --------- |
| `--ui-bracket1` | `#0284c7` | `#7dd3fc` |
| `--ui-bracket2` | `#059669` | `#34d399` |
| `--ui-bracket3` | `#b45309` | `#fbbf24` |
| `--ui-bracket4` | `#7e22ce` | `#c084fc` |
| `--ui-bracket5` | `#0e7490` | `#3b82f6` |
| `--ui-bracket6` | `#64748b` | `#94a3b8` |

### Git 颜色

| 变量                 | 说明   | 浅色模式  | 深色模式  |
| -------------------- | ------ | --------- | --------- |
| `--ui-git-added`     | 新增   | `#059669` | `#34d399` |
| `--ui-git-modified`  | 修改   | `#b45309` | `#fbbf24` |
| `--ui-git-deleted`   | 删除   | `#b91c1c` | `#f87171` |
| `--ui-git-untracked` | 未跟踪 | `#64748b` | `#94a3b8` |
| `--ui-git-ignored`   | 忽略   | `#94a3b8` | `#2d3748` |

## 间距

| 变量               | 值     | 说明       |
| ------------------ | ------ | ---------- |
| `--ui-spacing-xs`  | `4px`  | 极小间距   |
| `--ui-spacing-sm`  | `8px`  | 小间距     |
| `--ui-spacing-md`  | `12px` | 中间距     |
| `--ui-spacing-lg`  | `16px` | 大间距     |
| `--ui-spacing-xl`  | `24px` | 超大间距   |
| `--ui-spacing-2xl` | `32px` | 2 倍大间距 |
| `--ui-spacing-3xl` | `48px` | 3 倍大间距 |

## 圆角

| 变量               | 值    | 说明           |
| ------------------ | ----- | -------------- |
| `--ui-radius-none` | `0px` | 无圆角（默认） |
| `--ui-radius-sm`   | `2px` | 小圆角         |

## 排版

### 字体

| 变量                          | 值                                            | 说明             |
| ----------------------------- | --------------------------------------------- | ---------------- |
| `--ui-typography-family-sans` | `Inter, system-ui, -apple-system, sans-serif` | 无衬线字体       |
| `--ui-typography-family-mono` | `'JetBrains Mono', 'Fira Code', monospace`    | 等宽字体（代码） |

### 字号

| 变量                         | 值     | 说明                       |
| ---------------------------- | ------ | -------------------------- |
| `--ui-typography-size-body`  | `15px` | 正文字号                   |
| `--ui-typography-size-lg`    | `18px` | 大号文字（标题、大按钮等） |
| `--ui-typography-size-small` | `12px` | 小字号                     |
| `--ui-typography-size-code`  | `13px` | 代码字号                   |

### 行高

| 变量                               | 值     | 说明     |
| ---------------------------------- | ------ | -------- |
| `--ui-typography-line-height`      | `1.6`  | 正文行高 |
| `--ui-typography-line-height-code` | `1.45` | 代码行高 |

## 动效

### 时长

| 变量                          | 值      | 说明                   |
| ----------------------------- | ------- | ---------------------- |
| `--ui-motion-duration-neural` | `150ms` | 快速过渡（悬停、聚焦） |
| `--ui-motion-duration-fluid`  | `300ms` | 流畅过渡（面板展开）   |
| `--ui-motion-duration-lunar`  | `600ms` | 慢速过渡（月晕效果）   |

### 缓动函数

| 变量                       | 值                              | 说明         |
| -------------------------- | ------------------------------- | ------------ |
| `--ui-motion-easing-lunar` | `cubic-bezier(0.25, 1, 0.5, 1)` | 月晕缓动曲线 |

## 响应式断点

| 变量                       | 值       | 说明     |
| -------------------------- | -------- | -------- |
| `--ui-breakpoints-mobile`  | `640px`  | 手机断点 |
| `--ui-breakpoints-tablet`  | `768px`  | 平板断点 |
| `--ui-breakpoints-desktop` | `1024px` | 桌面断点 |
| `--ui-breakpoints-wide`    | `1280px` | 宽屏断点 |

## 层级

| 变量                   | 值     | 说明          |
| ---------------------- | ------ | ------------- |
| `--ui-z-index-base`    | `1`    | 基础层级      |
| `--ui-z-index-sticky`  | `100`  | 固定/粘性元素 |
| `--ui-z-index-overlay` | `500`  | 遮罩层        |
| `--ui-z-index-modal`   | `1000` | 模态框        |
| `--ui-z-index-tooltip` | `1500` | 提示层        |

## 物理效果

| 变量                            | 值     | 说明               |
| ------------------------------- | ------ | ------------------ |
| `--ui-physics-tidal-offset`     | `4px`  | 潮汐偏移量         |
| `--ui-physics-glow-alpha-night` | `0.12` | 暗色模式月晕透明度 |
| `--ui-physics-glow-alpha-dawn`  | `0.06` | 亮色模式月晕透明度 |
| `--ui-physics-focus-ring`       | `2px`  | 聚焦环宽度         |
| `--ui-physics-border-crease`    | `1px`  | 边框折痕宽度       |

## 主题定制示例

```css
:root {
  /* 修改主题色 */
  --ui-primary: #8b5cf6;

  /* 修改间距 */
  --ui-spacing-md: 16px;

  /* 修改字体 */
  --ui-typography-family-sans: 'Noto Sans SC', system-ui, sans-serif;
}

/* 暗色模式定制 */
.dark {
  --ui-primary: #a78bfa;
  --ui-bg: #0a0a0a;
}
```

## 样式基线

组件库的默认样式是**非侵入式**的：`moongate-vue/style.css` 只包含组件样式，不会重置使用方项目的全局样式（元素默认 margin/padding 保持不变）。

如需统一盒模型基线（所有元素 `box-sizing: border-box`），可额外引入：

```ts
import 'moongate-vue/reset.css'
```

> `reset.css` 为可选文件，仅做无害的盒模型统一，不覆盖浏览器的排版默认值。

## 使用方式

```vue
<style>
/* 在组件中使用设计令牌 */
.my-component {
  color: var(--ui-primary);
  padding: var(--ui-spacing-md);
  border: var(--ui-physics-border-crease) solid var(--ui-border);
  transition: all var(--ui-motion-duration-neural) var(--ui-motion-easing-lunar);
}
</style>
```
