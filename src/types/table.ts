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
  align?: "left" | "center" | "right"
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
  order: "asc" | "desc"
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