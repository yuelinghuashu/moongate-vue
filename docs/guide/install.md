# 安装

## 环境要求

- Node.js 20 及以上版本
- Vue 3.3 及以上版本

## 安装命令

```bash
npm install moongate-vue
# 或
pnpm add moongate-vue
# 或
yarn add moongate-vue
```

## 完整引入

```js
// main.js
import { createApp } from 'vue'
import MoongateUI from 'moongate-vue'
import 'moongate-vue/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(MoongateUI)
app.mount('#app')
```

## 按需引入

```vue
<script setup>
import { Button, useMessage } from 'moongate-vue'
import 'moongate-vue/style.css'
</script>
```

## 注意事项

- 需要额外引入样式文件 `moongate-vue/style.css`
- 组件库支持 Tree Shaking，未使用的组件不会打包