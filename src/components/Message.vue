<template>
  <div
    v-if="modelValue"
    v-bind="attrsWithoutClass"
    class="mg-message"
    :class="[`mg-message-${type}`, { 'mg-message-leave': leaving }, mergedClass]"
  >
    <span class="mg-message-icon">
      <slot name="icon">
        <span v-if="icon">{{ icon }}</span>
        <span v-else>{{ getDefaultIcon(type) }}</span>
      </slot>
    </span>
    <span class="mg-message-content">
      <slot>{{ message }}</slot>
    </span>
    <button
      v-if="closable"
      class="mg-message-close"
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
import type { MessageProps } from '../types/props'

defineOptions({ name: 'Message', inheritAttrs: false })

const props = withDefaults(defineProps<MessageProps>(), {
  message: '',
  type: 'info',
  duration: 3000,
  closable: false,
  icon: '',
})

/** 全局文案（响应式） */
const texts = useTexts()

/** 关闭按钮 aria-label：prop > 全局配置 */
const closeAriaLabel = computed(() => props.closeAriaLabel ?? texts.value.messageClose)

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
