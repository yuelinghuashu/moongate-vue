# Nuxt 集成

`Message` 和 `Toast` 涉及 DOM 操作，在 Nuxt 中需要确保只在客户端执行。

## 方法一：运行时判断

通过 `import.meta.client` 判断当前是否为客户端环境：

```vue
<script setup>
import { useMessage, Button } from 'moongate-vue'

const message = useMessage()

const handleSuccess = () => {
  if (import.meta.client) {
    message.success('操作成功')
  }
}
</script>

<template>
  <Button @click="handleSuccess" label="成功" />
</template>
```

## 方法二：Nuxt 插件方式（推荐）

创建 `plugins/message.client.ts`（或 `plugins/toast.client.ts`）：

```typescript
import { useMessage as useMessageCore } from 'moongate-vue'

export default defineNuxtPlugin(() => {
  const message = useMessageCore()

  return {
    provide: {
      message,
    },
  }
})
```

然后在组件中使用：

```vue
<script setup>
import { Button } from 'moongate-vue'

// 在 Nuxt 环境中使用 $message
// const { $message } = useNuxtApp()

const handleClick = () => {
  // $message.success("操作成功")
}
</script>

<template>
  <Button @click="handleClick" label="显示提示" />
</template>
```

> **注意**：插件文件名必须包含 `.client` 后缀，确保只在客户端执行。

## 其他组件

其余组件（Button、Card、Input 等）均为 SSR 安全的，无需额外处理即可在 Nuxt 中使用。
