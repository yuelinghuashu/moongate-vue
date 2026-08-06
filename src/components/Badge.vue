<template>
  <span v-bind="$attrs" class="mg-badge" :class="[`mg-badge-${color}`, `mg-badge-${size}`]">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import type { AddonColor, Size } from '../types/components'

defineOptions({ name: 'Badge', inheritAttrs: false })

/** Badge 尺寸只有 sm/md（无 lg） */
type BadgeSize = Exclude<Size, 'lg'>

interface Props {
  label?: string
  color?: AddonColor
  size?: BadgeSize
}

withDefaults(defineProps<Props>(), {
  label: '',
  color: 'primary',
  size: 'md',
})
</script>
