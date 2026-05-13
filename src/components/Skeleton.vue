<template>
  <div v-bind="$attrs" class="mg-skeleton" :class="`mg-skeleton-${type}`">
    <!-- 卡片模式 -->
    <template v-if="type === 'card'">
      <div class="mg-skeleton-card">
        <div v-if="avatar" class="mg-skeleton-avatar" :class="avatarClass" />
        <div class="mg-skeleton-content">
          <div class="mg-skeleton-title mg-skeleton-line" />
          <div
            v-for="i in rows"
            :key="i"
            class="mg-skeleton-line"
            :class="`mg-skeleton-line-${rowSize}`"
          />
        </div>
      </div>
    </template>

    <!-- 列表模式 -->
    <template v-else-if="type === 'list'">
      <div class="mg-skeleton-list">
        <div v-for="i in rows" :key="i" class="mg-skeleton-list-item">
          <div v-if="avatar" class="mg-skeleton-avatar" :class="avatarClass" />
          <div class="mg-skeleton-content" style="flex: 1">
            <div class="mg-skeleton-line mg-skeleton-line-md" />
            <div class="mg-skeleton-line mg-skeleton-line-sm" />
          </div>
        </div>
      </div>
    </template>

    <!-- 默认模式（纯行） -->
    <template v-else>
      <div
        v-for="i in rows"
        :key="i"
        class="mg-skeleton-line"
        :class="[
          i === 1 && title
            ? 'mg-skeleton-title'
            : `mg-skeleton-line-${rowSize}`,
        ]"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

type SkeletonType = "default" | "card" | "list"
type AvatarType = "circle" | "square"
type AvatarSize = "sm" | "md" | "lg"
type RowSize = "sm" | "md" | "lg"

interface Props {
  type?: SkeletonType
  rows?: number
  avatar?: boolean
  avatarShape?: AvatarType
  /** 头像尺寸 */
  avatarSize?: AvatarSize
  /** 第一行是否为标题 */
  title?: boolean
  /** 行宽度（仅 default 模式） */
  rowSize?: RowSize
}

const props = withDefaults(defineProps<Props>(), {
  type: "default",
  rows: 4,
  avatar: false,
  avatarShape: "circle",
  avatarSize: "md",
  title: false,
  rowSize: "md",
})

const avatarClass = computed(() => [
  `mg-skeleton-avatar-${props.avatarSize}`,
  props.avatarShape === "circle"
    ? "mg-skeleton-avatar-circle"
    : "mg-skeleton-avatar-square",
])
</script>
