<template>
  <Teleport to="body">
    <div
      v-if="visible"
      v-bind="$attrs"
      class="mg-toast-container"
      :class="{ 'mg-toast-container-bottom': position === 'bottom' }"
    >
      <div
        class="mg-toast"
        :class="[`mg-toast-${type}`, { 'mg-toast-slide-out': isLeaving }]"
      >
        <span class="mg-toast-icon">
          <slot name="icon">
            <span v-if="icon">{{ icon }}</span>
            <span v-else-if="type === 'success'">✓</span>
            <span v-else-if="type === 'error'">✗</span>
            <span v-else-if="type === 'warning'">⚠</span>
            <span v-else-if="type === 'info'">ℹ</span>
          </slot>
        </span>
        <span class="mg-toast-message">
          <slot>{{ message }}</slot>
        </span>
        <button v-if="closable" class="mg-toast-close" @click="handleClose">
          &times;
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"

type ToastType = "success" | "error" | "warning" | "info"
type ToastPosition = "top" | "bottom"

interface Props {
  modelValue?: boolean
  message?: string
  type?: ToastType
  duration?: number
  closable?: boolean
  position?: ToastPosition
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  message: "",
  type: "info",
  duration: 3000,
  closable: false,
  position: "top",
  icon: "",
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  close: []
}>()

const visible = ref(props.modelValue)
const isLeaving = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      visible.value = true
      isLeaving.value = false
      startTimer()
    } else {
      closeToast()
    }
  },
)

let timer: ReturnType<typeof setTimeout> | null = null

const startTimer = () => {
  if (props.duration > 0) {
    timer = setTimeout(() => {
      closeToast()
    }, props.duration)
  }
}

const closeToast = () => {
  isLeaving.value = true
  setTimeout(() => {
    visible.value = false
    isLeaving.value = false
    emit("update:modelValue", false)
    emit("close")
  }, 300)
}

const handleClose = () => {
  if (timer) clearTimeout(timer)
  closeToast()
}

// 清理定时器
onMounted(() => {
  if (visible.value) {
    startTimer()
  }
})
</script>
