<template>
  <Teleport to="body">
    <div
      v-if="visible"
      v-bind="attrsWithoutClass"
      :class="['mg-message-container', mergedClass]"
    >
      <div
        class="mg-message"
        :class="[`mg-message-${type}`, { 'mg-message-leave': isLeaving }]"
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
        <button v-if="closable" class="mg-message-close" @click="handleClose">
          &times;
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineOptions({ name: "Message", inheritAttrs: false })


import { ref, watch, onMounted, onUnmounted } from "vue"
import { useAttrsWithClass } from "../composables/useAttrsWithClass"

type MessageType = "success" | "error" | "warning" | "info"

interface Props {
  /** 是否显示（v-model） */
  modelValue?: boolean
  /** 消息内容 */
  message?: string
  /** 消息类型 */
  type?: MessageType
  /** 持续时间（毫秒），0 表示不自动关闭 */
  duration?: number
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 自定义图标 */
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  message: "",
  type: "info",
  duration: 3000,
  closable: false,
  icon: "",
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  /** 关闭事件 */
  close: []
}>()

const visible = ref(props.modelValue)
const isLeaving = ref(false)

// 处理外部属性透传
const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({}))

let timer: ReturnType<typeof setTimeout> | null = null

/**
 * 启动自动关闭定时器
 */
const startTimer = () => {
  if (props.duration > 0) {
    timer = setTimeout(() => {
      closeMessage()
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
 */
const closeMessage = () => {
  // 播放退出动画
  isLeaving.value = true

  // 等待动画结束后隐藏
  setTimeout(() => {
    visible.value = false
    isLeaving.value = false
    clearTimer()
    emit("update:modelValue", false)
    emit("close")
  }, 300)
}

/**
 * 手动关闭（点击关闭按钮）
 */
const handleClose = () => {
  clearTimer()
  closeMessage()
}

// 监听外部 v-model 变化
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      visible.value = true
      isLeaving.value = false
      startTimer()
    } else {
      closeMessage()
    }
  },
)

// 组件挂载时，如果初始为显示状态，启动定时器
onMounted(() => {
  if (visible.value) {
    startTimer()
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  clearTimer()
})
</script>