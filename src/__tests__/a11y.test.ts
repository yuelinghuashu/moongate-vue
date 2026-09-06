import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'
import Textarea from '../components/Textarea.vue'
import Modal from '../components/Modal.vue'
import Checkbox from '../components/Checkbox.vue'
import Radio from '../components/Radio.vue'
import Switch from '../components/Switch.vue'
import Tabs from '../components/Tabs.vue'
import Select from '../components/Select.vue'
import Drawer from '../components/Drawer.vue'
import Table from '../components/Table.vue'
import Pagination from '../components/Pagination.vue'
import Tooltip from '../components/Tooltip.vue'
import Popover from '../components/Popover.vue'
import Dropdown from '../components/Dropdown.vue'
import Message from '../components/Message.vue'
import Toast from '../components/Toast.vue'
import SeriesNav from '../components/SeriesNav.vue'
import Form from '../components/Form.vue'
import FormItem from '../components/FormItem.vue'
import Skeleton from '../components/Skeleton.vue'
import Badge from '../components/Badge.vue'
import Card from '../components/Card.vue'
import Container from '../components/Container.vue'
import Divider from '../components/Divider.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import Hero from '../components/Hero.vue'
import Main from '../components/Main.vue'
import { h } from 'vue'
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

  it('SeriesNav 折叠时无 a11y 违规', async () => {
    const items = Array.from({ length: 7 }, (_, i) => ({
      key: `p-${i + 1}`,
      label: `Part ${i + 1}`,
      href: `/p/${i + 1}`,
    }))
    const wrapper = mount(SeriesNav, {
      props: { items, active: 'p-4', visibleCount: 5 },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoViolations(document.body)
  })

  it('SeriesNav 展开时无 a11y 违规', async () => {
    const items = Array.from({ length: 7 }, (_, i) => ({
      key: `p-${i + 1}`,
      label: `Part ${i + 1}`,
      href: `/p/${i + 1}`,
    }))
    const wrapper = mount(SeriesNav, {
      props: { items, active: 'p-4', visibleCount: 5 },
      attachTo: document.body,
    })
    await wrapper.find('.mg-series-nav-toggle').trigger('click')
    await nextTick()
    await expectNoViolations(document.body)
  })

  it('Radio 无 a11y 违规', async () => {
    const wrapper = mount(Radio, { props: { label: '选项一', value: 'a' } })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Switch 无 a11y 违规', async () => {
    const wrapper = mount(Switch, { props: { label: '开关' } })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Message 无 a11y 违规', async () => {
    const wrapper = mount(Message, {
      props: { message: '操作成功', type: 'success' },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoViolations(document.body)
  })

  it('Toast 无 a11y 违规', async () => {
    const wrapper = mount(Toast, {
      props: { message: '通知内容', type: 'info' },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoViolations(document.body)
  })

  // ==================== 静态展示组件 ====================

  it('Badge 无 a11y 违规', async () => {
    const wrapper = mount(Badge, { props: { label: '新' } })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Card 无 a11y 违规', async () => {
    const wrapper = mount(Card, {
      slots: {
        header: () => h('h3', '卡片标题'),
        default: () => '卡片内容',
      },
    })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Container 无 a11y 违规', async () => {
    const wrapper = mount(Container, { slots: { default: () => '内容' } })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Divider 无 a11y 违规', async () => {
    const wrapper = mount(Divider, { slots: { default: () => '分隔' } })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Footer 无 a11y 违规', async () => {
    const wrapper = mount(Footer, { slots: { default: () => '页脚' } })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Header 无 a11y 违规', async () => {
    const wrapper = mount(Header, { slots: { default: () => '头部' } })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Hero 无 a11y 违规（带标题）', async () => {
    const wrapper = mount(Hero, {
      props: { title: 'Moongate Vue', description: '极简组件库' },
      slots: { actions: () => h(Button, { label: '开始使用' }) },
    })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Main 无 a11y 违规', async () => {
    const wrapper = mount(Main, { slots: { default: () => '主体' } })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('Skeleton 无 a11y 违规', async () => {
    const wrapper = mount(Skeleton, {
      props: { rows: 3, avatar: true },
      attrs: { 'aria-hidden': 'true' },
    })
    await nextTick()
    // Skeleton 是装饰性占位，应搭配 aria-hidden 使用
    await expectNoViolations(wrapper.element)
  })

  // ==================== 组合组件 ====================

  it('Form + FormItem + Input 无 a11y 违规', async () => {
    const wrapper = mount({
      render: () =>
        h(Form, { errors: { username: '' } }, () => [
          h(FormItem, { name: 'username', label: '用户名', required: true }, () =>
            h(Input, { placeholder: '请输入用户名' }),
          ),
        ]),
    })
    await nextTick()
    await expectNoViolations(wrapper.element)
  })

  it('FormItem 错误态无 a11y 违规（aria-describedby 关联）', async () => {
    const wrapper = mount(
      {
        render: () =>
          h(Form, { errors: { username: '用户名不能为空' } }, () => [
            h(FormItem, { name: 'username', label: '用户名', required: true }, () =>
              h(Input, { placeholder: '请输入用户名' }),
            ),
          ]),
      },
      { attachTo: document.body },
    )
    await nextTick()
    const describedby = wrapper.find('input').attributes('aria-describedby')
    expect(describedby).toBeDefined()
    if (describedby) {
      expect(document.getElementById(describedby)).not.toBeNull()
    }
    await expectNoViolations(document.body)
  })

  it('Dropdown 关闭态无 a11y 违规', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        options: [
          { key: 'edit', label: '编辑' },
          { key: 'delete', label: '删除' },
        ],
      },
      slots: { default: () => h(Button, { label: '操作菜单' }) },
      attachTo: document.body,
    })
    await nextTick()
    await expectNoViolations(document.body)
  })

  it('Dropdown 打开态无 a11y 违规', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        options: [
          { key: 'edit', label: '编辑' },
          { key: 'delete', label: '删除' },
        ],
      },
      slots: { default: () => h(Button, { label: '操作菜单' }) },
      attachTo: document.body,
    })
    await wrapper.find('.mg-dropdown-trigger').trigger('click')
    await nextTick()
    await expectNoViolations(document.body)
  })
})
