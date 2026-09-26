import { test, expect } from '@playwright/test'

// ==================== 组件渲染冒烟 ====================

test.describe('组件渲染冒烟', () => {
  test('页面加载后基础组件正常渲染', async ({ page }) => {
    await page.goto('/')

    // 基础组件
    await expect(page.getByTestId('basic')).toBeVisible()
    await expect(page.getByTestId('btn')).toBeVisible()
    // 按钮 + 悬停提示内 + 弹出触发等共 8 个
    await expect(page.locator('.mg-button')).toHaveCount(8)
    await expect(page.locator('.mg-badge')).toBeVisible()
    await expect(page.locator('.mg-card')).toBeVisible()
    await expect(page.locator('.mg-divider')).toBeVisible()
  })

  test('默认尺寸档为 md，且比 lg 档更紧凑（尺寸阶梯真实生效）', async ({ page }) => {
    await page.goto('/')

    // 默认按钮 = md 档（size prop 默认值即 'md'）
    await expect(page.getByTestId('btn')).toHaveClass(/mg-button-md/)

    const defaultBox = await page.getByTestId('btn').boundingBox()
    const largeBox = await page.getByTestId('btn-lg').boundingBox()
    expect(defaultBox).not.toBeNull()
    expect(largeBox).not.toBeNull()

    // 默认档落在 md 高度区间（不再是小号）
    expect(defaultBox!.height).toBeGreaterThan(35)
    expect(defaultBox!.height).toBeLessThan(39)
    // 相对比较，避免依赖具体字体渲染尺寸
    expect(defaultBox!.height).toBeLessThan(largeBox!.height)
  })

  test('同档位控件高度一致（控件高度由库决定，不随宿主行高漂移）', async ({ page }) => {
    await page.goto('/')

    // md 档（各组件 size prop 的默认档）控件在同一父容器下必须落在同一高度带。
    // 回归背景：Input/Badge/Select/Tab 未声明 font-size/line-height 时，
    // 宿主 `input,button,select { line-height: inherit }` 会把它们抬到宿主行高
    // （文档站实测 Input 42px / Badge 40px vs Button 37px）。
    const heights = await page.evaluate(() => {
      const host = document.createElement('div')
      host.style.cssText =
        'position:fixed;left:-9999px;top:0;display:flex;align-items:flex-start;gap:10px'
      // 只比对「自身即是控件」的元素；.mg-tab 需在 .mg-tabs-header 里才有完整上下文，
      // 单独渲染会带上 UA 默认按钮样式，故不纳入本断言（其契约由 CSS 单测覆盖）
      host.innerHTML = [
        '<button class="mg-button mg-button-filled-primary">按钮</button>',
        '<input class="mg-input" value="输入" />',
        '<textarea class="mg-textarea" rows="1"></textarea>',
        '<select class="mg-select-native"><option>选择</option></select>',
        '<span class="mg-badge mg-badge-primary mg-badge-md">徽章</span>',
      ].join('')
      document.body.appendChild(host)
      const out = Array.from(host.children).map((el) => ({
        tag: el.tagName,
        h: Math.round(el.getBoundingClientRect().height * 10) / 10,
      }))
      host.remove()
      return out
    })

    for (const { tag, h } of heights) {
      expect(h, `${tag} 高度应落在 md 档高度带`).toBeGreaterThan(35)
      expect(h, `${tag} 高度应落在 md 档高度带`).toBeLessThan(41)
    }
    // 最大最小差不超过 4px（输入类控件含 1px 边框，天然比按钮高 2px）
    const values = heights.map((x) => x.h)
    expect(Math.max(...values) - Math.min(...values)).toBeLessThanOrEqual(4)
  })

  test('三档实测高度符合尺寸契约（sm≈25 / md≈37 / lg≈49）', async ({ page }) => {
    await page.goto('/')

    // 同一父容器下等比测量，三档均带 .mg-button-label 以对齐真实渲染结构
    const heights = await page.evaluate(() => {
      const classes = ['mg-button-sm', 'mg-button-md', 'mg-button-lg']
      const host = document.createElement('div')
      host.style.cssText =
        'position:fixed;left:-9999px;top:0;display:flex;align-items:flex-start;gap:12px'
      host.innerHTML = classes
        .map(
          (c) =>
            `<button class="mg-button mg-button-filled-primary ${c}"><span class="mg-button-label">尺寸</span></button>`,
        )
        .join('')
      document.body.appendChild(host)
      const out = Array.from(host.children).map((el) => el.getBoundingClientRect().height)
      host.remove()
      return out
    })

    const [sm, md, lg] = heights
    // 容差 ±2px，避免字体渲染差异导致脆弱；上限约住「档位取值被改回 md」的回归
    expect(sm).toBeGreaterThan(23)
    expect(sm).toBeLessThan(27)
    expect(md).toBeGreaterThan(35)
    expect(md).toBeLessThan(39)
    expect(lg).toBeGreaterThan(47)
    expect(lg).toBeLessThan(51)
    // 阶梯单调
    expect(sm).toBeLessThan(md)
    expect(md).toBeLessThan(lg)
  })

  test('表单组件正常渲染', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.mg-input').first()).toBeVisible()
    await expect(page.locator('.mg-textarea')).toBeVisible()
    await expect(page.locator('.mg-checkbox')).toBeVisible()
    await expect(page.locator('.mg-radio')).toBeVisible()
    await expect(page.locator('.mg-switch')).toBeVisible()
    await expect(page.locator('.mg-select-wrapper')).toBeVisible()
    await expect(page.locator('.mg-select-multiple')).toBeVisible()
  })

  test('数据展示组件正常渲染', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.mg-table')).toBeVisible()
    await expect(page.locator('.mg-pagination')).toBeVisible()
    await expect(page.locator('.mg-tabs')).toBeVisible()
    await expect(page.locator('.mg-skeleton')).toBeVisible()
  })

  test('布局组件正常渲染', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.mg-container')).toBeVisible()
    await expect(page.locator('.mg-layout-header')).toBeVisible()
    await expect(page.locator('.mg-layout-main')).toBeVisible()
    await expect(page.locator('.mg-layout-footer')).toBeVisible()
    await expect(page.locator('.mg-hero')).toBeVisible()
  })

  test('样式工具正常渲染', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.mg-link')).toBeVisible()
    await expect(page.locator('.mg-code-inline')).toBeVisible()
  })
})

// ==================== 关键交互冒烟 ====================

test.describe('关键交互冒烟', () => {
  test('Modal 打开/关闭', async ({ page }) => {
    await page.goto('/')

    // 初始不显示
    await expect(page.locator('.mg-modal')).not.toBeVisible()

    // 点击打开
    await page.getByTestId('open-modal').click()
    await expect(page.locator('.mg-modal')).toBeVisible()
    await expect(page.locator('.mg-modal').getByText('模态框标题')).toBeVisible()

    // ESC 关闭
    await page.keyboard.press('Escape')
    await expect(page.locator('.mg-modal')).not.toBeVisible()
  })

  test('Drawer 打开/关闭', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.mg-drawer')).not.toBeVisible()

    await page.getByTestId('open-drawer').click()
    await expect(page.locator('.mg-drawer')).toBeVisible()
    await expect(page.locator('.mg-drawer').getByText('抽屉标题')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.locator('.mg-drawer')).not.toBeVisible()
  })

  test('Tooltip 悬停显示', async ({ page }) => {
    await page.goto('/')

    const tooltipTrigger = page.getByTestId('tooltip')
    await expect(page.locator('.mg-tooltip')).not.toBeVisible()

    await tooltipTrigger.hover()
    await expect(page.locator('.mg-tooltip')).toBeVisible()
    await expect(page.locator('.mg-tooltip').getByText('提示内容')).toBeVisible()
  })

  test('Select 多选', async ({ page }) => {
    await page.goto('/')

    const selectInput = page.locator('.mg-select-multiple input')
    await selectInput.click()

    // 下拉打开
    await expect(page.locator('.mg-select-dropdown')).toBeVisible()

    // 选择两个选项
    await page.locator('.mg-select-option').filter({ hasText: '苹果' }).click()
    await page.locator('.mg-select-option').filter({ hasText: '香蕉' }).click()

    // 标签显示
    await expect(page.locator('.mg-select-tag')).toHaveCount(2)
    await expect(page.locator('.mg-select-tag').first()).toContainText('苹果')
    await expect(page.locator('.mg-select-tag').nth(1)).toContainText('香蕉')

    // 删除一个标签
    await page.locator('.mg-select-tag-remove').first().click()
    await expect(page.locator('.mg-select-tag')).toHaveCount(1)
  })

  test('Table 行选择', async ({ page }) => {
    await page.goto('/')

    const rowCheckboxes = page.locator('.mg-table tbody .mg-table-checkbox')
    await expect(rowCheckboxes).toHaveCount(3)

    // 选中第一行
    await rowCheckboxes.first().check()
    await expect(page.locator('.mg-table tbody tr').first()).toHaveClass(/mg-table-row-selected/)

    // 全选
    await page.locator('.mg-table thead .mg-table-checkbox').check()
    await expect(page.locator('.mg-table tbody .mg-table-row-selected')).toHaveCount(3)

    // 取消全选
    await page.locator('.mg-table thead .mg-table-checkbox').uncheck()
    await expect(page.locator('.mg-table tbody .mg-table-row-selected')).toHaveCount(0)
  })

  test('Tabs 切换', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.mg-tab-panel').first()).toBeVisible()
    await expect(page.locator('.mg-tab-panel').first()).toContainText('标签一内容')

    // 切换到第二个标签
    await page.locator('.mg-tab').nth(1).click()
    await expect(page.locator('.mg-tab-panel-active')).toContainText('标签二内容')
  })

  test('Pagination 翻页', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.mg-pagination-current')).toHaveText('1')

    // 下一页（索引 0=first, 1=prev, 2=next, 3=last）
    await page.locator('.mg-pagination-btn').nth(2).click()
    // 当前页应为 2
    await expect(page.locator('.mg-pagination-current')).toHaveText('2')
  })

  test('Input 输入', async ({ page }) => {
    await page.goto('/')

    const input = page.getByTestId('input')
    await input.fill('你好，Moongate')
    await expect(input).toHaveValue('你好，Moongate')
  })

  test('深色模式切换', async ({ page }) => {
    await page.goto('/')

    // 默认浅色
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    // 添加 dark class
    await page.evaluate(() => document.documentElement.classList.add('dark'))
    await expect(page.locator('html')).toHaveClass(/dark/)

    // 移除恢复
    await page.evaluate(() => document.documentElement.classList.remove('dark'))
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })
})
