# 安装

## 环境要求

- Node.js 20 及以上版本
- Vue 3.5 及以上版本

## 安装命令

```bash
npm install moongate-vue
# 或
pnpm add moongate-vue
# 或
yarn add moongate-vue
```

## 样式引入

组件库的默认样式是**非侵入式**的（不会重置你的全局样式，* 等元素默认行为保持不变）：

```ts
// 默认引入：仅包含组件样式，无副作用
import 'moongate-vue/style.css'
```

如需统一盒模型基线（所有元素 `box-sizing: border-box`），可按需额外引入可选重置：

```ts
// 可选：全局盒模型统一（保留浏览器默认 margin/padding）
import 'moongate-vue/reset.css'
```

## 按需导入

```vue
<script setup>
import { Button, useMessage } from 'moongate-vue'
import 'moongate-vue/style.css'
</script>
```

## 注意事项

- 需要额外导入样式文件 `moongate-vue/style.css`
- `moongate-vue/reset.css` 为可选重置（仅统一 `border-box`），默认不引入
- 组件库支持 Tree Shaking，未使用的组件不会打包
