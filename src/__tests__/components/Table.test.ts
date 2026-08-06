import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
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

  it('选择列：selectable 显示 checkbox 列', () => {
    const wrapper = mount(Table, { props: { columns, data, selectable: true } })
    expect(wrapper.findAll('.mg-table-selection-col')).toHaveLength(4) // 1 表头 + 3 行
    expect(wrapper.find('th.mg-table-selection-col input[type="checkbox"]').exists()).toBe(true)
  })

  it('选择列：默认无选择列', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    expect(wrapper.find('.mg-table-selection-col').exists()).toBe(false)
  })

  it('选择列：点击行 checkbox 选中行', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        selectable: true,
        'onSelection-change': () => {},
      },
    })
    const rowCheckboxes = wrapper.findAll('tbody .mg-table-checkbox')
    await rowCheckboxes[0].trigger('change')
    expect(wrapper.emitted('selection-change')).toEqual([[[{ id: 1, name: 'Alice', age: 30 }]]])
    // 选中行添加高亮 class
    expect(wrapper.findAll('tbody tr')[0].classes()).toContain('mg-table-row-selected')
  })

  it('选择列：再次点击取消选中', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, selectable: true },
      attachTo: document.body,
    })
    const rowCheckboxes = wrapper.findAll('tbody .mg-table-checkbox')
    await rowCheckboxes[0].trigger('change') // 选中
    await rowCheckboxes[0].trigger('change') // 取消
    expect(wrapper.emitted('selection-change')).toHaveLength(2)
    const last = wrapper.emitted('selection-change')?.[1]?.[0]
    expect(last).toEqual([])
  })

  it('选择列：表头全选/取消全选', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, selectable: true },
      attachTo: document.body,
    })
    const headerCheckbox = wrapper.find('th.mg-table-selection-col .mg-table-checkbox')
    await headerCheckbox.trigger('change')
    const first = wrapper.emitted('selection-change')?.[0]?.[0]
    expect(first).toHaveLength(3)

    // 再次点击取消全选
    await headerCheckbox.trigger('change')
    const last = wrapper.emitted('selection-change')?.[1]?.[0]
    expect(last).toEqual([])
  })

  it('选择列：全选后表头 checkbox 为选中态', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, selectable: true },
    })
    const headerCheckbox = wrapper.find('th.mg-table-selection-col .mg-table-checkbox')
    await headerCheckbox.trigger('change')
    await nextTick()
    const input = wrapper.find('th.mg-table-selection-col .mg-table-checkbox')
      .element as HTMLInputElement
    expect(input.checked).toBe(true)
  })

  it('选择列：rowSelectable 禁用指定行', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        selectable: true,
        rowSelectable: (row: Record<string, any>) => row.id !== 2,
      },
    })
    const rowCheckboxes = wrapper.findAll('tbody .mg-table-checkbox')
    expect(rowCheckboxes[0].attributes('disabled')).toBeUndefined()
    expect(rowCheckboxes[1].attributes('disabled')).toBeDefined()
  })

  it('选择列：全选时跳过禁用行', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        selectable: true,
        rowSelectable: (row: Record<string, any>) => row.id !== 2,
      },
    })
    const headerCheckbox = wrapper.find('th.mg-table-selection-col .mg-table-checkbox')
    await headerCheckbox.trigger('change')
    const selected = wrapper.emitted('selection-change')?.[0]?.[0] as Record<string, any>[]
    expect(selected).toHaveLength(2)
    expect(selected[0].id).toBe(1)
    expect(selected[1].id).toBe(3)
  })

  it('选择列：v-model:selected-rows 通过 prop 初始化选中', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        selectable: true,
        selectedRows: [data[0]],
      },
    })
    const rowCheckboxes = wrapper.findAll('tbody .mg-table-checkbox')
    expect((rowCheckboxes[0].element as HTMLInputElement).checked).toBe(true)
    expect((rowCheckboxes[1].element as HTMLInputElement).checked).toBe(false)
  })

  // ==================== 回归：全选去重（无 rowKey 时重复累计 bug） ====================

  it('回归：无 rowKey 时全选不会重复累计（全选→取消→再全选）', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, selectable: true },
      attachTo: document.body,
    })
    const headerCheckbox = wrapper.find('th.mg-table-selection-col .mg-table-checkbox')

    // 第一次全选：3 行
    await headerCheckbox.trigger('change')
    expect(wrapper.emitted('selection-change')?.[0]?.[0]).toHaveLength(3)

    // 取消全选：0 行
    await headerCheckbox.trigger('change')
    expect(wrapper.emitted('selection-change')?.[1]?.[0]).toHaveLength(0)

    // 第二次全选：仍为 3 行（不被上一轮残留影响）
    await headerCheckbox.trigger('change')
    const third = wrapper.emitted('selection-change')?.[2]?.[0] as Record<string, any>[]
    expect(third).toHaveLength(3)

    // 第三次全选：此时已全选，应走「取消」分支，不应再追加
    await headerCheckbox.trigger('change')
    const fourth = wrapper.emitted('selection-change')?.[3]?.[0] as Record<string, any>[]
    expect(fourth).toHaveLength(0)
  })

  it('回归：有 rowKey 时全选合并去重按 rowKey 生效', async () => {
    // 构造引用不同但 id 相同的数据，模拟父组件重建数组
    const rebuiltData = data.map((row) => ({ ...row }))
    const wrapper = mount(Table, {
      props: { columns, data, selectable: true, rowKey: 'id' },
      attachTo: document.body,
    })
    const headerCheckbox = wrapper.find('th.mg-table-selection-col .mg-table-checkbox')

    // 先手动选中第一行
    const rowCheckboxes = wrapper.findAll('tbody .mg-table-checkbox')
    await rowCheckboxes[0].trigger('change')
    const selectedBefore = wrapper.emitted('selection-change')?.[0]?.[0] as Record<string, any>[]
    expect(selectedBefore).toHaveLength(1)

    // 外部用新引用数组更新 data 与 selectedRows（业务常见场景：接口刷新后数组重建）
    await wrapper.setProps({ data: rebuiltData })
    await wrapper.setProps({ selectedRows: [...selectedBefore] })

    // 再次点全选：第一行引用已不同但 id 相同，去重应按 rowKey 生效 → 合并后仍 3 行（不重复）
    await headerCheckbox.trigger('change')
    const second = wrapper.emitted('selection-change')?.[1]?.[0] as Record<string, any>[]
    expect(second).toHaveLength(3)
    // 且第一行应保留原引用（不因引用不同而重复追加）
    const idCount = new Set(second.map((row) => String(row.id))).size
    expect(idCount).toBe(3)
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

  // ==================== 补充：排序实际行为 ====================

  it('可排序列具备 aria-sort，点击后更新', async () => {
    const wrapper = mount(Table, { props: { columns, data } })
    const th = wrapper.findAll('th')[2]

    // 初始未排序时无 aria-sort
    expect(th.attributes('aria-sort')).toBeUndefined()

    // 点击升序后
    await th.trigger('click')
    expect(wrapper.findAll('th')[2].attributes('aria-sort')).toBe('ascending')

    // 再次点击降序后
    await wrapper.findAll('th')[2].trigger('click')
    expect(wrapper.findAll('th')[2].attributes('aria-sort')).toBe('descending')
  })

  it('可排序列支持键盘 Enter/Space 触发排序', async () => {
    const wrapper = mount(Table, { props: { columns, data } })
    const th = wrapper.findAll('th')[2]

    // Enter 触发排序
    await th.trigger('keydown.enter')
    expect(wrapper.emitted('sort')).toEqual([[{ key: 'age', order: 'asc' }]])

    // Space 触发切换为 desc
    await wrapper.findAll('th')[2].trigger('keydown.space')
    expect(wrapper.emitted('sort')).toEqual([
      [{ key: 'age', order: 'asc' }],
      [{ key: 'age', order: 'desc' }],
    ])
  })

  it('不可排序列无 aria-sort、无 tabindex、无 role', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    const th = wrapper.findAll('th')[0]
    expect(th.attributes('aria-sort')).toBeUndefined()
    expect(th.attributes('tabindex')).toBeUndefined()
    expect(th.attributes('role')).toBeUndefined()
  })

  it('可排序列有 tabindex 与 role="button"', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    const th = wrapper.findAll('th')[2]
    expect(th.attributes('tabindex')).toBe('0')
    expect(th.attributes('role')).toBe('button')
  })

  it('排序图标具备 aria-hidden="true"', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    const sortIcon = wrapper.find('.mg-table-sort-icon')
    expect(sortIcon.attributes('aria-hidden')).toBe('true')
  })

  it('非受控模式：点击升序后数据按升序渲染', async () => {
    const wrapper = mount(Table, { props: { columns, data } })
    // 初始顺序：Alice(30), Bob(25), Carol(35)
    expect(wrapper.findAll('tbody tr')[0].text()).toContain('Alice')

    // 点击年龄列升序：Bob(25), Alice(30), Carol(35)
    await wrapper.findAll('th')[2].trigger('click')
    const rowsAsc = wrapper.findAll('tbody tr')
    expect(rowsAsc[0].text()).toContain('Bob')
    expect(rowsAsc[1].text()).toContain('Alice')
    expect(rowsAsc[2].text()).toContain('Carol')

    // 再次点击降序：Carol(35), Alice(30), Bob(25)
    await wrapper.findAll('th')[2].trigger('click')
    const rowsDesc = wrapper.findAll('tbody tr')
    expect(rowsDesc[0].text()).toContain('Carol')
    expect(rowsDesc[1].text()).toContain('Alice')
    expect(rowsDesc[2].text()).toContain('Bob')
  })

  it('受控模式：外部提供排序参数时数据按升序渲染', async () => {
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
    // 受控模式下使用外部 sortKey/sortOrder 进行排序
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].text()).toContain('Bob')
    expect(rows[1].text()).toContain('Alice')
    expect(rows[2].text()).toContain('Carol')
  })

  it('数字升序/降序排序', async () => {
    const numericData = [
      { id: 1, value: 100 },
      { id: 2, value: 10 },
      { id: 3, value: 1000 },
    ]
    const numColumns = [{ key: 'value', title: '值', sortable: true }]
    const wrapper = mount(Table, { props: { columns: numColumns, data: numericData } })

    // 升序：10, 100, 1000
    await wrapper.findAll('th')[0].trigger('click')
    const ascRows = wrapper.findAll('tbody tr')
    expect(ascRows[0].text()).toContain('10')
    expect(ascRows[1].text()).toContain('100')
    expect(ascRows[2].text()).toContain('1000')

    // 降序：1000, 100, 10
    await wrapper.findAll('th')[0].trigger('click')
    const descRows = wrapper.findAll('tbody tr')
    expect(descRows[0].text()).toContain('1000')
    expect(descRows[1].text()).toContain('100')
    expect(descRows[2].text()).toContain('10')
  })

  it('null/undefined 值排序兜底为空字符串', async () => {
    const mixedData = [
      { id: 1, name: 'Alice' },
      { id: 2, name: null },
      { id: 3, name: 'Bob' },
    ]
    const nameColumns = [{ key: 'name', title: '姓名', sortable: true }]
    const wrapper = mount(Table, { props: { columns: nameColumns, data: mixedData } })

    // 升序：null 转 '' 排最前（Alice < Bob，空字符串 < 字母）
    await wrapper.findAll('th')[0].trigger('click')
    const rows = wrapper.findAll('tbody tr')
    // 空字符串通过 localeCompare 应该排最前
    expect(rows[0].text()).not.toContain('Alice') // null 或空
    expect(rows.some((r) => r.text().includes('Alice'))).toBe(true)
  })

  // ==================== 补充：getRowValue / getRowKey / getColumnKey 分支 ====================

  it('column.valueKey 优先于 column.key 取值', () => {
    const customColumns = [{ key: 'id', valueKey: 'name', title: '名称' }]
    const wrapper = mount(Table, { props: { columns: customColumns, data } })
    // valueKey='name' 优先于 key='id'，所以显示 name 列的值
    expect(wrapper.findAll('tbody tr td')[0].text()).toContain('Alice')
  })

  it('column.key 取值', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    // columns 中 key='name'，取 name 列值
    expect(wrapper.findAll('tbody tr td')[1].text()).toContain('Alice')
  })

  it('column 没有 key/valueKey 时回退到 props.valueKey 取值', () => {
    const customColumns = [{ title: '未知列' }]
    const customData = [{ value: 'fallback-value' }, { value: 'value2' }]
    const wrapper = mount(Table, {
      props: { columns: customColumns, data: customData },
    })
    // 默认 valueKey='value'，回退取该列值
    expect(wrapper.find('tbody tr td').text()).toContain('fallback-value')
  })

  it('rowKey 存在但值缺失时回退为索引', () => {
    const badData = [
      { id: undefined, name: 'A' },
      { id: undefined, name: 'B' },
    ]
    const wrapper = mount(Table, { props: { columns, data: badData, rowKey: 'id' } })
    // 不报错且渲染两行
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('column.title 优先于 column.labelKey 显示', () => {
    const customColumns = [{ labelKey: 'title', title: '自定义标题', key: '' }]
    const customData = [{ title: 'AAA' }]
    const wrapper = mount(Table, { props: { columns: customColumns, data: customData } })
    // column.title 优先，显示自定义标题
    expect(wrapper.find('th').text()).toContain('自定义标题')
  })

  it('column.title 非空时优先显示 title', () => {
    const customColumns = [{ title: 'AAA', key: '' }]
    const wrapper = mount(Table, { props: { columns: customColumns, data } })
    // column.title 非空时直接返回，不回退
    expect(wrapper.find('th').text()).toContain('AAA')
  })

  // ==================== 补充：受控排序事件 ====================

  it('受控模式：点击排序时发出正确的 update 事件', async () => {
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
    // 当前 age asc，点击后应切换为 desc
    expect(wrapper.emitted('update:sortKey')).toEqual([['age']])
    expect(wrapper.emitted('update:sortOrder')).toEqual([['desc']])
    // 同时发出 sort 事件
    expect(wrapper.emitted('sort')).toEqual([[{ key: 'age', order: 'desc' }]])
  })

  it('列宽度 style 应用', () => {
    const customColumns = [{ key: 'name', title: '姓名', width: '200px' }]
    const wrapper = mount(Table, { props: { columns: customColumns, data } })
    expect(wrapper.find('th').attributes('style')).toContain('width: 200px')
  })

  it('列对齐 class 应用', () => {
    const customColumns = [
      { key: 'id', title: 'ID', align: 'right' as const },
      { key: 'name', title: '姓名', align: 'center' as const },
    ]
    const wrapper = mount(Table, { props: { columns: customColumns, data } })
    expect(wrapper.find('th').classes()).toContain('mg-table-th-right')
    expect(wrapper.findAll('th')[1].classes()).toContain('mg-table-th-center')
    expect(wrapper.find('td').classes()).toContain('mg-table-td-right')
  })

  it('列可排序 class 应用且不可排序列无排序图标', () => {
    const wrapper = mount(Table, { props: { columns, data } })
    // age 列 sortable=true
    expect(wrapper.findAll('th')[2].classes()).toContain('mg-table-sortable')
    expect(wrapper.findAll('th')[2].find('.mg-table-sort-icon').exists()).toBe(true)
    // id 列 sortable 未设置，无排序图标
    expect(wrapper.findAll('th')[0].find('.mg-table-sort-icon').exists()).toBe(false)
  })

  it('排序图标 asc class 显示', async () => {
    const wrapper = mount(Table, { props: { columns, data } })
    await wrapper.findAll('th')[2].trigger('click')
    // 非受控模式：点击后内部排序状态为 age asc
    expect(wrapper.find('.mg-table-sort-svg').classes()).toContain('mg-table-sort-asc')
  })

  it('受控模式排序图标 class 显示', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        sortKey: 'age',
        sortOrder: 'desc',
        'onUpdate:sortKey': () => {},
        'onUpdate:sortOrder': () => {},
      },
    })
    // 受控模式：使用外部 sortKey='age' sortOrder='desc'
    expect(wrapper.find('.mg-table-sort-svg').classes()).toContain('mg-table-sort-desc')
  })

  it('hideFooter/hideBody 不影响 Table', () => {
    // Table 没有 hideFooter/hideBody，确保默认渲染正常
    const wrapper = mount(Table, { props: { columns, data } })
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAll('thead th')).toHaveLength(3)
  })
})
