<template>
  <section class="mg-hero">
    <div class="mg-hero-container">
      <h1 class="mg-hero-title">
        <slot name="title">{{ title }}</slot>
      </h1>
      <p class="mg-hero-description">
        <slot name="description">{{ description }}</slot>
      </p>
      <div class="mg-hero-actions">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: "Hero" })

interface Props {
  title?: string
  description?: string
}

defineProps<Props>()
</script>
