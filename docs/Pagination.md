# Pagination 分页

分页组件，用于分页导航。支持点击当前页码直接输入跳转，简洁高效。

## 基础用法

```vue
<Pagination v-model:current-page="page" :total-pages="10" />
```

## 尺寸

```vue
<Pagination v-model:current-page="page" :total-pages="10" size="sm" />
<Pagination v-model:current-page="page" :total-pages="10" size="md" />
<Pagination v-model:current-page="page" :total-pages="10" size="lg" />
```

## 点击跳转

点击当前页码会变成输入框，输入数字后按回车或失去焦点即可跳转。

```
[上一页]  5  /  50  [下一页]
              ↓ 点击
[上一页]  [____]  [下一页]
              ↓ 输入 8 回车
[上一页]  8  /  50  [下一页]
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `currentPage` | `number` | — | 当前页码（v-model） |
| `totalPages` | `number` | — | 总页数 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:currentPage` | `(page: number)` | 页码变化时触发（v-model） |
| `change` | `(page: number)` | 页码变化时触发 |

## 注意事项

- 页码显示格式为 `当前页 / 总页数`，简洁明了
- 点击当前页码即可编辑，无需额外跳转输入框
- 输入超出范围时会自动修正（1 ≤ 页码 ≤ 总页数）
- 上一页/下一页按钮在边界时自动禁用
- 包含完整的 ARIA 无障碍属性
