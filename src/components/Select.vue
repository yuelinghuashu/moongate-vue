<template>
  <select
    class="mg-select"
    :class="[`mg-select-${size}`, { 'mg-select-error': error }]"
    :value="modelValue"
    :disabled="disabled"
    v-bind="$attrs"
    @change="handleChange"
  >
    <option v-if="placeholder" value="" disabled hidden>
      {{ placeholder }}
    </option>
    <option
      v-for="item in options"
      :key="getValue(item)"
      :value="getValue(item)"
      :disabled="item.disabled"
    >
      {{ getLabel(item) }}
    </option>
  </select>
</template>

<script setup lang="ts">
type Size = "sm" | "md" | "lg"

interface Props {
  modelValue?: string | number
  options?: any[]
  placeholder?: string
  size?: Size
  disabled?: boolean
  error?: boolean
  labelKey?: string
  valueKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  options: () => [],
  placeholder: "",
  size: "md",
  disabled: false,
  error: false,
  labelKey: "label",
  valueKey: "value",
})

const emit = defineEmits<{
  "update:modelValue": [value: string | number]
  change: [event: Event]
}>()

// 获取显示文本
const getLabel = (item: any): string => {
  if (item === null || item === undefined) return ''
  // 基本类型（string, number, boolean）直接转字符串
  if (typeof item !== 'object') {
    return String(item)
  }
  // 对象类型：根据 labelKey 取值
  const label = item[props.labelKey]
  return label !== undefined ? String(label) : String(item)
}

// 获取选项值
const getValue = (item: any): any => {
  if (item === null || item === undefined) return undefined
  // 基本类型直接返回
  if (typeof item !== 'object') {
    return item
  }
  // 对象类型：根据 valueKey 取值
  const val = item[props.valueKey]
  return val !== undefined ? val : item
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit("update:modelValue", target.value)
  emit("change", event)
}
</script>