# Hero 英雄区

英雄区组件，用于页面顶部的品牌展示区域。

## 基础用法

```vue
<Hero title="Where Moon Meets Code" description="推开月之门，进入一个由代码构筑的探索空间。">
  <template #actions>
    <Button variant="filled" color="primary" size="lg" to="/docs">
      Access the Gate
      <template #icon>
        <Icon name="lucide:arrow-right" class="w-4 h-4" />
      </template>
    </Button>
  </template>
</Hero>
```

## 自定义标题和描述

通过插槽可以更灵活地定制内容。

```vue
<Hero>
  <template #title>
    <span class="text-gradient">Where Moon Meets Code</span>
  </template>
  <template #description>
    <p>推开月之门，进入一个由代码构筑的探索空间。</p>
    <p class="mt-2 text-sm">探索、学习、创造</p>
  </template>
  <template #actions>
    <div class="flex gap-4 justify-center">
      <Button variant="filled" color="primary" to="/docs">开始阅读</Button>
      <Button variant="outline" color="primary" to="/about">关于我</Button>
    </div>
  </template>
</Hero>
```

## 纯展示模式

不需要按钮时，可以省略 `actions` 插槽。

```vue
<Hero title="Where Moon Meets Code" description="推开月之门..." />
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 标题文字 |
| `description` | `string` | - | 描述文字 |

### Slots

| 名称 | 说明 |
|------|------|
| `title` | 自定义标题内容（优先级高于 `title` prop） |
| `description` | 自定义描述内容（优先级高于 `description` prop） |
| `actions` | 操作区域，通常放置按钮 |

## 响应式

- 移动端：标题约 40px，内边距 4rem
- 平板：标题约 48px，内边距 6rem
- 桌面：标题约 60px

## 注意事项

- Hero 组件只负责布局和样式，不包含内置按钮
- 按钮需通过 `actions` 插槽自行添加
- 组件使用 `Container` 自动控制最大宽度和居中
