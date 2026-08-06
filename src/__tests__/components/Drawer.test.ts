import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Drawer from '../../components/Drawer.vue'

/** 跟踪所有 wrapper，在 afterEach 中显式卸载，避免 Teleport 残留 */
const wrappers: ReturnType<typeof mount>[] = []
const mountDrawer = (options: Parameters<typeof mount>[1] = {}) => {
  const wrapper = mount(Drawer, { attachTo: document.body, ...options })
  wrappers.push(wrapper)
  return wrapper
}

/** 获取 body 中 Teleport 渲染的元素 */
const bodyDrawer = () => document.body.querySelector('.mg-drawer') as HTMLElement | null
const bodyDrawerRoot = () => document.body.querySelector('.mg-drawer-root') as HTMLElement | null
const bodyDrawerOverlay = () =>
  document.body.querySelector('.mg-drawer-overlay') as HTMLElement | null
const bodyDrawerClose = () => document.body.querySelector('.mg-drawer-close') as HTMLElement | null
const bodyDrawerHeader = () =>
  document.body.querySelector('.mg-drawer-header') as HTMLElement | null
const bodyDrawerFooter = () =>
  document.body.querySelector('.mg-drawer-footer') as HTMLElement | null

describe('Drawer', () => {
  beforeEach(async () => {
    await flushPromises()
  })

  afterEach(async () => {
    // 显式卸载所有 wrapper，确保 Teleport 从 body 正确移除
    while (wrappers.length > 0) {
      const wrapper = wrappers.pop()!
      await wrapper.unmount()
    }
    await flushPromises()
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('关闭时不渲染', () => {
    const wrapper = mountDrawer({ props: { modelValue: false } })
    expect(document.body.querySelector('.mg-drawer')).toBeNull()
    expect(wrapper.find('.mg-drawer').exists()).toBe(false)
  })

  it('打开时渲染到 body（Teleport）', () => {
    const wrapper = mountDrawer({ props: { modelValue: true, title: '抽屉标题' } })
    expect(bodyDrawer()).not.toBeNull()
    expect(bodyDrawerHeader()?.querySelector('.mg-drawer-title')?.textContent).toContain('抽屉标题')
  })

  it('placement/size 变体 class', () => {
    const wrapper = mountDrawer({
      props: { modelValue: true, placement: 'left', size: 'lg' },
    })
    expect(bodyDrawer()?.classList.contains('mg-drawer-left')).toBe(true)
    expect(bodyDrawer()?.classList.contains('mg-drawer-lg')).toBe(true)
  })

  it('closable 时显示关闭按钮并触发关闭', async () => {
    const wrapper = mountDrawer({
      props: { modelValue: true, closable: true, 'onUpdate:modelValue': () => {} },
    })
    expect(bodyDrawerClose()).not.toBeNull()
    ;(bodyDrawerClose() as HTMLElement)?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('点击遮罩层关闭（closeOnOverlay=true）', async () => {
    const wrapper = mountDrawer({
      props: { modelValue: true, 'onUpdate:modelValue': () => {} },
    })
    ;(bodyDrawerOverlay() as HTMLElement)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('点击遮罩层不关闭（closeOnOverlay=false）', async () => {
    const wrapper = mountDrawer({
      props: { modelValue: true, closeOnOverlay: false, 'onUpdate:modelValue': () => {} },
    })
    ;(bodyDrawerOverlay() as HTMLElement)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('打开时锁定 body 滚动，关闭时恢复', async () => {
    const wrapper = mountDrawer({ props: { modelValue: true } })
    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.setProps({ modelValue: false })
    expect(document.body.style.overflow).toBe('')
  })

  it('ESC 键关闭抽屉', () => {
    const wrapper = mountDrawer({
      props: { modelValue: true, 'onUpdate:modelValue': () => {} },
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('header/footer 插槽渲染', () => {
    const wrapper = mountDrawer({
      props: { modelValue: true },
      slots: {
        header: '<span class="custom-drawer-header">自定义头部</span>',
        footer: '<span class="custom-drawer-footer">自定义底部</span>',
      },
    })
    expect(bodyDrawerHeader()?.querySelector('.custom-drawer-header')).not.toBeNull()
    expect(bodyDrawerFooter()?.querySelector('.custom-drawer-footer')).not.toBeNull()
  })

  it('打开时触发 open 事件', () => {
    const wrapper = mountDrawer({ props: { modelValue: true } })
    expect(wrapper.emitted('open')).toBeDefined()
  })

  it('closable=false 时不显示关闭按钮', () => {
    mountDrawer({ props: { modelValue: true, closable: false } })
    expect(bodyDrawerClose()).toBeNull()
  })

  it('enableEsc=false 时 ESC 不关闭抽屉', () => {
    const wrapper = mountDrawer({
      props: { modelValue: true, enableEsc: false, 'onUpdate:modelValue': () => {} },
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('enableFocusTrap=false 时不自动聚焦', async () => {
    const wrapper = mountDrawer({
      props: { modelValue: true, enableFocusTrap: false },
    })
    await wrapper.vm.$nextTick()
    expect(document.activeElement).not.toBe(bodyDrawer())
  })

  it('关闭时触发 close 事件', async () => {
    const wrapper = mountDrawer({
      props: { modelValue: true, 'onUpdate:modelValue': () => {} },
    })
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.emitted('close')).toBeDefined()
  })
})
