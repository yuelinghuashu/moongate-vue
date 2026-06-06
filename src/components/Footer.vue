<template>
  <footer v-bind="$attrs" class="mg-layout-footer">
    <slot />
  </footer>
</template>

<script setup>
defineOptions({ name: "Footer", inheritAttrs: false })
</script>
