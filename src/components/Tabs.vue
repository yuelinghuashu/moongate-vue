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
        :id="getTabId(index)"
        :tabindex="activeTab === index ? 0 : -1"
        :aria-selected="activeTab === index"
        :aria-controls="getPanelId(index)"
        @click="handleTabClick(index)"
        @keydown.left.prevent="moveToPreviousTab()"
        @keydown.right.prevent="moveToNextTab()"
        @keydown.home.prevent="moveToFirstTab()"
        @keydown.end.prevent="moveToLastTab()"
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
        :id="getPanelId(index)"
        class="mg-tab-panel"
        :class="{ 'mg-tab-panel-active': activeTab === index }"
        role="tabpanel"
        :aria-labelledby="getTabId(index)"
      >
        <slot :name="`panel-${index}`">
          {{ tab.content }}
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, useId } from 'vue'
import type { TabsProps, TabItem } from '../types/props'

defineOptions({ name: 'Tabs', inheritAttrs: false })

/** 当前 Tabs 实例的唯一基础 ID（SSR 安全，hydration 时服务端与客户端一致） */
const tabsBaseId = useId()

const props = withDefaults(defineProps<TabsProps>(), {
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
 * 获取指定索引标签的唯一 ID（SSR 安全的 useId 前缀 + 索引）
 * 使用 useId 确保同一页面多个 Tabs 实例的 id 不冲突
 */
const getTabId = (index: number): string => `${tabsBaseId}-tab-${index}`

/**
 * 获取指定索引面板的唯一 ID（SSR 安全的 useId 前缀 + 索引）
 */
const getPanelId = (index: number): string => `${tabsBaseId}-panel-${index}`

/**
 * 当前激活的标签索引（内部状态）
 */
const activeTab = ref(modelValue.value)

/**
 * 记录已渲染过的面板索引（用于懒加载）
 * 初始时记录当前激活的面板
 */
const renderedPanels = ref<Set<number>>(new Set([activeTab.value]))

/**
 * 监听外部 modelValue 变化，同步到内部 activeTab
 * 单向数据流：外部 → 内部（内部变化通过 emit 直接同步回外部）
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
 * 处理标签点击
 * @param index - 点击的标签索引
 */
const handleTabClick = (index: number) => {
  // 禁用状态或已激活不处理
  if (props.tabs[index]?.disabled) return
  if (activeTab.value === index) return

  // 更新激活索引
  activateTab(index)
}

/** 激活指定标签（直接更新内部状态 + 同步外部 modelValue + 触发 change 事件） */
const activateTab = (index: number) => {
  activeTab.value = index
  // 直接同步外部 modelValue（替代 watch 双向同步，减少不必要的回调）
  if (modelValue.value !== index) {
    modelValue.value = index
  }
  // 懒加载：记录已渲染的面板
  if (props.lazy) {
    renderedPanels.value.add(index)
  }
  // 触发 change 事件
  emit('change', index, props.tabs[index])
}

/**
 * 查找下一个可用的标签索引（跳过禁用的）
 * @param fromIndex - 起始索引
 * @param direction - 方向：1 向后，-1 向前
 */
const findNextEnabledTab = (fromIndex: number, direction: 1 | -1): number => {
  const length = props.tabs.length
  for (let i = 1; i <= length; i++) {
    let nextIndex = (fromIndex + direction * i) % length
    if (nextIndex < 0) nextIndex += length
    if (!props.tabs[nextIndex]?.disabled) {
      return nextIndex
    }
  }
  return fromIndex // 没有可用标签时保持当前
}

/** 切换到前一个标签（← 方向键） */
const moveToPreviousTab = () => {
  const nextIndex = findNextEnabledTab(activeTab.value, -1)
  if (nextIndex !== activeTab.value) {
    activateTab(nextIndex)
  }
}

/** 切换到下一个标签（→ 方向键） */
const moveToNextTab = () => {
  const nextIndex = findNextEnabledTab(activeTab.value, 1)
  if (nextIndex !== activeTab.value) {
    activateTab(nextIndex)
  }
}

/** 跳转到第一个可用的标签（Home 键） */
const moveToFirstTab = () => {
  const firstEnabled = props.tabs.findIndex((tab) => !tab.disabled)
  if (firstEnabled >= 0 && firstEnabled !== activeTab.value) {
    activateTab(firstEnabled)
  }
}

/** 跳转到最后一个可用的标签（End 键） */
const moveToLastTab = () => {
  // 从后往前查找最后一个可用的标签（兼容 ES2022 以下目标，避免 findLastIndex）
  let lastEnabled = -1
  for (let i = props.tabs.length - 1; i >= 0; i--) {
    if (!props.tabs[i]?.disabled) {
      lastEnabled = i
      break
    }
  }
  if (lastEnabled >= 0 && lastEnabled !== activeTab.value) {
    activateTab(lastEnabled)
  }
}
</script>
