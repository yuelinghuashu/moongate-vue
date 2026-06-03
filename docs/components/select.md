# Select 下拉选择框

下拉选择框组件，用于从选项列表中选择一项。支持多种数据格式：对象数组、字符串数组、数字数组。可选配搜索过滤功能。

## 基础用法（对象数组）

```vue
<script setup>
import { ref } from "vue"

const category = ref("")
const categories = [
  { label: "技术文章", value: "tech" },
  { label: "生活随笔", value: "life" },
  { label: "工具推荐", value: "tools" },
]
</script>

<template>
  <Select v-model="category" :options="categories" placeholder="请选择分类" />
</template>
```

## 自定义字段名

如果数据字段不是 `label`/`value`，可通过 `label-key` 和 `value-key` 指定。

```vue
<script setup>
import { ref } from "vue"

const category = ref("")
const categories = [
  { name: "技术文章", id: "tech" },
  { name: "生活随笔", id: "life" },
  { name: "工具推荐", id: "tools" },
]
</script>

<template>
  <Select
    v-model="category"
    :options="categories"
    label-key="name"
    value-key="id"
    placeholder="请选择分类"
  />
</template>
```

## 字符串数组

```vue
<script setup>
import { ref } from "vue"

const color = ref("")
const colors = ["红", "绿", "蓝"]
</script>

<template>
  <Select v-model="color" :options="colors" placeholder="选择颜色" />
</template>
```

## 数字数组

```vue
<script setup>
import { ref } from "vue"

const number = ref(0)
const numbers = [10, 20, 30]
</script>

<template>
  <Select v-model="number" :options="numbers" placeholder="选择数字" />
</template>
```

## 占位文本

设置 `placeholder` 属性，会显示一个不可选中的默认选项。

```vue
<Select v-model="value" :options="options" placeholder="请选择" />
```

## 可搜索

设置 `filterable` 属性，下拉框支持输入过滤。选项较多时非常实用。

```vue
<script setup>
import { ref } from "vue"

const value = ref("")
const options = [
  { label: "苹果", value: "apple" },
  { label: "香蕉", value: "banana" },
  { label: "橙子", value: "orange" },
  { label: "葡萄", value: "grape" },
  { label: "西瓜", value: "watermelon" },
]
</script>

<template>
  <Select v-model="value" :options="options" filterable placeholder="搜索水果" />
</template>
```

### 搜索模式下的键盘操作

| 按键 | 操作 |
|------|------|
| `↓` | 向下移动高亮 |
| `↑` | 向上移动高亮 |
| `Enter` | 选中当前高亮项 |
| `Esc` | 关闭下拉面板 |

### 远程搜索

结合 `@search` 事件实现远程搜索：

```vue
<script setup>
import { ref, watch } from "vue"
import { debounce } from "lodash-es"

const value = ref("")
const options = ref([])
const loading = ref(false)

const searchUsers = debounce(async (keyword) => {
  if (!keyword) {
    options.value = []
    return
  }
  loading.value = true
  const res = await fetch(`/api/users?q=${keyword}`).then(r => r.json())
  options.value = res.data
  loading.value = false
}, 300)
</script>

<template>
  <Select
    v-model="value"
    :options="options"
    :loading="loading"
    filterable
    placeholder="搜索用户"
    @search="searchUsers"
  />
</template>
```

## 自定义选项渲染

通过 `#option` 插槽自定义每个选项的显示内容。

```vue
<template>
  <Select v-model="userId" :options="users" filterable label-key="name" value-key="id">
    <template #option="{ item, label }">
      <div class="flex items-center gap-2">
        <img :src="item.avatar" class="w-6 h-6 rounded-full" />
        <span>{{ label }}</span>
        <span class="text-muted text-sm">{{ item.email }}</span>
      </div>
    </template>
  </Select>
</template>
```

## 自定义空状态

搜索无结果时，可通过 `#empty` 插槽自定义提示内容。

```vue
<Select v-model="value" :options="options" filterable empty-text="未找到匹配项">
  <template #empty>
    <div class="text-center py-2">
      <span>🔍 没有找到相关选项</span>
      <button class="ml-2 text-primary" @click="addNewOption">新增</button>
    </div>
  </template>
</Select>
```

## 下拉面板高度

通过 `max-height` 属性控制下拉面板的最大高度（单位：px），超出后自动滚动。

```vue
<Select v-model="value" :options="options" filterable :max-height="300" />
```

## 尺寸

```vue
<Select v-model="value" size="sm" :options="options" placeholder="小号" />
<Select v-model="value" size="md" :options="options" placeholder="中号" />
<Select v-model="value" size="lg" :options="options" placeholder="大号" />
```

## 禁用状态

```vue
<Select disabled :options="options" value="option1" />
```

## 错误状态

`error` 属性仅控制选择框边框颜色，不渲染错误消息。

```vue
<template>
  <Select v-model="agree" :error="!agree" :options="options" placeholder="请选择" />
  <span v-if="!agree" class="text-error text-sm">请选择一个选项</span>
</template>
```

## 禁用选项

在选项中设置 `disabled: true` 可禁用特定选项。

```vue
<script setup>
const options = [
  { label: "启用", value: "active" },
  { label: "禁用", value: "inactive", disabled: true },
  { label: "待审核", value: "pending" },
]
</script>

<template>
  <Select v-model="status" :options="options" />
</template>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string \| number` | `''` | 选中的值（v-model） |
| `options` | `any[]` | `[]` | 选项列表，支持对象数组、字符串数组、数字数组 |
| `labelKey` | `string` | `'label'` | 对象数组中作为显示文本的字段名 |
| `valueKey` | `string` | `'value'` | 对象数组中作为选项值的字段名 |
| `placeholder` | `string` | `''` | 占位文本（显示为不可选中的默认选项） |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `error` | `boolean` | `false` | 是否显示错误状态（仅边框样式） |
| `filterable` | `boolean` | `false` | 是否可搜索（启用后替换为自定义下拉框） |
| `emptyText` | `string` | `'暂无数据'` | 搜索无结果时的空状态文案 |
| `maxHeight` | `number` | `240` | 下拉面板最大高度（单位：px） |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `(value: string \| number)` | 值变化时触发（v-model） |
| `change` | `(value: string \| number)` | 值变化时触发 |
| `search` | `(value: string)` | 搜索输入时触发（仅在 `filterable` 模式下可用） |

### Slots

| 名称 | 参数 | 说明 |
|------|------|------|
| `option` | `{ item, label }` | 自定义选项渲染内容 |
| `empty` | — | 自定义搜索无结果时的空状态内容 |

## 类型支持

Select 组件支持泛型类型推断，可手动标注 `options` 的类型以获得更好的类型提示：

```typescript
import type { SelectOption } from 'moongate-vue'

interface User {
  id: number
  name: string
  email: string
}

// 手动标注 options 类型
const options: SelectOption<User>[] = [
  { label: '张三', value: { id: 1, name: '张三', email: 'zhang@example.com' } },
  { label: '李四', value: { id: 2, name: '李四', email: 'li@example.com' } },
]
```

## 注意事项

- Select 默认使用原生 `<select>` 元素，极致轻量，支持键盘导航
- 设置 `filterable` 后会替换为自定义下拉框，支持搜索过滤和键盘导航
- 自定义下拉框支持 `↓` `↑` 键切换选项，`Enter` 键确认，`Esc` 键关闭
- 下拉箭头为内联 SVG，颜色自动继承文字颜色（`currentColor`）
- `placeholder` 选项会自动设置为 `disabled` 和 `hidden`，不会被选中
- `error` 属性仅控制边框颜色，不渲染错误消息
- 聚焦时显示主题色边框和聚焦环
- 对象数组默认使用 `label`/`value` 字段，可通过 `label-key`/`value-key` 自定义
- 基本类型（字符串、数字）数组自动处理：显示值和选中值均为该值本身
- 通过 `max-height` 可控制下拉面板最大高度，超出后自动滚动
