<template>
  <label
    class="mg-radio"
    :class="[
      `mg-radio-${size}`,
      { 'mg-radio-disabled': disabled, 'mg-radio-error': error },
    ]"
  >
    <input
      type="radio"
      class="mg-radio-input"
      :checked="isChecked"
      :disabled="disabled"
      :value="value"
      v-bind="$attrs"
      @change="handleChange"
    />
    <span class="mg-radio-circle" />
    <span class="mg-radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue"

type Size = "sm" | "md" | "lg"

interface Props {
  modelValue?: string | number
  label?: string
  value?: string | number
  size?: Size
  disabled?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  label: "",
  value: undefined,
  size: "md",
  disabled: false,
  error: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: string | number]
  change: [event: Event]
}>()

const isChecked = computed(() => {
  return props.modelValue === props.value
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked && props.value !== undefined) {
    emit("update:modelValue", props.value)
  }
  emit("change", event)
}
</script>
