# Pagination 分页

分页组件，用于分页导航。支持点击当前页码直接输入跳转，并提供快速跳转首尾页按钮，简洁高效。

## 基础用法

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Pagination } from 'moongate-vue'

const page = ref(1)
</script>

<template>
  <Pagination v-model="page" :total-pages="10" />
  <p style="margin-top: 12px; color: var(--ui-text-dim);">当前页码: {{ page }}</p>
</template>
```

:::

## 快速跳转首尾页

默认显示「«」和「»」按钮，分别跳转到第一页和最后一页。可通过 `show-quick-jump` 属性控制是否显示。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Pagination } from 'moongate-vue'

const page1 = ref(1)
const page2 = ref(1)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <p style="margin-bottom: 8px;">显示快速跳转按钮（默认）</p>
      <Pagination v-model="page1" :total-pages="50" />
    </div>
    <div>
      <p style="margin-bottom: 8px;">隐藏快速跳转按钮</p>
      <Pagination v-model="page2" :total-pages="50" :show-quick-jump="false" />
    </div>
  </div>
</template>
```

:::

## 自定义按钮文字

支持自定义所有按钮文字，适用于多语言场景。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Pagination } from 'moongate-vue'

const page = ref(1)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <div>
      <p style="margin-bottom: 8px;">中文自定义</p>
      <Pagination
        v-model="page"
        :total-pages="50"
        prev-text="上一页"
        next-text="下一页"
        first-text="首页"
        last-text="尾页"
      />
    </div>
    <div>
      <p style="margin-bottom: 8px;">英文环境</p>
      <Pagination
        v-model="page"
        :total-pages="50"
        prev-text="Prev"
        next-text="Next"
        first-text="First"
        last-text="Last"
      />
    </div>
  </div>
</template>
```

:::

## 尺寸

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Pagination } from 'moongate-vue'

const page1 = ref(1)
const page2 = ref(1)
const page3 = ref(1)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <Pagination v-model="page1" :total-pages="10" size="sm" />
    <Pagination v-model="page2" :total-pages="10" size="md" />
    <Pagination v-model="page3" :total-pages="10" size="lg" />
  </div>
</template>
```

:::

## 点击跳转

点击当前页码会变成输入框，输入数字后按回车或失去焦点即可跳转。

```text
[首页] [上一页]  5  /  50  [下一页] [尾页]
              ↓ 点击
[首页] [上一页]  [____]  [下一页] [尾页]
              ↓ 输入 8 回车
[首页] [上一页]  8  /  50  [下一页] [尾页]
```

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Pagination } from 'moongate-vue'

const page = ref(5)
</script>

<template>
  <div>
    <Pagination v-model="page" :total-pages="50" />
    <p style="margin-top: 12px; color: var(--ui-text-dim);">
      提示：点击当前页码即可编辑，按回车或失去焦点跳转
    </p>
  </div>
</template>
```

:::

## API

### Props

| 属性            | 类型                   | 默认值     | 说明                       |
| --------------- | ---------------------- | ---------- | -------------------------- |
| `v-model`       | `number`               | —          | 当前页码（双向绑定）       |
| `totalPages`    | `number`               | —          | 总页数（必填）             |
| `size`          | `'sm' \| 'md' \| 'lg'` | `'md'`     | 按钮尺寸                   |
| `prevText`      | `string`               | `'上一页'` | 上一页按钮文字             |
| `nextText`      | `string`               | `'下一页'` | 下一页按钮文字             |
| `showQuickJump` | `boolean`              | `true`     | 是否显示快速跳转首尾页按钮 |
| `firstText`     | `string`               | `'«'`      | 第一页按钮文字             |
| `lastText`      | `string`               | `'»'`      | 最后一页按钮文字           |

### Events

| 事件     | 参数             | 说明           |
| -------- | ---------------- | -------------- |
| `change` | `(page: number)` | 页码变化时触发 |

## 完整示例

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Pagination } from 'moongate-vue'

const page = ref(1)
const total = ref(50)

const handleChange = (newPage) => {
  console.log(`跳转到第 ${newPage} 页`)
}
</script>

<template>
  <div>
    <Pagination
      v-model="page"
      :total-pages="total"
      size="md"
      prev-text="上一页"
      next-text="下一页"
      first-text="首页"
      last-text="尾页"
      @change="handleChange"
    />
    <p style="margin-top: 12px; color: var(--ui-text-dim);">当前页码: {{ page }}</p>
  </div>
</template>
```

:::

## 注意事项

- 页码显示格式为 `当前页 / 总页数`，简洁明了
- 点击当前页码即可编辑，无需额外跳转输入框
- 输入超出范围时会自动修正（1 ≤ 页码 ≤ 总页数）
- 上一页/下一页/首页/尾页按钮在边界时自动禁用
- 所有按钮文字均支持自定义，适用于多语言场景
- 快速跳转按钮默认显示，可通过 `show-quick-jump` 关闭
