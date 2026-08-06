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
            <!-- 选择列 -->
            <th v-if="selectable" class="mg-table-selection-col">
              <input
                type="checkbox"
                class="mg-table-checkbox"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                :aria-label="selectAllText"
                @change="handleSelectAll"
              />
            </th>
            <th
              v-for="column in columns"
              :key="getColumnKey(column)"
              :style="{ width: column.width }"
              :aria-sort="column.sortable ? getSortAria(column) : undefined"
              :class="[
                `mg-table-th-${column.align || 'left'}`,
                { 'mg-table-sortable': column.sortable },
              ]"
              :tabindex="column.sortable ? 0 : undefined"
              :role="column.sortable ? 'button' : undefined"
              @click="column.sortable ? handleSort(column) : undefined"
              @keydown.enter="column.sortable ? handleSort(column) : undefined"
              @keydown.space.prevent="column.sortable ? handleSort(column) : undefined"
            >
              <span class="mg-table-th-content">
                {{ getColumnTitle(column) }}
                <!-- 排序图标（纯装饰性，屏幕阅读器通过 aria-sort 获取排序状态） -->
                <span v-if="column.sortable" class="mg-table-sort-icon" aria-hidden="true">
                  <svg
                    class="mg-table-sort-svg"
                    :class="{
                      'mg-table-sort-asc':
                        currentSortKey === getColumnKey(column) && currentSortOrder === 'asc',
                      'mg-table-sort-desc':
                        currentSortKey === getColumnKey(column) && currentSortOrder === 'desc',
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
            :key="getRowKey(row, rowIndex)"
            :class="{
              'mg-table-row-hover': hoverable,
              'mg-table-row-striped': striped && rowIndex % 2 === 1,
              'mg-table-row-selected': isRowSelected(row),
            }"
            @click="handleRowClick(row, rowIndex, $event)"
          >
            <!-- 选择列 -->
            <td v-if="selectable" class="mg-table-selection-col">
              <input
                type="checkbox"
                class="mg-table-checkbox"
                :checked="isRowSelected(row)"
                :disabled="!isRowSelectable(row, rowIndex)"
                :aria-label="`选择 ${getRowLabel(row)}`"
                @change="handleRowSelect(row)"
              />
            </td>
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
                <slot name="cell" :row="row" :column="column" :value="getRowValue(row, column)">
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
import { ref, computed } from 'vue'
import type { TableColumn, SortParams } from '../types/table'

defineOptions({ name: 'Table', inheritAttrs: false })

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
  }>(),
  {
    data: () => [],
    emptyText: '暂无数据',
    showHeader: true,
    striped: false,
    hoverable: true,
    scrollable: false,
    responsive: true,
    fixedHeader: false,
    maxHeight: '400px',
    sortKey: undefined,
    sortOrder: undefined,
    labelKey: 'label',
    valueKey: 'value',
    rowKey: undefined,
    selectable: false,
    rowSelectable: undefined,
    selectAllText: '全选',
  },
)

// ==================== v-model 定义 ====================

/**
 * v-model:selected-rows 双向绑定（选中行数组）
 * 未绑定时内部管理（默认全空）
 */
const selectedRows = defineModel<T[]>('selectedRows', { default: () => [] })

// ==================== Emits 定义 ====================

const emit = defineEmits<{
  /** 排序字段变化（v-model:sort-key） */
  'update:sortKey': [key: string]
  /** 排序方向变化（v-model:sort-order） */
  'update:sortOrder': [order: 'asc' | 'desc']
  /** 排序变化（合并事件） */
  sort: [params: SortParams]
  /** 点击行 */
  'row-click': [row: T, index: number, event: MouseEvent]
  /** 选中行变化 */
  'selection-change': [rows: T[]]
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
  if (column.key !== undefined && column.key !== '') return String(column.key)
  if (column.valueKey !== undefined && column.valueKey !== '') return column.valueKey
  if (column.labelKey !== undefined && typeof column === 'object') {
    const val = (column as any)[column.labelKey]
    if (val !== undefined && val !== '') return String(val)
  }
  return props.valueKey
}

/**
 * 获取列的标题文本
 * 优先级：column.title > column.labelKey 对应的值 > props.labelKey 对应的值 > getColumnKey()
 */
const getColumnTitle = (column: TableColumn<T>): string => {
  if (column.title !== undefined && column.title !== '') return column.title
  if (column.labelKey !== undefined && typeof column === 'object') {
    const val = (column as any)[column.labelKey]
    if (val !== undefined && val !== '') return String(val)
  }
  if (props.labelKey && typeof column === 'object') {
    const val = (column as any)[props.labelKey]
    if (val !== undefined && val !== '') return String(val)
  }
  return getColumnKey(column)
}

/**
 * 获取行的稳定 key
 * 优先级：props.rowKey > 行索引
 */
const getRowKey = (row: T, index: number): string | number => {
  if (props.rowKey !== undefined) {
    const val = row[props.rowKey as keyof T]
    if (val !== undefined && val !== null) {
      return String(val)
    }
  }
  return index
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
const internalSortOrder = ref<'asc' | 'desc' | undefined>(undefined)

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

/**
 * 获取可排序列的 aria-sort 值
 * @param column - 列配置
 * @returns 'ascending' | 'descending' | undefined（未排序时不设置）
 */
const getSortAria = (column: TableColumn<T>): 'ascending' | 'descending' | undefined => {
  if (currentSortKey.value !== getColumnKey(column)) return undefined
  if (currentSortOrder.value === 'asc') return 'ascending'
  if (currentSortOrder.value === 'desc') return 'descending'
  return undefined
}

const handleSort = (column: TableColumn<T>) => {
  const key = getColumnKey(column)
  let newOrder: 'asc' | 'desc' = 'asc'

  if (currentSortKey.value === key) {
    newOrder = currentSortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  if (useInternalSort.value) {
    internalSortKey.value = key
    internalSortOrder.value = newOrder
  } else {
    emit('update:sortKey', key)
    emit('update:sortOrder', newOrder)
  }

  emit('sort', { key, order: newOrder })
}

const displayData = computed(() => {
  const result = [...props.data]

  if (currentSortKey.value && currentSortOrder.value) {
    const key = currentSortKey.value as keyof T
    const order = currentSortOrder.value

    result.sort((a, b) => {
      const aRaw = a[key]
      const bRaw = b[key]

      const aStr = aRaw == null ? '' : String(aRaw)
      const bStr = bRaw == null ? '' : String(bRaw)

      if (typeof aRaw === 'number' && typeof bRaw === 'number') {
        return order === 'asc' ? aRaw - bRaw : bRaw - aRaw
      }

      return order === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })
  }

  return result
})

// ==================== 行选择逻辑 ====================

/**
 * 比较两行是否相等（优先使用 rowKey，否则按引用比较）
 */
const isSameRow = (a: T, b: T): boolean => {
  if (props.rowKey !== undefined) {
    return String(a[props.rowKey as keyof T]) === String(b[props.rowKey as keyof T])
  }
  return a === b
}

/**
 * 检查行是否在选中列表中
 */
const isRowSelected = (row: T): boolean => {
  return selectedRows.value.some((selected) => isSameRow(selected, row))
}

/**
 * 检查行是否可选（禁用 checkbox）
 */
const isRowSelectable = (row: T, index: number): boolean => {
  if (!props.rowSelectable) return true
  return props.rowSelectable(row, index)
}

/**
 * 当前可被选择的行（用于全选逻辑，跳过禁用行）
 */
const selectableRows = computed(() => {
  if (!props.rowSelectable) return displayData.value
  return displayData.value.filter((row, index) => props.rowSelectable?.(row, index))
})

/**
 * 表头 checkbox：是否全选
 */
const isAllSelected = computed(() => {
  if (selectableRows.value.length === 0) return false
  return selectableRows.value.every((row) => isRowSelected(row))
})

/**
 * 表头 checkbox：是否半选
 */
const isIndeterminate = computed(() => {
  const selectedCount = selectableRows.value.filter((row) => isRowSelected(row)).length
  return selectedCount > 0 && selectedCount < selectableRows.value.length
})

/**
 * 获取行的可访问名称（用于 checkbox aria-label）
 */
const getRowLabel = (row: T): string => {
  if (props.rowKey !== undefined) {
    return String(row[props.rowKey as keyof T])
  }
  // 使用第一列的值作为可访问名称
  const firstColumn = props.columns[0]
  if (firstColumn) {
    return String(getRowValue(row, firstColumn))
  }
  return '行'
}

/**
 * 选中/取消选中单行
 */
const handleRowSelect = (row: T) => {
  if (!isRowSelected(row)) {
    const next = [...selectedRows.value, row]
    selectedRows.value = next
    emit('selection-change', next)
  } else {
    const next = selectedRows.value.filter((selected) => !isSameRow(selected, row))
    selectedRows.value = next
    emit('selection-change', next)
  }
}

/**
 * 全选 / 取消全选（仅操作可选中的行）
 */
const handleSelectAll = () => {
  if (isAllSelected.value) {
    // 取消全选：移除所有可选行
    const next = selectedRows.value.filter(
      (selected) => !selectableRows.value.some((row) => isSameRow(selected, row)),
    )
    selectedRows.value = next
    emit('selection-change', next)
  } else {
    // 全选：仅追加尚未选中的可选行
    // 使用 isRowSelected（内部走 isSameRow：有 rowKey 按 rowKey 比较，无 rowKey 按引用比较）
    // 避免无 rowKey 时 getRowKey 返回数字索引导致 Set 去重类型不匹配（数字 vs 字符串）而重复追加
    const next = [...selectedRows.value]
    for (const row of selectableRows.value) {
      if (!isRowSelected(row)) {
        next.push(row)
      }
    }
    selectedRows.value = next
    emit('selection-change', next)
  }
}

// ==================== 行事件处理 ====================

const handleRowClick = (row: T, index: number, event: MouseEvent) => {
  emit('row-click', row, index, event)
}
</script>
