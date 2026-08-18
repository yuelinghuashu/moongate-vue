# Message 消息提示

消息提示组件，用于操作反馈提示，与 Toast 类似但位置不同（顶部居中）。

## 函数式调用（推荐）

:::demo

```vue
<script setup>
import { useMessage, Button } from 'moongate-vue'

const message = useMessage()

const handleSuccess = () => message.success('保存成功')
const handleError = () => message.error('保存失败，请重试')
const handleWarning = () => message.warning('内容不能为空')
const handleInfo = () => message.info('正在加载...')
const handleCustom = () =>
  message.show({
    message: '自定义提示',
    type: 'success',
    duration: 5000,
    closable: true,
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

在 Nuxt 中使用 Message，需要确保只在客户端执行。详见 [Nuxt 集成指南](/guide/nuxt-integration)。

## 组件式调用

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Message } from 'moongate-vue'

const show = ref(false)
</script>

<template>
  <div>
    <Button @click="show = true" label="显示消息" />
    <Message v-model="show" message="操作成功" type="success" />
  </div>
</template>
```

:::

## 自定义图标

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Message } from 'moongate-vue'

const show = ref(false)
</script>

<template>
  <div>
    <Button @click="show = true" label="显示自定义消息" />
    <Message v-model="show" type="success">
      <template #icon>
        <span>🎉</span>
      </template>
      自定义图标
    </Message>
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
| `type`           | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | 消息类型                                       |
| `duration`       | `number`                                      | `3000`   | 持续时间（毫秒），0 表示不自动关闭             |
| `closable`       | `boolean`                                     | `false`  | 是否显示关闭按钮                               |
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

## useMessage API

### 方法

| 方法      | 参数                          | 说明     |
| --------- | ----------------------------- | -------- |
| `show`    | `(options: MessageOptions)`   | 显示消息 |
| `success` | `(message: string, options?)` | 成功消息 |
| `error`   | `(message: string, options?)` | 错误消息 |
| `warning` | `(message: string, options?)` | 警告消息 |
| `info`    | `(message: string, options?)` | 信息消息 |

### MessageOptions

| 属性       | 类型                                          | 默认值   | 说明       |
| ---------- | --------------------------------------------- | -------- | ---------- |
| `message`  | `string`                                      | —        | 消息内容   |
| `type`     | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | 消息类型   |
| `duration` | `number`                                      | `3000`   | 持续时间   |
| `closable` | `boolean`                                     | `false`  | 是否可关闭 |
| `icon`     | `string`                                      | `''`     | 自定义图标 |

## Message vs Toast

| 特性     | Message      | Toast    |
| -------- | ------------ | -------- |
| 位置     | 顶部居中     | 右上角   |
| 动画     | 淡入淡出     | 右侧滑入 |
| 使用场景 | 常规操作反馈 | 轻量提示 |
| 持久化   | 自动消失     | 自动消失 |

## 注意事项

- 推荐使用 `useMessage` 函数式调用，代码更简洁
- **Nuxt 环境中**：请参考 [Nuxt 集成指南](/guide/nuxt-integration)
- 同时显示多条消息时会堆叠显示（后出现的在下方）
- 消息会自动消失，也可手动关闭（需启用 `closable`）
- 未传 `icon` 时，每种类型会自动显示默认图标：`success` → ✓、`error` → ✗、`warning` → ⚠、`info` → ℹ
- 移动端自动适配铺满宽度
