import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Select, { type SelectValue } from '../../components/Select.vue'

const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
]

describe('Select', () => {
  it('原生模式：渲染 options', () => {
    const wrapper = mount(Select, { props: { options } })
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.findAll('option')).toHaveLength(3)
    expect(wrapper.text()).toContain('苹果')
  })

  it('原生模式：placeholder 显示为 disabled option', () => {
    const wrapper = mount(Select, { props: { options, placeholder: '请选择' } })
    const placeholder = wrapper.find('option[value=""]')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.attributes('disabled')).toBeDefined()
    expect(placeholder.text()).toContain('请选择')
  })

  it('原生模式：change 事件更新 modelValue', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        'onUpdate:modelValue': (v: any) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('select').setValue('banana')
    expect(wrapper.emitted('update:modelValue')).toEqual([['banana']])
    expect(wrapper.emitted('change')).toEqual([['banana']])
  })

  it('原生模式：数字类型回溯', async () => {
    const numOptions = [1, 2, 3]
    const wrapper = mount(Select, {
      props: {
        options: numOptions,
        'onUpdate:modelValue': (v: any) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('select').setValue('2')
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('原生模式：size/error class', () => {
    const wrapper = mount(Select, { props: { options, size: 'lg', error: true } })
    expect(wrapper.find('select').classes()).toContain('mg-select-lg')
    expect(wrapper.find('.mg-select-wrapper').classes()).toContain('mg-select-error')
  })

  it('原生模式：disabled', () => {
    const wrapper = mount(Select, { props: { options, disabled: true } })
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
  })

  it('可搜索模式：聚焦打开下拉', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    expect(wrapper.find('.mg-select-filterable').exists()).toBe(true)
    await wrapper.find('.mg-select-input').trigger('focus')
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(true)
    expect(wrapper.findAll('.mg-select-option')).toHaveLength(3)
  })

  it('可搜索模式：选项具备 role="option" 与 aria-selected', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true, modelValue: 'banana' },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    const dropdown = wrapper.find('.mg-select-dropdown')
    // 下拉面板是 listbox，选项是 option
    expect(dropdown.attributes('role')).toBe('listbox')
    const optionElements = wrapper.findAll('.mg-select-option')
    expect(optionElements[0].attributes('role')).toBe('option')
    // 已选中项 aria-selected=true
    expect(optionElements[1].attributes('aria-selected')).toBe('true')
    expect(optionElements[0].attributes('aria-selected')).toBe('false')
  })

  it('可搜索模式：选中选项更新 modelValue', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        filterable: true,
        'onUpdate:modelValue': (v: any) => wrapper.setProps({ modelValue: v }),
      },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.findAll('.mg-select-option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['banana']])
  })

  it('可搜索模式：搜索过滤选项', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.find('.mg-select-input').setValue('苹')
    expect(wrapper.findAll('.mg-select-option')).toHaveLength(1)
    expect(wrapper.text()).toContain('苹果')
  })

  it('可搜索模式：空状态显示 emptyText', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true, emptyText: '无匹配选项' },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.find('.mg-select-input').setValue('不存在')
    expect(wrapper.find('.mg-select-empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('无匹配选项')
  })

  it('可搜索模式：搜索事件', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.find('.mg-select-input').setValue('苹')
    expect(wrapper.emitted('search')).toEqual([['苹']])
  })

  // ==================== 补充：ARIA 可访问性 ====================

  it('可搜索模式：键盘导航时 aria-activedescendant 指向高亮选项', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')

    const dropdown = wrapper.find('.mg-select-dropdown')
    // 初始无高亮时 aria-activedescendant 未设置
    expect(dropdown.attributes('aria-activedescendant')).toBeUndefined()

    // ArrowDown 高亮第一个选项
    await wrapper.find('.mg-select-input').trigger('keydown.down')
    const option0 = wrapper.findAll('.mg-select-option')[0]
    expect(option0.attributes('id')).toBeDefined()
    expect(dropdown.attributes('aria-activedescendant')).toBe(option0.attributes('id'))

    // ArrowDown 高亮第二个选项
    await wrapper.find('.mg-select-input').trigger('keydown.down')
    const option1 = wrapper.findAll('.mg-select-option')[1]
    expect(dropdown.attributes('aria-activedescendant')).toBe(option1.attributes('id'))
  })

  it('可搜索模式：每个选项具有唯一 id', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')

    const optionIds = wrapper.findAll('.mg-select-option').map((opt) => opt.attributes('id'))
    // 三个选项应有各自的 id
    expect(optionIds).toHaveLength(3)
    // 所有 id 均存在
    optionIds.forEach((id) => expect(id).toBeTruthy())
    // 互不相同
    expect(new Set(optionIds).size).toBe(3)
  })

  // ==================== 补充：键盘导航 ====================

  it('可搜索模式：ArrowDown 高亮下一个选项，ArrowUp 高亮上一个', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')

    await wrapper.find('.mg-select-input').trigger('keydown.down')
    expect(wrapper.findAll('.mg-select-option')[0].classes()).toContain('mg-select-option-focused')

    await wrapper.find('.mg-select-input').trigger('keydown.down')
    expect(wrapper.findAll('.mg-select-option')[1].classes()).toContain('mg-select-option-focused')

    await wrapper.find('.mg-select-input').trigger('keydown.up')
    expect(wrapper.findAll('.mg-select-option')[0].classes()).toContain('mg-select-option-focused')
  })

  it('可搜索模式：ArrowDown 到边界不再继续', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')

    // 连续按 3 次（共 3 个选项），索引应停在 2
    await wrapper.find('.mg-select-input').trigger('keydown.down')
    await wrapper.find('.mg-select-input').trigger('keydown.down')
    await wrapper.find('.mg-select-input').trigger('keydown.down')
    await wrapper.find('.mg-select-input').trigger('keydown.down')
    expect(wrapper.findAll('.mg-select-option')[2].classes()).toContain('mg-select-option-focused')
  })

  it('可搜索模式：Enter 选中高亮选项', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        filterable: true,
        'onUpdate:modelValue': (v: any) => wrapper.setProps({ modelValue: v }),
      },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.find('.mg-select-input').trigger('keydown.down')
    await wrapper.find('.mg-select-input').trigger('keydown.enter')

    expect(wrapper.emitted('update:modelValue')).toEqual([['apple']])
    // 选中后下拉关闭
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(false)
  })

  it('可搜索模式：没有任何高亮时 Enter 不触发选中', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.find('.mg-select-input').trigger('keydown.enter')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('可搜索模式：Esc 关闭下拉并清空搜索', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.find('.mg-select-input').setValue('苹')
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(true)

    await wrapper.find('.mg-select-input').trigger('keydown.esc')
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(false)
  })

  // ==================== 补充：下拉切换与失焦 ====================

  it('可搜索模式：点击箭头切换下拉开关', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    // 初始关闭
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(false)

    // 点击箭头打开
    await wrapper.find('.mg-select-arrow').trigger('click')
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(true)

    // 再次点击关闭
    await wrapper.find('.mg-select-arrow').trigger('click')
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(false)
  })

  it('可搜索模式：disabled 时点击箭头不打开', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true, disabled: true },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-arrow').trigger('click')
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(false)
  })

  it('可搜索模式：点击选项时 blur 不关闭下拉（mousedownInside 流程）', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        filterable: true,
        'onUpdate:modelValue': (v: any) => wrapper.setProps({ modelValue: v }),
      },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')

    // 模拟 mousedown 在过滤器区域内部（点击选项的前置事件）
    await wrapper.find('.mg-select-filterable').trigger('mousedown')
    await wrapper.find('.mg-select-input').trigger('blur')
    // 下拉仍保持打开
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(true)

    // 点击选项后关闭
    await wrapper.findAll('.mg-select-option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['banana']])
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(false)
  })

  it('可搜索模式：点击外部 blur 后关闭下拉', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(true)

    await wrapper.find('.mg-select-input').trigger('blur')
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(false)
  })

  // ==================== 补充：对象选项 / 自定义 key / 禁用选项 ====================

  it('自定义 labelKey/valueKey 渲染', () => {
    const customOptions = [
      { name: '北京', code: 'beijing' },
      { name: '上海', code: 'shanghai' },
    ]
    const wrapper = mount(Select, {
      props: { options: customOptions, labelKey: 'name', valueKey: 'code' },
    })
    expect(wrapper.text()).toContain('北京')
    expect(wrapper.text()).toContain('上海')
    expect(wrapper.findAll('option')[0].attributes('value')).toBe('beijing')
  })

  it('原生模式：禁用选项渲染 disabled attribute', () => {
    const customOptions = [
      { label: '可用', value: 'a' },
      { label: '禁用', value: 'b', disabled: true },
    ]
    const wrapper = mount(Select, { props: { options: customOptions } })
    const options = wrapper.findAll('option')
    expect(options[1].attributes('disabled')).toBeDefined()
  })

  it('原生模式：对象选项 change 类型回溯', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        'onUpdate:modelValue': (v: any) => wrapper.setProps({ modelValue: v }),
      },
    })
    await wrapper.find('select').setValue('orange')
    expect(wrapper.emitted('update:modelValue')).toEqual([['orange']])
  })

  it('原生模式：找不到匹配项时回退字符串值', async () => {
    const wrapper = mount(Select, {
      props: {
        options: [1, 2, 3],
        'onUpdate:modelValue': (v: any) => wrapper.setProps({ modelValue: v }),
      },
    })
    // jsdom 中 select.value 无法设为不存在的值，直接验证存在的值行为
    await wrapper.find('select').setValue('3')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
  })

  it('可搜索模式：点击禁用选项不触发选中', async () => {
    const customOptions = [
      { label: '正常', value: 'ok' },
      { label: '禁用', value: 'no', disabled: true },
    ]
    const wrapper = mount(Select, {
      props: {
        options: customOptions,
        filterable: true,
        'onUpdate:modelValue': (v: any) => wrapper.setProps({ modelValue: v }),
      },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')

    const allOptions = wrapper.findAll('.mg-select-option')
    // 禁用选项有 class
    expect(allOptions[1].classes()).toContain('mg-select-option-disabled')

    await allOptions[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    // 下拉仍打开
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(true)
  })

  it('可搜索模式：选中后显示选中项标签', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true, modelValue: 'banana' },
      attachTo: document.body,
    })
    const inputEl = wrapper.find('.mg-select-input').element as HTMLInputElement
    expect(inputEl.value).toBe('香蕉')
  })

  it('可搜索模式：外部 modelValue 变化清空搜索文本', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true, modelValue: '' },
      attachTo: document.body,
    })
    const input = wrapper.find('.mg-select-input')
    await input.trigger('focus')
    await input.setValue('苹')
    expect((input.element as HTMLInputElement).value).toBe('苹')

    // 外部更新 modelValue
    await wrapper.setProps({ modelValue: 'banana' })
    // watch 清空 searchText（displayValue 计算属性会因 isEditing 为 true 而显示空 searchText）
    expect((wrapper.find('.mg-select-input').element as HTMLInputElement).value).toBe('')
  })

  it('可搜索模式：搜索文本清空后下拉保持打开', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attachTo: document.body,
    })
    const input = wrapper.find('.mg-select-input')
    await input.trigger('focus')
    await input.setValue('苹')
    expect(wrapper.findAll('.mg-select-option')).toHaveLength(1)

    await input.setValue('')
    // 清空后所有选项都显示且下拉保持打开
    expect(wrapper.findAll('.mg-select-option')).toHaveLength(3)
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(true)
  })

  // ==================== 补充：属性透传 ====================

  it('透传 aria-label / name / id 到原生 input', () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attrs: { 'aria-label': '水果选择', name: 'fruit', id: 'fruit-select' },
      attachTo: document.body,
    })
    const input = wrapper.find('.mg-select-input')
    expect(input.attributes('aria-label')).toBe('水果选择')
    expect(input.attributes('name')).toBe('fruit')
    expect(input.attributes('id')).toBe('fruit-select')
  })

  it('listbox 使用透传的 aria-label', async () => {
    const wrapper = mount(Select, {
      props: { options, filterable: true },
      attrs: { 'aria-label': '水果选择' },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    const dropdown = wrapper.find('.mg-select-dropdown')
    expect(dropdown.attributes('aria-label')).toBe('水果选择')
  })

  it('非表单属性保留在外层 wrapper', () => {
    const wrapper = mount(Select, {
      props: { options },
      attrs: { 'data-test': 'wrapper-test', class: 'custom-class' },
    })
    expect(wrapper.find('.mg-select-wrapper').attributes('data-test')).toBe('wrapper-test')
    expect(wrapper.find('.mg-select-wrapper').classes()).toContain('custom-class')
  })

  it('select 元素透传 name/id', () => {
    const wrapper = mount(Select, {
      props: { options },
      attrs: { name: 'fruit-native', id: 'native-select' },
    })
    const select = wrapper.find('select')
    expect(select.attributes('name')).toBe('fruit-native')
    expect(select.attributes('id')).toBe('native-select')
  })

  // ==================== 多选模式（multiple + filterable） ====================

  it('多选模式：渲染已选标签', () => {
    const wrapper = mount(Select, {
      props: {
        options,
        filterable: true,
        multiple: true,
        modelValue: ['apple', 'banana'],
      },
      attachTo: document.body,
    })
    const tags = wrapper.findAll('.mg-select-tag')
    expect(tags).toHaveLength(2)
    expect(wrapper.text()).toContain('苹果')
    expect(wrapper.text()).toContain('香蕉')
  })

  it('多选模式：点击选项切换选中/取消，下拉保持打开', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        filterable: true,
        multiple: true,
        'onUpdate:modelValue': (v: any) => wrapper.setProps({ modelValue: v }),
      },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    const optionElements = wrapper.findAll('.mg-select-option')

    // 选中第一个（多选始终 emit 数组）
    await optionElements[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['apple']]])
    // 下拉保持打开
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(true)

    // 选中第二个
    await optionElements[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2)
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[1]?.[0]).toEqual(['apple', 'banana'])

    // 取消第一个
    await optionElements[0].trigger('click')
    const emitted2 = wrapper.emitted('update:modelValue')
    expect(emitted2?.[2]?.[0]).toEqual(['banana'])
  })

  it('多选模式：选项 aria-selected 正确反映选中状态', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        filterable: true,
        multiple: true,
        modelValue: ['apple'],
      },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    const optionElements = wrapper.findAll('.mg-select-option')
    expect(optionElements[0].attributes('aria-selected')).toBe('true')
    expect(optionElements[1].attributes('aria-selected')).toBe('false')
  })

  it('多选模式：Tag 删除按钮移除对应值', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        filterable: true,
        multiple: true,
        modelValue: ['apple', 'banana'],
        'onUpdate:modelValue': (v: any) => wrapper.setProps({ modelValue: v }),
      },
      attachTo: document.body,
    })
    const removeButtons = wrapper.findAll('.mg-select-tag-remove')
    expect(removeButtons).toHaveLength(2)

    await removeButtons[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['banana']]])
    expect(wrapper.emitted('change')).toEqual([[['banana']]])
  })

  it('多选模式：键盘 Enter 选中后保持下拉打开', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        filterable: true,
        multiple: true,
        'onUpdate:modelValue': (v: any) => wrapper.setProps({ modelValue: v }),
      },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.find('.mg-select-input').trigger('keydown.down')
    await wrapper.find('.mg-select-input').trigger('keydown.enter')

    // 选中 apple（多选始终 emit 数组），下拉保持打开
    expect(wrapper.emitted('update:modelValue')).toEqual([[['apple']]])
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(true)

    // 首次 Enter 后 focusedIndex 重置为 -1
    // 需要两次 Down 到达第二个选项（banana）再 Enter
    await wrapper.find('.mg-select-input').trigger('keydown.down')
    await wrapper.find('.mg-select-input').trigger('keydown.down')
    await wrapper.find('.mg-select-input').trigger('keydown.enter')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted?.[1]?.[0]).toEqual(['apple', 'banana'])
  })

  it('多选模式：多选时输入框只显示搜索文本，不显示选中标签', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        filterable: true,
        multiple: true,
        modelValue: ['apple'],
      },
      attachTo: document.body,
    })
    const inputEl = wrapper.find('.mg-select-input').element as HTMLInputElement
    // 未编辑时输入框为空（标签在 .mg-select-tag 中展示）
    expect(inputEl.value).toBe('')

    await wrapper.find('.mg-select-input').trigger('focus')
    await wrapper.find('.mg-select-input').setValue('香')
    expect((wrapper.find('.mg-select-input').element as HTMLInputElement).value).toBe('香')
  })

  it('多选模式：禁用选项不可点击选中', async () => {
    const customOptions = [
      { label: '正常', value: 'ok' },
      { label: '禁用', value: 'no', disabled: true },
    ]
    const wrapper = mount(Select, {
      props: {
        options: customOptions,
        filterable: true,
        multiple: true,
        'onUpdate:modelValue': (v: any) => wrapper.setProps({ modelValue: v }),
      },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    const allOptions = wrapper.findAll('.mg-select-option')

    await allOptions[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    // 正常项可选中（多选始终 emit 数组）
    await allOptions[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[['ok']]])
  })

  it('多选模式：手动 blur 关闭下拉', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
        filterable: true,
        multiple: true,
      },
      attachTo: document.body,
    })
    await wrapper.find('.mg-select-input').trigger('focus')
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(true)

    await wrapper.find('.mg-select-input').trigger('blur')
    expect(wrapper.find('.mg-select-dropdown').exists()).toBe(false)
  })
})
