import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import Modal from '../../components/Modal.vue'

// 自动卸载组件，确保模块级 scroll-lock 计数器正确归零
enableAutoUnmount(afterEach)

/** 获取 body 中 Teleport 渲染的元素 */
const bodyOverlay = () => document.body.querySelector('.mg-modal-overlay') as HTMLElement | null
const bodyModal = () => document.body.querySelector('.mg-modal') as HTMLElement | null
const bodyTitle = () => document.body.querySelector('.mg-modal-title') as HTMLElement | null
const bodyClose = () => document.body.querySelector('.mg-modal-close') as HTMLElement | null
const bodyFooter = () => document.body.querySelector('.mg-modal-footer') as HTMLElement | null

describe('Modal', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('关闭时不渲染', () => {
    const wrapper = mount(Modal, { props: { modelValue: false } })
    expect(wrapper.find('.mg-modal-overlay').exists()).toBe(false)
  })

  it('打开时渲染到 body（Teleport）', () => {
    const wrapper = mount(Modal, { props: { modelValue: true, title: '标题' } })
    expect(bodyOverlay()).not.toBeNull()
    expect(bodyTitle()?.textContent).toContain('标题')
  })

  it('渲染 title 插槽', () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true },
      slots: { title: '<span class="custom-title">自定义标题</span>' },
    })
    expect(bodyModal()?.querySelector('.custom-title')).not.toBeNull()
  })

  it('size 变体 class', () => {
    const wrapper = mount(Modal, { props: { modelValue: true, size: 'lg' } })
    expect(bodyModal()?.classList.contains('mg-modal-lg')).toBe(true)
  })

  it('closable 时显示关闭按钮并触发关闭', async () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true, closable: true, 'onUpdate:modelValue': () => {} },
    })
    expect(bodyClose()).not.toBeNull()
    ;(bodyClose() as HTMLElement)?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('closable=false 时不显示关闭按钮', () => {
    const wrapper = mount(Modal, { props: { modelValue: true, closable: false } })
    expect(bodyClose()).toBeNull()
  })

  it('点击遮罩层关闭（closeOnOverlay=true）', async () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true, 'onUpdate:modelValue': () => {} },
    })
    ;(bodyOverlay() as HTMLElement)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('点击遮罩层不关闭（closeOnOverlay=false）', async () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true, closeOnOverlay: false, 'onUpdate:modelValue': () => {} },
    })
    ;(bodyOverlay() as HTMLElement)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('打开时锁定 body 滚动，关闭时恢复', async () => {
    const wrapper = mount(Modal, { props: { modelValue: true } })
    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.setProps({ modelValue: false })
    expect(document.body.style.overflow).toBe('')
  })

  it('footer 插槽渲染', () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true },
      slots: { footer: '<button class="custom-footer">确定</button>' },
    })
    expect(bodyFooter()?.querySelector('.custom-footer')).not.toBeNull()
  })

  it('打开时触发 open 事件', async () => {
    const wrapper = mount(Modal, { props: { modelValue: false } })
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.emitted('open')).toHaveLength(1)
  })

  it('ESC 键关闭弹窗', () => {
    const wrapper = mount(Modal, {
      props: { modelValue: true, 'onUpdate:modelValue': () => {} },
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })
})
