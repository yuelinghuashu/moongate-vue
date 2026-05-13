<template>
  <textarea
    v-bind="$attrs"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :rows="rows"
    class="mg-textarea"
    :class="[`mg-textarea-${size}`, { 'mg-textarea-error': error }]"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
type Size = "sm" | "md" | "lg"

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  size?: Size
  rows?: number
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "",
  disabled: false,
  readonly: false,
  size: "md",
  rows: 3,
  error: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit("update:modelValue", target.value)
  emit("input", event)
}

const handleBlur = (event: FocusEvent) => {
  emit("blur", event)
}

const handleFocus = (event: FocusEvent) => {
  emit("focus", event)
}
</script>
