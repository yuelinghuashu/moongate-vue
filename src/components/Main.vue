<template>
  <main v-bind="$attrs" class="mg-layout-main">
    <slot />
  </main>
</template>

<script setup lang="ts">
defineOptions({ name: 'Main', inheritAttrs: false })
</script>
