import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Dropdown from '../../components/Dropdown.vue'
import Button from '../../components/Button.vue'

const mockRects = () => {
  vi.spyOn(window.HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.classList.contains('mg-dropdown-menu')) {
      return { top: 60, left: 100, right: 250, bottom: 200, width: 150, height: 140 } as DOMRect
    }
    return { top: 50, left: 100, right: 200, bottom: 80, width: 100, height: 30 } as DOMRect
  })
  vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024)
  vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(768)
}

const sampleOptions = [
  { key: 'edit', label: '编辑' },
  { key: 'copy', label: '复制' },
  { key: '__sep__', separator: true as const },
  { key: 'delete', label: '删除', danger: true },
]

describe('Dropdown', () => {
  let currentWrapper: VueWrapper | null = null

  function mountDropdown(props: Record<string, unknown> = {}) {
    if (currentWrapper) {
      currentWrapper.unmount()
      currentWrapper = null
    }
    document.body.innerHTML = ''
    currentWrapper = mount(Dropdown, {
      props: { options: sampleOptions, ...props },
      slots: {
        default: h(Button, { label: '打开菜单' }),
      },
      attachTo: document.body,
    })
    return currentWrapper
  }

  async function openDropdown(wrapper: VueWrapper) {
    await wrapper.find('.mg-dropdown-trigger').trigger('click')
    await nextTick()
  }

  beforeEach(() => {
    mockRects()
  })

  afterEach(() => {
    currentWrapper?.unmount()
    currentWrapper = null
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('初始状态菜单不显示', () => {
    mountDropdown()
    expect(document.body.querySelector('.mg-dropdown-menu')).toBeNull()
  })

  it('点击触发区打开菜单', async () => {
    const wrapper = mountDropdown()
    await openDropdown(wrapper)

    expect(document.body.querySelector('.mg-dropdown-menu')).not.toBeNull()
    // 编辑、复制、删除（分隔线不算 item）
    expect(document.body.querySelectorAll('.mg-dropdown-item')).toHaveLength(3)
  })

  it('点击菜单项触发 select 事件', async () => {
    const wrapper = mountDropdown()
    await openDropdown(wrapper)

    const items = document.body.querySelectorAll('.mg-dropdown-item')
    await (items[0] as HTMLElement).click()

    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('select')![0]).toEqual(['edit', sampleOptions[0]])
  })

  it('选中后菜单关闭', async () => {
    const wrapper = mountDropdown()
    await openDropdown(wrapper)

    const items = document.body.querySelectorAll('.mg-dropdown-item')
    await (items[0] as HTMLElement).click()
    await nextTick()

    expect(document.body.querySelector('.mg-dropdown-menu')).toBeNull()
  })

  it('disabled 菜单项不可选中', async () => {
    const wrapper = mountDropdown({
      options: [{ key: 'test', label: '测试', disabled: true }],
    })
    await openDropdown(wrapper)

    const item = document.body.querySelector('.mg-dropdown-item') as HTMLElement
    await item.click()

    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('分隔线渲染 role="separator"', async () => {
    const wrapper = mountDropdown()
    await openDropdown(wrapper)

    const separator = document.body.querySelector('.mg-dropdown-separator')
    expect(separator).not.toBeNull()
    expect(separator?.getAttribute('role')).toBe('separator')
  })

  it('菜单容器具备 role="menu"', async () => {
    const wrapper = mountDropdown()
    await openDropdown(wrapper)

    const menu = document.body.querySelector('.mg-dropdown-menu')
    expect(menu?.getAttribute('role')).toBe('menu')
  })

  it('触发容器不声明交互 ARIA（避免与插槽内按钮嵌套违规）', async () => {
    const wrapper = mountDropdown()
    const trigger = wrapper.find('.mg-dropdown-trigger')
    // wrapper 无 role / aria-haspopup / aria-expanded，插槽内的真实按钮承担触发语义
    expect(trigger.attributes('role')).toBeUndefined()
    expect(trigger.attributes('aria-haspopup')).toBeUndefined()
    expect(trigger.attributes('aria-expanded')).toBeUndefined()

    await openDropdown(wrapper)
    // 菜单自身仍是 role="menu"
    expect(document.body.querySelector('.mg-dropdown-menu')?.getAttribute('role')).toBe('menu')
  })

  it('Escape 键关闭菜单', async () => {
    const wrapper = mountDropdown()
    await openDropdown(wrapper)

    await wrapper.find('.mg-dropdown-trigger').trigger('keydown', { key: 'Escape' })
    await nextTick()

    expect(document.body.querySelector('.mg-dropdown-menu')).toBeNull()
  })

  it('danger 样式应用于危险操作项', async () => {
    const wrapper = mountDropdown()
    await openDropdown(wrapper)

    const items = document.body.querySelectorAll('.mg-dropdown-item')
    expect(items[2].classList.contains('mg-dropdown-item-danger')).toBe(true)
  })

  it('disabled 状态不打开菜单', async () => {
    const wrapper = mountDropdown({ disabled: true })
    await openDropdown(wrapper)

    expect(document.body.querySelector('.mg-dropdown-menu')).toBeNull()
  })

  // ==================== 键盘导航 ====================

  it('ArrowDown 高亮下一项', async () => {
    const wrapper = mountDropdown()
    await openDropdown(wrapper)

    // 打开后 resetActive 已高亮第一项，ArrowDown 移到第二项
    const trigger = wrapper.find('.mg-dropdown-trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    const items = document.body.querySelectorAll('.mg-dropdown-item')
    expect(items[1].classList.contains('mg-dropdown-item-active')).toBe(true)
  })

  it('ArrowUp 高亮上一项', async () => {
    const wrapper = mountDropdown()
    await openDropdown(wrapper)

    const trigger = wrapper.find('.mg-dropdown-trigger')
    // 打开后高亮第一项，ArrowDown 到第二项
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    // ArrowUp 回到第一项
    await trigger.trigger('keydown', { key: 'ArrowUp' })
    await nextTick()

    const items = document.body.querySelectorAll('.mg-dropdown-item')
    expect(items[0].classList.contains('mg-dropdown-item-active')).toBe(true)
  })

  it('Home 键跳到第一项', async () => {
    const wrapper = mountDropdown()
    await openDropdown(wrapper)

    const trigger = wrapper.find('.mg-dropdown-trigger')
    // 先移到第二项
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    // Home 回到第一项
    await trigger.trigger('keydown', { key: 'Home' })
    await nextTick()

    const items = document.body.querySelectorAll('.mg-dropdown-item')
    expect(items[0].classList.contains('mg-dropdown-item-active')).toBe(true)
  })

  it('End 键跳到最后一项', async () => {
    const wrapper = mountDropdown()
    await openDropdown(wrapper)

    const trigger = wrapper.find('.mg-dropdown-trigger')
    await trigger.trigger('keydown', { key: 'End' })
    await nextTick()

    const items = document.body.querySelectorAll('.mg-dropdown-item')
    expect(items[items.length - 1].classList.contains('mg-dropdown-item-active')).toBe(true)
  })

  it('Enter 键选中高亮项', async () => {
    const wrapper = mountDropdown()
    await openDropdown(wrapper)

    // 打开后 resetActive 高亮第一项（edit），直接 Enter 选中
    const trigger = wrapper.find('.mg-dropdown-trigger')
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('select')![0][0]).toBe('edit')
  })

  it('键盘导航跳过 disabled 项', async () => {
    const wrapper = mountDropdown({
      options: [
        { key: 'a', label: 'A' },
        { key: 'b', label: 'B', disabled: true },
        { key: 'c', label: 'C' },
      ],
    })
    await openDropdown(wrapper)

    // 打开后高亮 A（index 0），ArrowDown 应跳过 disabled B 到 C（index 2）
    const trigger = wrapper.find('.mg-dropdown-trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    const items = document.body.querySelectorAll('.mg-dropdown-item')
    expect(items[2].classList.contains('mg-dropdown-item-active')).toBe(true)
    expect(items[1].classList.contains('mg-dropdown-item-active')).toBe(false)
  })
})
