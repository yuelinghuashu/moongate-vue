# Drawer 抽屉

抽屉组件，用于从屏幕边缘滑出的面板。

## 基础用法

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Drawer } from 'moongate-vue'

const open = ref(false)
</script>

<template>
  <div>
    <Button @click="open = true" label="打开抽屉" />
    <Drawer v-model="open" title="标题">
      <p>抽屉内容</p>
    </Drawer>
  </div>
</template>
```

:::

## 方向

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Drawer } from 'moongate-vue'

const openLeft = ref(false)
const openRight = ref(false)
const openTop = ref(false)
const openBottom = ref(false)
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <Button @click="openLeft = true" label="左侧抽屉" />
    <Button @click="openRight = true" label="右侧抽屉" />
    <Button @click="openTop = true" label="顶部抽屉" />
    <Button @click="openBottom = true" label="底部抽屉" />

    <Drawer v-model="openLeft" placement="left" title="左侧抽屉">
      <p>从左侧滑出的抽屉内容</p>
    </Drawer>
    <Drawer v-model="openRight" placement="right" title="右侧抽屉">
      <p>从右侧滑出的抽屉内容</p>
    </Drawer>
    <Drawer v-model="openTop" placement="top" title="顶部抽屉">
      <p>从顶部滑出的抽屉内容</p>
    </Drawer>
    <Drawer v-model="openBottom" placement="bottom" title="底部抽屉">
      <p>从底部滑出的抽屉内容</p>
    </Drawer>
  </div>
</template>
```

:::

## 尺寸

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Drawer } from 'moongate-vue'

const openSm = ref(false)
const openMd = ref(false)
const openLg = ref(false)
const openXl = ref(false)
const openFull = ref(false)
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <Button @click="openSm = true" label="小号" />
    <Button @click="openMd = true" label="中号" />
    <Button @click="openLg = true" label="大号" />
    <Button @click="openXl = true" label="超大" />
    <Button @click="openFull = true" label="全屏" />

    <Drawer v-model="openSm" size="sm" title="小号抽屉">
      <p>小号抽屉内容</p>
    </Drawer>
    <Drawer v-model="openMd" size="md" title="中号抽屉">
      <p>中号抽屉内容</p>
    </Drawer>
    <Drawer v-model="openLg" size="lg" title="大号抽屉">
      <p>大号抽屉内容</p>
    </Drawer>
    <Drawer v-model="openXl" size="xl" title="超大抽屉">
      <p>超大抽屉内容</p>
    </Drawer>
    <Drawer v-model="openFull" size="full" title="全屏抽屉">
      <p>全屏抽屉内容</p>
    </Drawer>
  </div>
</template>
```

:::

## 自定义头部/底部

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Button, Drawer } from 'moongate-vue'

const open = ref(false)
</script>

<template>
  <div>
    <Button @click="open = true" label="打开抽屉" />
    <Drawer v-model="open">
      <template #header>
        <div
          style="display: flex; justify-content: space-between; align-items: center; width: 100%;"
        >
          <span>自定义标题区域</span>
          <span>🔔</span>
        </div>
      </template>
      <p>抽屉内容</p>
      <template #footer>
        <Button @click="open = false" label="关闭" />
      </template>
    </Drawer>
  </div>
</template>
```

:::

## API

### Props

| 属性              | 类型                                     | 默认值       | 说明                              |
| ----------------- | ---------------------------------------- | ------------ | --------------------------------- |
| `modelValue`      | `boolean`                                | `false`      | 是否显示（v-model）               |
| `placement`       | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'`    | 抽屉方向                          |
| `size`            | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'`       | 尺寸                              |
| `title`           | `string`                                 | `''`         | 标题文本                          |
| `closable`        | `boolean`                                | `true`       | 是否显示关闭按钮                  |
| `closeOnOverlay`  | `boolean`                                | `true`       | 点击遮罩层是否关闭                |
| `closeAriaLabel`  | `string`                                 | `'关闭抽屉'` | 关闭按钮的无障碍标签              |
| `enableEsc`       | `boolean`                                | `true`       | 是否启用 ESC 键关闭               |
| `enableFocusTrap` | `boolean`                                | `true`       | 是否启用焦点陷阱（键盘 Tab 循环） |

### Slots

| 名称      | 说明                                 |
| --------- | ------------------------------------ |
| `header`  | 自定义头部内容（优先级高于 `title`） |
| `default` | 抽屉主体内容                         |
| `footer`  | 底部区域                             |

### Events

| 事件                | 参数               | 说明               |
| ------------------- | ------------------ | ------------------ |
| `update:modelValue` | `(value: boolean)` | 显示状态变化时触发 |
| `open`              | —                  | 抽屉打开时触发     |
| `close`             | —                  | 抽屉关闭时触发     |

## 注意事项

- 使用 `closeOnOverlay && handleClose()` 时，必须加上括号，否则 `closeOnOverlay` 为 `true` 时仅返回函数而未执行，导致点击遮罩层无法关闭。

- 当 `size="full"` 且 `placement="left"/"right"` 时，抽屉会占满全屏，遮罩层将不可见，建议避免此组合或根据实际需求调整。

- 抽屉打开时会自动锁定 body 滚动，关闭时恢复。
- 支持按 ESC 键关闭（可通过 `enableEsc` 禁用）。
- 打开时自动启用焦点陷阱（可通过 `enableFocusTrap` 禁用）。
- 包含完整的 ARIA 无障碍属性。
