````markdown
# Badge 徽章

徽章组件，用于标注状态、等级、分类等信息。

## 基础用法

```vue
<Badge label="P3" />
<Badge color="success" label="已发布" />
<Badge color="warning" label="进行中" />
<Badge color="error" label="已归档" />
```
````

## 尺寸

```vue
<Badge size="sm" label="小号" />
<Badge size="md" label="中号" />
```

## 自定义内容

通过默认插槽自定义内容（优先级高于 `label` prop）。

```vue
<Badge color="primary">
  <span class="flex items-center gap-1">🔥 热门</span>
</Badge>

<Badge color="success">
  <span class="flex items-center gap-1">✓ 已完成</span>
</Badge>
```

## 博客卡片中的使用

```vue
<Card>
  <template #header>
    <div class="flex justify-between items-center mb-2">
      <Badge color="primary">P3</Badge>
      <time class="text-dim text-sm">2026-04-20</time>
    </div>
    <h3>文章标题</h3>
  </template>
  <p>文章摘要...</p>
</Card>
```

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

```

```
