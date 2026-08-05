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
import { ref, watch, useId } from 'vue'
import { useAttrsWithClass } from '../composables/useAttrsWithClass'
import { useOverlayBehavior } from '../composables/useScrollLock'

defineOptions({ name: 'Modal', inheritAttrs: false })

defineSlots<{
  default: () => any
  title: () => any
  footer: () => any
}>()

type Size = 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  /** 模态框标题 */
  title?: string
  /** 模态框尺寸 */
  size?: Size
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

/** 浮层容器 DOM 引用（焦点陷阱作用域） */
const overlayRef = ref<HTMLElement | null>(null)

/** 标题元素的唯一 ID（用于 aria-labelledby，SSR 安全） */
const titleId = useId()

// 处理外部属性透传（无内部动态类，仅合并外部 class）
const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({}))

// 统一管理滚动锁定 + ESC 关闭 + 焦点陷阱
useOverlayBehavior(modelValue as unknown as import('vue').Ref<boolean>, overlayRef, handleClose, {
  enableEsc: props.enableEsc,
  enableFocusTrap: props.enableFocusTrap,
})

/**
 * 监听 modelValue 变化
 * - 打开时：触发 open 事件
 * - 关闭时：触发 close 事件
 */
watch(
  () => modelValue.value,
  (val) => {
    if (val) {
      emit('open')
    } else {
      emit('close')
    }
  },
  { immediate: true },
)

/** 关闭模态框 */
function handleClose() {
  modelValue.value = false
}

/** 点击遮罩层关闭 */
function handleOverlayClick() {
  if (props.closeOnOverlay) {
    handleClose()
  }
}
</script>
