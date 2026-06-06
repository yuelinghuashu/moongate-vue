<template>
  <main v-bind="$attrs" class="mg-layout-main">
    <slot />
  </main>
</template>

<script setup>
defineOptions({ name: "Main", inheritAttrs: false })
</script>
