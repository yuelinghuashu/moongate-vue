// src/__tests__/helpers/axe.ts
import * as axe from 'axe-core'

/**
 * 对给定 DOM 元素执行 axe-core 可访问性检查。
 *
 * 返回所有 violations（违规项）。
 * 测试中断言 `violations` 为空数组即代表无 a11y 问题。
 *
 * @param element - 要检查的 DOM 元素（通常为 wrapper.element）
 * @returns axe 检查结果
 *
 * @example
 * ```ts
 * import { expectNoViolations } from '../helpers/axe'
 *
 * it('无 a11y 违规', async () => {
 *   const wrapper = mount(Modal, { props: { modelValue: true } })
 *   await nextTick()
 *   await expectNoViolations(wrapper.element)
 * })
 * ```
 */
export async function runAxe(element: HTMLElement): Promise<axe.AxeResults> {
  // jsdom 中 wrapper.element 可能是分离的 DOM，axe-core 要求元素在页面上下文（document）中
  // 因此运行时临时挂载到 body，结束后由调用方移除
  if (!document.body.contains(element)) {
    document.body.appendChild(element)
  }

  return axe.run(element, {
    // 禁用与"组件库测试环境"无关的规则
    rules: {
      // jsdom 中 color-contrast 无法正确计算（无真实渲染引擎）
      'color-contrast': { enabled: false },
      // 单测将组件直接挂载到 body，不在任何 landmark（header/main/footer）内，
      // 这是测试环境 artifact 而非组件缺陷
      region: { enabled: false },
    },
  })
}

/**
 * 断言指定元素无 axe-core 可访问性违规。
 * 若存在违规，会打印详细违规信息帮助定位问题。
 *
 * @param element - 要检查的 DOM 元素
 */
export async function expectNoViolations(element: HTMLElement): Promise<void> {
  const results = await runAxe(element)
  const violations = results.violations

  if (violations.length > 0) {
    const details = violations
      .map(
        (v) =>
          `\n❌ ${v.id}: ${v.help}\n   Impact: ${v.impact}\n   Nodes: ${v.nodes.length}\n   Help URL: ${v.helpUrl}`,
      )
      .join('\n')

    throw new Error(`可访问性违规（${violations.length} 项）:${details}`)
  }
}
