<template>
  <div
    ref="triggerRef"
    class="mg-dropdown-trigger"
    :class="{ 'mg-dropdown-disabled': disabled }"
    :aria-expanded="open"
    :aria-controls="menuId"
    aria-haspopup="menu"
    @click="toggle"
    @keydown="handleKeydown"
  >
    <slot />

    <Teleport to="body">
      <div
        v-if="open"
        :id="menuId"
        ref="floatingRef"
        class="mg-dropdown-menu"
        :class="[`mg-dropdown-menu-${size}`, `mg-dropdown-${currentPlacement}`]"
        :style="menuStyle"
        role="menu"
        :aria-label="ariaLabel || undefined"
        @click.stop
        @mouseenter="cancelHideTimer"
        @mouseleave="startHideTimer"
      >
        <template v-for="(item, index) in options" :key="item.key">
          <!-- 分隔线 -->
          <div
            v-if="item.separator"
            class="mg-dropdown-separator"
            role="separator"
            aria-orientation="horizontal"
          />
          <!-- 菜单项 -->
          <div
            v-else
            class="mg-dropdown-item"
            :class="{
              'mg-dropdown-item-active': activeIndex === index,
              'mg-dropdown-item-disabled': item.disabled,
              'mg-dropdown-item-danger': item.danger,
            }"
            role="menuitem"
            :tabindex="activeIndex === index ? 0 : -1"
            :aria-disabled="item.disabled || undefined"
            @click="handleSelect(item, index)"
            @mouseenter="activeIndex = index"
          >
            <slot name="item" :item="item" :index="index" :active="activeIndex === index">
              <span v-if="item.icon" class="mg-dropdown-item-icon">{{ item.icon }}</span>
              <span class="mg-dropdown-item-label">{{ item.label }}</span>
            </slot>
          </div>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, useId } from 'vue'
import { useFloating } from '../composables/useFloating'
import { useMenuKeyboard } from '../composables/useMenuKeyboard'
import type { DropdownProps } from '../types/props'
import type { DropdownOption } from '../types/components'

defineOptions({ name: 'Dropdown', inheritAttrs: false })

/** 菜单唯一 ID（SSR 安全，用于 aria-controls / aria-labelledby） */
const menuId = `mg-dropdown-${useId()}`

defineSlots<{
  default: () => any
  item: (props: { item: DropdownOption; index: number; active: boolean }) => any
}>()

// ==================== 类型 ====================

const props = withDefaults(defineProps<DropdownProps>(), {
  options: () => [],
  placement: 'bottom-start',
  size: 'md',
  disabled: false,
  ariaLabel: '',
})

// ==================== v-model ====================

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  /** 选中菜单项 */
  select: [key: string, option: DropdownOption]
  /** 菜单展开 */
  open: []
  /** 菜单关闭 */
  close: []
}>()

// ==================== 位置计算 ====================

/** 将 DropdownPlacement 拆分为 useFloating 需要的 basePlacement + 对齐 */
const basePlacement = computed(() => {
  const p = props.placement
  if (p.startsWith('top')) return 'top' as const
  if (p.startsWith('bottom')) return 'bottom' as const
  if (p.startsWith('left')) return 'left' as const
  return 'right' as const
})

const alignment = computed(() => {
  const p = props.placement
  if (p.endsWith('-start')) return 'start'
  if (p.endsWith('-end')) return 'end'
  return 'center'
})

// ==================== 共享浮层逻辑 ====================

// 直接使用 useFloating 返回的 ref，模板绑定 triggerRef / floatingRef
const {
  triggerRef,
  floatingRef,
  currentPlacement,
  floatStyle,
  show,
  hide,
  startHideTimer,
  cancelHideTimer,
} = useFloating({
  placement: () => basePlacement.value,
  offset: () => 4,
  boundsCorrection: true,
  awaitNextTick: true,
})

/** 菜单样式（含 start/end 对齐偏移） */
const menuStyle = computed(() => {
  const base = floatStyle.value
  if (alignment.value === 'center') return base

  // start/end 对齐：调整 left/top
  if (!triggerRef.value || !floatingRef.value) return base

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const style = { ...base }

  if (basePlacement.value === 'bottom' || basePlacement.value === 'top') {
    // 水平方向对齐
    if (alignment.value === 'start') {
      style.left = `${triggerRect.left}px`
    } else if (alignment.value === 'end') {
      const menuWidth = floatingRef.value.offsetWidth || 150
      style.left = `${triggerRect.right - menuWidth}px`
    }
  } else {
    // 垂直方向对齐
    if (alignment.value === 'start') {
      style.top = `${triggerRect.top}px`
    } else if (alignment.value === 'end') {
      const menuHeight = floatingRef.value.offsetHeight || 200
      style.top = `${triggerRect.bottom - menuHeight}px`
    }
  }

  return style
})

// ==================== 高亮索引 ====================

const activeIndex = ref(-1)

// ==================== 键盘导航 ====================

const { handleKeydown: menuKeydown, resetActive } = useMenuKeyboard({
  items: computed(() => props.options),
  activeIndex,
  isOpen: open,
  onSelect: (index) => {
    const item = props.options[index]
    if (item && !item.disabled && !item.separator) {
      emit('select', item.key, item)
      closeMenu()
    }
  },
  onClose: closeMenu,
})

/** 处理键盘事件（传递给菜单容器） */
const handleKeydown = (event: KeyboardEvent) => {
  if (!open.value) {
    // 触发区键盘打开
    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      openMenu()
    }
    return
  }
  menuKeydown(event)
}

// ==================== 开关逻辑 ====================

function openMenu() {
  if (props.disabled) return
  open.value = true
  emit('open')
  nextTick(() => {
    show()
    resetActive()
    // 聚焦菜单容器以接收键盘事件
    floatingRef.value?.focus()
  })
}

function closeMenu() {
  open.value = false
  hide()
  emit('close')
  // 焦点回到触发元素
  nextTick(() => {
    triggerRef.value?.focus()
  })
}

function toggle() {
  if (props.disabled) return
  if (open.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

// ==================== 点击外部关闭 ====================

/** SSR 安全 */
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

const handleClickOutside = (event: MouseEvent) => {
  if (!open.value) return
  const target = event.target as Node
  if (
    triggerRef.value &&
    !triggerRef.value.contains(target) &&
    floatingRef.value &&
    !floatingRef.value.contains(target)
  ) {
    closeMenu()
  }
}

onMounted(() => {
  if (isBrowser) {
    document.addEventListener('click', handleClickOutside, true)
  }
})

onUnmounted(() => {
  if (isBrowser) {
    document.removeEventListener('click', handleClickOutside, true)
  }
})

// ==================== 选中处理 ====================

function handleSelect(item: DropdownOption, _index: number) {
  if (item.disabled || item.separator) return
  emit('select', item.key, item)
  closeMenu()
}

// ==================== 监听外部 open 变化 ====================

watch(
  () => open.value,
  (val) => {
    if (val) {
      show()
    } else {
      hide()
    }
  },
)
</script>
