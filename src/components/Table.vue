<template>
  <div
    v-bind="$attrs"
    class="mg-table-wrapper"
    :class="{
      'mg-table-responsive': responsive,
      'mg-table-fixed-header': fixedHeader,
    }"
  >
    <div
      class="mg-table-container"
      :class="{
        'mg-table-scrollable': scrollable,
        'mg-table-fixed-header-container': fixedHeader,
      }"
      :style="fixedHeader ? { maxHeight: maxHeight } : {}"
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
                        sortKey === getColumnKey(column) &&
                        sortOrder === 'desc',
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
                    <polyline points="6 9 12 3 18 9" />
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

defineOptions({ name: "Table", inheritAttrs: false })

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
    /** 是否固定表头 */
    fixedHeader?: boolean
    /** 固定表头时的最大高度（如 '400px', '60vh'） */
    maxHeight?: string
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
    fixedHeader: false,
    maxHeight: "400px",
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

defineSlots<{
  [key: `column-${string}`]: (props: { row: T; value: any }) => any
  cell: (props: { row: T; column: TableColumn<T>; value: any }) => any
  empty: () => any
}>()

// ==================== 辅助函数 ====================

/**
 * 获取列的 key（用于排序标识和插槽名称）
 * 优先级：column.key > column.valueKey > column.labelKey > props.valueKey
 */
const getColumnKey = (column: TableColumn<T>): string => {
  if (column.key !== undefined && column.key !== "") return String(column.key)
  if (column.valueKey !== undefined && column.valueKey !== "")
    return column.valueKey
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
  if (column.labelKey !== undefined && typeof column === "object") {
    const val = (column as any)[column.labelKey]
    if (val !== undefined && val !== "") return String(val)
  }
  if (props.labelKey && typeof column === "object") {
    const val = (column as any)[props.labelKey]
    if (val !== undefined && val !== "") return String(val)
  }
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

const internalSortKey = ref<string | undefined>(undefined)
const internalSortOrder = ref<"asc" | "desc" | undefined>(undefined)

const useInternalSort = computed(() => {
  return props.sortKey === undefined && props.sortOrder === undefined
})

const currentSortKey = computed(() => {
  if (useInternalSort.value) return internalSortKey.value
  return props.sortKey
})

const currentSortOrder = computed(() => {
  if (useInternalSort.value) return internalSortOrder.value
  return props.sortOrder
})

const handleSort = (column: TableColumn<T>) => {
  const key = getColumnKey(column)
  let newOrder: "asc" | "desc" = "asc"

  if (currentSortKey.value === key) {
    newOrder = currentSortOrder.value === "asc" ? "desc" : "asc"
  }

  if (useInternalSort.value) {
    internalSortKey.value = key
    internalSortOrder.value = newOrder
  } else {
    emit("update:sortKey", key)
    emit("update:sortOrder", newOrder)
  }

  emit("sort", { key, order: newOrder })
}

const displayData = computed(() => {
  let result = [...props.data]

  if (currentSortKey.value && currentSortOrder.value) {
    const key = currentSortKey.value as keyof T
    const order = currentSortOrder.value

    result.sort((a, b) => {
      const aRaw = a[key]
      const bRaw = b[key]

      const aStr = aRaw == null ? "" : String(aRaw)
      const bStr = bRaw == null ? "" : String(bRaw)

      if (typeof aRaw === "number" && typeof bRaw === "number") {
        return order === "asc" ? aRaw - bRaw : bRaw - aRaw
      }

      return order === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr)
    })
  }

  return result
})

// ==================== 行事件处理 ====================

const handleRowClick = (row: T, index: number, event: MouseEvent) => {
  emit("row-click", row, index, event)
}
</script>
