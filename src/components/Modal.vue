<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      v-bind="attrsWithoutClass"
      :class="[
        'mg-modal-overlay',
        mergedClass,
        { 'mg-modal-overlay-open': modelValue },
      ]"
      @click.self="handleOverlayClick"
    >
      <div
        class="mg-modal"
        :class="`mg-modal-${size}`"
        role="dialog"
        :aria-label="title"
        aria-modal="true"
      >
        <!-- 头部 -->
        <div class="mg-modal-header">
          <h3 class="mg-modal-title">
            <slot name="title">{{ title }}</slot>
          </h3>
          <button
            v-if="closable"
            class="mg-modal-close"
            aria-label="关闭"
            @click="handleClose"
          >
            &times;
          </button>
        </div>

        <!-- 内容 -->
        <div class="mg-modal-body">
          <slot />
        </div>

        <!-- 底部 -->
        <div v-if="$slots.footer" class="mg-modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineOptions({ name: "Modal", inheritAttrs: false })

import { watch, onBeforeUnmount } from "vue"
import { useAttrsWithClass } from "../composables/useAttrsWithClass"

type Size = "sm" | "md" | "lg" | "xl"

interface Props {
  /** 模态框标题 */
  title?: string
  /** 模态框尺寸 */
  size?: Size
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  size: "md",
  closable: true,
  closeOnOverlay: true,
})

/** v-model 双向绑定（控制显示/隐藏） */
const modelValue = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  /** 模态框打开时触发 */
  open: []
  /** 模态框关闭时触发 */
  close: []
}>()

// 处理外部属性透传（无内部动态类，仅合并外部 class）
const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({}))

/**
 * 监听 modelValue 变化
 * - 打开时：触发 open 事件，禁止 body 滚动
 * - 关闭时：触发 close 事件，恢复 body 滚动
 */
watch(
  () => modelValue.value,
  (val) => {
    if (val) {
      emit("open")
      document.body.style.overflow = "hidden"
    } else {
      emit("close")
      document.body.style.overflow = ""
    }
  },
  { immediate: true },
)

/**
 * 组件卸载时清理
 * 防止组件非正常卸载时 body 滚动锁死
 */
onBeforeUnmount(() => {
  document.body.style.overflow = ""
})

/** 关闭模态框 */
const handleClose = () => {
  modelValue.value = false
}

/** 点击遮罩层关闭 */
const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}
</script>
