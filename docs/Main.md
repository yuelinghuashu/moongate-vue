# Main 主内容容器

页面主内容容器组件，提供语义化的 `<main>` 元素，并自动撑满剩余高度。

## 基础用法

```vue
<Main>
  <Container>
    <article>
      <h1>文章标题</h1>
      <p>文章内容...</p>
    </article>
  </Container>
</Main>
```

## API

### Slots

| 名称 | 说明 |
|------|------|
| `default` | 主内容区域 |

## 注意事项

- Main 组件默认设置 `flex: 1`，确保在 Flex 布局中撑满剩余高度
- 需要在父容器设置 `display: flex; flex-direction: column; min-height: 100vh`