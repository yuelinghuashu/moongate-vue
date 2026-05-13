<template>
  <div
    v-bind="$attrs"
    class="mg-tabs"
    :class="[`mg-tabs-${size}`, { 'mg-tabs-card': variant === 'card' }]"
  >
    <!-- 标签栏 -->
    <div class="mg-tabs-header" role="tablist">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        class="mg-tab"
        :class="{ 'mg-tab-active': activeTab === index }"
        :disabled="tab.disabled"
        role="tab"
        :aria-selected="activeTab === index"
        :aria-controls="`mg-tab-panel-${index}`"
        @click="handleTabClick(index)"
      >
        <span v-if="tab.icon" class="mg-tab-icon">{{ tab.icon }}</span>
        <span class="mg-tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- 内容面板（支持懒加载） -->
    <template v-for="(tab, index) in tabs" :key="index">
      <div
        v-if="!lazy || (lazy && renderedPanels.has(index))"
        v-show="activeTab === index"
        :id="`mg-tab-panel-${index}`"
        class="mg-tab-panel"
        :class="{ 'mg-tab-panel-active': activeTab === index }"
        role="tabpanel"
        :aria-labelledby="`mg-tab-${index}`"
      >
        <slot :name="`panel-${index}`">
          {{ tab.content }}
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

type TabSize = "sm" | "md" | "lg"
type TabVariant = "line" | "card"

export interface TabItem {
  label: string
  icon?: string
  content?: string
  disabled?: boolean
}

interface Props {
  tabs?: TabItem[]
  modelValue?: number
  size?: TabSize
  variant?: TabVariant
  lazy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  modelValue: 0,
  size: "md",
  variant: "line",
  lazy: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: number]
  change: [index: number, tab: TabItem]
}>()

const activeTab = ref(props.modelValue)

// 记录已渲染过的面板索引（用于懒加载）
const renderedPanels = ref<Set<number>>(new Set([activeTab.value]))

// 监听外部 v-model 变化
watch(
  () => props.modelValue,
  (val) => {
    if (val !== activeTab.value) {
      activeTab.value = val
    }
  },
)

// 监听内部变化，同步到外部并记录渲染
watch(activeTab, (val) => {
  if (val !== props.modelValue) {
    emit("update:modelValue", val)
  }
  // 懒加载：记录已渲染的面板
  if (props.lazy) {
    renderedPanels.value.add(val)
  }
})

const handleTabClick = (index: number) => {
  if (props.tabs[index]?.disabled) return
  if (activeTab.value === index) return
  activeTab.value = index
  emit("change", index, props.tabs[index])
}
</script>
