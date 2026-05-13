<template>
  <label
    class="mg-checkbox"
    :class="[
      `mg-checkbox-${size}`,
      { 'mg-checkbox-disabled': disabled, 'mg-checkbox-error': error },
    ]"
  >
    <input
      type="checkbox"
      class="mg-checkbox-input"
      :checked="isChecked"
      :disabled="disabled"
      v-bind="$attrs"
      @change="handleChange"
    />
    <span class="mg-checkbox-box" />
    <span class="mg-checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue"

type Size = "sm" | "md" | "lg"

interface Props {
  modelValue?: boolean | any[]
  label?: string
  value?: string | number
  size?: Size
  disabled?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: "",
  value: undefined,
  size: "md",
  disabled: false,
  error: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean | any[]]
  change: [event: Event]
}>()

const isChecked = computed(() => {
  if (props.value !== undefined && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return !!props.modelValue
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (props.value !== undefined && Array.isArray(props.modelValue)) {
    const newValue = target.checked
      ? [...props.modelValue, props.value]
      : props.modelValue.filter((v) => v !== props.value)
    emit("update:modelValue", newValue)
  } else {
    emit("update:modelValue", target.checked)
  }
  emit("change", event)
}
</script>
