/**
 * 组件库共享类型定义
 *
 * 集中管理多个组件中重复出现的类型联合，避免在各组件文件中重复定义。
 * 所有组件应从本文件导入共享类型，而不是各自声明。
 */

/** 通用组件尺寸（Button/Input/Checkbox/Radio/Switch/Select/Textarea 等） */
export type Size = 'sm' | 'md' | 'lg'

/** 大尺寸（含 xl）— Modal */
export type SizeXl = Size | 'xl'

/** 超大尺寸（含 full）— Drawer */
export type SizeFull = SizeXl | 'full'

/** 容器全尺寸 — Container */
export type SizeContainer = SizeFull | '2xl' | '3xl'

/** 弹出层位置 — Popover/Tooltip/Drawer */
export type Placement = 'top' | 'bottom' | 'left' | 'right'

/** 下拉菜单位置 — Dropdown（含 start/end 对齐） */
export type DropdownPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

/** 通知类型 — Message/Toast */
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

/** 附加颜色变体 — Button/Badge */
export type AddonColor = 'primary' | 'success' | 'warning' | 'error'

/** 输入框原生类型 — Input */
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'

/** 下拉菜单选项 — Dropdown */
export interface DropdownOption {
  /** 唯一标识（选中时传出） */
  key: string
  /** 显示文本 */
  label: string
  /** 图标（emoji 或字符串） */
  icon?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否为危险操作（红色高亮） */
  danger?: boolean
  /** 是否为分隔线（其他字段忽略） */
  separator?: boolean
}

/** 有序导航项 — SeriesNav */
export interface SeriesNavItem {
  /** 唯一标识（active 匹配用） */
  key: string
  /** 行文本 */
  label: string
  /** 链接地址（存在且未禁用则渲染为 <a>） */
  href?: string
  /** 是否禁用 */
  disabled?: boolean
}
