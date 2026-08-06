<template>
  <div v-bind="$attrs" class="mg-container" :class="`mg-container-${size}`">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { SizeContainer } from '../types/components'

defineOptions({ name: 'Container', inheritAttrs: false })

interface Props {
  size?: SizeContainer
}

withDefaults(defineProps<Props>(), {
  size: 'lg',
})
</script>
