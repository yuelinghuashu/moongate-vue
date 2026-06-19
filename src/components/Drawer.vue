<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      v-bind="attrsWithoutClass"
      :class="['mg-drawer-root', mergedClass]"
    >
      <!-- 遮罩层 -->
      <div
        class="mg-drawer-overlay"
        :class="{ 'mg-drawer-overlay-open': modelValue }"
        @click="closeOnOverlay && handleClose()"
      />
      <!-- 抽屉内容 -->
      <div
        class="mg-drawer"
        :class="[
          `mg-drawer-${placement}`,
          `mg-drawer-${size}`,
          { 'mg-drawer-open': modelValue },
        ]"
      >
        <div class="mg-drawer-header">
          <slot name="header">
            <span class="mg-drawer-title">{{ title }}</span>
          </slot>
          <button
            v-if="closable"
            class="mg-drawer-close"
            type="button"
            @click="handleClose"
          >
            &times;
          </button>
        </div>
        <div class="mg-drawer-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="mg-drawer-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineOptions({ name: "Drawer", inheritAttrs: false })

import { watch, onBeforeUnmount } from "vue"
import { useAttrsWithClass } from "../composables/useAttrsWithClass"

type Placement = "left" | "right" | "top" | "bottom"
type Size = "sm" | "md" | "lg" | "xl" | "full"

interface Props {
  /** 是否显示（v-model 双向绑定） */
  modelValue?: boolean
  /** 抽屉弹出方向 */
  placement?: Placement
  /** 抽屉尺寸（宽度/高度） */
  size?: Size
  /** 标题文本 */
  title?: string
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  placement: "right",
  size: "md",
  title: "",
  closable: true,
  closeOnOverlay: true,
})

/** v-model 双向绑定（由 defineModel 自动处理 update:modelValue） */
const modelValue = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  /** 抽屉打开时触发 */
  open: []
  /** 抽屉关闭时触发 */
  close: []
}>()

const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({}))

/**
 * 处理键盘事件（ESC 键关闭）
 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && modelValue.value) {
    handleClose()
  }
}

/**
 * 监听 modelValue 变化
 * - 打开时：触发 open 事件，禁止 body 滚动，添加键盘监听
 * - 关闭时：触发 close 事件，恢复 body 滚动，移除键盘监听
 */
watch(
  () => modelValue.value,
  (val) => {
    if (val) {
      emit("open")
      document.body.style.overflow = "hidden"
      document.addEventListener("keydown", handleKeydown)
    } else {
      emit("close")
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleKeydown)
    }
  },
  { immediate: true },
)

/**
 * 组件卸载时清理
 * 防止组件非正常卸载时 body 滚动锁死或键盘监听残留
 */
onBeforeUnmount(() => {
  document.body.style.overflow = ""
  document.removeEventListener("keydown", handleKeydown)
})

/** 关闭抽屉 */
const handleClose = () => {
  modelValue.value = false
}
</script>
