# Badge 徽章

徽章组件，用于标注状态、等级、分类等信息。

## 基础用法

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
    <Badge label="P3" />
    <Badge color="success" label="已发布" />
    <Badge color="warning" label="进行中" />
    <Badge color="error" label="已归档" />
  </div>
</template>

<script setup>
import { Badge } from 'moongate-vue'
</script>
```

:::

## 尺寸

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
    <Badge size="sm" label="小号" />
    <Badge size="md" label="中号" />
  </div>
</template>

<script setup>
import { Badge } from 'moongate-vue'
</script>
```

:::

## 自定义内容

通过默认插槽自定义内容（优先级高于 `label` prop）。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
    <Badge color="primary">
      <span style="display: flex; align-items: center; gap: 4px;">🔥 热门</span>
    </Badge>

    <Badge color="success">
      <span style="display: flex; align-items: center; gap: 4px;">✓ 已完成</span>
    </Badge>
  </div>
</template>

<script setup>
import { Badge } from 'moongate-vue'
</script>
```

:::

## 博客卡片中的使用

:::demo

```vue
<template>
  <div style="width: 320px;">
    <Card>
      <template #header>
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"
        >
          <Badge color="primary">P3</Badge>
          <time style="color: var(--text-dim, #666); font-size: 14px;">2026-04-20</time>
        </div>
        <h3 style="margin: 0;">文章标题</h3>
      </template>
      <p style="margin: 8px 0 0;">文章摘要...</p>
    </Card>
  </div>
</template>

<script setup>
import { Badge, Card } from 'moongate-vue'
</script>
```

:::

## API

### Props

| 属性    | 类型                                             | 默认值      | 说明     |
| ------- | ------------------------------------------------ | ----------- | -------- |
| `label` | `string`                                         | `''`        | 徽章文字 |
| `color` | `'primary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | 主题色   |
| `size`  | `'sm' \| 'md'`                                   | `'md'`      | 尺寸     |

### Slots

| 名称      | 说明                           |
| --------- | ------------------------------ |
| `default` | 徽章内容（优先级高于 `label`） |

## 注意事项

- 徽章默认使用半透明背景 + 主题色文字，符合 Moongate 的克制美学
- 颜色变体与 Button 组件保持一致，便于统一主题
- 小尺寸（`sm`）适合用于紧凑界面（如表格、标签列表）
- 默认尺寸（`md`）适合用于卡片头部等常见场景
