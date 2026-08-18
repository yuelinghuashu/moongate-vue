<template>
  <div
    v-bind="$attrs"
    v-if="!vertical"
    class="mg-divider"
    :class="{ 'mg-divider-dashed': dashed }"
    role="separator"
  >
    <span v-if="hasDefault" class="mg-divider-text">
      <slot />
    </span>
  </div>
  <span v-else class="mg-divider-vertical" role="separator" />
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue'
import type { DividerProps } from '../types/props'

defineOptions({ name: 'Divider', inheritAttrs: false })

const slots = useSlots()
const hasDefault = computed(() => !!slots.default)

withDefaults(defineProps<DividerProps>(), {
  vertical: false,
  dashed: false,
})
</script>
