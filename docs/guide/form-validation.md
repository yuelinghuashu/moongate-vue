# 表单校验

Moongate Vue 的极简哲学同样适用于表单校验：**优先使用 HTML5 原生能力，只有原生做不到时才引入 JS 校验**。

## 一、优先使用原生校验（HTML5 Constraint Validation）

简单的必填、格式（邮箱/URL/数字）、长度限制等校验，HTML5 已原生支持：

```vue
<script setup>
import { ref } from 'vue'
import { Input } from 'moongate-vue'
import 'moongate-vue/style.css'
</script>

<template>
  <form @submit.prevent>
    <!-- 必填 + 邮箱格式：浏览器原生校验 -->
    <Input required type="email" label="邮箱" placeholder="name@example.com" />

    <!-- 必填 + 最小长度 -->
    <Input required minlength="6" label="密码" type="password" placeholder="至少 6 位" />

    <!-- 数字范围 -->
    <Input type="number" min="1" max="100" label="数量" />

    <!-- 正则模式 -->
    <Input required pattern="[0-9]{11}" label="手机号" placeholder="11 位数字" />

    <button type="submit">提交</button>
  </form>
</template>
```

配合 CSS 自定义错误样式：

```css
/* 未通过原生校验时 */
input:invalid {
  border-color: var(--ui-error);
}
```

> `Input`/`Textarea`/`Select` 组件会将原生属性（`required`/`min`/`max`/`pattern`/`minlength` 等）透传到实际表单元素，原生校验开箱即用。

## 二、useForm：HTML5 覆盖不到的校验

`useForm` 组合式函数**不重复实现**原生已有的格式校验器，只提供原生做不到的四个能力：

1. **状态集中管理** — `values` / `errors` / `valid` 一个对象管理 → 驱动 Vue 响应式错误展示
2. **异步校验** — 远程唯一性检查等（原生做不到）
3. **关联字段校验** — 确认密码、时间区间（原生做不到）
4. **校验编排** — 提交时校验全部字段、单字段校验、一键重置

> 💡 **与组件配合**：`useForm` 负责校验逻辑（状态/异步/关联/编排），视图层可配合 [`Form`](/components/form) / `FormItem` 组件自动完成 label 布局、必填星号、错误文案与「校验中…」状态展示，无需手写错误模板。

### 安装

`useForm` 已包含在主入口中，无需额外安装：

```ts
import { useForm } from 'moongate-vue'
```

### 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { Input, Button, useForm } from 'moongate-vue'
import 'moongate-vue/style.css'

const { values, errors, valid, validate, validateField, reset } = useForm({
  initialValues: {
    username: '',
    email: '',
    password: '',
    confirm: '',
  },
  rules: {
    // 简单格式校验：直接写一行正则即可
    username: (v) => (v.length >= 3 ? true : '用户名至少 3 个字符'),
    email: (v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? true : '邮箱格式不正确'),
    // 关联字段校验：第二个参数可访问其他字段值
    confirm: (v, values) => (v === values.password ? true : '两次密码不一致'),
  },
})

const handleSubmit = async () => {
  if (await validate()) {
    alert('表单提交成功！')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" style="max-width: 320px; display: grid; gap: 12px;">
    <div>
      <Input v-model="values.username" placeholder="用户名" :error="!!errors.username" />
      <span v-if="errors.username" style="color: var(--ui-error); font-size: 12px;">
        {{ errors.username }}
      </span>
    </div>
    <div>
      <Input v-model="values.email" placeholder="邮箱" :error="!!errors.email" />
      <span v-if="errors.email" style="color: var(--ui-error); font-size: 12px;">
        {{ errors.email }}
      </span>
    </div>
    <div>
      <Input v-model="values.password" type="password" placeholder="密码" />
    </div>
    <div>
      <Input
        v-model="values.confirm"
        type="password"
        placeholder="确认密码"
        :error="!!errors.confirm"
      />
      <span v-if="errors.confirm" style="color: var(--ui-error); font-size: 12px;">
        {{ errors.confirm }}
      </span>
    </div>
    <div style="display: flex; gap: 8px;">
      <Button type="submit" label="提交" />
      <Button variant="outline" label="重置" @click="reset()" />
    </div>
  </form>
</template>
```

### 异步校验（远程唯一性检查）

```vue
<script setup>
import { useForm } from 'moongate-vue'

// 模拟远程检查用户名是否已存在
const checkUsernameUnique = async (username) => {
  if (!username) return '请输入用户名'
  await new Promise((resolve) => setTimeout(resolve, 300))
  return username === 'admin' ? '该用户名已被占用' : true
}

const { values, errors, isValidating, validateField } = useForm({
  initialValues: { username: '' },
  rules: {
    username: checkUsernameUnique,
  },
})

// 失焦时触发单字段校验
const handleBlur = () => validateField('username')
</script>

<template>
  <div>
    <Input
      v-model="values.username"
      placeholder="输入用户名检测是否可用"
      :error="!!errors.username"
      @blur="handleBlur"
    />
    <span v-if="isValidating" style="font-size: 12px; color: var(--ui-text-dim);">检测中…</span>
    <span v-else-if="errors.username" style="color: var(--ui-error); font-size: 12px;">
      {{ errors.username }}
    </span>
  </div>
</template>
```

### 规则数组

当需要多条规则时，使用数组按顺序执行，遇到第一个失败即停止：

```ts
const { validateField } = useForm({
  initialValues: { name: '' },
  rules: {
    name: [
      (v) => (v ? true : '请输入姓名'), // 必填
      (v) => (v.length >= 2 ? true : '姓名至少 2 个字符'), // 长度
      (v) => (!/[0-9]/.test(v) ? true : '姓名不能包含数字'), // 格式
    ],
  },
})
```

## API

### Rule 类型

```ts
type Rule = (
  value: any,
  values: Record<string, any>,
) => boolean | string | Promise<boolean | string>
```

- 返回 `true` → 校验通过
- 返回 `string` → 校验失败，该字符串为错误信息
- 返回 `false` → 校验失败，使用 `ruleMessage`（默认 `'校验未通过'`）
- 返回 `Promise` → 异步规则，`useForm` 自动等待

### UseFormOptions

| 参数              | 类型                                       | 默认值         | 说明                                         |
| ----------------- | ------------------------------------------ | -------------- | -------------------------------------------- |
| `initialValues`   | `Record<string, any>`                      | 必填           | 表单初始值                                   |
| `rules`           | `Partial<Record<keyof T, Rule \| Rule[]>>` | `{}`           | 校验规则映射                                 |
| `ruleMessage`     | `string \| Ref<string> \| getter`          | `'校验未通过'` | 规则返回 `false` 时的默认错误文案            |
| `validateOnMount` | `boolean`                                  | `false`        | 挂载时自动校验（仅客户端生效，SSR 下不执行） |

### 返回值

| 属性/方法            | 类型                                         | 说明                                           |
| -------------------- | -------------------------------------------- | ---------------------------------------------- |
| `values`             | `Reactive<T>`                                | 表单值（可直接 v-model 绑定）                  |
| `errors`             | `Reactive<Partial<Record<keyof T, string>>>` | 字段错误信息映射                               |
| `valid`              | `ComputedRef<boolean>`                       | 表单是否通过校验（无错误且无进行中的异步校验） |
| `hasErrors`          | `ComputedRef<boolean>`                       | 是否有任何错误                                 |
| `isValidating`       | `ComputedRef<boolean>`                       | 是否有异步校验正在进行（用于 loading 状态）    |
| `validate()`         | `() => Promise<boolean>`                     | 校验所有规则字段，全部通过返回 `true`          |
| `validateField(key)` | `(key) => Promise<boolean>`                  | 校验单个字段                                   |
| `reset(newValues?)`  | `(values?) => void`                          | 恢复初始值（或传入新值）并清空错误             |
| `clearErrors()`      | `() => void`                                 | 清空所有错误                                   |
| `setValues(partial)` | `(values) => void`                           | 程序化设置表单值                               |
| `setErrors(partial)` | `(errors) => void`                           | 程序化设置错误信息（空字符串清除）             |

## 设计理念

为什么 `useForm` 不做内置规则（`required`/`email`/`url`/`min`/`max`/`pattern`）？

这些能力 **HTML5 Constraint Validation API 已原生覆盖**，通过 `required`/`type="email"`/`min`/`max`/`pattern` 属性 + CSS `:invalid` 伪类即可实现，零 JS 成本。组件库用 JS 重复实现属于过度工程。

`useForm` 只做 HTML5 的**补充**：状态管理、异步校验、关联校验、校验编排。这保持了 Moongate 的「零依赖、极致轻量」定位——**让浏览器做它擅长的事，让 JS 做浏览器做不到的事**。
