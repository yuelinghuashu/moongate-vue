# Checkbox 复选框

复选框组件，用于多选或开关选项。

> **何时使用**：需要用户从一组选项中选择多个，或切换一个布尔值时使用。单选请使用 Radio。

> **注意**：Checkbox 组件只负责复选框本身，错误消息需要由使用者自行渲染。

## 基础用法

:::demo

```vue
<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <Checkbox label="同意用户协议" />
  </div>
</template>

<script setup>
import { Checkbox } from 'moongate-vue'
</script>
```

:::

## v-model 绑定

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Checkbox } from 'moongate-vue'

const agreed = ref(false)
</script>

<template>
  <div>
    <Checkbox v-model="agreed" label="我已阅读并同意" />
    <p>当前状态: {{ agreed ? '✅ 已同意' : '⬜ 未同意' }}</p>
  </div>
</template>
```

:::

## 多选（数组模式）

通过 `value` 属性实现多选，`v-model` 绑定数组。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Checkbox } from 'moongate-vue'

const colors = ref([])
const options = [
  { label: '红色', value: 'red' },
  { label: '绿色', value: 'green' },
  { label: '蓝色', value: 'blue' },
]
</script>

<template>
  <div>
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <Checkbox
        v-for="item in options"
        :key="item.value"
        v-model="colors"
        :value="item.value"
        :label="item.label"
      />
    </div>
    <p>已选: {{ colors.join(', ') }}</p>
  </div>
</template>
```

:::

## 尺寸

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    <Checkbox size="sm" label="小号" />
    <Checkbox size="md" label="中号" />
    <Checkbox size="lg" label="大号" />
  </div>
</template>

<script setup>
import { Checkbox } from 'moongate-vue'
</script>
```

:::

## 禁用状态

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    <Checkbox disabled label="已禁用" />
    <Checkbox disabled :model-value="true" label="已禁用（选中）" />
  </div>
</template>

<script setup>
import { Checkbox } from 'moongate-vue'
</script>
```

:::

## 错误状态

`error` 属性仅控制复选框边框颜色，不渲染错误消息。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Checkbox } from 'moongate-vue'

const agree = ref(false)
</script>

<template>
  <div>
    <Checkbox v-model="agree" :error="!agree" label="请同意后继续" />
  </div>
</template>
```

:::

## 自定义标签（插槽）

:::demo

```vue
<template>
  <Checkbox>
    <span style="display: flex; align-items: center; gap: 4px;">
      我已阅读
      <a href="/terms" class="mg-link">《用户协议》</a>
    </span>
  </Checkbox>
</template>

<script setup>
import { Checkbox } from 'moongate-vue'
</script>
```

:::

## API

### Props

| 属性         | 类型                   | 默认值      | 说明                       |
| ------------ | ---------------------- | ----------- | -------------------------- |
| `modelValue` | `boolean \| any[]`     | `false`     | 复选框值（v-model）        |
| `label`      | `string`               | `''`        | 标签文字                   |
| `value`      | `string \| number`     | `undefined` | 复选框的值（用于数组绑定） |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`      | 尺寸                       |
| `disabled`   | `boolean`              | `false`     | 是否禁用                   |
| `error`      | `boolean`              | `false`     | 是否显示错误状态           |

### Slots

| 名称      | 说明                           |
| --------- | ------------------------------ |
| `default` | 标签内容（优先级高于 `label`） |

### Events

| 事件                | 参数                        | 说明             |
| ------------------- | --------------------------- | ---------------- |
| `update:modelValue` | `(value: boolean \| any[])` | 值变化时触发     |
| `change`            | `(event: Event)`            | 原生 change 事件 |

## 注意事项

- 复选框默认使用自定义样式，不依赖浏览器原生样式
- `error` 属性仅控制边框颜色，不渲染错误消息
- 支持两种模式：
  - **布尔模式**：`v-model` 绑定 `boolean`，无 `value` 属性
  - **数组模式**：`v-model` 绑定数组，设置 `value` 属性
- 聚焦时显示聚焦环，确保可访问性
