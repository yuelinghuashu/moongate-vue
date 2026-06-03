# Switch 开关

开关组件，用于切换布尔值状态（开/关）。

## 基础用法

```vue
<Switch v-model="darkMode" label="深色模式" />
```

## 尺寸

```vue
<Switch v-model="value" size="sm" label="小号" />
<Switch v-model="value" size="md" label="中号" />
<Switch v-model="value" size="lg" label="大号" />
```

## 禁用状态

```vue
<Switch disabled label="已禁用" />
<Switch disabled :model-value="true" label="已禁用（开启）" />
```

## 错误状态

`error` 属性仅控制开关边框颜色，不渲染错误消息。

```vue
<Switch v-model="agree" :error="!agree" label="请同意协议" />
```

## 自定义标签（插槽）

```vue
<Switch v-model="notifications">
  <template #label>
    <span class="flex items-center gap-1">🔔 接收通知</span>
  </template>
</Switch>
```

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
