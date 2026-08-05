# Select 下拉选择框

下拉选择框组件，用于从选项列表中选择一项。支持多种数据格式：对象数组、字符串数组、数字数组。可选配搜索过滤功能。

## 基础用法（对象数组）

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const category = ref('')
const categories = [
  { label: '技术文章', value: 'tech' },
  { label: '生活随笔', value: 'life' },
  { label: '工具推荐', value: 'tools' },
]
</script>

<template>
  <div style="width: 240px;">
    <Select v-model="category" :options="categories" placeholder="请选择分类" />
    <p style="margin-top: 8px;">当前选中: {{ category || '未选择' }}</p>
  </div>
</template>
```

:::

## 自定义字段名

如果数据字段不是 `label`/`value`，可通过 `label-key` 和 `value-key` 指定。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const category = ref('')
const categories = [
  { name: '技术文章', id: 'tech' },
  { name: '生活随笔', id: 'life' },
  { name: '工具推荐', id: 'tools' },
]
</script>

<template>
  <div style="width: 240px;">
    <Select
      v-model="category"
      :options="categories"
      label-key="name"
      value-key="id"
      placeholder="请选择分类"
    />
    <p style="margin-top: 8px;">当前选中: {{ category || '未选择' }}</p>
  </div>
</template>
```

:::

## 字符串数组

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const color = ref('')
const colors = ['红', '绿', '蓝']
</script>

<template>
  <div style="width: 240px;">
    <Select v-model="color" :options="colors" placeholder="选择颜色" />
    <p style="margin-top: 8px;">当前选中: {{ color || '未选择' }}</p>
  </div>
</template>
```

:::

## 数字数组

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const number = ref(0)
const numbers = [10, 20, 30]
</script>

<template>
  <div style="width: 240px;">
    <Select v-model="number" :options="numbers" placeholder="选择数字" />
    <p style="margin-top: 8px;">当前选中: {{ number || '未选择' }}</p>
  </div>
</template>
```

:::

## 占位文本

设置 `placeholder` 属性，会显示一个不可选中的默认选项。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const value = ref('')
const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
]
</script>

<template>
  <div style="width: 240px;">
    <Select v-model="value" :options="options" placeholder="请选择" />
    <p style="margin-top: 8px;">当前选中: {{ value || '未选择' }}</p>
  </div>
</template>
```

:::

## 可搜索

设置 `filterable` 属性，下拉框支持输入过滤。选项较多时非常实用。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const value = ref('')
const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
  { label: '西瓜', value: 'watermelon' },
]
</script>

<template>
  <div style="width: 240px;">
    <Select v-model="value" :options="options" filterable placeholder="搜索水果" />
    <p style="margin-top: 8px;">当前选中: {{ value || '未选择' }}</p>
  </div>
</template>
```

:::

### 搜索模式下的键盘操作

| 按键    | 操作           |
| ------- | -------------- |
| `↓`     | 向下移动高亮   |
| `↑`     | 向上移动高亮   |
| `Enter` | 选中当前高亮项 |
| `Esc`   | 关闭下拉面板   |

### 远程搜索

结合 `@search` 事件实现远程搜索：

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const value = ref('')
const options = ref([])
const loading = ref(false)

const searchUsers = async (keyword) => {
  if (!keyword) {
    options.value = []
    return
  }
  loading.value = true
  // 模拟远程搜索
  await new Promise((resolve) => setTimeout(resolve, 300))
  options.value = [
    { label: `用户: ${keyword}1`, value: 'user1' },
    { label: `用户: ${keyword}2`, value: 'user2' },
  ]
  loading.value = false
}
</script>

<template>
  <div style="width: 240px;">
    <Select
      v-model="value"
      :options="options"
      :loading="loading"
      filterable
      placeholder="搜索用户"
      @search="searchUsers"
    />
  </div>
</template>
```

:::

## 自定义选项渲染

通过 `#option` 插槽自定义每个选项的显示内容。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const userId = ref('')
const users = [
  { label: '张三', value: 'zhang', avatar: '👤', email: 'zhang@example.com' },
  { label: '李四', value: 'li', avatar: '👤', email: 'li@example.com' },
]
</script>

<template>
  <div style="width: 280px;">
    <Select v-model="userId" :options="users" filterable placeholder="搜索用户">
      <template #option="{ item, label }">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>{{ item.avatar }}</span>
          <span>{{ label }}</span>
          <span style="color: var(--ui-text-dim); font-size: 12px;">{{ item.email }}</span>
        </div>
      </template>
    </Select>
  </div>
</template>
```

:::

## 自定义空状态

搜索无结果时，可通过 `#empty` 插槽自定义提示内容。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const value = ref('')
const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
]
</script>

<template>
  <div style="width: 240px;">
    <Select v-model="value" :options="options" filterable empty-text="未找到匹配项">
      <template #empty>
        <div style="text-align: center; padding: 8px;">
          <span>🔍 没有找到相关选项</span>
          <button
            style="margin-left: 8px; color: var(--ui-primary); background: none; border: none; cursor: pointer;"
            @click="alert('新增选项')"
          >
            新增
          </button>
        </div>
      </template>
    </Select>
  </div>
</template>
```

:::

## 下拉面板高度

通过 `max-height` 属性控制下拉面板的最大高度（单位：px），超出后自动滚动。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const value = ref('')
const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
  { label: '选项四', value: '4' },
  { label: '选项五', value: '5' },
  { label: '选项六', value: '6' },
  { label: '选项七', value: '7' },
  { label: '选项八', value: '8' },
]
</script>

<template>
  <div style="width: 240px;">
    <Select
      v-model="value"
      :options="options"
      filterable
      :max-height="200"
      placeholder="选择选项"
    />
  </div>
</template>
```

:::

## 尺寸

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const value1 = ref('')
const value2 = ref('')
const value3 = ref('')
const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
]
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    <div style="width: 200px;">
      <Select v-model="value1" size="sm" :options="options" placeholder="小号" />
    </div>
    <div style="width: 200px;">
      <Select v-model="value2" size="md" :options="options" placeholder="中号" />
    </div>
    <div style="width: 200px;">
      <Select v-model="value3" size="lg" :options="options" placeholder="大号" />
    </div>
  </div>
</template>
```

:::

## 禁用状态

:::demo

```vue
<script setup>
import { Select } from 'moongate-vue'

const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
]
</script>

<template>
  <div style="width: 240px;">
    <Select disabled :options="options" value="1" />
  </div>
</template>
```

:::

## 错误状态

`error` 属性仅控制选择框边框颜色，不渲染错误消息。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const agree = ref('')
const options = [
  { label: '同意', value: 'yes' },
  { label: '不同意', value: 'no' },
]
</script>

<template>
  <div>
    <div style="width: 240px;">
      <Select v-model="agree" :error="!agree" :options="options" placeholder="请选择" />
    </div>
    <span
      v-if="!agree"
      style="color: var(--ui-error); font-size: 12px; margin-top: 4px; display: inline-block;"
    >
      请选择一个选项
    </span>
  </div>
</template>
```

:::

## 禁用选项

在选项中设置 `disabled: true` 可禁用特定选项。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Select } from 'moongate-vue'

const status = ref('')
const options = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive', disabled: true },
  { label: '待审核', value: 'pending' },
]
</script>

<template>
  <div style="width: 240px;">
    <Select v-model="status" :options="options" placeholder="请选择状态" />
    <p style="margin-top: 8px;">当前选中: {{ status || '未选择' }}</p>
  </div>
</template>
```

:::

## API

### Props

| 属性          | 类型                   | 默认值       | 说明                                         |
| ------------- | ---------------------- | ------------ | -------------------------------------------- |
| `modelValue`  | `string \| number`     | `''`         | 选中的值（v-model）                          |
| `options`     | `any[]`                | `[]`         | 选项列表，支持对象数组、字符串数组、数字数组 |
| `labelKey`    | `string`               | `'label'`    | 对象数组中作为显示文本的字段名               |
| `valueKey`    | `string`               | `'value'`    | 对象数组中作为选项值的字段名                 |
| `placeholder` | `string`               | `''`         | 占位文本（显示为不可选中的默认选项）         |
| `size`        | `'sm' \| 'md' \| 'lg'` | `'md'`       | 尺寸                                         |
| `disabled`    | `boolean`              | `false`      | 是否禁用                                     |
| `error`       | `boolean`              | `false`      | 是否显示错误状态（仅边框样式）               |
| `filterable`  | `boolean`              | `false`      | 是否可搜索（启用后替换为自定义下拉框）       |
| `emptyText`   | `string`               | `'暂无数据'` | 搜索无结果时的空状态文案                     |
| `maxHeight`   | `number`               | `240`        | 下拉面板最大高度（单位：px）                 |

### Events

| 事件                | 参数                        | 说明                                           |
| ------------------- | --------------------------- | ---------------------------------------------- |
| `update:modelValue` | `(value: string \| number)` | 值变化时触发（v-model）                        |
| `change`            | `(value: string \| number)` | 值变化时触发                                   |
| `search`            | `(value: string)`           | 搜索输入时触发（仅在 `filterable` 模式下可用） |

### Slots

| 名称     | 参数              | 说明                           |
| -------- | ----------------- | ------------------------------ |
| `option` | `{ item, label }` | 自定义选项渲染内容             |
| `empty`  | —                 | 自定义搜索无结果时的空状态内容 |

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
