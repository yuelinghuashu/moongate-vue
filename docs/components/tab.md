# Tab 标签页

标签页组件，用于内容分类切换。

## 基础用法

```vue
<script setup>
import { ref } from "vue"
import { Tab } from "moongate-vue"

const tabs = [
  { label: "技术文章", content: "技术文章内容..." },
  { label: "生活随笔", content: "生活随笔内容..." },
  { label: "工具推荐", content: "工具推荐内容..." },
]
const active = ref(0)
</script>

<template>
  <Tab :tabs="tabs" v-model="active" />
</template>
```

## 自定义内容（插槽）

使用 `panel-{index}` 插槽自定义每个面板的内容：

```vue
<script setup>
import { ref } from "vue"
import { Tab } from "moongate-vue"

const tabs = [
  { label: "最新" },
  { label: "热门" },
  { label: "推荐" },
]
const active = ref(0)
</script>

<template>
  <Tab :tabs="tabs" v-model="active">
    <template #panel-0>
      <div>最新内容...</div>
    </template>
    <template #panel-1>
      <div>热门内容...</div>
    </template>
    <template #panel-2>
      <div>推荐内容...</div>
    </template>
  </Tab>
</template>
```

### 动态插槽（简化重复代码）

使用 `v-for` 动态生成插槽：

```vue
<template>
  <Tab :tabs="tabs" v-model="active">
    <template v-for="(tab, idx) in tabs" :key="idx" #[`panel-${idx}`]>
      <div class="custom-content">
        <Badge :color="tab.badgeColor">{{ tab.badgeLabel }}</Badge>
        <p>内容...</p>
      </div>
    </template>
  </Tab>
</template>
```

## 懒加载

设置 `lazy` 属性后，只有激活过的面板才会被渲染（首次激活时渲染，之后状态保留）。

```vue
<Tab :tabs="tabs" v-model="active" lazy>
  <template #panel-0>
    <HeavyComponent />  <!-- 首次打开时才渲染 -->
  </template>
  <template #panel-1>
    <AnotherComponent />  <!-- 首次打开时才渲染 -->
  </template>
</Tab>
```

## 卡片风格

```vue
<Tab :tabs="tabs" v-model="active" variant="card" />
```

## 尺寸

```vue
<Tab :tabs="tabs" v-model="active" size="sm" />
<Tab :tabs="tabs" v-model="active" size="md" />
<Tab :tabs="tabs" v-model="active" size="lg" />
```

## 带图标

```vue
<script setup>
const tabs = [
  { label: "首页", icon: "🏠" },
  { label: "关于", icon: "ℹ️" },
  { label: "联系", icon: "📧" },
]
</script>

<template>
  <Tab :tabs="tabs" v-model="active" />
</template>
```

## 禁用标签

```vue
<script setup>
const tabs = [
  { label: "可点击" },
  { label: "已禁用", disabled: true },
  { label: "可点击" },
]
</script>

<template>
  <Tab :tabs="tabs" v-model="active" />
</template>
```

## 监听切换事件

```vue
<template>
  <Tab :tabs="tabs" v-model="active" @change="handleTabChange" />
</template>

<script setup>
const handleTabChange = (index, tab) => {
  console.log(`切换到第 ${index + 1} 个标签：${tab.label}`)
}
</script>
```

## API

### Props

| 属性         | 类型                   | 默认值   | 说明                                 |
| ------------ | ---------------------- | -------- | ------------------------------------ |
| `tabs`       | `TabItem[]`            | `[]`     | 标签列表                             |
| `modelValue` | `number`               | `0`      | 当前激活的标签索引（v-model）        |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`   | 尺寸                                 |
| `variant`    | `'line' \| 'card'`     | `'line'` | 样式变体                             |
| `lazy`       | `boolean`              | `false`  | 是否懒加载（只有激活过的面板才渲染） |

### TabItem 类型

```typescript
interface TabItem {
  /** 标签文字 */
  label: string
  /** 图标（字符串，如 emoji） */
  icon?: string
  /** 面板内容（简单文本，插槽优先） */
  content?: string
  /** 是否禁用 */
  disabled?: boolean
}
```

### Slots

| 名称            | 说明                                         |
| --------------- | -------------------------------------------- |
| `panel-{index}` | 对应索引的面板内容（优先级高于 `tab.content`） |

### Events

| 事件                | 参数                            | 说明                          |
| ------------------- | ------------------------------- | ----------------------------- |
| `update:modelValue` | `(value: number)`               | 激活索引变化时触发（v-model） |
| `change`            | `(index: number, tab: TabItem)` | 切换标签页时触发              |

## 懒加载工作原理

| 模式                  | 行为                                           | 适用场景         |
| --------------------- | ---------------------------------------------- | ---------------- |
| `lazy: false`（默认） | 所有面板同时渲染                               | 内容简单、数量少 |
| `lazy: true`          | 只渲染激活过的面板（首次激活时渲染，之后保留） | 内容复杂、数量多 |

> **注意**：懒加载模式下，切换回之前的面板时不会重新渲染，内容状态会被保留。

## 注意事项

- `modelValue` 绑定的是标签索引（从 0 开始）
- 插槽优先级高于 `TabItem.content`，适合复杂内容
- 使用 `v-for` + 动态插槽 `#[`panel-${idx}`]` 可简化重复插槽代码
- 卡片模式下，激活标签的背景色会与内容区域融合
- 禁用标签无法被点击，也不会触发切换事件
- 懒加载模式下，自定义插槽内容只有在首次激活时才会被渲染