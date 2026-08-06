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
import { watch, onMounted, onUnmounted, ref } from 'vue'
import { useAttrsWithClass } from '../composables/useAttrsWithClass'
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

/** 是否正在退出（触发 CSS 退出动画） */
const leaving = ref(false)

let timer: ReturnType<typeof setTimeout> | null = null

/**
 * 启动自动关闭定时器
 */
const startTimer = () => {
  clearTimer()
  if (props.duration > 0 && modelValue.value) {
    timer = setTimeout(() => {
      handleClose()
    }, props.duration)
  }
}

/**
 * 清除定时器
 */
const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

/**
 * 关闭消息
 * 先播放退出动画，外层的 createOverlay 会在动画结束后清理 DOM
 */
const handleClose = () => {
  clearTimer()
  leaving.value = true
  emit('close')
}

// 监听 modelValue 变化，控制定时器启停
watch(
  () => modelValue.value,
  (val) => {
    if (val) {
      // 打开：启动自动关闭定时器
      startTimer()
    } else {
      // 关闭：清除定时器
      clearTimer()
    }
  },
  { immediate: true },
)

// 组件挂载时，如果初始为显示状态，启动定时器
onMounted(() => {
  if (modelValue.value) {
    startTimer()
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  clearTimer()
})
</script>
