# Card 卡片

卡片组件，用于展示独立的内容区块。支持头部、主体、底部三个可选区域，并可选悬停上浮光晕效果。

## 基础用法

最简单的卡片只包含主体内容。

```vue
<Card>
  <p>这是卡片内容</p>
</Card>
```

## 完整结构

通过三个插槽分别定义头部、主体和底部。

```vue
<Card>
  <template #header>
    <h3>文章标题</h3>
  </template>
  <p>文章摘要内容...</p>
  <template #footer>
    <Button label="阅读更多" />
  </template>
</Card>
```

## 悬停效果

设置 `hoverable` 属性后，鼠标悬停时卡片会平滑上浮并透出主题色的月晕光效。

```vue
<Card hoverable>
  <h3>可交互卡片</h3>
  <p>鼠标悬停时卡片会向上浮动，并透出冷色光晕。</p>
</Card>
```

## 改变根元素语义

通过 `as` 属性改变根元素标签，提升 HTML 语义化。支持任意合法 HTML 标签。

```vue
<!-- 文章卡片 -->
<Card as="article" hoverable>
  <h2>博客文章标题</h2>
  <p>文章内容...</p>
</Card>

<!-- 卡片列表项（用于列表容器中） -->
<Card as="li" hoverable>
  <div class="flex items-center gap-2">
    <span>《设计令牌与原子化 CSS》</span>
    <span class="text-dim text-sm">2026-04-19</span>
  </div>
</Card>

<!-- 自定义容器 -->
<Card as="fieldset">
  <legend>卡片标题</legend>
  <p>内容</p>
</Card>
```

## 博客文章卡片示例

一个实际博客中常用的文章卡片布局，包含元数据、标题、描述和标签。

```vue
<Card as="article" hoverable>
  <template #header>
    <div class="flex justify-between items-center mb-2">
      <Badge color="primary">P3</Badge>
      <time datetime="2026-04-20" class="text-dim text-sm">2026-04-20</time>
    </div>
    <RouterLink to="/post/1" rel="noopener noreferrer" class="block">
      <h2 class="text-xl font-semibold text-highlighted hover:text-primary transition">
        工程深化篇：工业级构建脚本与 DTCG 完整实现
      </h2>
    </RouterLink>
  </template>

  <RouterLink to="/post/1" rel="noopener noreferrer" class="block">
    <p class="text-dim line-clamp-2 hover:text-primary transition">
      深入工业级构建脚本，掌握颜色标准化、WCAG 对比度校验、循环引用检测、自动生成 CSS 变量...
    </p>
  </RouterLink>

  <template #footer>
    <div class="flex flex-wrap gap-1 mt-2">
      <RouterLink to="/tag/vue" rel="noopener noreferrer" class="nav-link"><em>#Vue</em></RouterLink>
      <RouterLink to="/tag/css" rel="noopener noreferrer" class="nav-link"><em>#CSS</em></RouterLink>
    </div>
  </template>
</Card>
```

## API

### Props

| 属性        | 类型      | 默认值  | 说明                               |
| ----------- | --------- | ------- | ---------------------------------- |
| `as`        | `string`  | `'div'` | 根元素标签，支持任意合法 HTML 标签 |
| `hoverable` | `boolean` | `false` | 是否启用悬停上浮 + 月晕效果        |

### Slots

| 名称      | 说明                 |
| --------- | -------------------- |
| `header`  | 卡片头部内容（可选） |
| `default` | 卡片主体内容         |
| `footer`  | 卡片底部内容（可选） |

## 注意事项

- 卡片默认**无边框、无圆角**，符合 Moongate 的直角美学
- 悬停效果仅当 `hoverable` 为 `true` 时生效
- 头部和底部插槽为可选，不传则对应区域不会渲染
- 若卡片内部包含多个可交互元素（如多个链接），请确保各元素的 `z-index` 或点击区域不冲突
- `as` 属性支持任意合法 HTML 标签，提供最大的语义化灵活性
