<template>
  <header v-bind="$attrs" class="mg-layout-header" :class="{ 'mg-layout-header-sticky': sticky }">
    <slot />
  </header>
</template>

<script setup lang="ts">
import type { HeaderProps } from '../types/props'

defineOptions({ name: 'Header', inheritAttrs: false })

withDefaults(defineProps<HeaderProps>(), {
  sticky: false,
})
</script>
