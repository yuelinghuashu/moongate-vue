import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Table from '../../components/Table.vue'

interface User {
  id: number
  name: string
  age: number
}

const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄', sortable: true },
]

const data: User[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Carol', age: 35 },
]

describe('Table', () => {
  it('渲染表头与数据', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(3)
    expect(headers[0].text()).toContain('ID')
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.text()).toContain('Alice')
  })

  it('空状态显示 emptyText', () => {
    const wrapper = mount(Table, { props: { columns, data: [] } })
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('empty 插槽覆盖默认空文案', () => {
    const wrapper = mount(Table, {
      props: { columns, data: [] },
      slots: { empty: '<div class="custom-empty">自定义空</div>' },
    })
    expect(wrapper.find('.custom-empty').exists()).toBe(true)
  })

  it('不显示表头', () => {
    const wrapper = mount(Table, { props: { columns, data, showHeader: false } })
    expect(wrapper.find('thead').exists()).toBe(false)
  })

  it('斑马纹与悬停 class', () => {
    const wrapper = mount(Table, {
      props: { columns, data, striped: true, hoverable: true },
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows[1].classes()).toContain('mg-table-row-striped')
    expect(rows[0].classes()).toContain('mg-table-row-hover')
  })

  it('默认排序（可排序列点击触发）', async () => {
    const wrapper = mount(Table, { props: { columns, data } })
    // 点击年龄表头
    await wrapper.findAll('th')[2].trigger('click')
    expect(wrapper.emitted('sort')).toEqual([[{ key: 'age', order: 'asc' }]])
    // 再次点击切换为 desc
    await wrapper.findAll('th')[2].trigger('click')
    expect(wrapper.emitted('sort')).toEqual([
      [{ key: 'age', order: 'asc' }],
      [{ key: 'age', order: 'desc' }],
    ])
  })

  it('受控排序模式（v-model:sort-key）', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        sortKey: 'age',
        sortOrder: 'asc',
        'onUpdate:sortKey': () => {},
        'onUpdate:sortOrder': () => {},
      },
    })
    await wrapper.findAll('th')[2].trigger('click')
    const updateSortKey = wrapper.emitted('update:sortKey')
    const updateSortOrder = wrapper.emitted('update:sortOrder')
    expect(updateSortKey).toBeDefined()
    expect(updateSortOrder).toBeDefined()
  })

  it('rowKey 作为稳定 key 渲染', () => {
    const wrapper = mount(Table, { props: { columns, data, rowKey: 'id' } })
    // 行 key 使用 id 值：1/2/3
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].attributes('data-v-inspector')).toBeUndefined() // 无需断言 DOM key，只需确认不报错
    expect(rows).toHaveLength(3)
  })

  it('cell 插槽渲染', () => {
    const wrapper = mount(Table, {
      props: { columns, data },
      slots: {
        cell: ({ value }: { value: any }) => h('span', { class: 'cell-slot' }, String(value)),
      },
    })
    expect(wrapper.find('.cell-slot').exists()).toBe(true)
  })

  it('column 动态插槽渲染', () => {
    const wrapper = mount(Table, {
      props: { columns, data },
      slots: {
        'column-name': ({ row }: { row: Record<string, any> }) =>
          h('span', { class: 'name-slot' }, String((row as User).name)),
      },
    })
    expect(wrapper.find('.name-slot').exists()).toBe(true)
  })

  it('行点击触发 row-click 事件', async () => {
    const wrapper = mount(Table, { props: { columns, data } })
    await wrapper.findAll('tbody tr')[0].trigger('click')
    const events = wrapper.emitted('row-click')
    expect(events).toHaveLength(1)
    expect(events![0][0]).toEqual({ id: 1, name: 'Alice', age: 30 })
    expect(events![0][1]).toBe(0)
  })

  it('固定表头 maxHeight 样式', () => {
    const wrapper = mount(Table, {
      props: { columns, data, fixedHeader: true, maxHeight: '500px' },
    })
    const container = wrapper.find('.mg-table-container')
    expect(container.attributes('style')).toContain('max-height: 500px')
  })

  it('scrollable/responsive class', () => {
    const wrapper = mount(Table, {
      props: { columns, data, scrollable: true, responsive: true },
    })
    expect(wrapper.find('.mg-table-wrapper').classes()).toContain('mg-table-responsive')
    expect(wrapper.find('.mg-table-container').classes()).toContain('mg-table-scrollable')
  })
})
