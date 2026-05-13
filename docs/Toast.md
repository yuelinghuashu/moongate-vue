# Toast 通知

通知组件，用于操作反馈提示。

## 函数式调用（推荐）

```vue
<script setup>
import { useToast } from "moongate-ui"

const toast = useToast()

// 成功
toast.success("评论发布成功")

// 错误
toast.error("发布失败，请重试")

// 警告
toast.warning("内容不能为空")

// 信息
toast.info("正在加载...")

// 自定义
toast.show({
  message: "自定义提示",
  type: "success",
  duration: 5000,
  closable: true,
  position: "bottom",
})
</script>
```

## Nuxt 环境使用

在 Nuxt 中，Toast 涉及 DOM 操作，需要确保只在客户端执行：

```vue
<script setup>
import { useToast } from "moongate-ui"

const toast = useToast()

const handleSuccess = () => {
  // 方式一：使用 import.meta.client
  if (import.meta.client) {
    toast.success("操作成功")
  }
}

const handleError = () => {
  // 方式二：使用 process.client
  if (process.client) {
    toast.error("操作失败")
  }
}
</script>

<template>
  <Button @click="handleSuccess" label="成功" />
  <Button @click="handleError" label="错误" />
</template>
```

### Nuxt 插件方式（推荐）

创建 `plugins/toast.client.ts`：

```typescript
import { useToast as useToastCore } from "moongate-ui"

export default defineNuxtPlugin(() => {
  const toast = useToastCore()
  
  return {
    provide: {
      toast,
    },
  }
})
```

然后在组件中使用：

```vue
<script setup>
const { $toast } = useNuxtApp()

const handleClick = () => {
  $toast.success("操作成功")
}
</script>

<template>
  <Button @click="handleClick" label="显示提示" />
</template>
```

> **注意**：插件文件名必须包含 `.client` 后缀，确保只在客户端执行。

## 组件式调用

```vue
<Button @click="show = true" label="显示提示" />
<Toast v-model="show" message="操作成功" type="success" />
```

## 自定义图标

```vue
<Toast v-model="show" type="success">
  <template #icon>
    <span>🎉</span>
  </template>
  自定义图标
</Toast>
```

## API

### Props

| 属性         | 类型                                          | 默认值   | 说明                               |
| ------------ | --------------------------------------------- | -------- | ---------------------------------- |
| `modelValue` | `boolean`                                     | `false`  | 是否显示（v-model）                |
| `message`    | `string`                                      | `''`     | 消息内容                           |
| `type`       | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | 通知类型                           |
| `duration`   | `number`                                      | `3000`   | 持续时间（毫秒），0 表示不自动关闭 |
| `closable`   | `boolean`                                     | `false`  | 是否显示关闭按钮                   |
| `position`   | `'top' \| 'bottom'`                           | `'top'`  | 显示位置                           |
| `icon`       | `string`                                      | `''`     | 自定义图标                         |

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
- **Nuxt 环境中**：需要确保在客户端执行，使用 `if (import.meta.client)` 判断
- **Nuxt 插件**：建议使用 `.client.ts` 后缀，或使用 `import.meta.client` 判断
- 同时显示多个通知时会堆叠显示（后出现的在下方）
- 通知会自动消失，也可手动关闭（需启用 `closable`）
- 支持顶部和底部两种位置
- 移动端自动适配铺满宽度