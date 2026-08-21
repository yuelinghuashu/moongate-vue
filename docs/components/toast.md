# Toast 通知

通知组件，用于操作反馈提示。

> **何时使用**：操作完成后需要短暂反馈（成功、失败、警告）时使用，自动消失。

## 函数式调用（推荐）

:::demo

```vue
<script setup>
import { useToast, Button } from 'moongate-vue'

const toast = useToast()

const handleSuccess = () => toast.success('评论发布成功')
const handleError = () => toast.error('发布失败，请重试')
const handleWarning = () => toast.warning('内容不能为空')
const handleInfo = () => toast.info('正在加载...')
const handleCustom = () =>
  toast.show({
    message: '自定义提示',
    type: 'success',
    duration: 5000,
    closable: true,
    position: 'bottom',
  })
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <Button @click="handleSuccess" label="成功" />
    <Button @click="handleError" label="错误" />
    <Button @click="handleWarning" label="警告" />
    <Button @click="handleInfo" label="信息" />
    <Button @click="handleCustom" label="自定义" />
  </div>
</template>
```

:::

## Nuxt 环境使用

在 Nuxt 中使用 Toast，需要确保只在客户端执行。详见 [Nuxt 集成指南](/guide/nuxt-integration)。

## 组件式调用

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Toast } from 'moongate-vue'

const show = ref(false)
</script>

<template>
  <div>
    <Button @click="show = true" label="显示提示" />
    <Toast v-model="show" message="操作成功" type="success" />
  </div>
</template>
```

:::

## 自定义图标

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Toast } from 'moongate-vue'

const show = ref(false)
</script>

<template>
  <div>
    <Button @click="show = true" label="显示自定义提示" />
    <Toast v-model="show" type="success">
      <template #icon>
        <span>🎉</span>
      </template>
      自定义图标
    </Toast>
  </div>
</template>
```

:::

## API

### Props

| 属性             | 类型                                          | 默认值   | 说明                                           |
| ---------------- | --------------------------------------------- | -------- | ---------------------------------------------- |
| `modelValue`     | `boolean`                                     | `false`  | 是否显示（v-model）                            |
| `message`        | `string`                                      | `''`     | 消息内容                                       |
| `type`           | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | 通知类型                                       |
| `duration`       | `number`                                      | `3000`   | 持续时间（毫秒），0 表示不自动关闭             |
| `closable`       | `boolean`                                     | `false`  | 是否显示关闭按钮                               |
| `position`       | `'top' \| 'bottom'`                           | `'top'`  | 显示位置                                       |
| `icon`           | `string`                                      | `''`     | 自定义图标（不传则按类型显示默认图标 ✓ ✗ ⚠ ℹ） |
| `closeAriaLabel` | `string`                                      | `''`     | 关闭按钮的 aria-label                          |

### Slots

| 名称      | 说明                                  |
| --------- | ------------------------------------- |
| `default` | 消息内容（优先级高于 `message` prop） |
| `icon`    | 自定义图标                            |

### Events

| 事件                | 参数               | 说明               |
| ------------------- | ------------------ | ------------------ |
| `update:modelValue` | `(value: boolean)` | 显示状态变化时触发 |
| `close`             | —                  | 关闭时触发         |

## useToast API

### 方法

| 方法      | 参数                          | 说明     |
| --------- | ----------------------------- | -------- |
| `show`    | `(options: ToastOptions)`     | 显示通知 |
| `success` | `(message: string, options?)` | 成功通知 |
| `error`   | `(message: string, options?)` | 错误通知 |
| `warning` | `(message: string, options?)` | 警告通知 |
| `info`    | `(message: string, options?)` | 信息通知 |

### ToastOptions

| 属性       | 类型                                          | 默认值   | 说明       |
| ---------- | --------------------------------------------- | -------- | ---------- |
| `message`  | `string`                                      | —        | 消息内容   |
| `type`     | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | 通知类型   |
| `duration` | `number`                                      | `3000`   | 持续时间   |
| `closable` | `boolean`                                     | `false`  | 是否可关闭 |
| `position` | `'top' \| 'bottom'`                           | `'top'`  | 显示位置   |
| `icon`     | `string`                                      | `''`     | 自定义图标 |

## 注意事项

- 推荐使用 `useToast` 函数式调用，代码更简洁
- **Nuxt 环境中**：请参考 [Nuxt 集成指南](/guide/nuxt-integration)
- 同时显示多个通知时会堆叠显示（后出现的在下方）
- 通知会自动消失，也可手动关闭（需启用 `closable`）
- 未传 `icon` 时，每种类型会自动显示默认图标：`success` → ✓、`error` → ✗、`warning` → ⚠、`info` → ℹ
- 支持顶部和底部两种位置
- 移动端自动适配铺满宽度
