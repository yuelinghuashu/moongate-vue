# Container 容器

容器组件，用于限制内容区域的最大宽度并居中。

## 基础用法

```vue
<Container>
  <p>内容区域自动居中，最大宽度 1024px</p>
</Container>
```

## 尺寸

```vue
<Container size="sm">
  <p>最大宽度 640px</p>
</Container>

<Container size="md">
  <p>最大宽度 768px</p>
</Container>

<Container size="lg">
  <p>最大宽度 1024px（默认）</p>
</Container>

<Container size="xl">
  <p>最大宽度 1280px</p>
</Container>

<Container size="2xl">
  <p>最大宽度 1536px</p>
</Container>

<Container size="3xl">
  <p>最大宽度 1920px</p>
</Container>

<Container size="full">
  <p>最大宽度 100%，占满整行</p>
</Container>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| 'full'` | `'lg'` | 容器最大宽度 |

### Slots

| 名称 | 说明 |
|------|------|
| `default` | 容器内容 |

## 尺寸对照表

| 尺寸 | 最大宽度 | 适用场景 |
|------|----------|----------|
| `sm` | 640px | 窄内容（侧边栏） |
| `md` | 768px | 平板 |
| `lg` | 1024px | 笔记本（默认） |
| `xl` | 1280px | 标准桌面 |
| `2xl` | 1536px | 大屏幕 |
| `3xl` | 1920px | 2K 屏幕 |
| `full` | 100% | 全宽（无限制） |

## 注意事项

- Container 默认使用 `--ui-spacing-lg` 作为左右内边距
- `full` 模式下 `max-width` 为 `100%`，容器会填满父容器宽度
- Container 不包含背景色，只负责宽度和居中
