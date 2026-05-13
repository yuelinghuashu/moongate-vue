<template>
  <button
    v-bind="$attrs"
    class="mg-button"
    :class="[
      `mg-button-${variant}-${color}`,
      `mg-button-${size}`,
      { 'mg-button-block': block, 'mg-button-loading': loading },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <template v-if="loading">
      <span class="mg-button-loading-icon" />
    </template>

    <!-- 正常状态 -->
    <template v-else>
      <span v-if="hasIconSlot || icon" class="mg-button-icon">
        <slot name="icon">
          <component :is="icon" v-if="typeof icon !== 'string'" />
          <span v-else-if="icon">{{ icon }}</span>
        </slot>
      </span>
      <span v-if="hasLabel" class="mg-button-label">
        <slot>{{ label }}</slot>
      </span>
    </template>
  </button>
</template>

<script setup lang="ts">
import { useSlots, computed } from "vue"
import type { Component } from "vue"

const slots = useSlots()
const hasIconSlot = computed(() => !!slots.icon)
const hasLabel = computed(() => !!props.label || !!slots.default)

type Variant = "filled" | "outline"
type Color = "primary" | "success" | "warning" | "error"
type Size = "sm" | "md" | "lg"

interface Props {
  label?: string
  variant?: Variant
  color?: Color
  size?: Size
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string | Component
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  variant: "filled",
  color: "primary",
  size: "sm",
  disabled: false,
  loading: false,
  block: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit("click", event)
}
</script>