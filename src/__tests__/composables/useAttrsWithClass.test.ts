import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useAttrsWithClass } from '../../composables/useAttrsWithClass'

/** 测试宿主组件：透传 attrs 并合并内部 class */
const Host = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs }) {
    const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({
      'internal-class': true,
      'dynamic-class': attrs.active === 'true',
    }))
    return () => h('div', { ...attrsWithoutClass, class: mergedClass.value }, [])
  },
})

describe('useAttrsWithClass', () => {
  it('合并外部 class 与内部 class', () => {
    const wrapper = mount(Host, {
      attrs: { class: 'external-class' },
    })
    expect(wrapper.classes()).toContain('external-class')
    expect(wrapper.classes()).toContain('internal-class')
  })

  it('透传非 class 属性', () => {
    const wrapper = mount(Host, {
      attrs: { id: 'custom-id', 'data-test': 'test' },
    })
    expect(wrapper.attributes('id')).toBe('custom-id')
    expect(wrapper.attributes('data-test')).toBe('test')
  })

  it('合并数组形式的内部 class', () => {
    const HostArray = defineComponent({
      inheritAttrs: false,
      setup() {
        const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ['base', { cond: true }])
        return () => h('div', { ...attrsWithoutClass, class: mergedClass.value }, [])
      },
    })
    const wrapper = mount(HostArray)
    expect(wrapper.classes()).toContain('base')
    expect(wrapper.classes()).toContain('cond')
  })

  it('响应式 class 更新', async () => {
    // 重新挂载一个响应式属性驱动的组件，模拟 attrs 变化
    const ReactiveHost = defineComponent({
      inheritAttrs: false,
      props: { dynamic: { type: Boolean, default: false } },
      setup(props) {
        const { attrsWithoutClass, mergedClass } = useAttrsWithClass(() => ({
          'internal-class': true,
          'dynamic-class': props.dynamic,
        }))
        return () => h('div', { ...attrsWithoutClass, class: mergedClass.value }, [])
      },
    })

    const wrapper = mount(ReactiveHost, { props: { dynamic: false } })
    expect(wrapper.classes()).not.toContain('dynamic-class')

    await wrapper.setProps({ dynamic: true })
    expect(wrapper.classes()).toContain('dynamic-class')
  })
})
