# 快速开始

## 第一个示例

确保你已经完成了[安装](/guide/install)，然后创建一个 Vue 组件：

```vue
<script setup>
import { Button, useMessage } from 'moongate-vue'
import 'moongate-vue/style.css'

const message = useMessage()
</script>

<template>
  <div class="flex gap-2">
    <Button variant="filled" color="primary" @click="message.success('操作成功')">主要按钮</Button>

    <Button variant="outline" color="error" @click="message.error('操作失败')">危险操作</Button>
  </div>
</template>
```

## 更多示例

### 卡片组件

```vue
<Card hoverable class="max-w-sm">
  <template #header>
    <h3>卡片标题</h3>
  </template>
  <p>卡片内容区域</p>
  <template #footer>
    <Button size="sm">操作</Button>
  </template>
</Card>
```

### 表格组件

```vue
<Table :columns="columns" :data="users" striped hoverable />
```

## 属性透传

所有组件都支持通过 `v-bind="$attrs"` 透传原生属性：

```vue
<!-- 属性自动透传到 <input> -->
<Input id="email" name="email" type="email" autocomplete="off" />

<!-- 无障碍属性 -->
<Checkbox name="terms" aria-label="同意用户协议" />

<!-- 自定义数据属性 -->
<Card data-testid="article-card" hoverable>
  文章内容
</Card>
```

> 透传属性不会覆盖组件 Props，`class` 和 `style` 会与组件内置样式合并。

## 下一步

- 查看[设计令牌](/guide/design-tokens)了解主题定制
- 浏览[组件列表](/components/button)查看所有组件
