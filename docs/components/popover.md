# Popover 弹出层

轻量级弹出层组件，用于鼠标悬浮时显示额外内容（如菜单、选项卡片），支持自动位置翻转和交互停留。

> **何时使用**：需要在点击/悬停时显示富内容（卡片、菜单、表单）时使用。纯文字提示请使用 Tooltip。

## 基础用法

:::demo

```vue
<script setup>
import { Popover, Button } from 'moongate-vue'
</script>

<template>
  <div style="padding: 40px;">
    <Popover placement="bottom" :show-delay="100">
      <template #trigger>
        <Button>悬浮弹出</Button>
      </template>
      <template #content>
        <div style="min-width: 120px;">
          <div style="padding: 8px 12px;">选项一</div>
          <div style="padding: 8px 12px;">选项二</div>
          <div style="padding: 8px 12px;">选项三</div>
        </div>
      </template>
    </Popover>
  </div>
</template>
```

:::

## 语言切换示例

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Popover } from 'moongate-vue'

const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
]

const currentLang = ref('zh')

const setLanguage = (code) => {
  currentLang.value = code
  console.log(`切换到: ${code}`)
}
</script>

<template>
  <div style="padding: 40px;">
    <Popover placement="bottom" :show-delay="100" :hide-delay="200">
      <template #trigger>
        <span style="cursor: pointer; font-size: 20px;">🌐</span>
      </template>
      <template #content>
        <div style="display: flex; flex-direction: column; min-width: 100px;">
          <button
            v-for="lang in languages"
            :key="lang.code"
            style="padding: 8px 16px; text-align: left; background: none; border: none; cursor: pointer;"
            @click="setLanguage(lang.code)"
          >
            {{ lang.name }}
          </button>
        </div>
      </template>
    </Popover>
    <p style="margin-top: 16px;">当前语言: {{ currentLang }}</p>
  </div>
</template>
```

:::

## 触发方式

组件默认通过 `hover` 触发，鼠标移入触发区域或内容区域时显示，移出后延迟隐藏。支持配置显示/隐藏延迟。

## 位置自动翻转

当 Popover 超出视口边界时，会自动翻转方向（例如 `bottom` 空间不足会翻转为 `top`），并会进行边界矫正，确保内容完整显示在屏幕内。

## API

### Props

| 属性        | 类型                                     | 默认值     | 说明                             |
| ----------- | ---------------------------------------- | ---------- | -------------------------------- |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | 弹出位置                         |
| `showDelay` | `number`                                 | `0`        | 显示延迟（毫秒）                 |
| `hideDelay` | `number`                                 | `100`      | 隐藏延迟（毫秒）                 |
| `offset`    | `number`                                 | `8`        | 与触发元素的偏移量（像素）       |
| `ariaLabel` | `string`                                 | `''`       | 弹出层的无障碍标签（aria-label） |

### Slots

| 名称      | 说明                             |
| --------- | -------------------------------- |
| `trigger` | 触发元素（支持默认插槽作为后备） |
| `content` | 弹出内容                         |

## 注意事项

- Popover 适用于鼠标悬浮触发的轻量内容，不适合需要点击外部关闭、受控模式的复杂场景。如需此类功能，可基于本组件扩展。
- 支持**键盘焦点**触发：Tab 聚焦时显示，失焦后隐藏。
- 按 **Escape** 键可关闭弹出层（键盘无障碍支持）。
- 触发区域和内容区域之间移动时，延迟机制保证不会闪烁消失。
- 内容宽度由内容决定，可通过 CSS 设置 `min-width` 或 `width`。
