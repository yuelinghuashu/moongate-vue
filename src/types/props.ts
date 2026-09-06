/**
 * 组件 Props 类型定义
 *
 * 集中管理所有组件的 Props 类型。使用独立的 .ts 文件而非 .vue 内导出，
 * 原因：
 * 1. vue-tsc 不支持 <script setup> 中导出带泛型默认参数的接口
 * 2. 消费者项目的 shims-vue.d.ts 会覆盖 *.vue 模块声明，导致从 .vue 导出的
 *    具名类型无法被解析（只保留 default 导出）
 *
 * 因此所有 Props 类型统一放在 .ts 文件中（与 Element Plus / Naive UI 同模式）。
 */

import type { Component } from 'vue'
import type {
  Size,
  SizeXl,
  SizeContainer,
  AddonColor,
  InputType,
  NotificationType,
  DropdownPlacement,
  DropdownOption,
  SeriesNavItem,
} from './components'

// ==================== 内部依赖类型 ====================

/** Button 变体 */
export type ButtonVariant = 'filled' | 'outline'
/** Button 原生类型 */
export type ButtonType = 'button' | 'submit' | 'reset'
/** Badge 尺寸 */
export type BadgeSize = Exclude<Size, 'lg'>
/** Tabs 视觉变体 */
export type TabsVariant = 'line' | 'card'
/** Skeleton 类型 */
export type SkeletonType = 'default' | 'card' | 'list'
/** Skeleton 头像形状 */
export type AvatarType = 'circle' | 'square'

// ==================== 基础组件 ====================

export interface ButtonProps {
  /** 按钮文字 */
  label?: string
  /** 按钮样式 */
  variant?: ButtonVariant
  /** 按钮颜色 */
  color?: AddonColor
  /** 按钮大小 */
  size?: Size
  /** 原生按钮类型，默认 button 防止表单意外提交 */
  type?: ButtonType
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 加载时是否保留文字 */
  showLabelWhileLoading?: boolean
  /** 加载时的文字（可选，默认使用 label） */
  loadingLabel?: string
  /** 是否为块级按钮 */
  block?: boolean
  /** 按钮图标 */
  icon?: string | Component
}

export interface CardProps {
  /** 根元素标签 */
  as?: 'div' | 'section' | 'article' | 'aside' | 'li'
  /** 是否启用悬停上浮 + 月晕效果 */
  hoverable?: boolean
  /** 是否隐藏主体区域（默认插槽） */
  hideBody?: boolean
  /** 是否隐藏底部区域（footer 插槽） */
  hideFooter?: boolean
}

export interface BadgeProps {
  /** 徽章文字 */
  label?: string
  /** 徽章颜色 */
  color?: AddonColor
  /** 徽章尺寸 */
  size?: BadgeSize
}

export interface DividerProps {
  /** 是否为垂直分割线 */
  vertical?: boolean
  /** 是否为虚线 */
  dashed?: boolean
}

// ==================== 表单组件 ====================

export interface InputProps {
  /** 输入框类型 */
  type?: InputType
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 尺寸大小 */
  size?: Size
  /** 是否显示错误状态 */
  error?: boolean
}

export interface TextareaProps {
  /** 占位文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 尺寸大小 */
  size?: Size
  /** 显示行数（默认 3 行） */
  rows?: number
  /** 错误状态（仅控制边框样式） */
  error?: boolean
}

export interface CheckboxProps {
  /** 复选框标签文字 */
  label?: string
  /** 复选框的值（用于数组多选模式） */
  value?: string | number
  /** 尺寸大小 */
  size?: Size
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示错误状态 */
  error?: boolean
}

export interface RadioProps {
  /** 单选框标签文字 */
  label?: string
  /** 单选框的值 */
  value?: string | number
  /** 尺寸大小 */
  size?: Size
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示错误状态 */
  error?: boolean
}

export interface SwitchProps {
  /** 开关标签文字 */
  label?: string
  /** 尺寸大小 */
  size?: Size
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示错误状态 */
  error?: boolean
}

/** Select 选项值类型 */
export type SelectValue = string | number
/** Select 选项类型：基本类型值或对象 */
export type SelectOption = string | number | Record<string, any>

export interface SelectProps {
  /** 选项列表，支持对象数组、字符串数组、数字数组 */
  options?: SelectOption[]
  /** 占位文本 */
  placeholder?: string
  /** 尺寸 */
  size?: Size
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示错误状态（仅边框样式） */
  error?: boolean
  /** 自定义显示文本字段名（对象数组时使用） */
  labelKey?: string
  /** 自定义选项值字段名（对象数组时使用） */
  valueKey?: string
  /** 是否可搜索 */
  filterable?: boolean
  /** 搜索无结果时的空状态文案 */
  emptyText?: string
  /** 下拉面板最大高度（单位：px） */
  maxHeight?: number
  /** 是否多选（仅 filterable 可搜索模式支持） */
  multiple?: boolean
}

export interface FormItemProps {
  /** 字段名（对应 useForm 的 errors[key]，必传） */
  name: string
  /** 标签文本 */
  label?: string
  /** 是否显示必填星号 */
  required?: boolean
  /** 关联输入框的 id（点击 label 聚焦对应 input）；不传时自动生成并注入给插槽内表单组件 */
  for?: string
  /** 自定义错误文案覆盖（不传则用注入的 errors[name]） */
  error?: string
  /** 校验中文案（默认跟随全局配置） */
  validatingText?: string
}

// ==================== 数据展示组件 ====================

export interface PaginationProps {
  /** 总页数 */
  totalPages: number
  /** 尺寸大小 */
  size?: Size
  /** 上一页按钮文字（默认跟随全局配置） */
  prevText?: string
  /** 下一页按钮文字（默认跟随全局配置） */
  nextText?: string
  /** 是否显示快速跳转按钮（首尾页） */
  showQuickJump?: boolean
  /** 第一页按钮文字（默认跟随全局配置） */
  firstText?: string
  /** 最后一页按钮文字（默认跟随全局配置） */
  lastText?: string
}

/** Tabs 标签项 */
export interface TabItem {
  /** 标签文字 */
  label: string
  /** 标签图标 */
  icon?: string
  /** 标签内容 */
  content?: string
  /** 是否禁用 */
  disabled?: boolean
}

export interface TabsProps {
  /** 标签列表 */
  tabs?: TabItem[]
  /** 尺寸大小 */
  size?: Size
  /** 视觉变体 */
  variant?: TabsVariant
  /** 是否懒加载（只有激活的面板才会渲染内容） */
  lazy?: boolean
}

export interface SkeletonProps {
  /** 骨架屏类型 */
  type?: SkeletonType
  /** 行数 */
  rows?: number
  /** 是否显示头像 */
  avatar?: boolean
  /** 头像形状 */
  avatarShape?: AvatarType
  /** 头像尺寸 */
  avatarSize?: Size
  /** 第一行是否为标题 */
  title?: boolean
  /** 行宽度（仅 default 模式） */
  rowSize?: Size
}

// ==================== 反馈组件 ====================

export interface ModalProps {
  /** 模态框标题 */
  title?: string
  /** 模态框尺寸 */
  size?: SizeXl
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnOverlay?: boolean
  /** 关闭按钮的 aria-label */
  closeAriaLabel?: string
  /** 是否启用 ESC 键关闭，默认 true */
  enableEsc?: boolean
  /** 是否启用焦点陷阱，默认 true */
  enableFocusTrap?: boolean
}

export interface ToastProps {
  /** 消息内容 */
  message?: string
  /** 消息类型 */
  type?: NotificationType
  /** 持续时间（毫秒），0 表示不自动关闭 */
  duration?: number
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 显示位置（由 useToast 用于容器定位） */
  position?: 'top' | 'bottom'
  /** 自定义图标 */
  icon?: string
  /** 关闭按钮的 aria-label */
  closeAriaLabel?: string
}

export interface MessageProps {
  /** 消息内容 */
  message?: string
  /** 消息类型 */
  type?: NotificationType
  /** 持续时间（毫秒），0 表示不自动关闭 */
  duration?: number
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 自定义图标 */
  icon?: string
  /** 关闭按钮的 aria-label */
  closeAriaLabel?: string
}

export interface TooltipProps {
  /** 提示内容 */
  content?: string
  /** 提示框位置，默认 top */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** 显示延迟时间（毫秒），避免鼠标划过时误弹，默认 0 */
  showDelay?: number
  /** 隐藏延迟时间（毫秒），默认 100 */
  hideDelay?: number
  /** 提示框与触发元素的偏移量（像素），默认 8 */
  offset?: number
}

export interface PopoverProps {
  /** 弹出层位置，默认 bottom */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** 显示延迟时间（毫秒），避免鼠标划过时误弹，默认 0 */
  showDelay?: number
  /** 隐藏延迟时间（毫秒），方便移入内容区，默认 100 */
  hideDelay?: number
  /** 弹出层与触发元素的偏移量（像素），默认 8 */
  offset?: number
  /** 弹出层的无障碍标签（role="dialog" 的 aria-label） */
  ariaLabel?: string
}

export interface DrawerProps {
  /** 抽屉弹出方向 */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** 抽屉尺寸（宽度/高度） */
  size?: SizeXl | 'full'
  /** 标题文本 */
  title?: string
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnOverlay?: boolean
  /** 关闭按钮的 aria-label */
  closeAriaLabel?: string
  /** 是否启用 ESC 键关闭，默认 true */
  enableEsc?: boolean
  /** 是否启用焦点陷阱，默认 true */
  enableFocusTrap?: boolean
}

export interface DropdownProps {
  /** 菜单项列表 */
  options?: DropdownOption[]
  /** 弹出位置 */
  placement?: DropdownPlacement
  /** 菜单尺寸 */
  size?: Size
  /** 是否禁用 */
  disabled?: boolean
  /** 弹出层无障碍标签 */
  ariaLabel?: string
}

// ==================== 布局组件 ====================

export interface ContainerProps {
  /** 容器尺寸 */
  size?: SizeContainer
}

export interface HeaderProps {
  /** 是否固定吸顶 */
  sticky?: boolean
}

export interface HeroProps {
  /** 标题文字 */
  title?: string
  /** 描述文字 */
  description?: string
}

// ==================== 数据展示组件 ====================

export interface SeriesNavProps {
  /** 有序导航项列表（顺序即展示顺序，不排序） */
  items?: SeriesNavItem[]
  /** 当前激活项的 key（高亮显示） */
  active?: string
  /** 可选标题（系列名，可通过 #title 插槽覆盖） */
  title?: string
  /** 是否显示序号圆点，默认 true */
  numbered?: boolean
  /**
   * 折叠阈值：当 items 超过该数量时，将中间项折叠为 "N more parts..."，
   * 固定展示首项、末项、激活项及其相邻项。0 表示不折叠。默认 0。
   */
  visibleCount?: number
}
