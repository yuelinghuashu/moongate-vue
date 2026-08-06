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
        <span v-else-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✗</span>
        <span v-else-if="type === 'warning'">⚠</span>
        <span v-else-if="type === 'info'">ℹ</span>
      </slot>
    </span>
    <span class="mg-message-content">
      <slot>{{ message }}</slot>
    </span>
    <button v-if="closable" class="mg-message-close" @click="handleClose">&times;</button>
  </div>
</template>

<script setup lang="ts">
import { useAttrsWithClass } from '../composables/useAttrsWithClass'
import { useNotification } from '../composables/useNotification'
import type { NotificationType } from '../types/components'

defineOptions({ name: 'Message', inheritAttrs: false })

interface Props {
  /** 消息内容 */
  message?: string
  /** 消息类型 */
  type?: NotificationType
  /** 持续时间（毫秒），0 表示不自动关闭 */
  duration?: number
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 自定义图标 */
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: '',
  type: 'info',
  duration: 3000,
  closable: false,
  icon: '',
})

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
