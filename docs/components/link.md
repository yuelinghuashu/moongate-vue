# Link 链接样式

> **注意**：Moongate 不提供封装的 Link 组件，仅提供样式类。请直接使用官方链接组件（`<RouterLink>`、`<NuxtLink>` 或 `<a>`）配合以下样式类。

## 为什么没有封装组件？

- 官方链接组件已经足够完善，无需重复封装
- 样式与逻辑解耦，更灵活、更轻量
- 避免透传 props 的维护负担
- 框架无关，React 等其他框架也可使用

## 通用链接 `.mg-link`

用于正文中的链接，轻量、无背景、无内边距。悬停时自动变色并显示下划线。

### 基础用法

```vue
<!-- 内部链接 -->
<RouterLink to="/about" rel="noopener noreferrer" class="mg-link">
  关于我们
</RouterLink>

<!-- 外部链接（新窗口打开，注意添加安全属性） -->
<a href="https://example.com" rel="noopener noreferrer" target="_blank" class="mg-link" rel="noopener noreferrer">
  外部网站
</a>
```

### 自定义颜色

配合工具类实现不同颜色：

```vue
<RouterLink to="/login" rel="noopener noreferrer" class="mg-link text-primary">
  登录
</RouterLink>
```

## 导航链接 `.nav-link`

用于导航栏，有内边距和悬停背景色。

### 基础用法

```vue
<RouterLink to="/" rel="noopener noreferrer" class="nav-link">首页</RouterLink>
<RouterLink to="/about" rel="noopener noreferrer" class="nav-link">关于</RouterLink>
```

### 激活状态

`RouterLink` 和 `NuxtLink` 会自动添加 `router-link-active` 类，你可根据需要自定义激活样式：

```vue
<!-- 自定义激活样式 -->
<RouterLink to="/" rel="noopener noreferrer" class="nav-link" active-class="active">
  首页
</RouterLink>
```

```css
.nav-link.active {
  background-color: var(--ui-bg-active);
  color: var(--ui-primary);
}
```

## API

本模块仅提供样式类，无组件 API。

### 样式类列表

| 类名 | 适用场景 | 内边距 | 背景色 | 悬停效果 |
|------|----------|--------|--------|----------|
| `.mg-link` | 正文链接 | 无 | 无 | 变色 + 下划线 |
| `.nav-link` | 导航链接 | 有 | 有（悬停） | 背景色变化 |

## 注意事项

- 两种链接都默认显示手型光标（`cursor: pointer`）
- `.mg-link` 和 `.nav-link` 设计用于不同场景，**不建议同时使用**
- 导航栏链接只用 `.nav-link`，正文链接只用 `.mg-link`
- 通用链接悬停时会自动出现下划线，导航链接无下划线
- **安全提示**：当使用 `<a>` 标签并设置 `target="_blank"` 时，务必同时添加 `rel="noopener noreferrer"`，以防止安全漏洞（新页面通过 `window.opener` 控制原页面）。
- 对于 `RouterLink` 或 `NuxtLink`，如果设置 `target="_blank"`，也建议手动添加 `rel="noopener noreferrer"`（虽然部分框架可能自动处理，但显式添加更安全）。
