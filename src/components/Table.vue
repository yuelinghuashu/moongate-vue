<template>
  <div
    v-bind="$attrs"
    class="mg-table-wrapper"
    :class="{ 'mg-table-responsive': responsive }"
  >
    <div
      class="mg-table-container"
      :class="{ 'mg-table-scrollable': scrollable }"
    >
      <table class="mg-table">
        <!-- 表头 -->
        <thead v-if="showHeader">
          <tr>
            <th
              v-for="column in columns"
              :key="getColumnKey(column)"
              :style="{ width: column.width }"
              :class="[
                `mg-table-th-${column.align || 'left'}`,
                { 'mg-table-sortable': column.sortable },
              ]"
              @click="column.sortable ? handleSort(column) : undefined"
            >
              <span class="mg-table-th-content">
                {{ getColumnTitle(column) }}
                <!-- 排序图标 -->
                <span v-if="column.sortable" class="mg-table-sort-icon">
                  <svg
                    class="mg-table-sort-svg"
                    :class="{
                      'mg-table-sort-asc':
                        sortKey === getColumnKey(column) && sortOrder === 'asc',
                      'mg-table-sort-desc':
                        sortKey === getColumnKey(column) && sortOrder === 'desc',
                    }"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <!-- 上箭头 -->
                    <polyline points="6 9 12 3 18 9" />
                    <!-- 下箭头 -->
                    <polyline points="6 15 12 21 18 15" />
                  </svg>
                </span>
              </span>
            </th>
          </tr>
        </thead>

        <!-- 表体：有数据时 -->
        <tbody v-if="displayData.length > 0">
          <tr
            v-for="(row, rowIndex) in displayData"
            :key="rowIndex"
            :class="{
              'mg-table-row-hover': hoverable,
              'mg-table-row-striped': striped && rowIndex % 2 === 1,
            }"
            @click="handleRowClick(row, rowIndex, $event)"
          >
            <td
              v-for="column in columns"
              :key="getColumnKey(column)"
              :class="`mg-table-td-${column.align || 'left'}`"
            >
              <!-- 
                插槽优先级：
                1. column-{key} 动态插槽（精确匹配列）
                2. cell 插槽（通用自定义，需通过 column.key 判断）
                3. 默认文本渲染
              -->
              <slot
                :name="`column-${getColumnKey(column)}`"
                :row="row"
                :value="getRowValue(row, column)"
              >
                <slot
                  name="cell"
                  :row="row"
                  :column="column"
                  :value="getRowValue(row, column)"
                >
                  {{ getRowValue(row, column) }}
                </slot>
              </slot>
            </td>
          </tr>
        </tbody>

        <!-- 表体：空状态 -->
        <tbody v-else>
          <tr>
            <td :colspan="columns.length" class="mg-table-empty">
              <!-- 空状态插槽：用户可完全自定义 -->
              <slot name="empty">
                <div class="mg-table-empty-content">
                  <span>{{ emptyText }}</span>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any> = any">
import { ref, computed } from "vue"
import type { TableColumn, SortParams } from "../types/table"

// ==================== Props 定义 ====================

const props = withDefaults(
  defineProps<{
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
    /** 当前排序字段（受控模式） */
    sortKey?: string
    /** 当前排序方向（受控模式） */
    sortOrder?: "asc" | "desc"
    /** 全局默认标题字段名 */
    labelKey?: string
    /** 全局默认数据字段名 */
    valueKey?: string
  }>(),
  {
    data: () => [],
    emptyText: "暂无数据",
    showHeader: true,
    striped: false,
    hoverable: true,
    scrollable: false,
    responsive: true,
    sortKey: undefined,
    sortOrder: undefined,
    labelKey: "label",
    valueKey: "value",
  },
)

// ==================== Emits 定义 ====================

const emit = defineEmits<{
  /** 排序字段变化（v-model:sort-key） */
  "update:sortKey": [key: string]
  /** 排序方向变化（v-model:sort-order） */
  "update:sortOrder": [order: "asc" | "desc"]
  /** 排序变化（合并事件） */
  sort: [params: SortParams]
  /** 点击行 */
  "row-click": [row: T, index: number, event: MouseEvent]
}>()

// ==================== 插槽定义 ====================

/**
 * 插槽类型定义
 * - column-{key}: 精确匹配某列，参数为 { row, value }
 * - cell: 通用自定义，参数为 { row, column, value }
 * - empty: 空状态自定义
 */
defineSlots<{
  /** 动态列插槽，名称格式为 column-{列key} */
  [key: `column-${string}`]: (props: { row: T; value: any }) => any
  /** 通用单元格插槽，通过 column.key 判断是哪一列 */
  cell: (props: { row: T; column: TableColumn<T>; value: any }) => any
  /** 空状态插槽 */
  empty: () => any
}>()

// ==================== 辅助函数 ====================

/**
 * 获取列的 key（用于排序标识和插槽名称）
 * 优先级：column.key > column.valueKey > column.labelKey > props.valueKey
 */
const getColumnKey = (column: TableColumn<T>): string => {
  if (column.key !== undefined && column.key !== "") return String(column.key)
  if (column.valueKey !== undefined && column.valueKey !== "") return column.valueKey
  // 兼容对象类型的 labelKey 用法（与 Select 组件一致）
  if (column.labelKey !== undefined && typeof column === "object") {
    const val = (column as any)[column.labelKey]
    if (val !== undefined && val !== "") return String(val)
  }
  return props.valueKey
}

/**
 * 获取列的标题文本
 * 优先级：column.title > column.labelKey 对应的值 > props.labelKey 对应的值 > getColumnKey()
 */
const getColumnTitle = (column: TableColumn<T>): string => {
  if (column.title !== undefined && column.title !== "") return column.title
  // 如果 column 是对象且指定了 labelKey，从 column 对象中取该字段的值
  if (column.labelKey !== undefined && typeof column === "object") {
    const val = (column as any)[column.labelKey]
    if (val !== undefined && val !== "") return String(val)
  }
  // 全局 labelKey：从 column 对象中取对应字段
  if (props.labelKey && typeof column === "object") {
    const val = (column as any)[props.labelKey]
    if (val !== undefined && val !== "") return String(val)
  }
  // 最终 fallback：返回 key
  return getColumnKey(column)
}

/**
 * 获取行数据中指定列的值
 * 优先级：column.valueKey > column.key > props.valueKey
 */
const getRowValue = (row: T, column: TableColumn<T>): any => {
  if (column.valueKey !== undefined) {
    return row[column.valueKey as keyof T]
  }
  if (column.key !== undefined) {
    return row[column.key as keyof T]
  }
  return row[props.valueKey as keyof T]
}

// ==================== 排序逻辑 ====================

/**
 * 内部排序状态（非受控模式）
 */
const internalSortKey = ref<string | undefined>(undefined)
const internalSortOrder = ref<"asc" | "desc" | undefined>(undefined)

/**
 * 判断是否使用内部状态：父组件没有传 sortKey 和 sortOrder
 */
const useInternalSort = computed(() => {
  return props.sortKey === undefined && props.sortOrder === undefined
})

/**
 * 当前生效的排序字段
 */
const currentSortKey = computed(() => {
  if (useInternalSort.value) return internalSortKey.value
  return props.sortKey
})

/**
 * 当前生效的排序方向
 */
const currentSortOrder = computed(() => {
  if (useInternalSort.value) return internalSortOrder.value
  return props.sortOrder
})

/**
 * 处理排序点击
 * @param column - 被点击的列配置
 */
const handleSort = (column: TableColumn<T>) => {
  const key = getColumnKey(column)
  let newOrder: "asc" | "desc" = "asc"

  // 切换排序方向
  if (currentSortKey.value === key) {
    newOrder = currentSortOrder.value === "asc" ? "desc" : "asc"
  }

  if (useInternalSort.value) {
    // 非受控模式：更新内部状态
    internalSortKey.value = key
    internalSortOrder.value = newOrder
  } else {
    // 受控模式：向上传递事件
    emit("update:sortKey", key)
    emit("update:sortOrder", newOrder)
  }

  // 始终发送 sort 事件
  emit("sort", { key, order: newOrder })
}

/**
 * 排序后的数据
 */
const displayData = computed(() => {
  let result = [...props.data]

  // 只有当 sortKey 和 sortOrder 都有值时才排序
  if (currentSortKey.value && currentSortOrder.value) {
    const key = currentSortKey.value as keyof T
    const order = currentSortOrder.value

    result.sort((a, b) => {
      const aRaw = a[key]
      const bRaw = b[key]

      // 转换为字符串用于比较
      const aStr = aRaw == null ? "" : String(aRaw)
      const bStr = bRaw == null ? "" : String(bRaw)

      // 数字优先比较
      if (typeof aRaw === "number" && typeof bRaw === "number") {
        return order === "asc" ? aRaw - bRaw : bRaw - aRaw
      }

      // 字符串比较
      return order === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })
  }

  return result
})

// ==================== 行事件处理 ====================

/**
 * 处理行点击事件
 * @param row - 当前行数据
 * @param index - 行索引
 * @param event - 原生鼠标事件
 */
const handleRowClick = (row: T, index: number, event: MouseEvent) => {
  emit("row-click", row, index, event)
}
</script>