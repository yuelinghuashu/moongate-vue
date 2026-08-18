<template>
  <div v-bind="$attrs" class="mg-container" :class="`mg-container-${size}`">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ContainerProps } from '../types/props'

defineOptions({ name: 'Container', inheritAttrs: false })

withDefaults(defineProps<ContainerProps>(), {
  size: 'lg',
})
</script>
