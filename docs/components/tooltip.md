# Tooltip 提示

Tooltip 提示组件，用于在鼠标悬停时显示提示信息。

## 基础用法

:::demo

```vue
<template>
  <div style="padding: 40px;">
    <Tooltip content="这是提示文字">
      <Button label="鼠标悬浮" />
    </Tooltip>
  </div>
</template>

<script setup>
import { Tooltip, Button } from 'moongate-vue'
</script>
```

:::

## 不同位置

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap; padding: 40px;">
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
</template>

<script setup>
import { Tooltip, Button } from 'moongate-vue'
</script>
```

:::

## 自定义延迟

:::demo

```vue
<template>
  <div style="padding: 40px;">
    <Tooltip content="延迟 500ms 显示" :show-delay="500">
      <Button label="延迟显示" />
    </Tooltip>
  </div>
</template>

<script setup>
import { Tooltip, Button } from 'moongate-vue'
</script>
```

:::

## 自定义内容（插槽）

:::demo

```vue
<template>
  <div style="padding: 40px;">
    <Tooltip>
      <template #trigger>
        <Button label="自定义内容" />
      </template>
      <template #content>
        <div style="padding: 4px 8px;">
          <div>✨ 支持自定义内容</div>
          <div style="font-size: 12px; color: var(--ui-text-dim);">可以放多行</div>
        </div>
      </template>
    </Tooltip>
  </div>
</template>

<script setup>
import { Tooltip, Button } from 'moongate-vue'
</script>
```

:::

## 边缘自动调整

靠近视口边缘时，Tooltip 会自动翻转方向以避免超出屏幕。

:::demo

```vue
<template>
  <div style="padding: 40px;">
    <Tooltip content="靠近顶部时自动翻转到下方" placement="top">
      <Button label="边缘测试" />
    </Tooltip>
  </div>
</template>

<script setup>
import { Tooltip, Button } from 'moongate-vue'
</script>
```

:::

## API

### Props

| 属性        | 类型                                     | 默认值  | 说明                       |
| ----------- | ---------------------------------------- | ------- | -------------------------- |
| `content`   | `string`                                 | `''`    | 提示内容                   |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 提示位置                   |
| `showDelay` | `number`                                 | `0`     | 显示延迟（毫秒）           |
| `offset`    | `number`                                 | `8`     | 与触发元素的偏移量（像素） |

### Slots

| 名称      | 说明                                        |
| --------- | ------------------------------------------- |
| `trigger` | 触发元素（如使用默认插槽则自动包裹）        |
| `default` | 触发元素的默认插槽（优先级低于 `trigger`）  |
| `content` | 自定义提示内容（优先级高于 `content` prop） |

## 注意事项

- Tooltip 支持 **hover 和键盘 focus** 两种触发方式：鼠标悬停或 `Tab` 聚焦时显示，移出/失焦时隐藏；不支持 click 模式
- 提示内容为纯文本时用 `content` prop，复杂内容用 `#content` 插槽
- 靠近视口边缘时自动翻转方向（防止超出屏幕）
- Tooltip 使用 `Teleport` 挂载到 `body`，避免被父容器裁剪
- 支持延迟显示，适合防止误触
- **无障碍**：显示时触发元素自动关联 `aria-describedby`，屏幕阅读器可正确读取提示内容；键盘用户可通过 `Tab` 聚焦查看提示；按 **Escape** 键可关闭提示
- 完全支持 SSR，`useId()` 保证服务端渲染与客户端 hydration 的关联 ID 一致
