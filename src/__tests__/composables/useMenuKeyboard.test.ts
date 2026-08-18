import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useMenuKeyboard } from '../../composables/useMenuKeyboard'
import type { MenuItemBase } from '../../composables/useMenuKeyboard'

function createItems(overrides?: Partial<MenuItemBase>[]): MenuItemBase[] {
  const defaults: MenuItemBase[] = [
    { label: '编辑', separator: false, disabled: false },
    { label: '复制', separator: false, disabled: false },
    { label: '', separator: true },
    { label: '删除', separator: false, disabled: false },
    { label: '归档', separator: false, disabled: true },
  ]
  return defaults.map((d, i) => ({ ...d, ...overrides?.[i] }))
}

describe('useMenuKeyboard', () => {
  let items: ReturnType<typeof ref<MenuItemBase[]>>
  let activeIndex: ReturnType<typeof ref<number>>
  let isOpen: ReturnType<typeof ref<boolean>>
  let onSelect: ReturnType<typeof vi.fn>
  let onClose: ReturnType<typeof vi.fn>
  let keyboard: ReturnType<typeof useMenuKeyboard>

  beforeEach(() => {
    items = ref(createItems())
    activeIndex = ref(0)
    isOpen = ref(false)
    onSelect = vi.fn()
    onClose = vi.fn()
    keyboard = useMenuKeyboard({ items, activeIndex, isOpen, onSelect, onClose })
  })

  it('关闭状态不响应键盘', () => {
    isOpen.value = false
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    keyboard.handleKeydown(event)
    expect(activeIndex.value).toBe(0)
  })

  it('ArrowDown 跳转到下一个可选项（跳过分隔线）', () => {
    isOpen.value = true
    activeIndex.value = 0

    keyboard.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(activeIndex.value).toBe(1) // 编辑 → 复制

    keyboard.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(activeIndex.value).toBe(3) // 复制 → 跳过分隔线 → 删除
  })

  it('ArrowUp 跳转到上一个可选项', () => {
    isOpen.value = true
    activeIndex.value = 3 // 删除

    keyboard.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    expect(activeIndex.value).toBe(1) // 删除 → 跳过分隔线 → 复制
  })

  it('Home 跳转到第一个可选项', () => {
    isOpen.value = true
    activeIndex.value = 3

    keyboard.handleKeydown(new KeyboardEvent('keydown', { key: 'Home' }))
    expect(activeIndex.value).toBe(0) // 编辑
  })

  it('End 跳转到最后一个可选项（跳过禁用项）', () => {
    isOpen.value = true
    activeIndex.value = 0

    keyboard.handleKeydown(new KeyboardEvent('keydown', { key: 'End' }))
    expect(activeIndex.value).toBe(3) // 删除（归档被禁用）
  })

  it('Enter 选中当前高亮项', () => {
    isOpen.value = true
    activeIndex.value = 1

    keyboard.handleKeydown(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(onSelect).toHaveBeenCalledWith(1)
    // onClose 由组件层调用，不在 composable 中
  })

  it('Escape 关闭菜单', () => {
    isOpen.value = true
    keyboard.handleKeydown(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('禁用项不可被 Enter 选中', () => {
    isOpen.value = true
    activeIndex.value = 4 // 归档（disabled）

    keyboard.handleKeydown(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('TypeAhead 首字符匹配', () => {
    isOpen.value = true
    activeIndex.value = 0

    // 输入 '删' 匹配 '删除'
    keyboard.handleKeydown(new KeyboardEvent('keydown', { key: '删' }))
    expect(activeIndex.value).toBe(3)
  })

  it('打开时重置高亮到第一个可选项', async () => {
    activeIndex.value = 3
    isOpen.value = true
    await nextTick() // 等待 watch 回调执行
    expect(activeIndex.value).toBe(0)
  })
})
