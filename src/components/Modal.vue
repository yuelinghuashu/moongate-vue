<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      v-bind="attrsWithoutClass"
      :class="[
        'mg-modal-overlay',
        mergedClass,
        { 'mg-modal-overlay-open': modelValue },
      ]"
      @click.self="handleOverlayClick"
    >
      <div
        class="mg-modal"
        :class="`mg-modal-${size}`"
        role="dialog"
        :aria-label="title"
        aria-modal="true"
      >
        <!-- 头部 -->
        <div class="mg-modal-header">
          <h3 class="mg-modal-title">
            <slot name="title">{{ title }}</slot>
          </h3>
          <button
            v-if="closable"
            class="mg-modal-close"
            aria-label="关闭"
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
defineOptions({ name: "Modal", inheritAttrs: false })

import { watch } from "vue"
import { useAttrsWithClass } from "../composables/useAttrsWithClass"

type Size = "sm" | "md" | "lg" | "xl"

interface Props {
  modelValue?: boolean
  title?: string
  size?: Size
  closable?: boolean
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: "",
  size: "md",
  closable: true,
  closeOnOverlay: true,
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  open: []
  close: []
}>()

// 处理外部属性透传（无内部动态类，仅合并外部 class）
const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({}))

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      emit("open")
      document.body.style.overflow = "hidden"
    } else {
      emit("close")
      document.body.style.overflow = ""
    }
  },
)

const handleClose = () => {
  emit("update:modelValue", false)
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}
</script>
