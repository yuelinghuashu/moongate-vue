<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      ref="overlayRef"
      v-bind="attrsWithoutClass"
      :class="['mg-modal-overlay', mergedClass, { 'mg-modal-overlay-open': modelValue }]"
      @click.self="handleOverlayClick"
    >
      <div
        class="mg-modal"
        :class="`mg-modal-${size}`"
        role="dialog"
        :aria-labelledby="titleId"
        :aria-describedby="contentId"
        aria-modal="true"
      >
        <!-- 头部 -->
        <div class="mg-modal-header">
          <h3 class="mg-modal-title" :id="titleId">
            <slot name="title">{{ title }}</slot>
          </h3>
          <button
            v-if="closable"
            type="button"
            class="mg-modal-close"
            :aria-label="closeAriaLabel"
            @click="handleClose"
          >
            &times;
          </button>
        </div>

        <!-- 内容 -->
        <div class="mg-modal-body" :id="contentId">
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
import { useId } from 'vue'
import { useOverlayComponent } from '../composables/useOverlayComponent'
import type { SizeXl } from '../types/components'

defineOptions({ name: 'Modal', inheritAttrs: false })

/** 内容区唯一 ID（SSR 安全，用于 aria-describedby 关联正文内容） */
const contentId = useId()

defineSlots<{
  default: () => any
  title: () => any
  footer: () => any
}>()

interface Props {
  /** 模态框标题 */
  title?: string
  /** 模态框尺寸 */
  size?: SizeXl
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnOverlay?: boolean
  /** 关闭按钮的 aria-label */
  closeAriaLabel?: string
  /** 是否启用 ESC 键关闭，默认 true */
  enableEsc?: boolean
  /** 是否启用焦点陷阱，默认 true */
  enableFocusTrap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  closeAriaLabel: '关闭',
  enableEsc: true,
  enableFocusTrap: true,
})

/** v-model 双向绑定（控制显示/隐藏） */
const modelValue = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  /** 模态框打开时触发 */
  open: []
  /** 模态框关闭时触发 */
  close: []
}>()

// 共享浮层逻辑：事件触发 + 标题 ID + 属性透传 + 滚动锁定/ESC/焦点陷阱
const { overlayRef, titleId, attrsWithoutClass, mergedClass, handleClose } = useOverlayComponent(
  modelValue,
  {
    onOpen: () => emit('open'),
    onClose: () => emit('close'),
  },
  () => ({}),
  {
    enableEsc: props.enableEsc,
    enableFocusTrap: props.enableFocusTrap,
  },
)

/** 点击遮罩层关闭 */
function handleOverlayClick() {
  if (props.closeOnOverlay) {
    handleClose()
  }
}
</script>
