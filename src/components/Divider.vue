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
defineOptions({ name: 'Divider', inheritAttrs: false })

import { useSlots, computed } from 'vue'

const slots = useSlots()
const hasDefault = computed(() => !!slots.default)

interface Props {
  /** 是否为垂直分割线 */
  vertical?: boolean
  /** 是否为虚线 */
  dashed?: boolean
}

withDefaults(defineProps<Props>(), {
  vertical: false,
  dashed: false,
})
</script>
