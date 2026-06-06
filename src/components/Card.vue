<template>
  <component v-bind="attrsWithoutClass" :is="as" :class="mergedClass">
    <!-- header 区域 -->
    <div
      v-if="hasHeader"
      class="mg-card-header"
      :class="{ 'mg-card-header--no-border': hideBody }"
    >
      <slot name="header" />
    </div>

    <!-- body 区域：添加 hideBody 控制 -->
    <div v-if="!hideBody" class="mg-card-body">
      <slot />
    </div>

    <!-- footer 区域：添加 hideFooter 控制，且只有存在 footer 插槽时才显示 -->
    <div v-if="!hideFooter && hasFooter" class="mg-card-footer">
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup lang="ts">
defineOptions({ name: "Card", inheritAttrs: false })

import { useSlots, computed } from "vue"
import { useAttrsWithClass } from "../composables/useAttrsWithClass"

const slots = useSlots()

const hasHeader = computed(() => !!slots.header)
const hasFooter = computed(() => !!slots.footer)

interface Props {
  as?: string
  hoverable?: boolean
  hideBody?: boolean
  hideFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: "div",
  hoverable: false,
  hideBody: false,
  hideFooter: false,
})

const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({
  "mg-card-hoverable": props.hoverable,
  "mg-card--body-hidden": props.hideBody,
}))
</script>
