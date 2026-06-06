<template>
  <div v-bind="$attrs" class="mg-container" :class="`mg-container-${size}`">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "Container", inheritAttrs: false })

type Size = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"

interface Props {
  size?: Size
}

withDefaults(defineProps<Props>(), {
  size: "lg",
})
</script>
