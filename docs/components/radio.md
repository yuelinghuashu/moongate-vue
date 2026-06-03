# Radio 单选框

单选框组件，用于在一组选项中选择一个。

> **注意**：Radio 选中后不能取消选中，只能通过选择另一个 Radio 来改变。如需可取消的选项，请使用 Checkbox。

## 基础用法

```vue
<Radio v-model="gender" value="male" label="男" />
<Radio v-model="gender" value="female" label="女" />
```

## 默认选中

```vue
<Radio v-model="size" value="small" label="小号" />
<Radio v-model="size" value="medium" label="中号" />
<Radio v-model="size" value="large" label="大号" />
```

## v-for 循环

```vue
<script setup>
const selected = ref("option1")
const options = [
  { label: "选项一", value: "option1" },
  { label: "选项二", value: "option2" },
  { label: "选项三", value: "option3" },
]
</script>

<template>
  <Radio
    v-for="item in options"
    :key="item.value"
    v-model="selected"
    :value="item.value"
    :label="item.label"
  />
</template>
```

## 尺寸

```vue
<Radio v-model="radioSize" size="sm" value="sm" label="小号" />
<Radio v-model="radioSize" size="md" value="md" label="中号" />
<Radio v-model="radioSize" size="lg" value="lg" label="大号" />
```

## 禁用状态

```vue
<Radio disabled value="disabled1" label="已禁用（未选中）" />
<Radio
  disabled
  value="disabled2"
  label="已禁用（选中）"
  :model-value="disabledSelected"
/>
```

## 错误状态

`error` 属性仅控制单选框边框颜色，不渲染错误消息。

```vue
<Radio v-model="agree" value="yes" :error="!agree" label="请同意协议" />
<span v-if="!agree" class="text-error text-sm">请勾选此选项</span>
```

## API

### Props

| 属性         | 类型                   | 默认值      | 说明                    |
| ------------ | ---------------------- | ----------- | ----------------------- |
| `modelValue` | `string \| number`     | `undefined` | 当前选中的值（v-model） |
| `label`      | `string`               | `''`        | 标签文字                |
| `value`      | `string \| number`     | `undefined` | 单选框的值              |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`      | 尺寸                    |
| `disabled`   | `boolean`              | `false`     | 是否禁用                |
| `error`      | `boolean`              | `false`     | 是否显示错误状态        |

### Slots

| 名称      | 说明                           |
| --------- | ------------------------------ |
| `default` | 标签内容（优先级高于 `label`） |

### Events

| 事件                | 参数                        | 说明             |
| ------------------- | --------------------------- | ---------------- |
| `update:modelValue` | `(value: string \| number)` | 值变化时触发     |
| `change`            | `(event: Event)`            | 原生 change 事件 |

## 注意事项

- Radio 选中后不能取消选中，只能通过选择另一个 Radio 来改变
- 同一组的 Radio 建议设置相同的 `name` 属性，以确保键盘导航正确
- `error` 属性仅控制边框颜色，不渲染错误消息
- 聚焦时显示聚焦环，确保可访问性
- 使用 `visibility` 控制圆点显隐，避免布局偏移
