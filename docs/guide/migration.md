# 从 Element Plus 迁移

本文档帮助你从 Element Plus 迁移到 Moongate Vue。两者的 API 设计理念不同，但核心用法相似。

## 设计理念差异

| 维度       | Element Plus                            | Moongate Vue                                    |
| ---------- | --------------------------------------- | ----------------------------------------------- |
| 依赖       | 有运行时依赖（@popperjs 等）            | 零依赖                                          |
| 样式       | CSS-in-JS + SCSS                        | CSS 变量（设计令牌）                            |
| Props 数量 | 每个组件 10-30+                         | 大多数组件 2-8（复杂组件如 Button/Select 略多） |
| 表单校验   | 内置校验器（required/email/min/max...） | 优先原生 HTML5，`useForm` 只做原生做不到的      |
| 主题       | 通过 SCSS 变量或 ConfigProvider         | 通过 CSS 变量覆盖                               |
| 图标       | 内置图标组件                            | 不提供，使用插槽或第三方图标库                  |

## 安装

```bash
# Element Plus
npm install element-plus

# Moongate Vue
npm install moongate-vue
```

## 样式引入

```ts
// Element Plus
import 'element-plus/dist/index.css'

// Moongate Vue
import 'moongate-vue/style.css'
```

## 组件映射

### Button

```vue
<!-- Element Plus -->
<el-button type="primary" size="small" :loading="isLoading">
  提交
</el-button>

<!-- Moongate Vue -->
<Button color="primary" size="sm" :loading="isLoading" label="提交" />
```

| Element Plus     | Moongate Vue                     | 说明                                          |
| ---------------- | -------------------------------- | --------------------------------------------- |
| `type="primary"` | `color="primary"`                | 属性名不同                                    |
| `size="small"`   | `size="sm"`                      | 枚举值不同：`small/medium/large` → `sm/md/lg` |
| `:icon="Search"` | `:icon="Search"` 或 `#icon` 插槽 | 一致，但 Moongate 还支持字符串图标            |
| 默认插槽         | `label` prop 或默认插槽          | Moongate 两种方式都支持                       |

### Input

```vue
<!-- Element Plus -->
<el-input v-model="form.name" placeholder="请输入" clearable />

<!-- Moongate Vue -->
<Input v-model="form.name" placeholder="请输入" />
```

| Element Plus  | Moongate Vue   | 说明                                      |
| ------------- | -------------- | ----------------------------------------- |
| `clearable`   | —              | Moongate 不提供内置清除按钮，使用原生方式 |
| `prefix-icon` | `#prefix` 插槽 | Moongate 使用插槽                         |
| `suffix-icon` | `#suffix` 插槽 | 同上                                      |

### Select

```vue
<!-- Element Plus -->
<el-select v-model="value" placeholder="请选择">
  <el-option label="选项一" value="1" />
  <el-option label="选项二" value="2" />
</el-select>

<!-- Moongate Vue -->
<Select v-model="value" :options="options" placeholder="请选择" />
```

| Element Plus         | Moongate Vue        | 说明                              |
| -------------------- | ------------------- | --------------------------------- |
| 子组件 `<el-option>` | `options` prop 数组 | Moongate 用数据驱动，不需要子组件 |
| `filterable`         | `filterable`        | 一致                              |
| `multiple`           | `multiple`          | 一致                              |

### Table

```vue
<!-- Element Plus -->
<el-table :data="users">
  <el-table-column prop="name" label="姓名" />
  <el-table-column prop="email" label="邮箱" />
</el-table>

<!-- Moongate Vue -->
<Table :columns="columns" :data="users" />
```

| Element Plus               | Moongate Vue                   | 说明                |
| -------------------------- | ------------------------------ | ------------------- |
| 子组件 `<el-table-column>` | `columns` prop 数组            | Moongate 用配置驱动 |
| `sortable`                 | `sortable`（在 column 配置中） | 一致                |
| `stripe`                   | `striped`                      | 属性名略有不同      |
| 自定义列模板               | `#column-key` 或 `#cell` 插槽  | Moongate 用命名插槽 |

### Modal / Dialog

```vue
<!-- Element Plus -->
<el-dialog v-model="visible" title="标题">
  内容
</el-dialog>

<!-- Moongate Vue -->
<Modal v-model="visible" title="标题">
  内容
</Modal>
```

| Element Plus           | Moongate Vue       | 说明                                 |
| ---------------------- | ------------------ | ------------------------------------ |
| `width`                | `size="sm/md/lg"`  | Moongate 用预设尺寸而非具体宽度      |
| `close-on-click-modal` | `overlay-closable` | 属性名不同                           |
| `destroy-on-close`     | —                  | Moongate 默认使用 `v-if`，关闭即销毁 |

### Message / Notification

```vue
<!-- Element Plus（全局调用） -->
<script>
import { ElMessage } from 'element-plus'
ElMessage.success('操作成功')
</script>

<!-- Moongate Vue（组合式调用） -->
<script setup>
import { useMessage } from 'moongate-vue'
const message = useMessage()
message.success('操作成功')
</script>
```

| Element Plus          | Moongate Vue             | 说明                         |
| --------------------- | ------------------------ | ---------------------------- |
| `ElMessage.success()` | `useMessage().success()` | Moongate 需要在 setup 中调用 |
| `ElNotification`      | `useToast()`             | 对应关系                     |

### Form 校验

```vue
<!-- Element Plus -->
<el-form :model="form" :rules="rules">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="form.username" />
  </el-form-item>
</el-form>

<!-- Moongate Vue -->
<Form :errors="errors" :validating-fields="validatingFields">
  <FormItem name="username" label="用户名" required>
    <Input v-model="values.username" @blur="validateField('username')" />
  </FormItem>
</Form>
```

| Element Plus       | Moongate Vue                | 说明                         |
| ------------------ | --------------------------- | ---------------------------- |
| `rules` 内置校验器 | `useForm` 的 `rules` 纯函数 | Moongate 推荐原生 HTML5 校验 |
| `prop` 绑定字段    | `name` 绑定字段             | 属性名不同                   |
| 自动校验时机       | 手动调用 `validateField`    | Moongate 更显式              |

## 主题定制

```css
/* Element Plus（SCSS 变量） */
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: ('primary': ('base': #409eff))
);

/* Moongate Vue（CSS 变量） */
:root {
  --ui-primary: #3b82f6;
}
```

## 常见问题

### 为什么没有 `clearable`？

Moongate 遵循"原生优先"理念。`clearable` 可以通过在输入框旁放置一个按钮实现，不需要组件内置。

### 为什么没有内置图标？

图标库的选择因项目而异（Lucide、Heroicons、自定义 SVG）。Moongate 通过插槽让你自由选择，而不是绑定特定图标库。

### 为什么 Message 需要在 setup 中调用？

Element Plus 的 `ElMessage` 是全局单例，依赖全局注册。Moongate 的 `useMessage()` 是组合式函数，不依赖全局状态——两种设计各有适用场景，组合式函数在组件内调用时无需全局注册。
