import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import { setConfig } from '../config'
import { useForm } from '../composables/useForm'
import Pagination from '../components/Pagination.vue'
import Table from '../components/Table.vue'
import Modal from '../components/Modal.vue'
import Drawer from '../components/Drawer.vue'
import Message from '../components/Message.vue'
import Toast from '../components/Toast.vue'

// 自动卸载，清理 Teleport 到 body 的 DOM
enableAutoUnmount(afterEach)

describe('config - 组件与全局配置联动', () => {
  beforeEach(() => {
    // 重置为中文默认
    setConfig({ locale: 'zh-CN' })
  })

  afterEach(() => {
    document.documentElement.lang = 'zh-CN'
  })

  describe('Pagination', () => {
    it('默认中文页码 aria-label', () => {
      const wrapper = mount(Pagination, {
        props: { totalPages: 10, modelValue: 3 },
      })
      expect(wrapper.attributes('aria-label')).toBe('第 3 页，共 10 页')
    })

    it('setConfig 切换英文后 aria-label 跟随更新', () => {
      setConfig({ locale: 'en-US' })
      const wrapper = mount(Pagination, {
        props: { totalPages: 10, modelValue: 3 },
      })
      expect(wrapper.attributes('aria-label')).toBe('Page 3 of 10')
    })

    it('自定义 texts 覆盖页码模板', () => {
      setConfig({ texts: { paginationPageInfo: '总 {total} 页，当前 {current}' } })
      const wrapper = mount(Pagination, {
        props: { totalPages: 10, modelValue: 3 },
      })
      expect(wrapper.attributes('aria-label')).toBe('总 10 页，当前 3')
    })

    it('显式 prop prevText 优先于全局配置', () => {
      setConfig({ locale: 'en-US' })
      const wrapper = mount(Pagination, {
        props: { totalPages: 10, modelValue: 3, prevText: '自定义上一页' },
      })
      // 第一个按钮是 first（«），第二个是 prev
      expect(wrapper.findAll('button')[1].text()).toBe('自定义上一页')
    })

    it('无 prop 时跟随全局配置的上一页/下一页', () => {
      setConfig({ locale: 'en-US' })
      const wrapper = mount(Pagination, {
        props: { totalPages: 10, modelValue: 3 },
      })
      expect(wrapper.findAll('button')[1].text()).toBe('Prev')
      expect(wrapper.findAll('button')[2].text()).toBe('Next')
    })
  })

  describe('Table', () => {
    const columns = [{ key: 'name', title: '名称' }]
    const data = [{ name: '张三' }]

    it('默认中文空状态文案', () => {
      const wrapper = mount(Table, {
        props: { columns: [{ key: 'name', title: '名称' }], data: [] },
      })
      expect(wrapper.text()).toContain('暂无数据')
    })

    it('setConfig 设置空状态文案', () => {
      setConfig({ texts: { empty: '抱歉，没有数据' } })
      const wrapper = mount(Table, {
        props: { columns: [{ key: 'name', title: '名称' }], data: [] },
      })
      expect(wrapper.text()).toContain('抱歉，没有数据')
    })

    it('英文模式下 selectable 全选按钮文案', () => {
      setConfig({ locale: 'en-US' })
      const wrapper = mount(Table, {
        props: { columns, data, selectable: true },
      })
      const checkbox = wrapper.find('.mg-table-checkbox')
      expect(checkbox.attributes('aria-label')).toBe('Select all')
    })

    it('prop emptyText 优先于全局配置', () => {
      setConfig({ texts: { empty: '全局空状态' } })
      const wrapper = mount(Table, {
        props: { columns: [{ key: 'name', title: '名称' }], data: [], emptyText: '局部空状态' },
      })
      expect(wrapper.text()).toContain('局部空状态')
      expect(wrapper.text()).not.toContain('全局空状态')
    })

    it('英文模式下行选择按钮 aria-label', () => {
      setConfig({ locale: 'en-US' })
      const wrapper = mount(Table, {
        props: { columns, data, selectable: true, rowKey: 'name' },
      })
      const rowCheckbox = wrapper.findAll('.mg-table-checkbox')[1]
      expect(rowCheckbox.attributes('aria-label')).toBe('Select 张三')
    })

    it('无列信息时行标签兜底跟随全局配置', () => {
      setConfig({ locale: 'en-US' })
      const wrapper = mount(Table, {
        props: { columns: [], data, selectable: true, rowKey: undefined },
      })
      const rowCheckbox = wrapper.findAll('.mg-table-checkbox')[1]
      expect(rowCheckbox.attributes('aria-label')).toBe('Select Row')
    })
  })

  describe('Modal & Drawer', () => {
    // Modal/Drawer 使用 Teleport to body，需要通过 document.body 查找
    const bodyCloseButton = (selector: string) =>
      document.body.querySelector<HTMLButtonElement>(selector)

    it('Modal 默认中文关闭按钮 aria-label', () => {
      mount(Modal, {
        props: { modelValue: true, title: '标题', closable: true },
      })
      expect(bodyCloseButton('.mg-modal-close')?.getAttribute('aria-label')).toBe('关闭')
    })

    it('Modal 英文模式关闭按钮 aria-label', () => {
      setConfig({ locale: 'en-US' })
      mount(Modal, {
        props: { modelValue: true, title: 'Title', closable: true },
      })
      expect(bodyCloseButton('.mg-modal-close')?.getAttribute('aria-label')).toBe('Close')
    })

    it('Drawer 自定义关闭按钮 aria-label', () => {
      setConfig({ texts: { drawerClose: '收起抽屉' } })
      mount(Drawer, {
        props: { modelValue: true, title: '标题', closable: true },
      })
      expect(bodyCloseButton('.mg-drawer-close')?.getAttribute('aria-label')).toBe('收起抽屉')
    })
  })

  describe('Message & Toast', () => {
    it('Message 默认中文关闭按钮 aria-label', () => {
      const wrapper = mount(Message, {
        props: { modelValue: true, message: '提示', closable: true },
      })
      expect(wrapper.find('.mg-message-close').attributes('aria-label')).toBe('关闭消息')
    })

    it('Message 英文模式关闭按钮 aria-label', () => {
      setConfig({ locale: 'en-US' })
      const wrapper = mount(Message, {
        props: { modelValue: true, message: 'Info', closable: true },
      })
      expect(wrapper.find('.mg-message-close').attributes('aria-label')).toBe('Close message')
    })

    it('Toast 默认中文关闭按钮 aria-label', () => {
      const wrapper = mount(Toast, {
        props: { modelValue: true, message: '操作成功', closable: true },
      })
      expect(wrapper.find('.mg-toast-close').attributes('aria-label')).toBe('关闭通知')
    })

    it('Toast 英文模式关闭按钮 aria-label', () => {
      setConfig({ locale: 'en-US' })
      const wrapper = mount(Toast, {
        props: { modelValue: true, message: 'Success', closable: true },
      })
      expect(wrapper.find('.mg-toast-close').attributes('aria-label')).toBe('Close notification')
    })
  })

  describe('useForm', () => {
    it('默认中文校验失败文案跟随全局配置', async () => {
      setConfig({ locale: 'zh-CN' })
      const { validate, errors } = useForm({
        initialValues: { name: '' },
        rules: { name: (v: string) => (v ? true : false) },
      })
      const valid = await validate()
      expect(valid).toBe(false)
      expect(errors.name).toBe('校验未通过')
    })

    it('英文模式默认校验失败文案', async () => {
      setConfig({ locale: 'en-US' })
      const { validate, errors } = useForm({
        initialValues: { name: '' },
        rules: { name: (v: string) => (v ? true : false) },
      })
      const valid = await validate()
      expect(valid).toBe(false)
      expect(errors.name).toBe('Validation failed')
    })

    it('自定义 ruleMessage 优先于全局配置', async () => {
      setConfig({ locale: 'en-US' })
      const { validate, errors } = useForm({
        initialValues: { name: '' },
        rules: { name: (v: string) => (v ? true : false) },
        ruleMessage: '自定义错误',
      })
      const valid = await validate()
      expect(valid).toBe(false)
      expect(errors.name).toBe('自定义错误')
    })
  })
})
