<template>
  <div
    v-bind="$attrs"
    class="mg-select-wrapper"
    :class="[`mg-select-${size}`, { 'mg-select-error': error, 'mg-select-disabled': disabled }]"
  >
    <!-- ==================== 可搜索模式 ==================== -->
    <div v-if="filterable" class="mg-select-filterable">
      <!-- 输入框 -->
      <input
        ref="inputRef"
        type="text"
        class="mg-select-input"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleSearchInput"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @keydown.down.prevent="handleKeyDown"
        @keydown.up.prevent="handleKeyUp"
        @keydown.enter.prevent="handleKeyEnter"
        @keydown.esc="handleKeyEsc"
      />

      <!-- 下拉箭头 -->
      <span class="mg-select-arrow" @click="toggleDropdown">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          :class="{ 'mg-select-arrow-up': isOpen }"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>

      <!-- 下拉面板 -->
      <transition name="mg-select-dropdown">
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="mg-select-dropdown"
          :style="{ maxHeight: `${maxHeight}px` }"
        >
          <!-- 空状态 -->
          <div v-if="filteredOptions.length === 0" class="mg-select-empty">
            <slot name="empty">
              <span>{{ emptyText }}</span>
            </slot>
          </div>

          <!-- 选项列表 -->
          <div
            v-for="(item, index) in filteredOptions"
            v-else
            :key="getValue(item)"
            class="mg-select-option"
            :class="{
              'mg-select-option-selected': isSelected(item),
              'mg-select-option-focused': focusedIndex === index,
              'mg-select-option-disabled': isOptionDisabled(item),
            }"
            @click="selectOption(item)"
            @mouseenter="focusedIndex = index"
          >
            <slot name="option" :item="item" :label="getLabel(item)">
              {{ getLabel(item) }}
            </slot>
          </div>
        </div>
      </transition>
    </div>

    <!-- ==================== 普通模式 ==================== -->
    <select
      v-else
      class="mg-select-native"
      :class="[`mg-select-${size}`, { 'mg-select-error': error }]"
      :value="modelValue"
      :disabled="disabled"
      @change="handleNativeChange"
    >
      <option v-if="placeholder" value="" disabled hidden>
        {{ placeholder }}
      </option>
      <option
        v-for="item in options"
        :key="getValue(item)"
        :value="getValue(item)"
        :disabled="isOptionDisabled(item)"
      >
        {{ getLabel(item) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

defineOptions({ name: 'Select', inheritAttrs: false })

// ==================== 类型定义 ====================

/**
 * 组件尺寸类型
 * - sm: 小号
 * - md: 中号（默认）
 * - lg: 大号
 */
type Size = 'sm' | 'md' | 'lg'

/** 选项值的类型 */
export type SelectValue = string | number

/** 选项类型：基本类型值或对象 */
export type SelectOption = string | number | Record<string, any>

interface Props {
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
}

// ==================== Props 默认值 ====================

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  placeholder: '',
  size: 'md',
  disabled: false,
  error: false,
  labelKey: 'label',
  valueKey: 'value',
  filterable: false,
  emptyText: '暂无数据',
  maxHeight: 240,
})

/** v-model 双向绑定（当前选中的值） */
const modelValue = defineModel<SelectValue>({ default: '' })

// ==================== Emits 定义 ====================

const emit = defineEmits<{
  /** 值变化事件 */
  change: [value: SelectValue]
  /** 搜索输入事件 */
  search: [value: string]
}>()

// ==================== 辅助函数 ====================

/**
 * 获取选项的显示文本
 * @param item - 选项对象或基本类型值
 * @returns 显示文本
 *
 * 优先级：
 * 1. 基本类型（string/number）直接转字符串
 * 2. 对象类型：取 labelKey 对应的值
 * 3. 都不存在则转字符串
 */
const getLabel = (item: SelectOption): string => {
  if (item === null || item === undefined) return ''
  // 基本类型（string, number, boolean）直接转字符串
  if (typeof item !== 'object') {
    return String(item)
  }
  // 对象类型：根据 labelKey 取值
  const obj = item as Record<string, any>
  const label = props.labelKey ? obj[props.labelKey] : undefined
  return label !== undefined ? String(label) : String(item)
}

/**
 * 获取选项的实际值
 * @param item - 选项对象或基本类型值
 * @returns 选项的实际值
 *
 * 优先级：
 * 1. 基本类型直接返回
 * 2. 对象类型：取 valueKey 对应的值
 * 3. 都不存在则返回 item 本身
 */
const getValue = (item: SelectOption): SelectValue => {
  if (item === null || item === undefined) return ''
  // 基本类型直接返回
  if (typeof item !== 'object') {
    return item as SelectValue
  }
  // 对象类型：根据 valueKey 取值
  const obj = item as Record<string, any>
  const val = props.valueKey ? obj[props.valueKey] : undefined
  return val !== undefined ? (val as SelectValue) : String(item)
}

/**
 * 检查选项是否禁用
 * 只有对象类型选项才可能有 disabled 字段
 */
const isOptionDisabled = (item: SelectOption): boolean => {
  return typeof item === 'object' && item !== null && !!item.disabled
}

/**
 * 检查选项是否被选中
 * @param item - 选项对象或基本类型值
 * @returns 是否选中
 */
const isSelected = (item: SelectOption): boolean => {
  const itemValue = getValue(item)
  return String(itemValue) === String(modelValue.value)
}

/**
 * 查找当前选中的选项对象
 * 用于在搜索模式下显示选中项的标签
 */
const selectedOption = computed(() => {
  if (modelValue.value === undefined || modelValue.value === '') return null
  return props.options.find((item) => {
    const itemValue = getValue(item)
    return String(itemValue) === String(modelValue.value)
  })
})

// ==================== 搜索模式状态 ====================

/** 下拉面板是否打开 */
const isOpen = ref(false)
/** 用户输入的搜索文本 */
const searchText = ref('')
/** 当前高亮选项的索引（用于键盘导航） */
const focusedIndex = ref(-1)
/** 输入框 DOM 引用 */
const inputRef = ref<HTMLInputElement | null>(null)
/** 下拉面板 DOM 引用（用于滚动事件监听） */
const dropdownRef = ref<HTMLDivElement | null>(null)
/** 用户是否正在编辑中（用于控制显示逻辑） */
const isEditing = ref(false)

/**
 * 输入框显示的值
 * - 用户正在编辑时：显示 searchText（允许空字符串）
 * - 用户未编辑且有选中值时：显示选中项的标签
 * - 否则显示空字符串
 */
const displayValue = computed(() => {
  // 用户正在编辑时，始终显示 searchText（允许空字符串）
  if (isEditing.value) {
    return searchText.value
  }
  // 未编辑时，有选中值显示选中项的标签
  if (selectedOption.value) {
    return getLabel(selectedOption.value)
  }
  return ''
})

/**
 * 过滤后的选项列表
 * 根据搜索文本模糊匹配选项的显示文本
 */
const filteredOptions = computed(() => {
  if (!props.filterable || !searchText.value) {
    return props.options
  }

  const searchLower = searchText.value.toLowerCase()
  return props.options.filter((item) => {
    const label = getLabel(item).toLowerCase()
    return label.includes(searchLower)
  })
})

// ==================== 搜索模式方法 ====================

/**
 * 处理搜索输入
 * @param event - 输入事件
 */
const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchText.value = target.value
  isEditing.value = true
  isOpen.value = true
  focusedIndex.value = -1
  emit('search', searchText.value)
}

/**
 * 处理输入框聚焦
 * 进入编辑模式，清空搜索文本，显示下拉面板
 */
const handleInputFocus = () => {
  if (props.disabled) return
  isEditing.value = true
  isOpen.value = true
  searchText.value = ''
  focusedIndex.value = -1
}

/**
 * 处理输入框失焦
 * 延迟退出编辑模式，让点击选项有机会执行
 */
const handleInputBlur = () => {
  // 延迟 200ms 关闭，确保点击选项的事件能够执行
  setTimeout(() => {
    isEditing.value = false
    isOpen.value = false
  }, 200)
}

/**
 * 切换下拉面板
 */
const toggleDropdown = () => {
  if (props.disabled) return

  if (isOpen.value) {
    // 关闭下拉
    isEditing.value = false
    isOpen.value = false
    searchText.value = ''
    focusedIndex.value = -1
  } else {
    // 打开下拉
    isEditing.value = true
    isOpen.value = true
    searchText.value = ''
    focusedIndex.value = -1
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
}

/**
 * 选择选项
 * @param item - 选中的选项
 */
const selectOption = (item: SelectOption) => {
  if (isOptionDisabled(item)) return

  const value = getValue(item)
  modelValue.value = value
  emit('change', value)

  // 选择后退出编辑模式，关闭下拉，清空搜索状态
  isEditing.value = false
  isOpen.value = false
  searchText.value = ''
  focusedIndex.value = -1
}

/**
 * 键盘向下导航
 */
const handleKeyDown = () => {
  if (focusedIndex.value < filteredOptions.value.length - 1) {
    focusedIndex.value++
    scrollToFocusedOption()
  }
}

/**
 * 键盘向上导航
 */
const handleKeyUp = () => {
  if (focusedIndex.value > 0) {
    focusedIndex.value--
    scrollToFocusedOption()
  }
}

/**
 * 键盘回车确认
 */
const handleKeyEnter = () => {
  if (focusedIndex.value >= 0 && filteredOptions.value[focusedIndex.value]) {
    selectOption(filteredOptions.value[focusedIndex.value])
  }
}

/**
 * 键盘 ESC 关闭下拉
 */
const handleKeyEsc = () => {
  isEditing.value = false
  isOpen.value = false
  searchText.value = ''
  focusedIndex.value = -1
}

/**
 * 滚动到当前高亮选项
 * 确保键盘导航时高亮选项始终在可视区域内
 */
const scrollToFocusedOption = () => {
  nextTick(() => {
    const options = dropdownRef.value?.querySelectorAll('.mg-select-option')
    const focusedOption = options?.[focusedIndex.value] as HTMLElement
    if (focusedOption) {
      focusedOption.scrollIntoView({ block: 'nearest' })
    }
  })
}

// ==================== 原生模式方法 ====================

/**
 * 处理原生 select 变化
 * @param event - 原生 change 事件
 *
 * 注意：需要类型回溯，确保返回的值的类型与 options 中的原始类型一致
 * 例如：options 中是数字 [1, 2, 3]，选中后 modelValue 应该是 number 而不是 string
 */
const handleNativeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const rawValue = target.value

  // 类型回溯：在原始 options 中找回原始类型
  const originalItem = props.options?.find((item) => String(getValue(item)) === rawValue)
  const finalValue = originalItem !== undefined ? getValue(originalItem) : rawValue

  modelValue.value = finalValue
  emit('change', finalValue)
}

// ==================== 监听器 ====================

/**
 * 监听外部值变化，清空搜索状态
 * 当父组件直接修改 modelValue 时，需要同步清空搜索文本
 */
watch(
  () => modelValue.value,
  () => {
    if (searchText.value) {
      searchText.value = ''
    }
  },
)

/**
 * 监听搜索文本变化
 * 当搜索文本为空时，保持下拉打开，显示所有选项
 */
watch(searchText, (newVal) => {
  if (isEditing.value && newVal === '') {
    isOpen.value = true
  }
})
</script>
