<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
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
        :class="[
          `mg-drawer-${placement}`,
          `mg-drawer-${size}`,
          { 'mg-drawer-open': modelValue },
        ]"
      >
        <div class="mg-drawer-header">
          <slot name="header">
            <span class="mg-drawer-title">{{ title }}</span>
          </slot>
          <button
            v-if="closable"
            class="mg-drawer-close"
            type="button"
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
import { watch } from "vue"
import { useAttrsWithClass } from "../composables/useAttrsWithClass"

type Placement = "left" | "right" | "top" | "bottom"
type Size = "sm" | "md" | "lg" | "xl" | "full"

interface Props {
  /** 是否显示（v-model） */
  modelValue?: boolean
  /** 抽屉方向 */
  placement?: Placement
  /** 尺寸（宽度或高度） */
  size?: Size
  /** 标题文本 */
  title?: string
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  placement: "right",
  size: "md",
  title: "",
  closable: true,
  closeOnOverlay: true,
})

defineOptions({
  inheritAttrs: false,
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
  { immediate: true },
)

const handleClose = () => {
  emit("update:modelValue", false)
}
</script>
