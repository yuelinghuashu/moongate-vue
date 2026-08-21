# Nuxt 集成

## SSR 支持（开箱即用）

组件库已内置 SSR 支持，全部 28 个组件在 Nuxt / VitePress 等服务端渲染环境中开箱即用，无需额外配置：

- 所有 DOM 访问均带浏览器环境守卫，`renderToString` 不会崩溃
- 组件 ID 使用 Vue 3.5 的 `useId()`，服务端与客户端 hydration 一致
- 样式为纯 CSS 变量，SSR 下无任何运行时开销

## Message / Toast：唯一需要注意的点

`Message` 和 `Toast` 是命令式调用（`useMessage().success()`），涉及动态创建并挂载 DOM。在 SSR 阶段调用时会**静默失败**——不报错，但提示不会显示。因此需要确保调用发生在客户端。

### 事件处理器中调用（天然安全）

事件处理器只在客户端执行，无需任何判断：

```vue
<script setup>
import { useMessage, Button } from 'moongate-vue'

const message = useMessage()

const handleSuccess = () => {
  message.success('操作成功')
}
</script>

<template>
  <Button @click="handleSuccess" label="成功" />
</template>
```

### 页面加载时调用（需要客户端判断）

`onMounted` 只在客户端执行，是页面加载后显示提示的安全方式：

```vue
<script setup>
import { useMessage } from 'moongate-vue'
import { onMounted } from 'vue'

const message = useMessage()

onMounted(() => {
  message.success('欢迎回来')
})
</script>
```

Nuxt 环境下也可用 `import.meta.client` 显式判断：

```ts
if (import.meta.client) {
  message.success('操作成功')
}
```

### 全局复用：Nuxt 插件方式（可选）

需要多处复用 `$message` 时，创建 `plugins/message.client.ts`：

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

> **注意**：插件文件名必须包含 `.client` 后缀，确保只在客户端执行。

## 其他组件

其余组件（Button、Card、Input 等）均为 SSR 安全，无需额外处理即可在 Nuxt 中使用。
