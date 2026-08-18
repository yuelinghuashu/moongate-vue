<template>
  <span v-bind="$attrs" class="mg-badge" :class="[`mg-badge-${color}`, `mg-badge-${size}`]">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import type { BadgeProps } from '../types/props'

defineOptions({ name: 'Badge', inheritAttrs: false })

/** Badge 尺寸只有 sm/md（无 lg） */

withDefaults(defineProps<BadgeProps>(), {
  label: '',
  color: 'primary',
  size: 'md',
})
</script>
