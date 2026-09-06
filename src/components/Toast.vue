<template>
  <div
    v-if="modelValue"
    v-bind="attrsWithoutClass"
    class="mg-toast"
    :class="[`mg-toast-${type}`, { 'mg-toast-leave': leaving }, mergedClass]"
    :role="type === 'error' ? 'alert' : 'status'"
  >
    <span class="mg-toast-icon">
      <slot name="icon">
        <span v-if="icon">{{ icon }}</span>
        <span v-else>{{ getDefaultIcon(type) }}</span>
      </slot>
    </span>
    <span class="mg-toast-message">
      <slot>{{ message }}</slot>
    </span>
    <button
      v-if="closable"
      class="mg-toast-close"
      :aria-label="closeAriaLabel"
      @click="handleClose"
    >
      &times;
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAttrsWithClass } from '../composables/useAttrsWithClass'
import { useNotification } from '../composables/useNotification'
import { useTexts, getDefaultIcon } from '../config'
import type { ToastProps } from '../types/props'

defineOptions({ name: 'Toast', inheritAttrs: false })

defineSlots<{
  /** 消息内容（优先于 message prop） */
  default: () => any
  /** 自定义图标 */
  icon: () => any
}>()

const props = withDefaults(defineProps<ToastProps>(), {
  message: '',
  type: 'info',
  duration: 3000,
  closable: false,
  position: 'top',
  icon: '',
})

/** 全局文案（响应式） */
const texts = useTexts()

/** 关闭按钮 aria-label：prop > 全局配置 */
const closeAriaLabel = computed(() => props.closeAriaLabel ?? texts.value.toastClose)

/** v-model 双向绑定（控制显示/隐藏） */
const modelValue = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  /** 关闭事件 */
  close: []
}>()

// 处理外部属性透传（无内部动态类，仅合并外部 class）
const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({}))

// 共享通知逻辑：定时器 / 退场动画 / 生命周期清理（SSR 安全）
const { leaving, handleClose } = useNotification(
  modelValue,
  () => props.duration,
  () => emit('close'),
)
</script>
