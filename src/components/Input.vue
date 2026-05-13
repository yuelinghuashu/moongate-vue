<template>
  <input
    v-bind="$attrs"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    class="mg-input"
    :class="[`mg-input-${size}`, { 'mg-input-error': error }]"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
type Size = "sm" | "md" | "lg"
type InputType = "text" | "email" | "password" | "number" | "tel" | "url"

interface Props {
  type?: InputType
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  size?: Size
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: "",
  placeholder: "",
  disabled: false,
  readonly: false,
  size: "md",
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
  const target = event.target as HTMLInputElement
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
