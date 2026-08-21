# Input 输入框

输入框组件，用于接收用户输入。

> **何时使用**：需要接收用户单行文本输入时使用。多行文本请使用 Textarea。

> **注意**：Input 组件只负责输入框本身，错误消息需要由使用者自行渲染，以获得最大的布局灵活性。

## 基础用法

:::demo

```vue
<template>
  <div style="width: 320px;">
    <Input placeholder="请输入内容" />
  </div>
</template>

<script setup>
import { Input } from 'moongate-vue'
</script>
```

:::

## v-model 绑定

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Input } from 'moongate-vue'

const value = ref('')
</script>

<template>
  <div style="width: 320px;">
    <Input v-model="value" placeholder="输入内容" />
    <p style="margin-top: 8px;">输入内容: {{ value }}</p>
  </div>
</template>
```

:::

## 尺寸

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    <div style="width: 200px;">
      <Input size="sm" placeholder="小号" />
    </div>
    <div style="width: 200px;">
      <Input size="md" placeholder="中号" />
    </div>
    <div style="width: 200px;">
      <Input size="lg" placeholder="大号" />
    </div>
  </div>
</template>

<script setup>
import { Input } from 'moongate-vue'
</script>
```

:::

## 错误状态

`error` 属性仅控制输入框的边框和聚焦环样式，不渲染错误消息。

:::demo

```vue
<template>
  <div style="width: 320px;">
    <Input :error="true" placeholder="输入有误" />
  </div>
</template>

<script setup>
import { Input } from 'moongate-vue'
</script>
```

:::

## 错误消息（用户自行控制）

通过组合工具类，可以灵活控制错误消息的位置。

### 消息在下方

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Input } from 'moongate-vue'

const username = ref('')
const usernameError = ref('用户名不能为空')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 4px; width: 320px;">
    <Input v-model="username" :error="!!usernameError" placeholder="请输入用户名" />
    <span v-if="usernameError" style="color: var(--ui-error); font-size: 12px;">
      {{ usernameError }}
    </span>
  </div>
</template>
```

:::

### 消息在右侧

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Input } from 'moongate-vue'

const email = ref('')
const emailError = ref('邮箱格式错误')
</script>

<template>
  <div style="display: flex; align-items: center; gap: 8px; width: 400px;">
    <Input v-model="email" :error="!!emailError" placeholder="请输入邮箱" style="flex: 1;" />
    <span v-if="emailError" style="color: var(--ui-error); font-size: 12px; white-space: nowrap;">
      {{ emailError }}
    </span>
  </div>
</template>
```

:::

## 禁用与只读

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <div style="width: 200px;">
      <Input disabled placeholder="已禁用" />
    </div>
    <div style="width: 200px;">
      <Input readonly value="只读内容" />
    </div>
  </div>
</template>

<script setup>
import { Input } from 'moongate-vue'
</script>
```

:::

## 不同类型

:::demo

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px; width: 320px;">
    <Input type="email" placeholder="邮箱" />
    <Input type="password" placeholder="密码" />
    <Input type="number" placeholder="数字" />
  </div>
</template>

<script setup>
import { Input } from 'moongate-vue'
</script>
```

:::

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
