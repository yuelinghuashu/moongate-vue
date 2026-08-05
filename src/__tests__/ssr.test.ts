import { describe, it, expect } from 'vitest'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h } from 'vue'

import Button from '../components/Button.vue'
import Badge from '../components/Badge.vue'
import Card from '../components/Card.vue'
import Checkbox from '../components/Checkbox.vue'
import Container from '../components/Container.vue'
import Divider from '../components/Divider.vue'
import Drawer from '../components/Drawer.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import Hero from '../components/Hero.vue'
import Input from '../components/Input.vue'
import Main from '../components/Main.vue'
import Modal from '../components/Modal.vue'
import Pagination from '../components/Pagination.vue'
import Popover from '../components/Popover.vue'
import Radio from '../components/Radio.vue'
import Select from '../components/Select.vue'
import Skeleton from '../components/Skeleton.vue'
import Switch from '../components/Switch.vue'
import Table from '../components/Table.vue'
import Tabs from '../components/Tabs.vue'
import Textarea from '../components/Textarea.vue'
import Toast from '../components/Toast.vue'
import Tooltip from '../components/Tooltip.vue'

const renderSSR = async (
  component: any,
  props: Record<string, any> = {},
  slots: Record<string, any> = {},
) => {
  const app = createSSRApp({ render: () => h(component, props, slots) })
  const html = await renderToString(app)
  expect(typeof html).toBe('string')
  return html
}

describe('SSR 兼容性（renderToString 不崩溃）', () => {
  it('基础组件可 SSR 渲染', async () => {
    expect(await renderSSR(Button, { label: '确定' })).toContain('mg-button')
    expect(await renderSSR(Badge, { content: 'New' })).toContain('mg-badge')
    expect(await renderSSR(Card, {}, { default: () => '卡片' })).toContain('mg-card')
    expect(await renderSSR(Divider)).toContain('mg-divider')
    expect(await renderSSR(Checkbox, { label: '同意', modelValue: true })).toContain('mg-checkbox')
  })

  it('布局组件可 SSR 渲染', async () => {
    expect(await renderSSR(Container, {}, { default: () => '内容' })).toContain('mg-container')
    expect(await renderSSR(Header, {}, { default: () => '头部' })).toContain('mg-layout-header')
    expect(await renderSSR(Main, {}, { default: () => '主体' })).toContain('mg-layout-main')
    expect(await renderSSR(Footer, {}, { default: () => '页脚' })).toContain('mg-layout-footer')
    expect(await renderSSR(Hero, { title: '标题' })).toContain('mg-hero')
  })

  it('表单组件可 SSR 渲染', async () => {
    expect(await renderSSR(Input, { placeholder: '请输入', modelValue: '值' })).toContain(
      'mg-input',
    )
    expect(await renderSSR(Textarea, { modelValue: '文本' })).toContain('mg-textarea')
    expect(await renderSSR(Radio, { label: '选项' })).toContain('mg-radio')
    expect(await renderSSR(Switch, { modelValue: true })).toContain('mg-switch')
    expect(
      await renderSSR(Select, {
        options: [
          { label: 'A', value: 1 },
          { label: 'B', value: 2 },
        ],
        modelValue: 1,
      }),
    ).toContain('mg-select')
  })

  it('数据展示组件可 SSR 渲染', async () => {
    expect(
      await renderSSR(Table, {
        columns: [{ key: 'name', title: '名称' }],
        data: [{ name: '张三' }],
      }),
    ).toContain('mg-table')
    expect(await renderSSR(Pagination, { total: 100, currentPage: 1 })).toContain('mg-pagination')
    expect(await renderSSR(Skeleton, { rows: 3 })).toContain('mg-skeleton')
    expect(
      await renderSSR(
        Tabs,
        { active: 'tab1' },
        {
          default: () => [h('div', { title: '标签1' }, '内容1')],
        },
      ),
    ).toContain('mg-tabs')
  })

  it('悬浮层组件可 SSR 渲染且默认隐藏', async () => {
    expect(await renderSSR(Modal, { title: '弹窗' })).not.toContain('mg-modal')
    expect(await renderSSR(Drawer, { title: '抽屉' })).not.toContain('mg-drawer')
    expect(await renderSSR(Toast, { message: '提示' })).not.toContain('mg-toast')
    expect(await renderSSR(Popover, {}, { default: () => '触发' })).toContain('mg-popover-trigger')
    expect(
      await renderSSR(Tooltip, { content: '提示内容' }, { default: () => '悬停我' }),
    ).toContain('mg-tooltip-trigger')
  })
})
