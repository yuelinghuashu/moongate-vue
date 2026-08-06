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
        :id="`mg-tab-${index}`"
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
import { ref, watch } from 'vue'
import type { Size } from '../types/components'

defineOptions({ name: 'Tabs', inheritAttrs: false })

type Variant = 'line' | 'card'

export interface TabItem {
  /** 标签文字 */
  label: string
  /** 标签图标 */
  icon?: string
  /** 标签内容 */
  content?: string
  /** 是否禁用 */
  disabled?: boolean
}

interface Props {
  /** 标签列表 */
  tabs?: TabItem[]
  /** 尺寸大小 */
  size?: Size
  /** 视觉变体 */
  variant?: Variant
  /** 是否懒加载（只有激活的面板才会渲染内容） */
  lazy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  size: 'md',
  variant: 'line',
  lazy: false,
})

/**
 * v-model 双向绑定（当前激活的标签索引）
 * 使用 defineModel 替代 props.modelValue + emit('update:modelValue')
 */
const modelValue = defineModel<number>({ default: 0 })

const emit = defineEmits<{
  /** 标签切换时触发 */
  change: [index: number, tab: TabItem]
}>()

/**
 * 当前激活的标签索引
 * 使用 ref 存储内部状态，通过 watch 与 modelValue 双向同步
 */
const activeTab = ref(modelValue.value)

/**
 * 记录已渲染过的面板索引（用于懒加载）
 * 初始时记录当前激活的面板
 */
const renderedPanels = ref<Set<number>>(new Set([activeTab.value]))

/**
 * 监听外部 modelValue 变化，同步到内部 activeTab
 */
watch(
  () => modelValue.value,
  (val) => {
    if (val !== activeTab.value) {
      activeTab.value = val
      // 懒加载：外部切换时也要记录面板
      if (props.lazy) {
        renderedPanels.value.add(val)
      }
    }
  },
)

/**
 * 监听内部 activeTab 变化，同步到外部 modelValue
 */
watch(activeTab, (val) => {
  if (val !== modelValue.value) {
    modelValue.value = val
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
  // 禁用状态或已激活不处理
  if (props.tabs[index]?.disabled) return
  if (activeTab.value === index) return

  // 更新激活索引（触发 watch 同步到外部）
  activeTab.value = index
  // 触发 change 事件
  emit('change', index, props.tabs[index])
}
</script>
