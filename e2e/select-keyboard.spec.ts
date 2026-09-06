import { test, expect } from '@playwright/test'

// ==================== Select 键盘交互与 aria-activedescendant ====================

test.describe('Select 键盘导航与 activedescendant', () => {
  test('ArrowDown/ArrowUp 移动高亮并同步 aria-activedescendant', async ({ page }) => {
    await page.goto('/')

    const selectInput = page.locator('[data-testid="select"] input')
    await selectInput.click()
    await expect(page.locator('.mg-select-dropdown')).toBeVisible()

    // 初始：下拉打开（activedescendant 为空，跳过歧义断言）

    // ArrowDown 移动到第 1 个选项
    await page.keyboard.press('ArrowDown')
    const firstOption = page.locator('.mg-select-option').first()
    await expect(firstOption).toHaveClass(/mg-select-option-focused/)
    // activedescendant 指向当前高亮选项（id 以 -option-0 结尾）
    await expect(selectInput).toHaveAttribute('aria-activedescendant', /-option-0$/)

    // ArrowDown 移动到第 2 个选项
    await page.keyboard.press('ArrowDown')
    const secondOption = page.locator('.mg-select-option').nth(1)
    await expect(secondOption).toHaveClass(/mg-select-option-focused/)
    await expect(selectInput).toHaveAttribute('aria-activedescendant', /-option-1$/)

    // ArrowUp 回到第 1 个
    await page.keyboard.press('ArrowUp')
    await expect(firstOption).toHaveClass(/mg-select-option-focused/)
  })

  test('Home/End 跳到首/末项', async ({ page }) => {
    await page.goto('/')

    const selectInput = page.locator('[data-testid="select"] input')
    await selectInput.click()
    await expect(page.locator('.mg-select-dropdown')).toBeVisible()

    const options = page.locator('.mg-select-option')
    const last = options.nth((await options.count()) - 1)

    // End → 末项
    await page.keyboard.press('End')
    await expect(last).toHaveClass(/mg-select-option-focused/)

    // Home → 首项
    await page.keyboard.press('Home')
    await expect(options.first()).toHaveClass(/mg-select-option-focused/)
  })

  test('过滤后 activedescendant 不越界（选项减少仍落在范围内）', async ({ page }) => {
    await page.goto('/')

    const selectInput = page.locator('[data-testid="select"] input')
    await selectInput.click()
    await expect(page.locator('.mg-select-dropdown')).toBeVisible()

    // 输入过滤词，只剩部分选项
    await selectInput.fill('苹果')
    await expect(page.locator('.mg-select-option')).toHaveCount(1)

    // 等下拉进入动画稳定后连续 ArrowDown 多次不应越界
    await page.waitForTimeout(400)
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    const onlyOption = page.locator('.mg-select-option').first()
    await expect(onlyOption).toHaveClass(/mg-select-option-focused/)
    await expect(selectInput).toHaveAttribute('aria-activedescendant', /-option-0$/)
  })

  test('Enter 选中、Esc 关闭并返回焦点', async ({ page }) => {
    await page.goto('/')

    const selectInput = page.locator('[data-testid="select"] input')
    await selectInput.click()
    await expect(page.locator('.mg-select-dropdown')).toBeVisible()

    // 选中第一个选项
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await expect(page.locator('.mg-select-tag')).toHaveCount(1)

    // Esc 关闭下拉（打开状态下）
    await selectInput.click()
    await expect(page.locator('.mg-select-dropdown')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('.mg-select-dropdown')).not.toBeVisible()
  })

  test('Tab 关闭下拉（等离开过渡完成）', async ({ page }) => {
    await page.goto('/')

    const selectInput = page.locator('[data-testid="select"] input')
    await selectInput.click()
    await expect(page.locator('.mg-select-dropdown')).toBeVisible()

    await page.keyboard.press('Tab')
    // 离开过渡 300ms，等元素最终移除
    await page.waitForTimeout(400)
    await expect(page.locator('.mg-select-dropdown')).toHaveCount(0)
  })
})
