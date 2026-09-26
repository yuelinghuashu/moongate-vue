# 介绍

Moongate Vue 是一个受月亮启发的**极简 Vue 3 组件库**：29 个组件 + 2 个样式工具，零运行时依赖，设计令牌驱动，CSS 优先。

```bash
npm install moongate-vue
```

```vue
<script setup>
import { Button } from 'moongate-vue'
import 'moongate-vue/style.css'
</script>

<template>
  <Button label="月光按钮" />
</template>
```

继续阅读[设计哲学](/guide/philosophy)了解取舍，或直接看[快速开始](/guide/getting-started)与[组件列表](/components/)。

## 浏览器支持

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_24x24.png" width="24px" height="24px" /> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_24x24.png" width="24px" height="24px" /> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_24x24.png" width="24px" height="24px" /> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_24x24.png" width="24px" height="24px" /> |
| :-----------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: |
|                                                          Chrome ≥ 111                                                           |                                                           Firefox ≥ 113                                                           |                                                         Edge ≥ 111                                                          |                                                          Safari ≥ 16.2                                                          |

与 **VitePress** 基线保持一致；完整版本要求见[安装](/guide/install#环境要求)，版本变更见[更新日志](/guide/changelog)。

## 贡献

欢迎贡献，请查看 [GitHub](https://github.com/yuelinghuashu/moongate-vue)。
