<template>
  <component
    v-bind="$attrs"
    :is="as"
    :class="{
      'mg-card-hoverable': hoverable,
      'mg-card--body-hidden': hideBody,
    }"
  >
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
import { useSlots, computed } from "vue"

const slots = useSlots()

const hasHeader = computed(() => !!slots.header)
const hasFooter = computed(() => !!slots.footer)

interface Props {
  as?: string
  hoverable?: boolean
  hideBody?: boolean
  hideFooter?: boolean
}

withDefaults(defineProps<Props>(), {
  as: "div",
  hoverable: false,
  hideBody: false,
  hideFooter: false,
})
</script>
