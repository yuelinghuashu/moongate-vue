# Skeleton 骨架屏

骨架屏组件，用于数据加载时的占位展示。

## 基础用法

```vue
<Skeleton />
```

## 带标题

第一行会显示为更宽的标题样式。

```vue
<Skeleton :rows="4" title />
```

## 卡片模式

适用于文章卡片、评论卡片等场景。

```vue
<Skeleton type="card" avatar :rows="3" />
```

## 列表模式

适用于文章列表、评论列表等场景。

```vue
<Skeleton type="list" avatar :rows="3" />
```

## 自定义行高

```vue
<Skeleton :rows="4" row-size="lg" />
```

## 动态切换

```vue
<script setup>
const loading = ref(false)

const loadData = () => {
  loading.value = true
  fetchData().finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <Button @click="loadData" :loading="loading" label="加载数据" />
  <Skeleton v-if="loading" :rows="3" title />
  <div v-else>真实内容</div>
</template>
```

## API

### Props

| 属性          | 类型                            | 默认值      | 说明                      |
| ------------- | ------------------------------- | ----------- | ------------------------- |
| `type`        | `'default' \| 'card' \| 'list'` | `'default'` | 骨架屏类型                |
| `rows`        | `number`                        | `4`         | 行数                      |
| `avatar`      | `boolean`                       | `false`     | 是否显示头像              |
| `avatarShape` | `'circle' \| 'square'`          | `'circle'`  | 头像形状                  |
| `avatarSize`  | `'sm' \| 'md' \| 'lg'`          | `'md'`      | 头像尺寸                  |
| `title`       | `boolean`                       | `false`     | 第一行是否为标题（更宽）  |
| `rowSize`     | `'sm' \| 'md' \| 'lg'`          | `'md'`      | 行宽度（仅 default 模式） |

## 尺寸对照

| 尺寸 | 头像大小 | 行高度   |
| ---- | -------- | -------- |
| `sm` | 32px     | 0.875rem |
| `md` | 40px     | 1rem     |
| `lg` | 48px     | 1.25rem  |

## 注意事项

- 骨架屏是纯展示组件，无任何交互行为
- `default` 模式按行显示，`card` 和 `list` 模式自动布局
- 动画为左到右的流光效果
- 深色模式自动适配背景色
- `card` 模式下 `rows` 表示内容区域的行数
