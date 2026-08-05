<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      ref="overlayRef"
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
        :class="[`mg-drawer-${placement}`, `mg-drawer-${size}`, { 'mg-drawer-open': modelValue }]"
        role="dialog"
        :aria-labelledby="titleId"
        aria-modal="true"
      >
        <div class="mg-drawer-header">
          <slot name="header">
            <span class="mg-drawer-title" :id="titleId">{{ title }}</span>
          </slot>
          <button
            v-if="closable"
            class="mg-drawer-close"
            type="button"
            :aria-label="closeAriaLabel"
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
import { ref, watch, useId } from 'vue'
import { useAttrsWithClass } from '../composables/useAttrsWithClass'
import { useOverlayBehavior } from '../composables/useScrollLock'

defineOptions({ name: 'Drawer', inheritAttrs: false })

defineSlots<{
  default: () => any
  header: () => any
  footer: () => any
}>()

type Placement = 'left' | 'right' | 'top' | 'bottom'
type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface Props {
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
  /** 关闭按钮的 aria-label */
  closeAriaLabel?: string
  /** 是否启用 ESC 键关闭，默认 true */
  enableEsc?: boolean
  /** 是否启用焦点陷阱，默认 true */
  enableFocusTrap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'right',
  size: 'md',
  title: '',
  closable: true,
  closeOnOverlay: true,
  closeAriaLabel: '关闭抽屉',
  enableEsc: true,
  enableFocusTrap: true,
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

/** 浮层容器 DOM 引用（焦点陷阱作用域） */
const overlayRef = ref<HTMLElement | null>(null)

/** 标题元素的唯一 ID（用于 aria-labelledby，SSR 安全） */
const titleId = useId()

// 统一管理滚动锁定 + ESC 关闭 + 焦点陷阱（支持多实例计数器）
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

/** 关闭抽屉 */
function handleClose() {
  modelValue.value = false
}
</script>
