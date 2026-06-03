# Checkbox 复选框

复选框组件，用于多选或开关选项。

> **注意**：Checkbox 组件只负责复选框本身，错误消息需要由使用者自行渲染。

## 基础用法

```vue
<Checkbox label="同意用户协议" />
```

## v-model 绑定

```vue
<script setup>
const agreed = ref(false)
</script>

<template>
  <Checkbox v-model="agreed" label="我已阅读并同意" />
  <p>当前状态: {{ agreed ? "✅ 已同意" : "⬜ 未同意" }}</p>
</template>
```

## 多选（数组模式）

通过 `value` 属性实现多选，`v-model` 绑定数组。

```vue
<script setup>
const colors = ref([])
const options = [
  { label: "红色", value: "red" },
  { label: "绿色", value: "green" },
  { label: "蓝色", value: "blue" },
]
</script>

<template>
  <Checkbox
    v-for="item in options"
    :key="item.value"
    v-model="colors"
    :value="item.value"
    :label="item.label"
  />
  <p>已选: {{ colors.join(", ") }}</p>
</template>
```

## 尺寸

```vue
<Checkbox size="sm" label="小号" />
<Checkbox size="md" label="中号" />
<Checkbox size="lg" label="大号" />
```

## 禁用状态

```vue
<Checkbox disabled label="已禁用" />
<Checkbox disabled checked label="已禁用（选中）" />
```

## 错误状态

`error` 属性仅控制复选框边框颜色，不渲染错误消息。

```vue
<Checkbox v-model="agree" :error="!agree" label="请同意后继续" />
```

## 自定义标签（插槽）

```vue
<Checkbox>
  <span class="flex items-center gap-1">
    我已阅读<a href="/terms" class="mg-link">《用户协议》</a>
  </span>
</Checkbox>
```

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
