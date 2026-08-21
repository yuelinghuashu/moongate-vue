# Card 卡片

卡片组件，用于展示独立的内容区块。支持头部、主体、底部三个可选区域，并可选悬停上浮光晕效果。

> **何时使用**：需要将相关信息组织在一个独立的视觉容器中时使用，如文章摘要、用户信息、产品卡片等。

## 基础用法

最简单的卡片只包含主体内容。

:::demo

```vue
<template>
  <div style="width: 320px;">
    <Card>
      <p>这是卡片内容</p>
    </Card>
  </div>
</template>

<script setup>
import { Card } from 'moongate-vue'
</script>
```

:::

## 完整结构

通过三个插槽分别定义头部、主体和底部。

:::demo

```vue
<template>
  <div style="width: 360px;">
    <Card>
      <template #header>
        <h3>文章标题</h3>
      </template>
      <p>文章摘要内容...</p>
      <template #footer>
        <Button label="阅读更多" />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { Card, Button } from 'moongate-vue'
</script>
```

:::

## 悬停效果

设置 `hoverable` 属性后，鼠标悬停时卡片会平滑上浮并透出主题色的月晕光效。

:::demo

```vue
<template>
  <div style="width: 320px;">
    <Card hoverable>
      <h3>可交互卡片</h3>
      <p>鼠标悬停时卡片会向上浮动，并透出冷色光晕。</p>
    </Card>
  </div>
</template>

<script setup>
import { Card } from 'moongate-vue'
</script>
```

:::

## 隐藏主体或底部区域

通过 `hideBody` 和 `hideFooter` 属性可分别控制主体或底部区域的渲染（不生成对应 DOM）。

:::demo

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px; width: 320px;">
    <!-- 隐藏主体内容 -->
    <Card hide-body>
      <template #header>只有头部</template>
      <!-- 这里的内容不会显示 -->
    </Card>

    <!-- 隐藏底部区域 -->
    <Card hide-footer>
      <p>主体内容</p>
      <template #footer>这个底部不会显示</template>
    </Card>

    <!-- 同时隐藏主体和底部 -->
    <Card hide-body hide-footer>
      <template #header>只剩头部</template>
    </Card>
  </div>
</template>

<script setup>
import { Card } from 'moongate-vue'
</script>
```

:::

## 改变根元素语义

通过 `as` 属性改变根元素标签，提升 HTML 语义化。支持 `div`、`section`、`article`、`aside`、`li`。

:::demo

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <!-- 文章卡片 -->
    <Card as="article" hoverable>
      <h2>博客文章标题</h2>
      <p>文章内容...</p>
    </Card>

    <!-- 卡片列表项（用于列表容器中） -->
    <ul style="list-style: none; padding: 0; margin: 0;">
      <Card as="li" hoverable>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>《设计令牌与原子化 CSS》</span>
          <span style="color: var(--text-dim, #666); font-size: 14px;">2026-04-19</span>
        </div>
      </Card>
    </ul>

    <!-- 自定义容器 -->
    <Card as="section" style="border: 1px solid #e5e5e5; padding: 12px;">
      <h3 style="margin: 0 0 8px;">卡片标题</h3>
      <p>内容</p>
    </Card>
  </div>
</template>

<script setup>
import { Card } from 'moongate-vue'
</script>
```

:::

## 博客文章卡片示例

一个实际博客中常用的文章卡片布局，包含元数据、标题、描述和标签。

:::demo

```vue
<template>
  <div style="width: 480px;">
    <Card as="article" hoverable>
      <template #header>
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"
        >
          <Badge color="primary">P3</Badge>
          <time datetime="2026-04-20" style="color: var(--text-dim, #666); font-size: 14px;">
            2026-04-20
          </time>
        </div>
        <RouterLink to="/post/1" class="mg-link" style="display: block;">
          <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600;">
            工程深化篇：工业级构建脚本与 DTCG 完整实现
          </h2>
        </RouterLink>
      </template>

      <RouterLink to="/post/1" class="mg-link" style="display: block;">
        <p
          style="margin: 0; color: var(--text-dim, #666); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
        >
          深入工业级构建脚本，掌握颜色标准化、WCAG 对比度校验、循环引用检测、自动生成 CSS 变量...
        </p>
      </RouterLink>

      <template #footer>
        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
          <RouterLink to="/tag/vue" class="nav-link" style="text-decoration: none;">
            #Vue
          </RouterLink>
          <RouterLink to="/tag/css" class="nav-link" style="text-decoration: none;">
            #CSS
          </RouterLink>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { Card, Badge } from 'moongate-vue'
</script>
```

:::

## API

### Props

| 属性         | 类型                                                 | 默认值  | 说明                              |
| ------------ | ---------------------------------------------------- | ------- | --------------------------------- |
| `as`         | `'div' \| 'section' \| 'article' \| 'aside' \| 'li'` | `'div'` | 根元素标签                        |
| `hoverable`  | `boolean`                                            | `false` | 是否启用悬停上浮 + 月晕效果       |
| `hideBody`   | `boolean`                                            | `false` | 是否隐藏主体区域（默认插槽）      |
| `hideFooter` | `boolean`                                            | `false` | 是否隐藏底部区域（`footer` 插槽） |

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
- 使用 `hideBody` 或 `hideFooter` 时，对应的 DOM 元素完全不会生成，适用于需要精确控制布局的场景
- 若卡片内部包含多个可交互元素（如多个链接），请确保各元素的 `z-index` 或点击区域不冲突
- `as` 属性支持 `div`、`section`、`article`、`aside`、`li` 五种容器标签
