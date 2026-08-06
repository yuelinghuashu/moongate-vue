import { test, expect } from '@playwright/test'

// ==================== 组件渲染冒烟 ====================

test.describe('组件渲染冒烟', () => {
  test('页面加载后基础组件正常渲染', async ({ page }) => {
    await page.goto('/')

    // 基础组件
    await expect(page.getByTestId('basic')).toBeVisible()
    await expect(page.getByTestId('btn')).toBeVisible()
    // 按钮 + 悬停提示内 + 弹出触发等共 7 个
    await expect(page.locator('.mg-button')).toHaveCount(7)
    await expect(page.locator('.mg-badge')).toBeVisible()
    await expect(page.locator('.mg-card')).toBeVisible()
    await expect(page.locator('.mg-divider')).toBeVisible()
  })

  test('表单组件正常渲染', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.mg-input')).toBeVisible()
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
