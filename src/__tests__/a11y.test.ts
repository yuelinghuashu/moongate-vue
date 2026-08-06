import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'
import Textarea from '../components/Textarea.vue'
import Modal from '../components/Modal.vue'
import Checkbox from '../components/Checkbox.vue'
import Tabs from '../components/Tabs.vue'
import Select from '../components/Select.vue'
import Drawer from '../components/Drawer.vue'
import Table from '../components/Table.vue'
import Pagination from '../components/Pagination.vue'
import Tooltip from '../components/Tooltip.vue'
import Popover from '../components/Popover.vue'
import { expectNoViolations } from './helpers/axe'

/** 等待浮层显示（Timer 微任务） */
const waitForOverlay = () => new Promise((resolve) => setTimeout(resolve, 20))

describe('可访问性（axe-core）', () => {
  it('Button 无 a11y 违规', async () => {
    const wrapper = mount(Button, { props: { label: '提交' } })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Checkbox 无 a11y 违规', async () => {
    const wrapper = mount(Checkbox, { props: { label: '同意协议' } })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Input 无 a11y 违规', async () => {
    const wrapper = mount(Input, { props: { placeholder: '请输入' } })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Textarea 无 a11y 违规', async () => {
    const wrapper = mount(Textarea, { props: { placeholder: '请输入内容' } })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Select（原生模式）无 a11y 违规', async () => {
    const wrapper = mount(Select, {
      props: {
        'aria-label': '请选择',
        options: [
          { label: '选项一', value: 1 },
          { label: '选项二', value: 2 },
        ],
      },
    })
    await nextTick()
    // aria-label 应透传到原生 select
    expect(wrapper.find('select').attributes('aria-label')).toBe('请选择')
    await expectNoViolations(wrapper.element)
  })

  it('Select（可搜索模式展开下拉）无 a11y 违规', async () => {
    const wrapper = mount(Select, {
      props: {
        filterable: true,
        'aria-label': '请选择水果',
        options: [
          { label: '苹果', value: 'apple' },
          { label: '香蕉', value: 'banana' },
        ],
      },
      attachTo: document.body,
    })
    // aria-label 应透传到实际搜索 input
    expect(wrapper.find('.mg-select-input').attributes('aria-label')).toBe('请选择水果')
    await wrapper.find('.mg-select-input').trigger('focus')
    await nextTick()
    await waitForOverlay()
    await expectNoViolations(document.body)
  })

  it('Tabs 无 a11y 违规', async () => {
    const wrapper = mount(Tabs, {
      props: {
        tabs: [
          { label: '概览', content: '概览内容' },
          { label: '详情', content: '详情内容' },
        ],
      },
    })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Table 无 a11y 违规', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { key: 'id', title: 'ID' },
          { key: 'name', title: '姓名' },
        ],
        data: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
      },
    })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Pagination 无 a11y 违规', async () => {
    const wrapper = mount(Pagination, {
      props: { totalPages: 10, modelValue: 1 },
    })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Modal 打开时无 a11y 违规', async () => {
    mount(Modal, {
      props: { modelValue: true, title: '对话框' },
      slots: { default: '内容' },
    })
    await nextTick()
    // Modal 使用 Teleport，实际内容渲染在 body 中，需要检查 body
    const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement
    // aria-describedby 关联到正文内容
    const describedby = dialog?.getAttribute('aria-describedby')
    expect(describedby).toBeDefined()
    if (describedby) {
      expect(document.getElementById(describedby)).not.toBeNull()
    }
    await expectNoViolations(document.body)
  })

  it('Modal 带关闭按钮无 a11y 违规', async () => {
    mount(Modal, {
      props: { modelValue: true, title: '对话框', closable: true, closeAriaLabel: '关闭' },
      slots: { default: '内容' },
    })
    await nextTick()
    await expectNoViolations(document.body)
  })

  it('Drawer 打开时无 a11y 违规', async () => {
    mount(Drawer, {
      props: { modelValue: true, title: '抽屉面板' },
      slots: { default: '内容' },
    })
    await nextTick()
    const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement
    // aria-describedby 关联到正文内容
    const describedby = dialog?.getAttribute('aria-describedby')
    expect(describedby).toBeDefined()
    if (describedby) {
      expect(document.getElementById(describedby)).not.toBeNull()
    }
    await expectNoViolations(document.body)
  })

  it('Tooltip 显示时无 a11y 违规', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: '提示内容', delay: 0 },
      slots: { default: '<button type="button">悬停我</button>' },
      attachTo: document.body,
    })
    await wrapper.find('.mg-tooltip-trigger').trigger('mouseenter')
    await waitForOverlay()
    await nextTick()
    await expectNoViolations(document.body)
  })

  it('Popover 显示时无 a11y 违规', async () => {
    const wrapper = mount(Popover, {
      props: { content: '弹出内容', showDelay: 0 },
      slots: { default: '<button type="button">触发</button>' },
      attachTo: document.body,
    })
    await wrapper.find('.mg-popover-trigger').trigger('mouseenter')
    await waitForOverlay()
    await nextTick()
    await expectNoViolations(document.body)
  })
})
