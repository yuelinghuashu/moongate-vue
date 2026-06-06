# Button 按钮

按钮组件，用于触发操作或提交表单。

## 基础用法

:::demo

```vue
<template>
  <Button>默认按钮</Button>
</template>

<script setup>
import { Button } from "moongate-vue"
</script>
```

:::

## 带图标

通过 `#icon` 插槽或 `icon` prop 添加图标。

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
    <!-- 使用插槽（优先级更高，最灵活） -->
    <Button>
      <template #icon>🔍</template>
      搜索
    </Button>

    <!-- 使用字符串 prop -->
    <Button icon="✓" label="确认" />

    <!-- 使用 Vue 组件 prop -->
    <Button :icon="IconHome" label="首页" />
  </div>
</template>

<script setup>
import { Button } from "moongate-vue"

// 请根据实际使用的图标库导入 IconHome 组件
// 示例：import { IconHome } from "lucide-vue-next"
const IconHome = () => "🏠" // 临时占位，请替换为实际图标组件
</script>
```

:::

## 加载状态

:::demo

```vue
<template>
  <Button loading label="提交中" />
</template>

<script setup>
import { Button } from "moongate-vue"
</script>
```

:::

## 禁用状态

:::demo

```vue
<template>
  <Button disabled label="不可用" />
</template>

<script setup>
import { Button } from "moongate-vue"
</script>
```

:::

## 块级按钮

:::demo

```vue
<template>
  <div style="width: auto">
    <Button block label="全宽按钮" />
  </div>
</template>

<script setup>
import { Button } from "moongate-vue"
</script>
```

:::

## 尺寸

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
    <Button size="sm" label="小号" />
    <Button size="md" label="中号" />
    <Button size="lg" label="大号" />
  </div>
</template>

<script setup>
import { Button } from "moongate-vue"
</script>
```

:::

## 颜色变体

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <Button color="primary" label="主要" />
    <Button color="success" label="成功" />
    <Button color="warning" label="警告" />
    <Button color="error" label="错误" />
  </div>
</template>

<script setup>
import { Button } from "moongate-vue"
</script>
```

:::

## 视觉变体

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <Button variant="filled" label="填充按钮" />
    <Button variant="outline" label="边框按钮" />
  </div>
</template>

<script setup>
import { Button } from "moongate-vue"
</script>
```

:::

## 组合使用

:::demo

```vue
<template>
  <div style="max-width: 400px;">
    <Button
      variant="outline"
      color="error"
      size="lg"
      block
      loading
      label="删除项目"
    />
  </div>
</template>

<script setup>
import { Button } from "moongate-vue"
</script>
```

:::

## API

### Props

| 属性       | 类型                                             | 默认值      | 说明                      |
| ---------- | ------------------------------------------------ | ----------- | ------------------------- |
| `label`    | `string`                                         | `''`        | 按钮文字                  |
| `variant`  | `'filled' \| 'outline'`                          | `'filled'`  | 视觉变体                  |
| `color`    | `'primary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | 主题色                    |
| `size`     | `'sm' \| 'md' \| 'lg'`                           | `'md'`      | 按钮尺寸                  |
| `disabled` | `boolean`                                        | `false`     | 是否禁用                  |
| `loading`  | `boolean`                                        | `false`     | 是否加载中                |
| `block`    | `boolean`                                        | `false`     | 是否为块级（宽度 100%）   |
| `icon`     | `string \| Component`                            | —           | 图标（字符串或 Vue 组件） |

### Slots

| 名称      | 说明                                       |
| --------- | ------------------------------------------ |
| `default` | 按钮文字（**优先级高于 `label` prop**）    |
| `icon`    | 左侧图标内容（**优先级高于 `icon` prop**） |

### Events

| 事件    | 参数                  | 说明                             |
| ------- | --------------------- | -------------------------------- |
| `click` | `(event: MouseEvent)` | 点击回调（禁用或加载时不会触发） |

## 注意事项

- `label` prop 与默认插槽同时存在时，**默认插槽优先**
- `icon` prop 与 `#icon` 插槽同时存在时，**插槽优先**
- `loading` 状态下，按钮自动禁用，图标和文字会被加载动画替代
- `icon` prop 支持传入 Vue 组件（如 `:icon="IconHome"`）或字符串（如 `icon="✓"`）
