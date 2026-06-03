# Input 输入框

输入框组件，用于接收用户输入。

> **注意**：Input 组件只负责输入框本身，错误消息需要由使用者自行渲染，以获得最大的布局灵活性。

## 基础用法

```vue
<Input placeholder="请输入内容" />
```

## v-model 绑定

```vue
<script setup>
const value = ref("")
</script>

<template>
  <Input v-model="value" placeholder="输入内容" />
</template>
```

## 尺寸

```vue
<Input size="sm" placeholder="小号" />
<Input size="md" placeholder="中号" />
<Input size="lg" placeholder="大号" />
```

## 错误状态

`error` 属性仅控制输入框的边框和聚焦环样式，不渲染错误消息。

```vue
<Input :error="true" placeholder="输入有误" />
```

## 错误消息（用户自行控制）

通过组合工具类，可以灵活控制错误消息的位置。

### 消息在下方

```vue
<div class="flex flex-col gap-1">
  <Input v-model="username" :error="!!usernameError" />
  <span v-if="usernameError" class="text-error text-sm">{{ usernameError }}</span>
</div>
```

### 消息在右侧

```vue
<div class="flex items-center gap-2">
  <Input v-model="email" :error="!!emailError" class="flex-1" />
  <span v-if="emailError" class="text-error text-sm">{{ emailError }}</span>
</div>
```

## 禁用与只读

```vue
<Input disabled placeholder="已禁用" />
<Input readonly value="只读内容" />
```

## 不同类型

```vue
<Input type="email" placeholder="邮箱" />
<Input type="password" placeholder="密码" />
<Input type="number" placeholder="数字" />
```

## API

### Props

| 属性          | 类型                                                            | 默认值   | 说明                   |
| ------------- | --------------------------------------------------------------- | -------- | ---------------------- |
| `type`        | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url'` | `'text'` | 输入框类型             |
| `modelValue`  | `string`                                                        | `''`     | 输入框的值（v-model）  |
| `placeholder` | `string`                                                        | `''`     | 占位文本               |
| `disabled`    | `boolean`                                                       | `false`  | 是否禁用               |
| `readonly`    | `boolean`                                                       | `false`  | 是否只读               |
| `size`        | `'sm' \| 'md' \| 'lg'`                                          | `'md'`   | 尺寸                   |
| `error`       | `boolean`                                                       | `false`  | 错误状态（仅控制样式） |

### Events

| 事件                | 参数                  | 说明                  |
| ------------------- | --------------------- | --------------------- |
| `update:modelValue` | `(value: string)`     | 输入时触发（v-model） |
| `input`             | `(event: Event)`      | 原生 input 事件       |
| `change`            | `(event: Event)`      | 原生 change 事件      |
| `focus`             | `(event: FocusEvent)` | 获得焦点时触发        |
| `blur`              | `(event: FocusEvent)` | 失去焦点时触发        |

## 注意事项

- 输入框默认宽度 100%，填满父容器
- `error` 属性仅控制样式，不渲染错误消息
- 错误消息需要用户自行渲染，以获得最大的布局灵活性
- 聚焦时显示主题色边框和聚焦环，错误状态下聚焦环变为错误色
- 原生属性（`id`、`name` 等）通过 `v-bind="$attrs"` 自动透传，无需额外声明
