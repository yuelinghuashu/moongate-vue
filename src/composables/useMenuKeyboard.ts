// composables/useMenuKeyboard.ts
import { watch, type Ref } from 'vue'

/**
 * 菜单键盘导航组合式函数。
 *
 * 统一处理：
 * - ↑↓ / ←→ 方向键导航（跳过 disabled 和 separator）
 * - Home / End 跳转首尾可选项
 * - Enter 选中当前高亮项
 * - Escape 关闭菜单
 * - TypeAhead 字符匹配跳转
 *
 * 供 Dropdown、Select（filterable）等菜单类组件共享。
 */
export interface MenuItemBase {
  /** 是否禁用 */
  disabled?: boolean
  /** 是否为分隔线 */
  separator?: boolean
  /** 显示文本（TypeAhead 匹配用） */
  label?: string
}

export interface UseMenuKeyboardOptions<T extends MenuItemBase = MenuItemBase> {
  /** 菜单项列表（响应式） */
  items: Ref<T[]>
  /** 当前高亮索引 */
  activeIndex: Ref<number>
  /** 是否打开（非打开时不响应键盘） */
  isOpen: Ref<boolean>
  /** 选中回调 */
  onSelect: (index: number) => void
  /** 关闭回调 */
  onClose: () => void
}

/**
 * 获取下一个可操作的菜单项索引（跳过 disabled 和 separator）
 * @param items - 菜单项列表
 * @param from - 起始索引
 * @param direction - 方向：1 向下，-1 向上
 */
function findNextEnabled<T extends MenuItemBase>(
  items: T[],
  from: number,
  direction: 1 | -1,
): number {
  const len = items.length
  for (let i = 1; i <= len; i++) {
    let idx = (from + direction * i) % len
    if (idx < 0) idx += len
    const item = items[idx]
    if (item && !item.disabled && !item.separator) {
      return idx
    }
  }
  return from
}

export function useMenuKeyboard<T extends MenuItemBase>(options: UseMenuKeyboardOptions<T>) {
  const { items, activeIndex, isOpen, onSelect, onClose } = options

  /** TypeAhead 缓冲区 */
  let typeAheadBuffer = ''
  let typeAheadTimer: ReturnType<typeof setTimeout> | null = null

  /** 清除 typeAhead 缓冲 */
  const clearTypeAhead = () => {
    if (typeAheadTimer) clearTimeout(typeAheadTimer)
    typeAheadTimer = null
    typeAheadBuffer = ''
  }

  /** 处理键盘事件 */
  const handleKeydown = (event: KeyboardEvent) => {
    if (!isOpen.value) return

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight': {
        event.preventDefault()
        const next = findNextEnabled(items.value, activeIndex.value, 1)
        activeIndex.value = next
        break
      }
      case 'ArrowUp':
      case 'ArrowLeft': {
        event.preventDefault()
        const prev = findNextEnabled(items.value, activeIndex.value, -1)
        activeIndex.value = prev
        break
      }
      case 'Home': {
        event.preventDefault()
        const first = findNextEnabled(items.value, -1, 1)
        activeIndex.value = first
        break
      }
      case 'End': {
        event.preventDefault()
        const last = findNextEnabled(items.value, items.value.length, -1)
        activeIndex.value = last
        break
      }
      case 'Enter':
      case ' ': {
        event.preventDefault()
        const item = items.value[activeIndex.value]
        if (item && !item.disabled && !item.separator) {
          onSelect(activeIndex.value)
        }
        break
      }
      case 'Escape': {
        event.preventDefault()
        onClose()
        break
      }
      default: {
        // TypeAhead：首字符匹配
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          clearTypeAhead()
          typeAheadBuffer += event.key.toLowerCase()
          typeAheadTimer = setTimeout(clearTypeAhead, 500)

          // 从当前位置向后搜索匹配项
          const startIdx = activeIndex.value + 1
          const len = items.value.length
          for (let i = 0; i < len; i++) {
            const idx = (startIdx + i) % len
            const item = items.value[idx]
            if (
              item &&
              !item.disabled &&
              !item.separator &&
              typeof item.label === 'string' &&
              item.label.toLowerCase().startsWith(typeAheadBuffer)
            ) {
              activeIndex.value = idx
              break
            }
          }
        }
        break
      }
    }
  }

  /** 重置高亮到第一个可选项 */
  const resetActive = () => {
    activeIndex.value = findNextEnabled(items.value, -1, 1)
  }

  // 打开时重置高亮
  watch(isOpen, (val) => {
    if (val) {
      resetActive()
    } else {
      clearTypeAhead()
    }
  })

  return {
    /** 键盘事件处理器（绑定到菜单容器） */
    handleKeydown,
    /** 重置高亮到第一个可选项 */
    resetActive,
  }
}
