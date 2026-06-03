# Tooltip 提示

Tooltip 提示组件，用于在鼠标悬停时显示提示信息。

## 基础用法

```vue
<Tooltip content="这是提示文字">
  <Button label="鼠标悬浮" />
</Tooltip>
```

## 不同位置

```vue
<div class="flex gap-2">
  <Tooltip content="顶部提示" placement="top">
    <Button label="顶部" />
  </Tooltip>
  <Tooltip content="底部提示" placement="bottom">
    <Button label="底部" />
  </Tooltip>
  <Tooltip content="左侧提示" placement="left">
    <Button label="左侧" />
  </Tooltip>
  <Tooltip content="右侧提示" placement="right">
    <Button label="右侧" />
  </Tooltip>
</div>
```

## 自定义延迟

```vue
<Tooltip content="延迟 500ms 显示" :delay="500">
  <Button label="延迟显示" />
</Tooltip>
```

## 自定义内容（插槽）

```vue
<Tooltip>
  <template #trigger>
    <Button label="自定义内容" />
  </template>
  <template #content>
    <div class="custom-tooltip">
      <span>✨ 支持自定义内容</span>
      <span class="text-sm text-dim">可以放多行</span>
    </div>
  </template>
</Tooltip>
```

## 边缘自动调整

靠近视口边缘时，Tooltip 会自动翻转方向以避免超出屏幕。

```vue
<Tooltip content="靠近顶部时自动翻转到下方" placement="top">
  <Button label="边缘测试" style="margin-top: 10px;" />
</Tooltip>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `content` | `string` | `''` | 提示内容 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 提示位置 |
| `delay` | `number` | `0` | 显示延迟（毫秒） |
| `offset` | `number` | `8` | 与触发元素的偏移量（像素） |

### Slots

| 名称 | 说明 |
|------|------|
| `trigger` | 触发元素（如使用默认插槽则自动包裹） |
| `default` | 触发元素的默认插槽（优先级低于 `trigger`） |
| `content` | 自定义提示内容（优先级高于 `content` prop） |

## 注意事项

- Tooltip 默认在 hover 时触发，不支持 click 或 focus 模式
- 提示内容为纯文本时用 `content` prop，复杂内容用 `#content` 插槽
- 靠近视口边缘时自动翻转方向（防止超出屏幕）
- Tooltip 使用 `Teleport` 挂载到 `body`，避免被父容器裁剪
- 支持延迟显示，适合防止误触
