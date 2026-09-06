# SeriesNav 系列导航

有序内容导航组件，用于展示"文章系列/目录"的条目列表：按序编号、当前篇高亮、超过阈值时窗口化折叠为 "N more parts..."。视觉风格参考 dev.to 的系列侧栏（Series widget）。

> **何时使用**：把多篇文章组织成一个系列（教程、专栏、长篇连载），在文章页展示系列内的上一篇/下一篇及全部篇目导航，便于连续阅读。

## 基础用法

传入按**阅读顺序**排列的 `items` 即可。当前篇通过 `active` 指定，自动高亮。

:::demo

```vue
<script setup>
import { SeriesNav } from 'moongate-vue'

const items = [
  { key: 'part-1', label: 'Part 1: 从自由叙事到契约约束', href: '/docs/part-1' },
  { key: 'part-2', label: 'Part 2: 快速上手——从零写出你的第一个契约', href: '/docs/part-2' },
  { key: 'part-3', label: 'Part 3: 区块扫描与行号绑定', href: '/docs/part-3' },
]
</script>

<template>
  <SeriesNav :items="items" active="part-2" />
</template>
```

:::

## 带标题

通过 `title` 设置系列名，展示在列表上方。

:::demo

```vue
<script setup>
import { SeriesNav } from 'moongate-vue'

const items = [
  { key: 'part-1', label: 'Part 1: 从自由叙事到契约约束', href: '/docs/part-1' },
  { key: 'part-2', label: 'Part 2: 快速上手', href: '/docs/part-2' },
  { key: 'part-3', label: 'Part 3: 区块扫描', href: '/docs/part-3' },
  { key: 'part-4', label: 'Part 4: 集成测试', href: '/docs/part-4' },
  { key: 'part-5', label: 'Part 5: 运行时闭环', href: '/docs/part-5' },
]
</script>

<template>
  <SeriesNav title="叙事引擎（5 篇系列）" :items="items" active="part-2" />
</template>
```

:::

## 窗口化折叠

当条目数超过 `visibleCount` 时，组件会固定展示 **首项、末项、当前激活项及相邻项**，中间折叠为 "N more parts..."，点击展开完整列表。

:::demo

```vue
<script setup>
import { SeriesNav } from 'moongate-vue'

const items = Array.from({ length: 7 }, (_, i) => ({
  key: `p-${i + 1}`,
  label: `Part ${i + 1}`,
  href: `/p/${i + 1}`,
}))
</script>

<template>
  <SeriesNav :items="items" active="p-4" :visible-count="5" />
</template>
```

:::

## 自定义行内容

通过 `#item` 插槽自定义每一行的渲染（参数含 `item` 与 `index`）。`#title` 插槽可覆盖标题。

:::demo

```vue
<script setup>
import { SeriesNav } from 'moongate-vue'

const items = [
  { key: 'part-1', label: '契约约束', href: '/docs/part-1' },
  { key: 'part-2', label: '快速上手', href: '/docs/part-2' },
]
</script>

<template>
  <SeriesNav :items="items" active="part-2">
    <template #title><strong>系列导航</strong></template>
    <template #item="{ item, index }">
      <span class="custom-item" :data-index="index">{{ item.label }} →</span>
    </template>
  </SeriesNav>
</template>
```

:::

## API

### Props

| 属性           | 类型              | 默认值      | 说明                                                               |
| -------------- | ----------------- | ----------- | ------------------------------------------------------------------ |
| `items`        | `SeriesNavItem[]` | `[]`        | 有序导航项列表（顺序即展示顺序，组件不排序）                       |
| `active`       | `string`          | `undefined` | 当前激活项的 key（高亮显示）                                       |
| `title`        | `string`          | `undefined` | 可选标题（系列名，可通过 `#title` 插槽覆盖）                       |
| `numbered`     | `boolean`         | `true`      | 是否显示序号圆点                                                   |
| `visibleCount` | `number`          | `0`         | 折叠阈值：条目数超过时窗口化折叠为 "N more parts..."。0 表示不折叠 |

### SeriesNavItem

| 属性       | 类型      | 说明                                   |
| ---------- | --------- | -------------------------------------- |
| `key`      | `string`  | 唯一标识（`active` 匹配用）            |
| `label`    | `string`  | 行文本                                 |
| `href`     | `string`  | 链接地址（存在且未禁用时渲染为 `<a>`） |
| `disabled` | `boolean` | 是否禁用（禁用项不渲染为链接）         |

### Slots

| 名称    | 参数              | 说明                         |
| ------- | ----------------- | ---------------------------- |
| `item`  | `{ item, index }` | 自定义每一行内容             |
| `title` | -                 | 自定义标题内容（覆盖 title） |
