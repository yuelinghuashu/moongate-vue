# Modal 模态框

模态框组件，用于弹窗展示内容。

## 基础用法

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Modal } from 'moongate-vue'

const open = ref(false)
</script>

<template>
  <div>
    <Button @click="open = true" label="打开弹窗" />
    <Modal v-model="open" title="提示">
      <p>这是弹窗内容</p>
    </Modal>
  </div>
</template>
```

:::

## 尺寸

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Modal } from 'moongate-vue'

const openSm = ref(false)
const openMd = ref(false)
const openLg = ref(false)
const openXl = ref(false)
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <Button @click="openSm = true" label="小号" />
    <Button @click="openMd = true" label="中号" />
    <Button @click="openLg = true" label="大号" />
    <Button @click="openXl = true" label="超大" />

    <Modal v-model="openSm" title="小号" size="sm">
      <p>小号弹窗内容</p>
    </Modal>
    <Modal v-model="openMd" title="中号" size="md">
      <p>中号弹窗内容</p>
    </Modal>
    <Modal v-model="openLg" title="大号" size="lg">
      <p>大号弹窗内容</p>
    </Modal>
    <Modal v-model="openXl" title="超大" size="xl">
      <p>超大弹窗内容</p>
    </Modal>
  </div>
</template>
```

:::

## 自定义底部按钮

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Modal } from 'moongate-vue'

const open = ref(false)

const handleConfirm = () => {
  alert('已确认')
  open.value = false
}
</script>

<template>
  <div>
    <Button @click="open = true" label="打开弹窗" />
    <Modal v-model="open" title="确认操作">
      <p>确定要删除吗？</p>
      <template #footer>
        <Button variant="outline" @click="open = false" label="取消" />
        <Button variant="filled" color="error" @click="handleConfirm" label="确认" />
      </template>
    </Modal>
  </div>
</template>
```

:::

## 自定义标题

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Modal } from 'moongate-vue'

const open = ref(false)
</script>

<template>
  <div>
    <Button @click="open = true" label="打开弹窗" />
    <Modal v-model="open">
      <template #title>
        <span style="display: flex; align-items: center; gap: 8px;">🎉 自定义标题</span>
      </template>
      <p>弹窗内容</p>
    </Modal>
  </div>
</template>
```

:::

## 无关闭按钮

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Modal } from 'moongate-vue'

const open = ref(false)
</script>

<template>
  <div>
    <Button @click="open = true" label="打开弹窗" />
    <Modal v-model="open" title="提示" :closable="false">
      <p>这个弹窗没有关闭按钮</p>
    </Modal>
  </div>
</template>
```

:::

## 禁用点击遮罩层关闭

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Modal } from 'moongate-vue'

const open = ref(false)
</script>

<template>
  <div>
    <Button @click="open = true" label="打开弹窗" />
    <Modal v-model="open" title="提示" :close-on-overlay="false">
      <p>点击遮罩层不会关闭</p>
    </Modal>
  </div>
</template>
```

:::

## API

### Props

| 属性              | 类型                           | 默认值   | 说明                              |
| ----------------- | ------------------------------ | -------- | --------------------------------- |
| `modelValue`      | `boolean`                      | `false`  | 是否显示（v-model）               |
| `title`           | `string`                       | `''`     | 标题                              |
| `size`            | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`   | 尺寸（宽度）                      |
| `closable`        | `boolean`                      | `true`   | 是否显示关闭按钮                  |
| `closeOnOverlay`  | `boolean`                      | `true`   | 点击遮罩层是否关闭                |
| `closeAriaLabel`  | `string`                       | `'关闭'` | 关闭按钮的无障碍标签              |
| `enableEsc`       | `boolean`                      | `true`   | 是否启用 ESC 键关闭               |
| `enableFocusTrap` | `boolean`                      | `true`   | 是否启用焦点陷阱（键盘 Tab 循环） |

### Slots

| 名称      | 说明                                  |
| --------- | ------------------------------------- |
| `title`   | 自定义标题（优先级高于 `title` prop） |
| `default` | 弹窗内容                              |
| `footer`  | 底部区域（通常放按钮）                |

### Events

| 事件                | 参数               | 说明               |
| ------------------- | ------------------ | ------------------ |
| `update:modelValue` | `(value: boolean)` | 显示状态变化时触发 |
| `open`              | —                  | 弹窗打开时触发     |
| `close`             | —                  | 弹窗关闭时触发     |

## 尺寸对照

| 尺寸 | 最大宽度 | 适用场景         |
| ---- | -------- | ---------------- |
| `sm` | 400px    | 简单确认框、提示 |
| `md` | 500px    | 默认弹窗         |
| `lg` | 700px    | 表单、详情展示   |
| `xl` | 900px    | 大内容、图片预览 |

## 注意事项

- 弹窗使用 `Teleport` 挂载到 `body`，避免层级问题
- 弹窗打开时会锁定 body 滚动，关闭时恢复
- 支持点击遮罩层关闭（可通过 `closeOnOverlay` 禁用）
- 支持按 ESC 键关闭（可通过 `enableEsc` 禁用）
- 打开时自动启用焦点陷阱（可通过 `enableFocusTrap` 禁用）
- 关闭按钮可通过 `closable` 属性控制显示/隐藏
- 包含完整的 ARIA 无障碍属性
