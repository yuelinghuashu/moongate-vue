<template>
  <nav v-bind="$attrs" class="mg-series-nav" aria-label="series">
    <!-- 可选标题（系列名） -->
    <div v-if="title || $slots.title" class="mg-series-nav-head">
      <slot name="title">{{ title }}</slot>
    </div>

    <ol class="mg-series-nav-list">
      <template v-for="(item, index) in items" :key="item.key">
        <!-- 可见行：始终保留首项、末项、激活项；其余折叠为单个占位 -->
        <li
          v-if="isVisible(index)"
          class="mg-series-nav-item"
          :class="{
            'mg-series-nav-item-active': item.key === active,
            'mg-series-nav-item-disabled': item.disabled,
          }"
          :aria-current="item.key === active ? 'true' : undefined"
        >
          <span v-if="numbered" class="mg-series-nav-index" aria-hidden="true">
            {{ index + 1 }}
          </span>
          <slot name="item" :item="item" :index="index">
            <a v-if="item.href && !item.disabled" class="mg-series-nav-link" :href="item.href">
              {{ item.label }}
            </a>
            <span v-else class="mg-series-nav-label">{{ item.label }}</span>
          </slot>
        </li>

        <!-- 单一收缩占位行：仅当存在被折叠项时，在"中间"渲染一次 -->
        <li v-if="isCollapsedGap(index)" class="mg-series-nav-item mg-series-nav-gap">
          <button
            type="button"
            class="mg-series-nav-toggle"
            :aria-expanded="expanded ? 'true' : 'false'"
            @click="toggleExpanded"
          >
            {{ gapText }}
          </button>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SeriesNavProps } from '../types/props'

defineOptions({ name: 'SeriesNav', inheritAttrs: false })

const props = withDefaults(defineProps<SeriesNavProps>(), {
  items: () => [],
  active: undefined,
  title: undefined,
  numbered: true,
  visibleCount: 0,
})

/**
 * 是否展开被折叠的中间项。
 * SSR 下默认折叠，确保服务端与客户端首屏一致；仅在客户端交互后展开。
 */
const expanded = ref(false)

const toggleExpanded = () => {
  expanded.value = !expanded.value
}

/** 是否启用窗口化折叠 */
const isCollapsible = computed(() => props.visibleCount > 0)

/**
 * 是否存在需要折叠的项（未展开且超过阈值）。
 * 折叠窗口 = 首项 + 末项 + 激活项及其相邻项，其余折叠。
 */
const contentLength = computed(() => props.items.length)

/** 折叠间隙的占位文本：如 "2 more parts..." */
const gapText = computed(() => {
  if (!isCollapsible.value) return ''
  const hidden = hiddenIndices.value
  return `${hidden.size} more part${hidden.size === 1 ? '' : 's'}...`
})

/**
 * 计算出应折叠（隐藏）的下标集合。
 *
 * 单一收缩策略（与 dev.to 一致）：始终保留「首项 + 末项 + 激活项」，
 * 其余项统一折叠为**一个** `N more part(s)...` 占位。
 * 不去保留激活项的相邻项，避免隐藏项被激活项拆成多段而出现多个收缩结构。
 * 在没有激活项时必须展示首项，避免整列表被折成空白。
 */
const hiddenIndices = computed(() => {
  if (!isCollapsible.value || expanded.value) return new Set<number>()
  const n = contentLength.value
  if (n <= props.visibleCount) return new Set<number>()

  const activeIndex = props.items.findIndex((i) => i.key === props.active)
  const keep = new Set<number>()

  // 首末项始终保留
  keep.add(0)
  keep.add(n - 1)

  // 激活项保留（不保留其相邻项，确保折叠项聚成单一连续区段）
  if (activeIndex >= 0) {
    keep.add(activeIndex)
  }

  const hidden = new Set<number>()
  for (let i = 0; i < n; i++) {
    if (!keep.has(i)) hidden.add(i)
  }
  return hidden
})

const isVisible = (index: number) => !hiddenIndices.value.has(index)

/**
 * 单一收缩占位行的渲染位置：取第一个被折叠项的下标。
 * 隐藏项集合无论被激活项分成几段，都只这里渲染一次 gap，
 * 从而确保列表里最多只有一个 "N more part(s)..." 收缩结构。
 */
const gapIndex = computed(() => {
  const hidden = hiddenIndices.value
  if (hidden.size === 0) return -1
  // 找到最小的隐藏项下标
  for (let i = 0; i < contentLength.value; i++) {
    if (hidden.has(i)) return i
  }
  return -1
})

/** 是否在当前项渲染单一收缩占位 */
const isCollapsedGap = (index: number) => index === gapIndex.value
</script>
