# Code 代码样式

全局代码样式，用于美化行内代码和代码块。

## 基础用法

### 行内代码

直接在段落中使用 `<code>` 标签即可自动获得样式。

```vue
<template>
  <p>这是行内代码 <code>const a = 1</code> 示例。</p>
</template>
```

### 代码块

使用 `<pre><code>` 包裹代码块，自动获得样式和横向滚动。

```vue
<template>
  <pre><code>
function hello() {
  console.log('world')
}
  </code></pre>
</template>
```

## 手动使用类名（可选）

如果需要更精细的控制，可以使用以下类名：

| 类名 | 说明 |
|------|------|
| `.mg-code` | 基础类，设置等宽字体 |
| `.mg-code-inline` | 行内代码样式（背景、圆角、主题色文字） |
| `.mg-code-block` | 代码块容器样式（背景、内边距、横向滚动） |

```vue
<template>
  <!-- 手动使用行内代码类 -->
  <code class="mg-code mg-code-inline">const a = 1</code>

  <!-- 手动使用代码块类 -->
  <pre class="mg-code-block"><code>
function hello() {
  console.log('world')
}
  </code></pre>
</template>
```

## 与 Markdown 渲染器集成

当使用 `@nuxt/content` 等 Markdown 渲染器时，生成的 HTML 会自动应用全局样式，无需手动添加类名。

```vue
<template>
  <!-- ContentRenderer 输出的 Markdown 内容会自动获得样式 -->
  <ContentRenderer :value="page" />
</template>
```

## API

### CSS 变量

可通过覆盖以下 CSS 变量定制代码样式：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `--ui-typography-family-mono` | 等宽字体 | `'JetBrains Mono', 'Fira Code', monospace` |
| `--ui-typography-size-code` | 代码字体大小 | `13px` |
| `--ui-bg-muted` | 代码背景色 | 浅色 `#f1f5f9` / 深色 `#1e293b` |
| `--ui-primary` | 行内代码文字颜色 | 浅色 `#0284c7` / 深色 `#3b82f6` |
| `--ui-radius-sm` | 行内代码圆角 | `2px` |
| `--ui-radius-none` | 代码块圆角 | `0px` |
| `--ui-spacing-lg` | 代码块内边距 | `16px` |

## 样式说明

| 元素 | 样式 | 说明 |
|------|------|------|
| 行内代码 | 浅色背景 + 主题色文字 + 圆角 | 与普通文字区分，吸引注意力 |
| 代码块 | 深色背景 + 内边距 + 横向滚动 | 保留 Shiki 语法高亮原始颜色 |
| 代码块内代码 | 无背景、无内边距 | 避免样式嵌套冲突 |

## 深色模式适配

- 行内代码背景和文字颜色会随主题自动切换
- 代码块背景会随主题切换，但文字颜色保留 Shiki 语法高亮（设计如此，不覆盖）

## 注意事项

- 行内代码默认使用主题色（蓝色），与普通文字区分
- 代码块使用 Shiki 语法高亮时，保留原始语法颜色，不被覆盖
- 代码块支持横向滚动（`overflow-x: auto`），长代码不会撑破布局
- 深色模式下背景色和文字颜色自动适配