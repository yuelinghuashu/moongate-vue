# Divider 分割线

分割线组件，用于分隔内容区块。

## 基础用法

```vue
<Divider />
```

## 虚线

```vue
<Divider dashed />
```

## 带文字

```vue
<Divider>分隔文字</Divider>
<Divider dashed>虚线分隔</Divider>
```

## 垂直分割线

用于按钮组、面包屑等内联场景。

```vue
<div class="flex items-center gap-2">
  <span>首页</span>
  <Divider vertical />
  <span>关于</span>
  <Divider vertical />
  <span>联系</span>
</div>
```

## API

### Props

| 属性       | 类型      | 默认值  | 说明             |
| ---------- | --------- | ------- | ---------------- |
| `vertical` | `boolean` | `false` | 是否为垂直分割线 |
| `dashed`   | `boolean` | `false` | 是否为虚线       |

### Slots

| 名称      | 说明                           |
| --------- | ------------------------------ |
| `default` | 分割线中间的文字（仅水平模式） |

## 注意事项

- 水平分割线默认占据整行，上下间距为 `--ui-spacing-xl`
- 垂直分割线用于内联场景，高度为 `1em`，与文字对齐
- 带文字的分割线使用 `::before` 和 `::after` 伪元素实现，无需额外 DOM 结构
