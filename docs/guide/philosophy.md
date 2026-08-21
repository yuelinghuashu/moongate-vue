# 设计哲学

Moongate Vue 的每一个技术决策都不是"能做就做"，而是"该做才做"。这篇文档解释为什么。

## 零依赖

> 每个运行时依赖都是供应链风险、体积成本、和版本冲突的来源。

Moongate Vue 的 `dependencies` 为空。没有 Popper、没有 Lodash、没有 date-fns。

```json
{
  "peerDependencies": {
    "vue": "^3.5.0"
  },
  "dependencies": {}
}
```

对比 Maz-UI：11 个运行时依赖（chart.js、dayjs、valibot、libphonenumber-js 等），仅 `libphonenumber-js` 一个就 150KB+。

**不这样做会怎样：** 用户安装一个按钮组件，被迫引入一整条依赖链。每个依赖都可能有安全漏洞、版本冲突、或意外的行为变更。组件库应该对自己的行为负全责，而不是把责任转嫁给第三方。

## CSS 优先

> 样式与逻辑解耦，意味着样式可以独立于 Vue 使用。

所有组件样式基于 CSS 变量（设计令牌），不依赖 CSS-in-JS 运行时：

```css
/* src/styles/tokens/colors.css */
:root {
  --ui-primary: #1e40af;
  --ui-bg-elevated: #ffffff;
  --ui-border: #cbd5e1;
}

/* 组件只引用变量 */
.mg-card {
  background-color: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
}
```

好处：

- **主题切换**：覆盖 CSS 变量即可，不需要 JS 运行时介入
- **跨框架复用**：CSS 文件可以在 React、Svelte 中直接引入
- **无运行时开销**：样式在构建时确定，不随状态变化而重新计算

**不这样做会怎样：** CSS-in-JS 方案（如 styled-components、emotion）需要 JS 运行时解析样式，增加包体积和首屏渲染开销。对于组件库来说，这是把用户的性能预算花在了样式引擎上。

## 极简 API

> 每多一个 prop，就多一个决策负担给用户。

Moongate 的每个组件控制在 2-8 个 props：

| 组件   | Props 数 | 关键 Props                                                   |
| ------ | -------- | ------------------------------------------------------------ |
| Button | 7        | `label` `variant` `color` `size` `type` `disabled` `loading` |
| Input  | 5        | `type` `placeholder` `disabled` `readonly` `size`            |
| Modal  | 5        | `title` `size` `closable` `escClosable` `overlayClosable`    |

这不是功能缺失，是刻意取舍。每个 prop 都要问：**用户真的需要控制这个吗？还是有合理的默认值？**

例如 Button 的 `type` 默认 `'button'` 而不是 `'submit'` — 因为放在 `<form>` 外的按钮触发提交是最常见的意外 bug。

**不这样做会怎样：** 某些库的 Button 有 20+ props（shape、ghost、block、loading、icon、href、target、htmlType...），新用户打开文档就被淹没。极简 API 的目标是：**看一眼 props 就知道怎么用，不需要读文档。**

## 优先原生能力

> HTML5 已经解决了 80% 的表单校验问题，组件库不应该重新发明轮子。

`useForm` 不重复实现内置校验器（required、email、min、max、pattern）。它只做原生做不到的四件事：

1. **状态集中管理** — 一个 `values` / `errors` 对象管理所有字段
2. **异步校验** — 远程唯一性检查（原生做不到）
3. **关联字段校验** — 确认密码、时间区间（原生做不到）
4. **校验编排** — 提交时校验全部、单字段校验、一键重置

```vue
<!-- 原生校验：够用就不需要 useForm -->
<Input required type="email" label="邮箱" />

<!-- 需要异步/关联校验时才引入 useForm -->
<script setup>
const { values, errors, validate } = useForm({
  initialValues: { password: '', confirm: '' },
  rules: {
    confirm: (v, all) => (v === all.password ? true : '两次密码不一致'),
  },
})
</script>
```

**不这样做会怎样：** Element Plus 的 Form 组件有完整的内置校验器（required、email、url、type、pattern、min、max、len、enum、whitespace、transform、asyncValidator...），这些本质上是用 JS 重新实现了浏览器原生的 Constraint Validation API。用户学了一套组件库专属的校验 DSL，离开这个库就用不上了。

## 非侵入式

> 组件库不应该改变用户页面的默认行为。

```css
/* ❌ 侵入式：改变全局盒模型 */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ✅ Moongate：组件样式只作用于 .mg-* 类 */
.mg-button { ... }
.mg-card { ... }
```

默认引入的 `style.css` 只包含组件样式，不重置全局。如果需要统一盒模型，可选引入 `reset.css`。

属性透传也遵循这个原则 — 所有原生属性通过 `v-bind="$attrs"` 直通到根元素，不覆盖已声明的 props：

```vue
<!-- 这些属性会透传到 <button> 元素 -->
<Button data-testid="submit" aria-label="提交表单" class="custom-class" />
```

**不这样做会怎样：** Tailwind CSS 的 Preflight 会重置所有元素的默认样式（`h1` 到 `h6` 全部变成 `font-size: inherit`），在引入组件库的页面中可能导致意外的样式覆盖。非侵入式设计让用户完全控制自己的全局样式。

## SSR 安全

> 服务端没有 `document`、`window`、`MutationObserver`。组件库必须对此做好防护。

所有 DOM 访问都有守卫：

```ts
// config.ts — MutationObserver 只在客户端创建
if (typeof document !== 'undefined') {
  langObserver = new MutationObserver(() => { ... })
  langObserver.observe(document.documentElement, { ... })
}

// useForm.ts — onMounted 只在客户端执行
if (validateOnMount) {
  onMounted(() => { validate() })
}
```

唯一 ID 使用 Vue 3.5 的 `useId()`（SSR 安全，hydration 时服务端与客户端一致）：

```ts
// Modal.vue
const titleId = useId() // 服务端和客户端生成相同的 ID
```

**不这样做会怎样：** 在 Nuxt 或 VitePress 中使用时，服务端渲染阶段访问 `document` 会直接崩溃。28 个组件全部通过了 `renderToString` 的 SSR 兼容性测试。
