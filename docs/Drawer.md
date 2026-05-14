# Drawer 抽屉

抽屉组件，用于从屏幕边缘滑出的面板。

## 基础用法

```vue
<Button @click="open = true" label="打开抽屉" />
<Drawer v-model="open" title="标题">
  <p>抽屉内容</p>
</Drawer>
```

## 方向

```vue
<Drawer v-model="open" placement="left" title="左侧抽屉" />
<Drawer v-model="open" placement="right" title="右侧抽屉" />
<Drawer v-model="open" placement="top" title="顶部抽屉" />
<Drawer v-model="open" placement="bottom" title="底部抽屉" />
```

## 尺寸

```vue
<Drawer v-model="open" size="sm" title="小号" />
<Drawer v-model="open" size="md" title="中号" />
<Drawer v-model="open" size="lg" title="大号" />
<Drawer v-model="open" size="xl" title="超大" />
<Drawer v-model="open" size="full" title="全屏" />
```

## 自定义头部/底部

```vue
<Drawer v-model="open">
  <template #header>自定义标题区域</template>
  <p>内容</p>
  <template #footer>
    <Button @click="open = false" label="关闭" />
  </template>
</Drawer>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `boolean` | `false` | 是否显示（v-model） |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | 抽屉方向 |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | 尺寸 |
| `title` | `string` | `''` | 标题文本 |
| `closable` | `boolean` | `true` | 是否显示关闭按钮 |
| `closeOnOverlay` | `boolean` | `true` | 点击遮罩层是否关闭 |

### Slots

| 名称 | 说明 |
|------|------|
| `header` | 自定义头部内容（优先级高于 `title`） |
| `default` | 抽屉主体内容 |
| `footer` | 底部区域 |

### Events

| 事件                  | 参数                 | 说明        |
| ------------------- | ------------------ | --------- |
| `update:modelValue` | `(value: boolean)` | 显示状态变化时触发 |
| `open`              | —                  | 抽屉打开时触发   |
| `close`             | —                  | 抽屉关闭时触发   |

## 注意事项
- 使用 closeOnOverlay && handleClose() 时，必须加上括号，否则 closeOnOverlay 为 true 时仅返回函数而未执行，导致点击遮罩层无法关闭。

- 当 size="full" 且 placement="left"/"right" 时，抽屉会占满全屏，遮罩层将不可见，建议避免此组合或根据实际需求调整。

- 抽屉打开时会自动锁定 body 滚动，关闭时恢复。
