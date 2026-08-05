# Textarea 多行文本输入框

多行文本输入框组件，用于接收多行文本输入。

> **注意**：Textarea 组件只负责输入框本身，错误消息需要由使用者自行渲染，以获得最大的布局灵活性。

## 基础用法

:::demo

```vue
<template>
  <div style="width: 320px;">
    <Textarea placeholder="请输入内容" />
  </div>
</template>

<script setup>
import { Textarea } from 'moongate-vue'
</script>
```

:::

## v-model 绑定

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Textarea } from 'moongate-vue'

const comment = ref('')
</script>

<template>
  <div style="width: 320px;">
    <Textarea v-model="comment" placeholder="写下你的评论..." />
    <p style="margin-top: 8px;">输入内容: {{ comment || '暂无' }}</p>
  </div>
</template>
```

:::

## 自定义行数

设置 `rows` 属性控制默认显示行数。

:::demo

```vue
<template>
  <div style="width: 320px;">
    <Textarea rows="5" placeholder="显示 5 行" />
  </div>
</template>

<script setup>
import { Textarea } from 'moongate-vue'
</script>
```

:::

## 自动高度

如需内容自适应高度，推荐使用 CSS `field-sizing` 属性（Chrome 123+ 支持）：

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Textarea } from 'moongate-vue'

const content = ref('')
</script>

<template>
  <div style="width: 320px;">
    <Textarea v-model="content" class="auto-grow" placeholder="内容越多，高度越高" :rows="1" />
  </div>
</template>

<style scoped>
.auto-grow {
  field-sizing: content;
  resize: none;
}
</style>
```

:::

> 兼容性提示：field-sizing 是较新的 CSS 属性，Chrome 123+、Edge 123+ 支持。如需兼容旧浏览器，请自行实现 JS 方案。

## 尺寸

:::demo

```vue
<template>
  <div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap;">
    <div style="width: 200px;">
      <Textarea size="sm" placeholder="小号" rows="2" />
    </div>
    <div style="width: 200px;">
      <Textarea size="md" placeholder="中号" rows="2" />
    </div>
    <div style="width: 200px;">
      <Textarea size="lg" placeholder="大号" rows="2" />
    </div>
  </div>
</template>

<script setup>
import { Textarea } from 'moongate-vue'
</script>
```

:::

## 错误状态

`error` 属性仅控制输入框的边框和聚焦环样式，不渲染错误消息。

:::demo

```vue
<template>
  <div style="width: 320px;">
    <Textarea :error="true" placeholder="输入有误" />
  </div>
</template>

<script setup>
import { Textarea } from 'moongate-vue'
</script>
```

:::

## 错误消息（用户自行控制）

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Textarea } from 'moongate-vue'

const content = ref('')
const contentError = ref('内容不能为空')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 4px; width: 320px;">
    <Textarea v-model="content" :error="!!contentError" placeholder="请输入内容" rows="2" />
    <span v-if="contentError" style="color: var(--ui-error); font-size: 12px;">
      {{ contentError }}
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
      <Textarea disabled value="已禁用" rows="2" />
    </div>
    <div style="width: 200px;">
      <Textarea readonly value="只读内容" rows="2" />
    </div>
  </div>
</template>

<script setup>
import { Textarea } from 'moongate-vue'
</script>
```

:::

## 控制拖拽行为

默认情况下，用户可以垂直拖拽调整大小。可通过 CSS 覆盖：

```vue
<!-- 禁用拖拽 -->
<Textarea class="resize-none" />

<!-- 允许水平拖拽 -->
<Textarea class="resize-horizontal" />

<!-- 允许双向拖拽 -->
<Textarea class="resize-both" />
```

```css
.resize-none {
  resize: none;
}
.resize-horizontal {
  resize: horizontal;
}
.resize-both {
  resize: both;
}
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
- 如需自动高度功能，推荐使用 CSS `field-sizing: content`
