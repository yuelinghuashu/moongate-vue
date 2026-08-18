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

> 💡 **非侵入式样式**：上面的 `style.css` 只包含组件样式，不会重置你的全局样式。如需统一盒模型基线，可额外引入 `moongate-vue/reset.css`（详见[安装指南](/guide/install#样式引入)）。

## 更多示例

### 卡片组件

```vue
<script setup>
import { Card, Button } from 'moongate-vue'

// 卡片标题、内容、底部操作区
</script>

<template>
  <Card hoverable style="max-width: 24rem;">
    <template #header>
      <h3>卡片标题</h3>
    </template>
    <p>卡片内容区域</p>
    <template #footer>
      <Button size="sm" label="操作" />
    </template>
  </Card>
</template>
```

### 表格组件

```vue
<script setup>
import { Table } from 'moongate-vue'

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色' },
]

const users = [
  { name: '张三', email: 'zhangsan@example.com', role: '管理员' },
  { name: '李四', email: 'lisi@example.com', role: '编辑' },
]
</script>

<template>
  <Table :columns="columns" :data="users" striped hoverable />
</template>
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

- 查看[国际化配置](/guide/i18n)了解中英文案切换与自定义
- 查看[设计令牌](/guide/design-tokens)了解主题定制
- 浏览[组件列表](/components/button)查看所有组件
