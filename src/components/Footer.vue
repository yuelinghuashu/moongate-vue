<template>
  <footer v-bind="$attrs" class="mg-layout-footer">
    <slot />
  </footer>
</template>

<script setup lang="ts">
defineOptions({ name: 'Footer', inheritAttrs: false })
</script>
