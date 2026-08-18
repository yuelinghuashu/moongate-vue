# Dropdown 下拉菜单

点击触发后弹出的操作菜单组件，适用于动作选择、快捷操作等场景。支持键盘导航、分隔线、危险操作高亮。

## 基础用法

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Dropdown, Button } from 'moongate-vue'

const options = [
  { key: 'edit', label: '编辑' },
  { key: 'copy', label: '复制' },
  { key: 'delete', label: '删除' },
]

const handleSelect = (key) => {
  console.log('选中:', key)
}
</script>

<template>
  <Dropdown :options="options" @select="handleSelect">
    <Button>操作菜单</Button>
  </Dropdown>
</template>
```

:::

## 分隔线与危险操作

通过 `separator: true` 添加分隔线，`danger: true` 标记危险操作（红色高亮）。

:::demo

```vue
<script setup>
import { Dropdown, Button } from 'moongate-vue'

const options = [
  { key: 'edit', label: '编辑', icon: '✏️' },
  { key: 'copy', label: '复制', icon: '📋' },
  { key: '__sep__', separator: true },
  { key: 'delete', label: '删除', icon: '🗑️', danger: true },
]
</script>

<template>
  <Dropdown :options="options" @select="(k) => console.log(k)">
    <Button variant="outline">更多操作</Button>
  </Dropdown>
</template>
```

:::

## 弹出位置

通过 `placement` 控制菜单弹出方向，支持9个方位。

:::demo

```vue
<script setup>
import { Dropdown, Button } from 'moongate-vue'

const options = [
  { key: 'action1', label: '操作一' },
  { key: 'action2', label: '操作二' },
]
</script>

<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <Dropdown :options="options" placement="bottom-start" @select="(k) => console.log(k)">
      <Button>下左</Button>
    </Dropdown>
    <Dropdown :options="options" placement="bottom" @select="(k) => console.log(k)">
      <Button>下中</Button>
    </Dropdown>
    <Dropdown :options="options" placement="bottom-end" @select="(k) => console.log(k)">
      <Button>下右</Button>
    </Dropdown>
  </div>
</template>
```

:::

## 受控模式

使用 `v-model:open` 控制菜单的展开/收起状态。

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Dropdown, Button } from 'moongate-vue'

const isOpen = ref(false)
const options = [
  { key: 'save', label: '保存' },
  { key: 'publish', label: '发布' },
]
</script>

<template>
  <Dropdown :options="options" v-model:open="isOpen" @select="(k) => console.log(k)">
    <Button>{{ isOpen ? '收起' : '展开' }}</Button>
  </Dropdown>
</template>
```

:::

## 尺寸

通过 `size` 控制菜单尺寸。

:::demo

```vue
<script setup>
import { Dropdown, Button } from 'moongate-vue'

const options = [
  { key: 'a', label: '选项 A' },
  { key: 'b', label: '选项 B' },
]
</script>

<template>
  <div style="display: flex; gap: 16px;">
    <Dropdown :options="options" size="sm" @select="(k) => console.log(k)">
      <Button size="sm">小号</Button>
    </Dropdown>
    <Dropdown :options="options" size="md" @select="(k) => console.log(k)">
      <Button>中号</Button>
    </Dropdown>
    <Dropdown :options="options" size="lg" @select="(k) => console.log(k)">
      <Button size="lg">大号</Button>
    </Dropdown>
  </div>
</template>
```

:::

## 禁用状态

设置 `disabled` 后，点击触发区不会弹出菜单。

:::demo

```vue
<script setup>
import { Dropdown, Button } from 'moongate-vue'

const options = [{ key: 'a', label: '选项 A' }]
</script>

<template>
  <Dropdown :options="options" disabled @select="(k) => console.log(k)">
    <Button disabled>禁用菜单</Button>
  </Dropdown>
</template>
```

:::

## 键盘导航

完全支持键盘操作，符合 WAI-ARIA Menu 模式：

| 按键              | 行为                          |
| ----------------- | ----------------------------- |
| `↑` `↓`           | 在菜单项间移动高亮            |
| `Home`            | 跳转到第一个可选项            |
| `End`             | 跳转到最后一个可选项          |
| `Enter` / `Space` | 选中当前高亮项                |
| `Escape`          | 关闭菜单                      |
| 首字符输入        | 快速跳转到匹配项（TypeAhead） |

## API

### Props

| 属性        | 类型                   | 默认值           | 说明               |
| ----------- | ---------------------- | ---------------- | ------------------ |
| `options`   | `DropdownOption[]`     | `[]`             | 菜单项列表         |
| `placement` | `DropdownPlacement`    | `'bottom-start'` | 弹出位置           |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'`           | 菜单尺寸           |
| `disabled`  | `boolean`              | `false`          | 是否禁用           |
| `ariaLabel` | `string`               | `''`             | 弹出层的无障碍标签 |

### v-model

| 属性   | 类型      | 说明                     |
| ------ | --------- | ------------------------ |
| `open` | `boolean` | 菜单展开状态（受控模式） |

### Events

| 事件     | 参数                                    | 说明             |
| -------- | --------------------------------------- | ---------------- |
| `select` | `(key: string, option: DropdownOption)` | 选中菜单项时触发 |
| `open`   | —                                       | 菜单展开时触发   |
| `close`  | —                                       | 菜单关闭时触发   |

### Slots

| 名称      | 说明             |
| --------- | ---------------- |
| `default` | 触发元素         |
| `item`    | 自定义菜单项渲染 |

### DropdownOption 类型

| 属性        | 类型      | 说明                   |
| ----------- | --------- | ---------------------- |
| `key`       | `string`  | 唯一标识（选中时传出） |
| `label`     | `string`  | 显示文本               |
| `icon`      | `string`  | 图标（emoji 或字符串） |
| `disabled`  | `boolean` | 是否禁用               |
| `danger`    | `boolean` | 是否为危险操作（红色） |
| `separator` | `boolean` | 是否为分隔线           |

## 注意事项

- Dropdown 适用于**操作菜单**（点击后执行动作），若需**值选择**请使用 Select
- 支持 `placement` 的 `-start` / `-end` 后缀控制对齐方式（如 `bottom-start` 左对齐）
- 菜单通过 `Teleport` 挂载到 `body`，避免被父容器裁剪
- 全组件 SSR 安全，键盘导航和 ARIA 属性完整支持
