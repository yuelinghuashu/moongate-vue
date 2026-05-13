<template>
  <component
    v-bind="$attrs"
    :is="as"
    class="mg-card"
    :class="{ 'mg-card-hoverable': hoverable }"
  >
    <div v-if="hasHeader" class="mg-card-header">
      <slot name="header" />
    </div>
    <div class="mg-card-body">
      <slot />
    </div>
    <div v-if="hasFooter" class="mg-card-footer">
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup lang="ts">
import { useSlots, computed } from "vue"

const slots = useSlots()

const hasHeader = computed(() => !!slots.header)
const hasFooter = computed(() => !!slots.footer)

interface Props {
  as?: string
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  as: "div",
  hoverable: false,
})
</script>
