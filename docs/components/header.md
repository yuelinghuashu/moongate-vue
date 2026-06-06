# Header 头部容器

页面头部容器组件，提供语义化的 `<header>` 元素，支持可选的粘性定位。

## 基础用法

:::demo

```vue
<template>
  <Header>
    <Container>
      <div style="padding: 1rem 0;">头部内容</div>
    </Container>
  </Header>
</template>

<script setup>
import { Header, Container } from "moongate-vue"
</script>
```

:::

## 粘性定位

设置 `sticky` 属性，头部会在滚动时固定在顶部。

:::demo

```vue
<template>
  <div style="height: 200px; overflow-y: auto; border: 1px solid #e5e5e5;">
    <Header sticky>
      <Container>
        <div style="padding: 1rem 0; border-bottom: 1px solid #e5e5e5;">
          粘性头部（滚动查看效果）
        </div>
      </Container>
    </Header>
    <div style="padding: 2rem; text-align: center; color: #666;">
      <p>向下滚动内容...</p>
      <p style="margin-top: 100px;">粘性头部会固定在顶部</p>
      <p style="margin-top: 100px;">继续滚动查看更多效果</p>
    </div>
  </div>
</template>

<script setup>
import { Header, Container } from "moongate-vue"
</script>
```

:::

## API

### Props

| 属性     | 类型      | 默认值  | 说明             |
| -------- | --------- | ------- | ---------------- |
| `sticky` | `boolean` | `false` | 是否开启粘性定位 |

### Slots

| 名称      | 说明     |
| --------- | -------- |
| `default` | 头部内容 |

## 注意事项

- 粘性定位要求父容器 `overflow` 不为 `hidden`
- 使用粘性定位时，建议同时设置背景色，避免滚动时内容透出
