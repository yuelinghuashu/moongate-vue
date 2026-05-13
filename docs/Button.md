# Button 按钮

按钮组件，用于触发操作或提交表单。

## 基础用法

```vue
<Button label="默认按钮" />
<Button variant="filled" color="primary" label="主要按钮" />
<Button variant="outline" color="error" label="危险操作" />
```

## 带图标

通过 `#icon` 插槽或 `icon` prop 添加图标。`icon` prop 支持字符串（如 emoji）或 Vue 组件。

```vue
<!-- 使用插槽（最灵活） -->
<Button>
  <template #icon>🔍</template>
  搜索
</Button>

<!-- 使用字符串 prop -->
<Button icon="✓" label="确认" />

<!-- 使用组件 prop（如 @iconify/vue） -->
<Button :icon="IconHome" label="首页" />
```

## 加载状态

设置 `loading` 属性，按钮进入加载状态，显示旋转动画并禁用点击。

```vue
<Button loading label="提交中" />
```

## 禁用状态

设置 `disabled` 属性，按钮不可点击。

```vue
<Button disabled label="不可用" />
```

## 块级按钮

设置 `block` 属性，按钮宽度填满父容器。

```vue
<Button block label="全宽按钮" />
```

## 尺寸

通过 `size` 属性调整按钮大小。

```vue
<Button size="sm" label="小号" />
<Button size="md" label="中号" />
<Button size="lg" label="大号" />
```

## 颜色变体

通过 `color` 属性设置按钮的主题色。

```vue
<Button color="primary" label="主要" />
<Button color="success" label="成功" />
<Button color="warning" label="警告" />
<Button color="error" label="错误" />
```

## 视觉变体

通过 `variant` 属性切换按钮的视觉模式。

```vue
<Button variant="filled" label="填充按钮" />
<Button variant="outline" label="边框按钮" />
```

## 组合使用

各属性可自由组合。

```vue
<Button
  variant="outline"
  color="error"
  size="lg"
  block
  :loading="isDeleting"
  label="删除项目"
/>
```

## API

### Props

| 属性       | 类型                                             | 默认值      | 说明                      |
| ---------- | ------------------------------------------------ | ----------- | ------------------------- |
| `label`    | `string`                                         | `''`        | 按钮文字                  |
| `variant`  | `'filled' \| 'outline'`                          | `'filled'`  | 视觉变体                  |
| `color`    | `'primary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | 主题色                    |
| `size`     | ` 'sm' \| 'md' \| 'lg'`                   | `'md'`      | 按钮尺寸                  |
| `disabled` | `boolean`                                        | `false`     | 是否禁用                  |
| `loading`  | `boolean`                                        | `false`     | 是否加载中                |
| `block`    | `boolean`                                        | `false`     | 是否为块级（宽度 100%）   |
| `icon`     | `string \| Component`                            | —           | 图标（字符串或 Vue 组件） |

### Slots

| 名称      | 说明                                   |
| --------- | -------------------------------------- |
| `default` | 按钮文字（优先级低于 `label`）         |
| `icon`    | 左侧图标内容（优先级高于 `icon` prop） |

### Events

| 事件    | 参数                  | 说明                             |
| ------- | --------------------- | -------------------------------- |
| `click` | `(event: MouseEvent)` | 点击回调（禁用或加载时不会触发） |

## 注意事项

- `label` prop 与默认插槽同时存在时，**默认插槽优先**
- `icon` prop 与 `#icon` 插槽同时存在时，**插槽优先**
- `loading` 状态下，按钮自动禁用，图标和文字会被加载动画替代
- `icon` prop 支持传入 Vue 组件，如 `<Button :icon="IconHome" />`
