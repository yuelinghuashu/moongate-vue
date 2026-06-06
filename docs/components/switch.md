# Switch 开关

开关组件，用于切换布尔值状态（开/关）。

## 基础用法

:::demo

```vue
<script setup>
import { ref } from "vue"
import { Switch } from "moongate-vue"

const darkMode = ref(false)
</script>

<template>
  <div>
    <Switch v-model="darkMode" label="深色模式" />
    <p style="margin-top: 12px;">当前状态: {{ darkMode ? "开启" : "关闭" }}</p>
  </div>
</template>
```

:::

## 尺寸

:::demo

```vue
<script setup>
import { ref } from "vue"
import { Switch } from "moongate-vue"

const valueSm = ref(false)
const valueMd = ref(false)
const valueLg = ref(false)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <Switch v-model="valueSm" size="sm" label="小号" />
    <Switch v-model="valueMd" size="md" label="中号" />
    <Switch v-model="valueLg" size="lg" label="大号" />
  </div>
</template>
```

:::

## 禁用状态

:::demo

```vue
<script setup>
import { Switch } from "moongate-vue"
</script>

<template>
  <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
    <Switch disabled label="已禁用" />
    <Switch disabled :model-value="true" label="已禁用（开启）" />
  </div>
</template>
```

:::

## 错误状态

`error` 属性仅控制开关边框颜色，不渲染错误消息。

:::demo

```vue
<script setup>
import { ref } from "vue"
import { Switch } from "moongate-vue"

const agree = ref(false)
</script>

<template>
  <div>
    <Switch v-model="agree" :error="!agree" label="请同意协议" />
    <span
      v-if="!agree"
      style="color: var(--ui-error); font-size: 12px; margin-top: 4px; display: inline-block;"
    >
      请同意协议
    </span>
  </div>
</template>
```

:::

## 自定义标签（插槽）

:::demo

```vue
<script setup>
import { ref } from "vue"
import { Switch } from "moongate-vue"

const notifications = ref(false)
</script>

<template>
  <Switch v-model="notifications">
    <template #label>
      <span style="display: flex; align-items: center; gap: 4px;"
        >🔔 接收通知</span
      >
    </template>
  </Switch>
  <p style="margin-top: 12px;">
    通知状态: {{ notifications ? "开启" : "关闭" }}
  </p>
</template>
```

:::

## API

### Props

| 属性         | 类型                   | 默认值  | 说明                |
| ------------ | ---------------------- | ------- | ------------------- |
| `modelValue` | `boolean`              | `false` | 开关状态（v-model） |
| `label`      | `string`               | `''`    | 标签文字            |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`  | 尺寸                |
| `disabled`   | `boolean`              | `false` | 是否禁用            |
| `error`      | `boolean`              | `false` | 是否显示错误状态    |

### Slots

| 名称      | 说明                           |
| --------- | ------------------------------ |
| `default` | 标签内容（优先级高于 `label`） |

### Events

| 事件                | 参数               | 说明             |
| ------------------- | ------------------ | ---------------- |
| `update:modelValue` | `(value: boolean)` | 状态变化时触发   |
| `change`            | `(event: Event)`   | 原生 change 事件 |

## 注意事项

- Switch 本质是一个特殊样式的 Checkbox，行为一致
- `error` 属性仅控制边框颜色，不渲染错误消息
- 聚焦时显示聚焦环，确保可访问性
