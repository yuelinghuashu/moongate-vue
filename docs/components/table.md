# Table 表格

表格组件，用于展示结构化数据。支持排序、自定义列、空状态、固定表头等常用功能。

## 基础用法

最简单的表格，只需传入列配置和数据。

:::demo

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
  <Table :columns="columns" :data="users" />
</template>
```

:::

## 斑马纹与悬停

通过 `striped` 和 `hoverable` 属性增强表格可读性。

:::demo

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

:::

## 排序

在列配置中设置 `sortable: true`，即可点击表头进行排序。支持受控和非受控两种模式。

### 非受控模式（默认）

:::demo

```vue
<script setup>
import { Table } from 'moongate-vue'

const columns = [
  { key: 'name', title: '姓名', sortable: true },
  { key: 'age', title: '年龄', sortable: true },
]

const users = [
  { name: '张三', age: 28 },
  { name: '李四', age: 22 },
  { name: '王五', age: 35 },
]
</script>

<template>
  <Table :columns="columns" :data="users" />
</template>
```

:::

### 键盘操作

可排序表头不仅支持鼠标点击，还支持**键盘操作**：

- 按 `Tab` 聚焦到可排序表头
- 按 `Enter` 或 `Space` 键触发排序
- 排序状态通过 `aria-sort` 属性暴露给屏幕阅读器（`ascending` / `descending`）

### 受控模式

通过 `sort-key` 和 `sort-order` 控制排序状态，并监听 `@sort` 事件。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Table } from 'moongate-vue'

const sortKey = ref('name')
const sortOrder = ref('asc')

const columns = [
  { key: 'name', title: '姓名', sortable: true },
  { key: 'age', title: '年龄', sortable: true },
]

const users = [
  { name: '张三', age: 28 },
  { name: '李四', age: 22 },
]

const handleSort = ({ key, order }) => {
  console.log(`排序: ${key} ${order}`)
}
</script>

<template>
  <Table
    :columns="columns"
    :data="users"
    :sort-key="sortKey"
    :sort-order="sortOrder"
    @sort="handleSort"
  />
</template>
```

:::

## 稳定行标识（row-key）

默认情况下，Table 使用**行索引**作为 DOM 的 key。当数据**排序、过滤或更新**时，行索引会变化，
导致 Vue 无法准确复用已有 DOM 节点，可能出现：

- 单元格内容「跳动」或闪烁
- 单元格内输入框 / 展开状态错位
- 动画效果异常

通过 `row-key` 指定数据中的**唯一字段**（如 `id`），可让 Vue 始终正确匹配每一行。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Table } from 'moongate-vue'

const columns = [
  { key: 'name', title: '姓名', sortable: true },
  { key: 'age', title: '年龄', sortable: true },
]

const users = ref([
  { id: 1, name: '张三', age: 28 },
  { id: 2, name: '李四', age: 22 },
  { id: 3, name: '王五', age: 35 },
])
</script>

<template>
  <!-- ✅ 推荐：指定唯一 id 作为行标识 -->
  <Table :columns="columns" :data="users" row-key="id" />
</template>
```

:::

> 💡 `rowKey` 指向的字段必须在每行数据中**唯一**（如数据库主键 `id`）。
> 若数据没有唯一字段，可跳过此 prop（默认按索引处理，简单场景够用）。
> 在**受控排序**（`:sort-key`）或**数据频繁更新**时，设置 `row-key` 效果尤其明显。

## 固定表头

当表格数据较多时，可以固定表头，滚动时表头始终可见。

:::demo

```vue
<script setup>
import { Table } from 'moongate-vue'

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色' },
]

// 生成 20 条测试数据
const users = Array.from({ length: 20 }, (_, i) => ({
  name: `用户${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 === 0 ? '管理员' : '编辑',
}))
</script>

<template>
  <Table :columns="columns" :data="users" fixed-header max-height="400px" />
</template>
```

:::

## 自定义字段名

如果数据字段不是预期的名称，可通过 `labelKey` 和 `valueKey` 指定（与 Select 组件一致）。

:::demo

```vue
<script setup>
import { Table } from 'moongate-vue'

const columns = [
  { key: 'user_id', title: 'ID', sortable: true },
  { key: 'user_name', title: '姓名' },
]

const users = [
  { user_id: 1, user_name: '张三' },
  { user_id: 2, user_name: '李四' },
]
</script>

<template>
  <Table :columns="columns" :data="users" value-key="user_id" />
</template>
```

:::

## 自定义列内容

Table 组件提供两种自定义列内容的方式，你可以根据场景选择。

### 方式一：通用 `cell` 插槽（推荐）

使用 `#cell` 插槽统一处理所有列，通过 `column.key` 判断是哪一列。**这种方式有完整的 IDE 自动补全提示。**

:::demo

```vue
<script setup>
import { Table, Badge, Button } from 'moongate-vue'

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'status', title: '状态' },
  { key: 'actions', title: '操作' },
]

const users = [
  { name: '张三', status: 'active' },
  { name: '李四', status: 'inactive' },
]

const edit = (row) => console.log('编辑', row)
</script>

<template>
  <Table :columns="columns" :data="users">
    <template #cell="{ row, column, value }">
      <strong v-if="column.key === 'name'">{{ value }}</strong>
      <Badge v-else-if="column.key === 'status'" :color="value === 'active' ? 'success' : 'error'">
        {{ value === 'active' ? '激活' : '禁用' }}
      </Badge>
      <div v-else-if="column.key === 'actions'">
        <Button size="sm" @click="edit(row)">编辑</Button>
      </div>
      <span v-else>{{ value }}</span>
    </template>
  </Table>
</template>
```

:::

### 方式二：精确列插槽 `#column-{key}`

为每一列单独定义插槽，插槽名称为 `column-` 加上列的 `key` 值。

:::demo

```vue
<script setup>
import { Table, Badge, Button } from 'moongate-vue'

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'status', title: '状态' },
  { key: 'actions', title: '操作' },
]

const users = [
  { name: '张三', status: 'active' },
  { name: '李四', status: 'inactive' },
]

const edit = (row) => console.log('编辑', row)
</script>

<template>
  <Table :columns="columns" :data="users">
    <template #column-name="{ row }">
      <strong>{{ row.name }}</strong>
    </template>
    <template #column-status="{ value }">
      <Badge :color="value === 'active' ? 'success' : 'error'">
        {{ value === 'active' ? '激活' : '禁用' }}
      </Badge>
    </template>
    <template #column-actions="{ row }">
      <Button size="sm" @click="edit(row)">编辑</Button>
    </template>
  </Table>
</template>
```

:::

### 两种方式对比

| 方式            | 自动补全  | 类型检查  | 适用场景                |
| --------------- | --------- | --------- | ----------------------- |
| `#cell`         | ✅ 有提示 | ✅ 有报错 | 列较多，或需要 IDE 辅助 |
| `#column-{key}` | ❌ 无提示 | ✅ 有报错 | 列较少，追求简洁        |

两种方式可以**同时使用**，精确列插槽优先级更高：

:::demo

```vue
<script setup>
import { Table, Badge } from 'moongate-vue'

const columns = [
  { key: 'avatar', title: '头像' },
  { key: 'name', title: '姓名' },
  { key: 'status', title: '状态' },
]

const users = [
  { avatar: '👤', name: '张三', status: 'active' },
  { avatar: '👤', name: '李四', status: 'inactive' },
]
</script>

<template>
  <Table :columns="columns" :data="users">
    <template #column-avatar="{ row }">
      <span style="font-size: 24px;">{{ row.avatar }}</span>
    </template>
    <template #cell="{ column, value }">
      <span v-if="column.key === 'status'">
        <Badge :color="value === 'active' ? 'success' : 'error'">
          {{ value === 'active' ? '激活' : '禁用' }}
        </Badge>
      </span>
      <span v-else>{{ value }}</span>
    </template>
  </Table>
</template>
```

:::

## 列宽与对齐

通过 `width` 和 `align` 属性控制列样式。

:::demo

```vue
<script setup>
import { Table } from 'moongate-vue'

const columns = [
  { key: 'name', title: '姓名', width: '120px' },
  { key: 'price', title: '价格', align: 'right' },
  { key: 'status', title: '状态', align: 'center' },
]

const products = [
  { name: '商品一', price: 99.0, status: '在售' },
  { name: '商品二', price: 199.0, status: '缺货' },
]
</script>

<template>
  <Table :columns="columns" :data="products" />
</template>
```

:::

## 空状态

数据为空时显示提示文案。可通过 `empty-text` 自定义文案，或通过 `#empty` 插槽完全自定义。

:::demo

```vue
<script setup>
import { Table } from 'moongate-vue'

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <Table :columns="columns" :data="[]" empty-text="暂无用户数据" />
    <Table :columns="columns" :data="[]">
      <template #empty>
        <div style="text-align: center;">
          <span>📭 暂无数据</span>
          <button
            style="margin-left: 8px; color: var(--ui-primary); background: none; border: none; cursor: pointer;"
            @click="alert('重新加载')"
          >
            点击重试
          </button>
        </div>
      </template>
    </Table>
  </div>
</template>
```

:::

## 响应式

`responsive` 属性（默认开启）使表格在小屏幕下自动横向滚动，避免布局错乱。

:::demo

```vue
<script setup>
import { Table } from 'moongate-vue'

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色' },
  { key: 'department', title: '部门' },
  { key: 'location', title: '地点' },
]

const users = [
  {
    name: '张三',
    email: 'zhang@example.com',
    role: '管理员',
    department: '技术部',
    location: '北京',
  },
  {
    name: '李四',
    email: 'li@example.com',
    role: '编辑',
    department: '内容部',
    location: '上海',
  },
]
</script>

<template>
  <div style="max-width: 500px; border: 1px solid var(--ui-border); padding: 16px;">
    <p style="margin-bottom: 8px;">小屏幕容器（500px），表格自动横向滚动</p>
    <Table :columns="columns" :data="users" />
  </div>
</template>
```

:::

## 行点击事件

通过 `@row-click` 监听行点击事件。

:::demo

```vue
<script setup>
import { Table } from 'moongate-vue'

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
]

const users = [
  { name: '张三', email: 'zhang@example.com' },
  { name: '李四', email: 'li@example.com' },
]

const handleRowClick = (row, index) => {
  alert(`点击了第 ${index + 1} 行: ${row.name}`)
}
</script>

<template>
  <Table :columns="columns" :data="users" @row-click="handleRowClick" />
</template>
```

:::

## 行选择

设置 `selectable` 属性显示选择列。选中行通过 `v-model:selected-rows` 双向绑定（数组），或通过 `@selection-change` 监听变化。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Table } from 'moongate-vue'

const selectedRows = ref([])
const columns = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色' },
]

// 推荐为数据提供唯一 id，并与 row-key 配合使用
// 未设置 row-key 时组件按对象引用识别行，父组件重建数组（过滤/排序/接口刷新）会导致已选状态失效
const users = [
  { id: 1, name: '张三', email: 'zhang@example.com', role: '管理员' },
  { id: 2, name: '李四', email: 'li@example.com', role: '编辑' },
  { id: 3, name: '王五', email: 'wang@example.com', role: '访客' },
]
</script>

<template>
  <div>
    <Table
      v-model:selected-rows="selectedRows"
      :columns="columns"
      :data="users"
      row-key="id"
      selectable
    />
    <p style="margin-top: 8px;">
      已选 {{ selectedRows.length }} 行:
      {{ selectedRows.map((row) => row.name).join(', ') || '无' }}
    </p>
  </div>
</template>
```

:::

### 禁用指定行

通过 `row-selectable` 回调控制哪些行不可选（返回 `false` 禁用该行 checkbox）：

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Table } from 'moongate-vue'

const selectedRows = ref([])
const columns = [
  { key: 'name', title: '姓名' },
  { key: 'role', title: '角色' },
]

const users = [
  { id: 1, name: '张三', role: '管理员' },
  { id: 2, name: '李四', role: '编辑' },
  { id: 3, name: '王五', role: '已离职' },
]

// 已离职（index 2）不可选
const rowSelectable = (row, index) => index !== 2
</script>

<template>
  <Table
    v-model:selected-rows="selectedRows"
    :columns="columns"
    :data="users"
    row-key="id"
    selectable
    :row-selectable="rowSelectable"
  />
</template>
```

:::

### 行选择行为说明

- **全选**：表头 checkbox 一键全选/取消，自动跳过 `row-selectable` 禁用的行
- **半选状态**：部分行选中时表头 checkbox 显示 `indeterminate` 状态
- **选中高亮**：选中行添加 `mg-table-row-selected` 背景色
- **`rowKey` 配合（强烈建议）**：设置 `row-key` 后，排序/数据更新时选中状态按唯一标识比较，保持稳定；**未设置时组件按对象引用识别行，若父组件重建 `data` 数组（重新赋值、过滤、排序、接口刷新），已选中的记录会因引用变化而"失联"**

## 加载状态

Table 组件不内置加载状态，推荐配合 `Skeleton` 骨架屏组件使用：

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Table, Skeleton } from 'moongate-vue'

const loading = ref(true)
const users = ref([])
const columns = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色' },
]

// 模拟异步加载
setTimeout(() => {
  users.value = [
    { name: '张三', email: 'zhang@example.com', role: '管理员' },
    { name: '李四', email: 'li@example.com', role: '编辑' },
  ]
  loading.value = false
}, 1000)
</script>

<template>
  <div>
    <Skeleton v-if="loading" :rows="3" />
    <Table v-else :columns="columns" :data="users" />
  </div>
</template>
```

:::

## API

### Props

| 属性            | 类型                      | 默认值       | 说明                                                       |
| --------------- | ------------------------- | ------------ | ---------------------------------------------------------- |
| `columns`       | `TableColumn[]`           | `[]`         | 列配置                                                     |
| `data`          | `any[]`                   | `[]`         | 表格数据                                                   |
| `emptyText`     | `string`                  | `'暂无数据'` | 空状态文案（插槽优先）                                     |
| `showHeader`    | `boolean`                 | `true`       | 是否显示表头                                               |
| `striped`       | `boolean`                 | `false`      | 是否显示斑马纹                                             |
| `hoverable`     | `boolean`                 | `true`       | 是否显示悬停高亮                                           |
| `scrollable`    | `boolean`                 | `false`      | 是否强制横向滚动                                           |
| `responsive`    | `boolean`                 | `true`       | 是否响应式（小屏自动滚动）                                 |
| `fixedHeader`   | `boolean`                 | `false`      | 是否固定表头                                               |
| `maxHeight`     | `string`                  | `'400px'`    | 固定表头时的最大高度（配合 `fixedHeader` 使用）            |
| `sortKey`       | `string`                  | `undefined`  | 当前排序字段（受控模式）                                   |
| `sortOrder`     | `'asc' \| 'desc'`         | `undefined`  | 当前排序方向（受控模式）                                   |
| `rowKey`        | `keyof T \| string`       | `undefined`  | 行唯一标识字段名（稳定 key，排序/更新时避免 DOM 复用错乱） |
| `selectable`    | `boolean`                 | `false`      | 是否显示选择列（行选择）                                   |
| `rowSelectable` | `(row, index) => boolean` | `undefined`  | 行是否可选（返回 `false` 禁用该行 checkbox）               |
| `selectAllText` | `string`                  | `'全选'`     | 全选 checkbox 的 `aria-label`                              |
| `labelKey`      | `string`                  | `'label'`    | 全局默认标题字段名                                         |
| `valueKey`      | `string`                  | `'value'`    | 全局默认数据字段名                                         |

### TableColumn 配置

| 属性       | 类型                            | 说明                                           |
| ---------- | ------------------------------- | ---------------------------------------------- |
| `key`      | `string`                        | 数据字段名（与 `valueKey` 二选一，优先级更高） |
| `title`    | `string`                        | 列标题（与 `labelKey` 二选一，优先级更高）     |
| `width`    | `string`                        | 列宽度（如 `'100px'` 或 `'10%'`）              |
| `align`    | `'left' \| 'center' \| 'right'` | 文本对齐方式                                   |
| `sortable` | `boolean`                       | 是否可排序                                     |
| `labelKey` | `string`                        | 自定义标题字段名（当 `title` 未提供时使用）    |
| `valueKey` | `string`                        | 自定义数据字段名（当 `key` 未提供时使用）      |

### Slots

| 名称           | 参数                     | 说明                                         |
| -------------- | ------------------------ | -------------------------------------------- |
| `cell`         | `{ row, column, value }` | 通用单元格插槽，通过 `column.key` 判断列     |
| `column-{key}` | `{ row, value }`         | 精确列插槽，`key` 为列的 `key` 或 `valueKey` |
| `empty`        | —                        | 自定义空状态内容                             |

### Events

| 事件                  | 参数                       | 说明                                |
| --------------------- | -------------------------- | ----------------------------------- |
| `update:sortKey`      | `(key: string)`            | 排序字段变化（v-model:sort-key）    |
| `update:sortOrder`    | `(order: 'asc' \| 'desc')` | 排序方向变化（v-model:sort-order）  |
| `sort`                | `({ key, order })`         | 排序变化（合并事件）                |
| `row-click`           | `(row, index, event)`      | 点击行                              |
| `update:selectedRows` | `(rows: T[])`              | 选中行变化（v-model:selected-rows） |
| `selection-change`    | `(rows: T[])`              | 选中行变化（与 update 同时触发）    |

## 类型支持

Table 组件使用 Vue 3.5+ 的泛型组件特性，**自动从 `data` 推断行数据类型**：

```vue
<script setup lang="ts">
// ✅ 不需要手动定义接口，自动推断
const users = ref([
  { id: 1, name: '张三', email: 'zhang@example.com' },
  { id: 2, name: '李四', email: 'li@example.com' },
])

// ✅ columns 配置时，key 自动提示只能是 id | name | email
const columns = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
]

// ✅ 事件回调中 row 自动推断类型
const handleRowClick = (row, index) => {
  console.log(row.name)
}
</script>

<template>
  <Table :columns="columns" :data="users" @row-click="handleRowClick">
    <template #cell="{ row }">
      {{ row.name }}
    </template>
  </Table>
</template>
```

如需显式使用类型，可从包中导入：

```typescript
import type { TableColumn, CellSlotProps } from 'moongate-vue'
```

## 注意事项

- 排序支持数字和字符串类型，数字按数值比较，字符串按字典序比较
- `columns` 中的 `key` 和 `valueKey` 决定了插槽名称：`#column-{key}` 和 `#cell` 中的 `column.key`
- 空状态时，`empty` 插槽优先级高于 `emptyText` prop
- `responsive` 默认开启，无需手动添加 `overflow-x: auto`
- `scrollable` 与 `responsive` 可同时使用，效果为强制滚动
- `fixedHeader` 需要配合 `maxHeight` 使用，否则表格会无限撑开
- 固定表头时，表头会浮动在滚动内容上方，确保表格背景色已设置
- 移动端建议谨慎使用固定表头功能
- 建议在 `tsconfig.json` 中开启 `strict: true` 以获得最佳类型推断体验
- 加载状态推荐配合 `Skeleton` 组件使用，Table 本身不内置加载逻辑
- 行选择需设置 `selectable`，选中行通过 `v-model:selected-rows` 绑定数组
- `row-key` 强烈建议配合行选择使用：设置后数据排序/更新时选中状态按唯一标识保持稳定；**未设置时组件按对象引用识别行，父组件重建 `data` 数组（过滤/排序/接口刷新）会导致已选记录失效**
- 全选操作自动跳过 `row-selectable` 禁用的行
