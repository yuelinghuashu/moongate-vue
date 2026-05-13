<template>
  <header
    v-bind="$attrs"
    class="mg-layout-header"
    :class="{ 'mg-layout-header-sticky': sticky }"
  >
    <slot />
  </header>
</template>

<script setup lang="ts">
interface Props {
  sticky?: boolean
}

withDefaults(defineProps<Props>(), {
  sticky: false,
})
</script>
