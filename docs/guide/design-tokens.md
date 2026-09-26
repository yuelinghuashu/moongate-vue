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

| 变量                        | 说明                       | 浅色模式  | 深色模式  |
| --------------------------- | -------------------------- | --------- | --------- |
| `--ui-text`                 | 主要文本                   | `#0f172a` | `#e2e8f0` |
| `--ui-text-dim`             | 次要文本                   | `#475569` | `#cbd5e1` |
| `--ui-text-muted`           | 占位/弱化文本              | `#64748b` | `#7a8c9e` |
| `--ui-text-inactive`        | 非活跃文本                 | `#7a8c9e` | `#94a3b8` |
| `--ui-selection-foreground` | 选中行前景（实底选中背景） | `#0f172a` | `#ffffff` |

### 背景颜色

| 变量                 | 说明                        | 浅色模式    | 深色模式    |
| -------------------- | --------------------------- | ----------- | ----------- |
| `--ui-bg`            | 页面背景                    | `#f9fafb`   | `#0f172a`   |
| `--ui-bg-elevated`   | 浮层背景（卡片/弹窗）       | `#ffffff`   | `#131c31`   |
| `--ui-bg-muted`      | 弱背景（表头/悬停）         | `#f1f5f9`   | `#1e293b`   |
| `--ui-bg-hover`      | 悬停背景（半透明）          | `#0284c715` | `#3b82f620` |
| `--ui-bg-active`     | 激活背景（半透明）          | `#0284c725` | `#3b82f640` |
| `--ui-primary-solid` | 实底强调背景（其上白/浅字） | `#1e40af`   | `#2563eb`   |

### 边框颜色

| 变量                 | 说明     | 浅色模式  | 深色模式  |
| -------------------- | -------- | --------- | --------- |
| `--ui-border`        | 默认边框 | `#cbd5e1` | `#2d3748` |
| `--ui-border-dim`    | 弱边框   | `#94a3b8` | `#475569` |
| `--ui-border-hover`  | 悬停边框 | `#0284c7` | `#3b82f6` |
| `--ui-border-subtle` | 极弱边框 | `#cbd5e1` | `#2d3748` |

### 叠加层

| 变量                 | 说明              | 浅色模式    | 深色模式    |
| -------------------- | ----------------- | ----------- | ----------- |
| `--ui-overlay-scrim` | 模态框/抽屉遮罩色 | `#00000080` | `#000000b3` |
| `--ui-code-dim`      | 无用代码压暗      | `#00000022` | `#00000022` |

### 语法高亮（代码块）

| 变量               | 说明   | 浅色模式  | 深色模式  |
| ------------------ | ------ | --------- | --------- |
| `--ui-function`    | 函数   | `#0369a1` | `#87cefa` |
| `--ui-operator`    | 运算符 | `#64748b` | `#7a8c9e` |
| `--ui-comment`     | 注释   | `#55647c` | `#a5b4cb` |
| `--ui-variable`    | 变量   | `#0f172a` | `#e2e8f0` |
| `--ui-punctuation` | 标点   | `#64748b` | `#94a3b8` |

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

| 变量                              | 值     | 说明                       |
| --------------------------------- | ------ | -------------------------- |
| `--ui-typography-size-body`       | `15px` | 正文字号                   |
| `--ui-typography-size-lg`         | `18px` | 大号文字（标题、大按钮等） |
| `--ui-typography-size-xl`         | `24px` | 浮层关闭按钮 / 更大强调    |
| `--ui-typography-size-title`      | `20px` | 浮层标题（Modal/Drawer）   |
| `--ui-typography-size-display`    | `40px` | 首屏大标题（Hero 基准）    |
| `--ui-typography-size-display-lg` | `48px` | 首屏大标题（桌面端增强）   |
| `--ui-typography-size-display-xl` | `60px` | 首屏大标题（宽屏增强）     |
| `--ui-typography-size-small`      | `12px` | 小字号                     |
| `--ui-typography-size-code`       | `13px` | 代码字号                   |

### 行高

| 变量                               | 值     | 说明     |
| ---------------------------------- | ------ | -------- |
| `--ui-typography-line-height`      | `1.6`  | 正文行高 |
| `--ui-typography-line-height-code` | `1.45` | 代码行高 |

### 控件行高

交互控件使用组件内联的 `line-height: 1.4`（`button.css` / `input.css` / `select.css` /
`badge.css` / `tabs.css` / `pagination.css`，与 `form.css`、`toast.css` 一致）。
它不是令牌；控件高度契约见下一节。

## 控件尺寸档位

控件高度由「字号令牌 + 间距令牌 + 显式行高 `1.4`」决定，不继承宿主的 `line-height`：
宿主若声明 `button,input,select,textarea { line-height: inherit }`（VitePress 就是），
不声明行高的控件会被抬到宿主行高（曾出现输入框 42px、徽章 40px，比默认按钮 37px 还高）。

各组件 `size` prop 的默认档均为 **`md`**（`Container` 为 `lg`）。Chromium 实测高度（含边框，`border-box`）：

| 组件                       | `sm` | `md`（默认） | `lg` |
| -------------------------- | ---- | ------------ | ---- |
| Button                     | 25px | 37px         | 49px |
| Input                      | 27px | 39px         | 51px |
| Textarea（`rows=1`）       | 27px | 39px         | 51px |
| Select（原生）             | 27px | 39px         | 51px |
| Tabs 标签项                | 27px | 39px         | 51px |
| Pagination 页码按钮        | 27px | 39px         | 51px |
| Badge（仅 `sm`/`md` 两档） | 25px | 37px         | —    |
| Dropdown 菜单项            | 23px | 33px         | 45px |

输入类控件比 Button 高 2px 是 1px 上下边框所致（Button 无边框）。

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

## 样式引入

见[安装指南 · 样式引入](/guide/install#样式引入)。

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
