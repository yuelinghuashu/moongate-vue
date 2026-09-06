# 无障碍

Moongate Vue 以 **WCAG 2.1 AA** 为对齐目标。所有组件语义、键盘行为与动效偏好均通过自动化与人工审查保障，追求「轻量」不牺牲「可靠」。

## 质量保障

- **axe-core 全组件扫描**：29 个组件全部纳入自动化可访问性测试（打开态与关闭态分别检查），违规即失败（CI 阻断）
- **键盘行为测试**：方向键 / Home / End / Enter / Space / Esc 的交互均有单元测试覆盖
- **SSR + ID 安全**：所有 `aria-labelledby` / `aria-describedby` / `aria-controls` 关联 ID 均由 Vue 3.5 `useId()` 生成，SSR hydration 一致
- **自动化测试的已知豁免**（jsdom 环境限制，非组件缺陷）：
  - `color-contrast`：jsdom 无真实渲染引擎，颜色对比度需人工 / 浏览器审查
  - `region`：单测将组件直接挂载到 body，不在 landmark 内

## 键盘交互对照表

| 组件                                       | 可用键                         | 行为 / 依据模式                                                                |
| ------------------------------------------ | ------------------------------ | ------------------------------------------------------------------------------ |
| Button                                     | Enter / Space                  | 原生按钮行为                                                                   |
| Checkbox                                   | Space                          | 原生切换（多选数组模式同样适用）                                               |
| Radio                                      | Space                          | 原生选中（方向键在同组内移动）                                                 |
| Switch                                     | Space                          | 原生切换（`role="switch"`）                                                    |
| Input / Textarea                           | 原生                           | 浏览器输入控制                                                                 |
| Select（原生模式）                         | 原生                           | `<select>` 原生键盘                                                            |
| Select（可搜索）                           | ↑ / ↓                          | 在选项间移动高亮（WAI-ARIA listbox + `aria-activedescendant`）                 |
|                                            | Home / End                     | 跳到首 / 末选项                                                                |
|                                            | Enter                          | 选中当前高亮项（多选保持打开，单选关闭）                                       |
|                                            | Esc                            | 关闭下拉                                                                       |
| Tabs                                       | ← / →                          | 切换到相邻标签（跳过禁用），自动激活                                           |
|                                            | Home / End                     | 跳到首 / 末标签                                                                |
|                                            | Tab                            | roving tabindex：仅激活标签在 Tab 序中（0 / -1）                               |
| Modal / Drawer                             | Esc                            | 关闭（`enableEsc` 可关）                                                       |
|                                            | Tab / Shift+Tab                | 焦点陷阱循环（打开时焦点入内，关闭后返回触发元素，WCAG 2.4.3）                 |
| Dropdown                                   | ↓ / ↑                          | 打开菜单（关闭时）并移动高亮（`role="menu"`）                                  |
|                                            | Home / End                     | 跳到首 / 末菜单项（跳过 disabled / separator）                                 |
|                                            | Enter / Space                  | 选中高亮项                                                                     |
|                                            | Esc                            | 关闭菜单                                                                       |
|                                            | 字符键                         | TypeAhead：按首字符匹配跳转                                                    |
| Tooltip                                    | Tab（聚焦） / Shift+Tab        | 聚焦显示 / 失焦隐藏（非仅 hover）                                              |
|                                            | Esc                            | 隐藏                                                                           |
| Popover                                    | Tab（聚焦进入）                | 聚焦显示                                                                       |
|                                            | Esc                            | 隐藏                                                                           |
| Table                                      | Enter / Space（可排序表头）    | 切换排序（表头可聚焦，暴露 `aria-sort`）                                       |
|                                            | Tab / Space（行选择 checkbox） | 原生 checkbox 选择                                                             |
| Pagination                                 | Enter（页码输入框）            | 提交跳转（blur 同样提交）                                                      |
|                                            | Tab                            | 前后 / 首尾按钮为原生按钮                                                      |
| SeriesNav                                  | Enter / Space（折叠按钮）      | 展开 / 收起 "N more parts…"                                                    |
|                                            | Tab                            | 项链接为原生导航链接                                                           |
| Form / FormItem                            | Enter（输入框内）              | 原生表单提交                                                                   |
| FormItem                                   | —                              | 错误提示 `role="alert"`；校验中 `aria-live="polite"`；label `for` 关联自动生成 |
| Message                                    | —                              | `role="alert"` 立即播报                                                        |
| Toast                                      | —                              | `role="status"` 温和播报；`error` 类型用 `role="alert"`                        |
| Divider / Card / Badge / Skeleton / 布局类 | —                              | 静态 / 装饰组件；Skeleton 建议搭配 `aria-hidden="true"`                        |

## 动效偏好：prefers-reduced-motion

系统开启「减弱动态效果」时（`@media (prefers-reduced-motion: reduce)`）：

| 类型           | 处理                                                                               |
| -------------- | ---------------------------------------------------------------------------------- |
| 关键帧动画     | Message / Toast 进入退出、Skeleton 扫光、Button 加载旋转 → **禁用**                |
| 浮层显隐位移   | Modal / Drawer 滑入缩放、Dropdown / Popover / Tooltip / Select 下拉过渡 → **归零** |
| hover 颜色过渡 | 保留（颜色过渡不诱发眩晕，避免过度禁用）                                           |

## RTL 支持

组件库以 `[dir="rtl"]` 属性驱动 RTL。**Flexbox 布局组件自动镜像**（主轴随 `direction` 反转），物理定位需显式处理：

| 组件                                           | 状态                                                                        |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| Message / Toast                                | 容器位置与彩色边框已镜像                                                    |
| Select（原生）                                 | 箭头位置与背景已镜像（`scaleX(-1)`）                                        |
| Select（可搜索）                               | 下拉箭头与输入内边距已镜像                                                  |
| Pagination / Tabs / Modal header / Form inline | Flex 布局自动镜像，无需额外处理                                             |
| Drawer `placement`                             | **不随 RTL 翻转**（`left`/`right`/`top`/`bottom` 为用户显式控制的物理语义） |
| Tooltip / Popover 箭头                         | 装饰性定位，不镜像                                                          |

## 用法建议与已知边界

### Dropdown 触发语义

Dropdown 的触发容器不声明交互角色——触发语义由**插槽内的实际元素**（通常是 `Button`）承担。这避免「角色容器嵌套真实按钮」导致的双重朗读与 axe `nested-interactive` 违规（与 Element Plus / Ant Design 一致）。

若需要向读屏用户完整播报菜单展开状态，可在触发按钮上手动补充：

```vue
<Dropdown :options="options">
  <Button
    aria-haspopup="menu"
    :aria-expanded="isOpen"
    @click="isOpen = !isOpen"
  >操作菜单</Button>
</Dropdown>
```

（与 `v-model:open` 受控模式配合使用。）

### Skeleton

骨架屏是装饰性占位，建议始终添加 `aria-hidden="true"`，避免读屏朗读空内容。真实内容加载完成后应移除骨架屏并由内容自然呈现。

### 焦点可见性

所有可交互组件均提供 `:focus-visible` 焦点样式——仅键盘导航时显示焦点环，鼠标点击不显示，兼顾美观与可达性。
