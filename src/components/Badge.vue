<template>
  <span
    v-bind="$attrs"
    class="mg-badge"
    :class="[`mg-badge-${color}`, `mg-badge-${size}`]"
  >
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
type Color = "primary" | "success" | "warning" | "error"
type Size = "sm" | "md"

interface Props {
  label?: string
  color?: Color
  size?: Size
}

withDefaults(defineProps<Props>(), {
  label: "",
  color: "primary",
  size: "md",
})
</script>
