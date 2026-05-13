<template>
  <label
    class="mg-switch"
    :class="[
      `mg-switch-${size}`,
      { 'mg-switch-disabled': disabled, 'mg-switch-error': error },
    ]"
  >
    <input
      type="checkbox"
      class="mg-switch-input"
      :checked="modelValue"
      :disabled="disabled"
      v-bind="$attrs"
      @change="handleChange"
    />
    <span class="mg-switch-track" />
    <span class="mg-switch-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
type Size = "sm" | "md" | "lg"

interface Props {
  modelValue?: boolean
  label?: string
  size?: Size
  disabled?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: "",
  size: "md",
  disabled: false,
  error: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  change: [event: Event]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit("update:modelValue", target.checked)
  emit("change", event)
}
</script>
