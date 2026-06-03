# Footer 底部容器

页面底部容器组件，提供语义化的 `<footer>` 元素。

## 基础用法

```vue
<Footer>
  <Container>
    <div style="padding: 1.5rem 0; text-align: center;">
      © 2026 Moongate. All rights reserved.
    </div>
  </Container>
</Footer>
```

## API

### Slots

| 名称 | 说明 |
|------|------|
| `default` | 底部内容 |

## 注意事项

- Footer 只提供基础结构，不包含背景色和边框
- 如需底部固定在页面最下方，请确保父容器设置了 `display: flex; flex-direction: column; min-height: 100vh`