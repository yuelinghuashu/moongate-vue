<template>
  <section v-bind="$attrs" class="mg-hero" :aria-labelledby="titleId">
    <div class="mg-hero-container">
      <h1 :id="titleId" class="mg-hero-title">
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
import { useId } from 'vue'
import type { HeroProps } from '../types/props'

defineOptions({ name: 'Hero', inheritAttrs: false })

/** 标题唯一 ID（用于 aria-labelledby 关联） */
const titleId = useId()

defineProps<HeroProps>()
</script>
