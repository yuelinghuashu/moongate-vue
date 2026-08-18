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
        @click.self="closeOnOverlay && handleClose()"
      />
      <!-- 抽屉内容 -->
      <div
        class="mg-drawer"
        :class="[`mg-drawer-${placement}`, `mg-drawer-${size}`, { 'mg-drawer-open': modelValue }]"
        role="dialog"
        :aria-labelledby="titleId"
        :aria-describedby="contentId"
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
            :aria-label="closeAriaLabelValue"
            @click="handleClose"
          >
            &times;
          </button>
        </div>
        <div class="mg-drawer-body" :id="contentId">
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
import { computed, useId } from 'vue'
import { useOverlayComponent } from '../composables/useOverlayComponent'
import { useTexts } from '../config'
import type { DrawerProps } from '../types/props'

defineOptions({ name: 'Drawer', inheritAttrs: false })

/** 内容区唯一 ID（SSR 安全，用于 aria-describedby 关联正文内容） */
const contentId = useId()

defineSlots<{
  default: () => any
  header: () => any
  footer: () => any
}>()

const props = withDefaults(defineProps<DrawerProps>(), {
  placement: 'right',
  size: 'md',
  title: '',
  closable: true,
  closeOnOverlay: true,
  enableEsc: true,
  enableFocusTrap: true,
})

/** 全局文案（响应式） */
const texts = useTexts()

/** 关闭按钮 aria-label：prop > 全局配置 */
const closeAriaLabelValue = computed(() => props.closeAriaLabel ?? texts.value.drawerClose)

/** v-model 双向绑定（由 defineModel 自动处理 update:modelValue） */
const modelValue = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  /** 抽屉打开时触发 */
  open: []
  /** 抽屉关闭时触发 */
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
</script>
