# Textarea 多行文本输入框

多行文本输入框组件，用于接收多行文本输入。

> **注意**：Textarea 组件只负责输入框本身，错误消息需要由使用者自行渲染，以获得最大的布局灵活性。

## 基础用法

```vue
<Textarea placeholder="请输入内容" />
```

## v-model 绑定

```vue
<script setup>
const comment = ref("")
</script>

<template>
  <Textarea v-model="comment" placeholder="写下你的评论..." />
</template>
```

## 自定义行数

```vue
<Textarea rows="5" placeholder="更多行数" />
```

## 尺寸

```vue
<Textarea size="sm" placeholder="小号" />
<Textarea size="md" placeholder="中号" />
<Textarea size="lg" placeholder="大号" />
```

## 错误状态

`error` 属性仅控制输入框的边框和聚焦环样式，不渲染错误消息。

```vue
<Textarea :error="true" placeholder="输入有误" />
```

## 错误消息（用户自行控制）

```vue
<div class="flex flex-col gap-1">
  <Textarea v-model="content" :error="!!contentError" />
  <span v-if="contentError" class="text-error text-sm">{{ contentError }}</span>
</div>
```

## 禁用与只读

```vue
<Textarea disabled value="已禁用" />
<Textarea readonly value="只读内容" />
```

## API

### Props

| 属性          | 类型                   | 默认值  | 说明                   |
| ------------- | ---------------------- | ------- | ---------------------- |
| `modelValue`  | `string`               | `''`    | 输入框的值（v-model）  |
| `placeholder` | `string`               | `''`    | 占位文本               |
| `disabled`    | `boolean`              | `false` | 是否禁用               |
| `readonly`    | `boolean`              | `false` | 是否只读               |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`  | 尺寸                   |
| `rows`        | `number`               | `3`     | 显示行数               |
| `error`       | `boolean`              | `false` | 错误状态（仅控制样式） |

### Events

| 事件                | 参数                  | 说明                  |
| ------------------- | --------------------- | --------------------- |
| `update:modelValue` | `(value: string)`     | 输入时触发（v-model） |
| `input`             | `(event: Event)`      | 原生 input 事件       |
| `change`            | `(event: Event)`      | 原生 change 事件      |
| `focus`             | `(event: FocusEvent)` | 获得焦点时触发        |
| `blur`              | `(event: FocusEvent)` | 失去焦点时触发        |

## 注意事项

- 文本域默认宽度 100%，填满父容器
- 默认支持垂直方向调整大小（`resize: vertical`）
- `error` 属性仅控制样式，不渲染错误消息
- 错误消息需要用户自行渲染，以获得最大的布局灵活性
- 聚焦时显示主题色边框和聚焦环，错误状态下聚焦环变为错误色
- 原生属性（`id`、`name` 等）通过 `v-bind="$attrs"` 自动透传
