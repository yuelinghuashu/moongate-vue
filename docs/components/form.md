# Form 表单

表单容器组件，配合 `FormItem` 与 `useForm` 使用，快速搭建带校验的表单布局。

## 基础用法

`Form` 接收 `useForm` 解构出的 `errors`（必填星号、错误提示、label 布局全部自动处理）：

:::demo

```vue
<script setup>
import { ref } from 'vue'
import { Form, FormItem, Input, Button, useForm } from 'moongate-vue'

const { values, errors, validatingFields, validate, validateField, reset } = useForm({
  initialValues: { username: '', email: '' },
  rules: {
    username: (v) => (v.length >= 3 ? true : '用户名至少 3 个字符'),
    email: (v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? true : '邮箱格式不正确'),
  },
})

const handleSubmit = async () => {
  if (await validate()) {
    alert('表单提交成功！')
  }
}
</script>

<template>
  <Form
    :errors="errors"
    :validating-fields="validatingFields"
    label-width="80px"
    style="max-width: 320px"
    @submit.prevent="handleSubmit"
  >
    <FormItem name="username" label="用户名" required>
      <Input
        v-model="values.username"
        placeholder="至少 3 个字符"
        @blur="validateField('username')"
      />
    </FormItem>
    <FormItem name="email" label="邮箱">
      <Input v-model="values.email" placeholder="name@example.com" @blur="validateField('email')" />
    </FormItem>
    <div style="display: flex; gap: 8px; justify-content: flex-end;">
      <Button type="submit" label="提交" />
      <Button variant="outline" label="重置" @click="reset()" />
    </div>
  </Form>
</template>
```

:::

## 布局方向

通过 `layout` 属性切换布局：`horizontal`（默认，label 在左）、`vertical`（label 在上）、`inline`（行内）。

:::demo

```vue
<script setup>
import { Form, FormItem, Input } from 'moongate-vue'

const errors = {}
</script>

<template>
  <Form :errors="errors" layout="vertical" style="max-width: 320px; display: grid; gap: 12px;">
    <FormItem name="name" label="姓名">
      <Input placeholder="姓名" />
    </FormItem>
    <FormItem name="city" label="城市">
      <Input placeholder="城市" />
    </FormItem>
  </Form>
</template>
```

:::

## 必填星号

`FormItem` 设置 `required` 属性后，label 前显示红色星号（纯视觉提示，不做自动校验）：

:::demo

```vue
<script setup>
import { Form, FormItem, Input } from 'moongate-vue'

const errors = {}
</script>

<template>
  <Form :errors="errors" style="max-width: 320px;">
    <FormItem name="name" label="姓名" required>
      <Input placeholder="姓名" />
    </FormItem>
    <FormItem name="remark" label="备注">
      <Input placeholder="选填" />
    </FormItem>
  </Form>
</template>
```

:::

## 与 useForm 集成

`Form` 组件**不内置校验逻辑**，全部委托给 `useForm`：

- **`:errors`** — 传入 `useForm` 解构出的 `errors`，`FormItem` 自动显示对应字段错误
- **`:validating-fields`** — 传入 `useForm` 解构出的 `validatingFields`，异步校验时对应 `FormItem` 显示「校验中…」
- **`validate` / `validateField` / `reset`** — 在按钮/输入事件中调用 `useForm` 方法驱动校验

```vue
<script setup>
import { Form, FormItem, Input, useForm } from 'moongate-vue'

const { values, errors, validatingFields, validateField } = useForm({
  initialValues: { username: '' },
  rules: {
    username: async (v) => {
      // 异步校验（远程唯一性）
      await new Promise((r) => setTimeout(r, 300))
      return v === 'admin' ? '该用户名已被占用' : true
    },
  },
})
</script>

<template>
  <Form :errors="errors" :validating-fields="validatingFields" style="max-width: 320px;">
    <FormItem name="username" label="用户名" required>
      <Input
        v-model="values.username"
        placeholder="输入用户名检测是否可用"
        @blur="validateField('username')"
      />
    </FormItem>
  </Form>
</template>
```

## 自定义错误文案

`FormItem` 的 `error` prop 可覆盖注入的错误文案（优先级高于 `errors[name]`）：

```vue
<Form :errors="errors">
  <FormItem name="username" label="用户名" :error="customError">
    <Input v-model="values.username" />
  </FormItem>
</Form>
```

## API

### Form Props

| 属性               | 类型                                     | 默认值         | 说明                               |
| ------------------ | ---------------------------------------- | -------------- | ---------------------------------- |
| `errors`           | `Partial<Record<keyof T, string>>`       | `undefined`    | `useForm` 解构出的字段错误映射     |
| `layout`           | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` | 布局方向                           |
| `labelWidth`       | `string`                                 | `'80px'`       | label 宽度（仅 `horizontal` 生效） |
| `validatingFields` | `Record<string, boolean>`                | `undefined`    | `useForm` 解构出的单字段校验中状态 |

### FormItem Props

| 属性             | 类型      | 默认值      | 说明                                                    |
| ---------------- | --------- | ----------- | ------------------------------------------------------- |
| `name`           | `string`  | 必填        | 字段名（对应 `errors[key]` 与 `validatingFields[key]`） |
| `label`          | `string`  | `undefined` | 标签文本                                                |
| `required`       | `boolean` | `false`     | 是否显示必填星号（纯视觉提示）                          |
| `for`            | `string`  | `undefined` | 关联输入框的 `id`，点击 label 聚焦对应 input            |
| `error`          | `string`  | `undefined` | 自定义错误文案（覆盖注入的 `errors[name]`）             |
| `validatingText` | `string`  | `undefined` | 校验中文案（默认跟随全局配置）                          |

### Slots

| 名称      | 说明                                            |
| --------- | ----------------------------------------------- |
| `default` | 表单控件内容（FormItem 内放置 Input/Select 等） |

> 💡 **设计说明**：Form/FormItem 是**视图层**组件，不含校验逻辑——状态管理、异步校验、关联校验、编排全部由 [`useForm`](/guide/form-validation) 提供。两者组合使用即可获得完整的表单校验能力。
