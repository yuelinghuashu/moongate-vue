# Table 表格

表格组件，用于展示结构化数据。支持排序、自定义列、空状态、固定表头等常用功能。

## 基础用法

最简单的表格，只需传入列配置和数据。

```vue
<script setup>
const columns = [
  { key: "name", title: "姓名" },
  { key: "email", title: "邮箱" },
  { key: "role", title: "角色" },
]

const users = [
  { name: "张三", email: "zhangsan@example.com", role: "管理员" },
  { name: "李四", email: "lisi@example.com", role: "编辑" },
]
</script>

<template>
  <Table :columns="columns" :data="users" />
</template>
```

## 斑马纹与悬停

通过 `striped` 和 `hoverable` 属性增强表格可读性。

```vue
<Table :columns="columns" :data="users" striped hoverable />
```

## 排序

在列配置中设置 `sortable: true`，即可点击表头进行排序。支持受控和非受控两种模式。

### 非受控模式（默认）

```vue
<script setup>
const columns = [
  { key: "name", title: "姓名", sortable: true },
  { key: "age", title: "年龄", sortable: true },
]

const users = [
  { name: "张三", age: 28 },
  { name: "李四", age: 22 },
  { name: "王五", age: 35 },
]
</script>

<template>
  <Table :columns="columns" :data="users" />
</template>
```

### 受控模式

通过 `sort-key` 和 `sort-order` 控制排序状态，并监听 `@sort` 事件。

```vue
<script setup>
import { ref } from "vue"

const sortKey = ref("name")
const sortOrder = ref("asc")

const columns = [
  { key: "name", title: "姓名", sortable: true },
  { key: "age", title: "年龄", sortable: true },
]

const users = [
  { name: "张三", age: 28 },
  { name: "李四", age: 22 },
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

## 固定表头

当表格数据较多时，可以固定表头，滚动时表头始终可见。

```vue
<!-- 固定表头，高度 400px -->
<Table :columns="columns" :data="users" fixed-header max-height="400px" />

<!-- 固定表头，视口高度 -->
<Table :columns="columns" :data="users" fixed-header max-height="60vh" />
```

## 自定义字段名

如果数据字段不是预期的名称，可通过 `labelKey` 和 `valueKey` 指定（与 Select 组件一致）。

```vue
<script setup>
const columns = [
  { valueKey: "user_id", title: "ID", sortable: true },
  { valueKey: "user_name", title: "姓名" },
]

const users = [
  { user_id: 1, user_name: "张三" },
  { user_id: 2, user_name: "李四" },
]
</script>

<template>
  <Table :columns="columns" :data="users" value-key="user_id" />
</template>
```

## 自定义列内容

Table 组件提供两种自定义列内容的方式，你可以根据场景选择。

### 方式一：通用 `cell` 插槽（推荐）

使用 `#cell` 插槽统一处理所有列，通过 `column.key` 判断是哪一列。**这种方式有完整的 IDE 自动补全提示。**

```vue
<script setup>
const columns = [
  { key: "name", title: "姓名" },
  { key: "status", title: "状态" },
  { key: "actions", title: "操作" },
]

const users = [
  { name: "张三", status: "active" },
  { name: "李四", status: "inactive" },
]

const edit = (row) => console.log("编辑", row)
</script>

<template>
  <Table :columns="columns" :data="users">
    <template #cell="{ row, column, value }">
      <!-- 根据列 key 自定义渲染 -->
      <span v-if="column.key === 'name'" class="font-bold">
        {{ value }}
      </span>
      <Badge
        v-else-if="column.key === 'status'"
        :color="value === 'active' ? 'success' : 'error'"
      >
        {{ value === "active" ? "激活" : "禁用" }}
      </Badge>
      <div v-else-if="column.key === 'actions'">
        <Button size="sm" @click="edit(row)">编辑</Button>
      </div>
      <span v-else>{{ value }}</span>
    </template>
  </Table>
</template>
```

### 方式二：精确列插槽 `#column-{key}`

为每一列单独定义插槽，插槽名称为 `column-` 加上列的 `key` 值。**这种方式虽然没有自动补全，但输入错误会报错，类型安全。**

```vue
<template>
  <Table :columns="columns" :data="users">
    <!-- 精确匹配 name 列 -->
    <template #column-name="{ row }">
      <span class="font-bold">{{ row.name }}</span>
    </template>

    <!-- 精确匹配 status 列 -->
    <template #column-status="{ row, value }">
      <Badge :color="value === 'active' ? 'success' : 'error'">
        {{ value === "active" ? "激活" : "禁用" }}
      </Badge>
    </template>

    <!-- 精确匹配 actions 列 -->
    <template #column-actions="{ row }">
      <Button size="sm" @click="edit(row)">编辑</Button>
    </template>
  </Table>
</template>
```

### 两种方式对比

| 方式 | 自动补全 | 类型检查 | 适用场景 |
|------|----------|----------|----------|
| `#cell` | ✅ 有提示 | ✅ 有报错 | 列较多，或需要 IDE 辅助 |
| `#column-{key}` | ❌ 无提示 | ✅ 有报错 | 列较少，追求简洁 |

两种方式可以**同时使用**，精确列插槽优先级更高：

```vue
<template>
  <Table :columns="columns" :data="users">
    <!-- 特殊列用精确插槽 -->
    <template #column-avatar="{ row }">
      <img :src="row.avatar" class="w-8 h-8 rounded-full" />
    </template>

    <!-- 其他列用 cell 插槽兜底 -->
    <template #cell="{ column, value }">
      <span v-if="column.key === 'status'">{{ value }}</span>
      <span v-else>{{ value }}</span>
    </template>
  </Table>
</template>
```

## 列宽与对齐

通过 `width` 和 `align` 属性控制列样式。

```vue
<script setup>
const columns = [
  { key: "name", title: "姓名", width: "120px" },
  { key: "price", title: "价格", align: "right" },
  { key: "status", title: "状态", align: "center" },
]
</script>

<template>
  <Table :columns="columns" :data="products" />
</template>
```

## 空状态

数据为空时显示提示文案。可通过 `empty-text` 自定义文案，或通过 `#empty` 插槽完全自定义。

```vue
<Table :columns="columns" :data="[]" empty-text="暂无用户数据" />
```

```vue
<Table :columns="columns" :data="[]">
  <template #empty>
    <div class="text-center">
      <span class="text-muted">📭 暂无数据</span>
      <button class="ml-2 text-primary" @click="fetchData">点击重试</button>
    </div>
  </template>
</Table>
```

## 响应式

`responsive` 属性（默认开启）使表格在小屏幕下自动横向滚动，避免布局错乱。

```vue
<!-- 默认响应式 -->
<Table :columns="columns" :data="data" />

<!-- 关闭响应式（可能导致溢出） -->
<Table :columns="columns" :data="data" :responsive="false" />

<!-- 强制横向滚动（无论屏幕大小） -->
<Table :columns="columns" :data="data" scrollable />
```

## 行点击事件

通过 `@row-click` 监听行点击事件。

```vue
<script setup>
const handleRowClick = (row, index, event) => {
  console.log(`点击了第 ${index + 1} 行`, row)
  // 跳转详情页等操作
}
</script>

<template>
  <Table :columns="columns" :data="users" @row-click="handleRowClick" />
</template>
```

## 加载状态

Table 组件不内置加载状态，推荐配合 `Skeleton` 骨架屏组件使用：

```vue
<script setup>
import { ref } from "vue"
import { Table, Skeleton } from "moongate-vue"

const loading = ref(true)
const users = ref([])
const columns = [...]

// 模拟异步加载
setTimeout(() => {
  users.value = [...]
  loading.value = false
}, 1000)
</script>

<template>
  <div>
    <Skeleton v-if="loading" :rows="5" :columns="columns.length" />
    <Table v-else :columns="columns" :data="users" />
  </div>
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `TableColumn[]` | `[]` | 列配置 |
| `data` | `any[]` | `[]` | 表格数据 |
| `emptyText` | `string` | `'暂无数据'` | 空状态文案（插槽优先） |
| `showHeader` | `boolean` | `true` | 是否显示表头 |
| `striped` | `boolean` | `false` | 是否显示斑马纹 |
| `hoverable` | `boolean` | `true` | 是否显示悬停高亮 |
| `scrollable` | `boolean` | `false` | 是否强制横向滚动 |
| `responsive` | `boolean` | `true` | 是否响应式（小屏自动滚动） |
| `fixedHeader` | `boolean` | `false` | 是否固定表头 |
| `maxHeight` | `string` | `'400px'` | 固定表头时的最大高度（配合 `fixedHeader` 使用） |
| `sortKey` | `string` | `undefined` | 当前排序字段（受控模式） |
| `sortOrder` | `'asc' \| 'desc'` | `undefined` | 当前排序方向（受控模式） |
| `labelKey` | `string` | `'label'` | 全局默认标题字段名 |
| `valueKey` | `string` | `'value'` | 全局默认数据字段名 |

### TableColumn 配置

| 属性 | 类型 | 说明 |
|------|------|------|
| `key` | `string` | 数据字段名（与 `valueKey` 二选一，优先级更高） |
| `title` | `string` | 列标题（与 `labelKey` 二选一，优先级更高） |
| `width` | `string` | 列宽度（如 `'100px'` 或 `'10%'`） |
| `align` | `'left' \| 'center' \| 'right'` | 文本对齐方式 |
| `sortable` | `boolean` | 是否可排序 |
| `labelKey` | `string` | 自定义标题字段名（当 `title` 未提供时使用） |
| `valueKey` | `string` | 自定义数据字段名（当 `key` 未提供时使用） |

### Slots

| 名称 | 参数 | 说明 |
|------|------|------|
| `cell` | `{ row, column, value }` | 通用单元格插槽，通过 `column.key` 判断列 |
| `column-{key}` | `{ row, value }` | 精确列插槽，`key` 为列的 `key` 或 `valueKey` |
| `empty` | — | 自定义空状态内容 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:sortKey` | `(key: string)` | 排序字段变化（v-model:sort-key） |
| `update:sortOrder` | `(order: 'asc' \| 'desc')` | 排序方向变化（v-model:sort-order） |
| `sort` | `({ key, order })` | 排序变化（合并事件） |
| `row-click` | `(row, index, event)` | 点击行 |

## 类型支持

Table 组件使用 Vue 3.3+ 的泛型组件特性，**自动从 `data` 推断行数据类型**：

```vue
<script setup lang="ts">
// ✅ 不需要手动定义接口，自动推断
const users = ref([
  { id: 1, name: "张三", email: "zhang@example.com" },
  { id: 2, name: "李四", email: "li@example.com" },
])

// ✅ columns 配置时，key 自动提示只能是 id | name | email
const columns = [
  { key: "name", title: "姓名" },  // key 有类型提示
  { key: "email", title: "邮箱" },
]

// ✅ 事件回调中 row 自动推断类型
const handleRowClick = (row, index) => {
  console.log(row.name)  // 有类型提示
}
</script>

<template>
  <Table :columns="columns" :data="users" @row-click="handleRowClick">
    <!-- ✅ 插槽中 row 也自动推断类型 -->
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
