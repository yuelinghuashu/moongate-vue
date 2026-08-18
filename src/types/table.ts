/**
 * 表格列配置
 * @template T - 行数据的类型
 */
export interface TableColumn<T = any> {
  /** 数据字段名（与 valueKey 二选一，优先级更高） */
  key?: keyof T | string
  /** 列标题（与 labelKey 二选一，优先级更高） */
  title?: string
  /** 列宽度（如 '100px' 或 '10%'） */
  width?: string
  /** 文本对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否可排序 */
  sortable?: boolean
  /** 自定义标题字段名（当 title 未提供时使用） */
  labelKey?: string
  /** 自定义数据字段名（当 key 未提供时使用） */
  valueKey?: string
}

/**
 * 排序参数
 */
export interface SortParams {
  /** 排序字段 */
  key: string
  /** 排序方向 */
  order: 'asc' | 'desc'
}

/**
 * cell 插槽参数
 * @template T - 行数据的类型
 */
export interface CellSlotProps<T> {
  /** 当前行数据 */
  row: T
  /** 当前列配置 */
  column: TableColumn<T>
  /** 当前单元格的值 */
  value: any
}

/**
 * 动态列插槽参数
 * @template T - 行数据的类型
 */
export interface ColumnSlotProps<T> {
  /** 当前行数据 */
  row: T
  /** 当前单元格的值 */
  value: any
}

/**
 * Table 组件 Props
 * @template T - 行数据的类型
 */
export interface TableProps<T = Record<string, any>> {
  /** 列配置 */
  columns: TableColumn<T>[]
  /** 表格数据 */
  data?: T[]
  /** 空状态文案（插槽优先） */
  emptyText?: string
  /** 是否显示表头 */
  showHeader?: boolean
  /** 是否显示斑马纹 */
  striped?: boolean
  /** 是否显示悬停高亮 */
  hoverable?: boolean
  /** 是否强制横向滚动 */
  scrollable?: boolean
  /** 是否响应式（小屏自动滚动） */
  responsive?: boolean
  /** 是否固定表头 */
  fixedHeader?: boolean
  /** 固定表头时的最大高度（如 '400px', '60vh'） */
  maxHeight?: string
  /** 当前排序字段（受控模式） */
  sortKey?: string
  /** 当前排序方向（受控模式） */
  sortOrder?: 'asc' | 'desc'
  /** 全局默认标题字段名 */
  labelKey?: string
  /** 全局默认数据字段名 */
  valueKey?: string
  /** 行唯一标识字段名（稳定 key，排序时可避免 DOM 复用错乱） */
  rowKey?: keyof T | string
  /** 是否显示选择列（行选择） */
  selectable?: boolean
  /** 行是否可选（返回 false 禁用该行 checkbox） */
  rowSelectable?: (row: T, index: number) => boolean
  /** 全选 checkbox 的 aria-label */
  selectAllText?: string
}
