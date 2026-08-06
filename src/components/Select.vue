<template>
  <div
    v-bind="wrapperAttrs"
    class="mg-select-wrapper"
    :class="[`mg-select-${size}`, { 'mg-select-error': error, 'mg-select-disabled': disabled }]"
  >
    <!-- ==================== 可搜索模式 ==================== -->
    <div
      v-if="filterable"
      class="mg-select-filterable"
      :class="{ 'mg-select-multiple': multiple }"
      @mousedown="mousedownInside = true"
    >
      <!-- 多选模式：已选标签 -->
      <div v-if="multiple" class="mg-select-tags">
        <span v-for="tag in selectedTags" :key="String(tag.value)" class="mg-select-tag">
          <span class="mg-select-tag-label">{{ tag.label }}</span>
          <button
            type="button"
            class="mg-select-tag-remove"
            :aria-label="`移除 ${tag.label}`"
            @click.stop="removeTag(tag.value)"
          >
            &times;
          </button>
        </span>
      </div>

      <!-- 输入框 -->
      <input
        ref="inputRef"
        v-bind="formAttrs"
        type="text"
        class="mg-select-input"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleSearchInput"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @keydown.down.prevent="moveFocus(1)"
        @keydown.up.prevent="moveFocus(-1)"
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
          role="listbox"
          :aria-label="listboxAriaLabel"
          :aria-activedescendant="focusedIndex >= 0 ? getOptionId(focusedIndex) : undefined"
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
            :id="getOptionId(index)"
            :key="getValue(item)"
            class="mg-select-option"
            role="option"
            :aria-selected="isSelected(item)"
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
      v-bind="formAttrs"
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
import { ref, computed, watch, nextTick, useAttrs, useId } from 'vue'
import type { Size } from '../types/components'

defineOptions({ name: 'Select', inheritAttrs: false })

/** 生成 select 实例的唯一基础 ID（SSR 安全，hydration 时服务端与客户端一致） */
const selectBaseId = useId()

/**
 * 获取指定索引选项的唯一 ID
 * @param index - 选项索引
 * @returns 用于 aria-activedescendant / 选项 id 的唯一 ID
 */
const getOptionId = (index: number): string => `${selectBaseId}-option-${index}`

/**
 * 属性透传拆分：
 * - 表单/无障碍相关属性（name/id/aria-* 等）透传到实际的 <input>/<select>，
 *   否则可搜索模式的输入框将缺失可访问名称（axe 的 aria-input-field-name/label 违规）。
 * - 其余属性（class/style/事件/data-* 等）保留在外层 wrapper。
 */
const attrs = useAttrs()

/** 透传到原生表单元素的 form/aria 属性 */
const formAttrs = computed(() => {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith('aria-') || ['name', 'id', 'role', 'tabindex'].includes(key)) {
      result[key] = value
    }
  }
  return result
})

/** 保留在外层 wrapper 的其余属性 */
const wrapperAttrs = computed(() => {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (!(key in formAttrs.value)) {
      result[key] = value
    }
  }
  return result
})

/**
 * 下拉面板（role="listbox"）的可访问名称。
 * 复用透传的 aria-label，确保 listbox 与搜索输入框拥有相同的可访问名称
 * （axe 的 aria-input-field-name 要求组合式输入控件也具有可访问名称）。
 */
const listboxAriaLabel = computed(() => {
  const ariaLabel = formAttrs.value['aria-label']
  return typeof ariaLabel === 'string' ? ariaLabel : undefined
})

// ==================== 类型定义 ====================

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
  /** 是否多选（仅 filterable 可搜索模式支持） */
  multiple?: boolean
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
  multiple: false,
})

/**
 * v-model 双向绑定（当前选中的值）
 * - 单选：SelectValue
 * - 多选（multiple + filterable）：SelectValue[]
 */
const modelValue = defineModel<SelectValue | SelectValue[]>({ default: '' })

// ==================== Emits 定义 ====================

const emit = defineEmits<{
  /** 值变化事件（多选时为数组） */
  change: [value: SelectValue | SelectValue[]]
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
 * 多选模式下的选中值数组（对非数组的 modelValue 做防护）
 */
const multipleValues = computed<SelectValue[]>(() => {
  if (!props.multiple) return []
  return Array.isArray(modelValue.value) ? modelValue.value : []
})

/**
 * 检查选项是否被选中
 * - 多选模式：值存在于数组中
 * - 单选模式：值与模型值相等
 */
const isSelected = (item: SelectOption): boolean => {
  const itemValue = getValue(item)
  if (props.multiple) {
    return multipleValues.value.some((v) => String(v) === String(itemValue))
  }
  return String(itemValue) === String(modelValue.value)
}

/**
 * 多选模式：已选中的选项标签列表
 */
const selectedTags = computed(() => {
  return multipleValues.value
    .map((value) => {
      const item = props.options.find((opt) => String(getValue(opt)) === String(value))
      return item ? { label: getLabel(item), value: getValue(item) } : null
    })
    .filter((tag): tag is { label: string; value: SelectValue } => tag !== null)
})

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
/** 标记 mousedown 是否发生在组件内部（用于优化 blur 关闭逻辑） */
const mousedownInside = ref(false)

/**
 * 输入框显示的值
 * - 用户正在编辑时：显示 searchText（允许空字符串）
 * - 用户未编辑且有选中值时：显示选中项的标签
 * - 否则显示空字符串
 */
const displayValue = computed(() => {
  // 多选模式：输入框只显示搜索文本（已选项由标签展示）
  if (props.multiple) {
    return searchText.value
  }
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
 * 打开下拉面板（清空搜索文本、重置高亮索引）
 */
const openDropdown = () => {
  isEditing.value = true
  isOpen.value = true
  searchText.value = ''
  focusedIndex.value = -1
}

/**
 * 关闭下拉面板（清空搜索文本、重置高亮索引）
 */
const closeDropdown = () => {
  isEditing.value = false
  isOpen.value = false
  searchText.value = ''
  focusedIndex.value = -1
}

/**
 * 处理输入框聚焦
 * 进入编辑模式，清空搜索文本，显示下拉面板
 */
const handleInputFocus = () => {
  if (props.disabled) return
  openDropdown()
}

/**
 * 处理输入框失焦
 *
 * 利用事件顺序（mousedown → blur → mouseup → click）判断：
 * - 如果 mousedown 发生在组件内部（如点击选项），则不关闭下拉，让 click 正常执行选中逻辑
 * - 点击外部区域时 blur 立即关闭，无需等待固定延迟
 */
const handleInputBlur = () => {
  // mousedown 在 blur 之前触发，若发生在组件内部说明是点击选项，保留下拉
  if (mousedownInside.value) {
    mousedownInside.value = false
    return
  }
  closeDropdown()
}

/**
 * 切换下拉面板
 */
const toggleDropdown = () => {
  if (props.disabled) return

  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
    mousedownInside.value = false
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
}

/**
 * 移除多选中的一个值
 * @param value - 要移除的值
 */
const removeTag = (value: SelectValue) => {
  if (!props.multiple) return
  const next = multipleValues.value.filter((v) => String(v) !== String(value))
  modelValue.value = next
  // 多选模式始终 emit 数组
  emit('change', next)
}

/**
 * 选择选项
 * - 单选：设置值并关闭下拉
 * - 多选：切换选中/取消，保持下拉打开（方便连续多选）
 * @param item - 选中的选项
 */
const selectOption = (item: SelectOption) => {
  if (isOptionDisabled(item)) return

  const value = getValue(item)

  if (props.multiple) {
    // 多选：切换选中状态
    const current = multipleValues.value
    const isAlreadySelected = current.some((v) => String(v) === String(value))
    const next = isAlreadySelected
      ? current.filter((v) => String(v) !== String(value)) // 取消选中
      : [...current, value] // 添加选中

    modelValue.value = next
    // 多选模式始终 emit 数组
    emit('change', next)

    // 多选保持下拉打开，清空搜索文本方便连续选择
    searchText.value = ''
    focusedIndex.value = -1
    nextTick(() => inputRef.value?.focus())
    return
  }

  // 单选：选择后关闭
  modelValue.value = value
  emit('change', value)
  closeDropdown()
  mousedownInside.value = false
}

/**
 * 键盘导航：移动高亮选项
 * @param offset - 移动方向：1 向下，-1 向上
 */
const moveFocus = (offset: 1 | -1) => {
  const nextIndex = focusedIndex.value + offset
  if (nextIndex >= 0 && nextIndex < filteredOptions.value.length) {
    focusedIndex.value = nextIndex
    scrollToFocusedOption()
  }
}

/**
 * 键盘回车确认
 * - 单选：选中后关闭下拉
 * - 多选：选中后保持下拉打开（方便连续多选）
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
  closeDropdown()
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
