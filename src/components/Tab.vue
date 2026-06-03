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
        :class="{ 'mg-tab-active': activeIndex === index }"
        :disabled="tab.disabled"
        role="tab"
        :aria-selected="activeIndex === index"
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
        v-show="activeIndex === index"
        :id="`mg-tab-panel-${index}`"
        class="mg-tab-panel"
        :class="{ 'mg-tab-panel-active': activeIndex === index }"
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

// 当前激活的标签索引
const activeIndex = ref(props.modelValue)

// 记录已渲染过的面板索引（用于懒加载）
const renderedPanels = ref<Set<number>>(new Set([activeIndex.value]))

// 监听外部 v-model 变化，同步内部状态
watch(
  () => props.modelValue,
  (val) => {
    if (val !== activeIndex.value) {
      activeIndex.value = val
    }
  },
)

// 监听内部变化，同步到外部并记录渲染
watch(activeIndex, (val) => {
  if (val !== props.modelValue) {
    emit("update:modelValue", val)
  }
  // 懒加载：记录已渲染的面板
  if (props.lazy) {
    renderedPanels.value.add(val)
  }
})

/**
 * 处理标签点击
 * @param index - 点击的标签索引
 */
const handleTabClick = (index: number) => {
  // 禁用状态不可点击
  if (props.tabs[index]?.disabled) return
  // 已激活无需重复点击
  if (activeIndex.value === index) return
  // 更新激活索引
  activeIndex.value = index
  // 触发 change 事件
  emit("change", index, props.tabs[index])
}
</script>