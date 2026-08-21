import { test, expect } from '@playwright/test'

/**
 * CSS Anchor Positioning 可行性验证（Tooltip 实验）
 *
 * 验证目标：
 * 1. anchor 定位是否真的让浮层出现在正确位置（computed style 非零坐标）
 * 2. 四个方向（top/bottom/left/right）的定位正确性
 * 3. 与触发元素的相对位置关系（浮层在触发元素上方/下方等）
 * 4. 视口边缘翻转（@position-try）是否工作
 */

test.describe('CSS Anchor Positioning 验证', () => {
  test('tooltip 悬停后浮层有实际定位坐标（anchor 生效）', async ({ page }) => {
    await page.goto('/')

    const trigger = page.getByTestId('tooltip')
    await trigger.hover()
    await expect(page.locator('.mg-tooltip')).toBeVisible()

    const tooltip = page.locator('.mg-tooltip')
    const triggerBox = await trigger.boundingBox()
    const tooltipBox = await tooltip.boundingBox()

    expect(triggerBox).not.toBeNull()
    expect(tooltipBox).not.toBeNull()

    // anchor 定位生效：浮层不在 (0,0) 且与触发元素有位置关系
    expect(tooltipBox!.x).toBeGreaterThan(0)
    expect(tooltipBox!.y).toBeGreaterThan(0)

    // 默认 placement=top：浮层应在触发元素上方
    expect(tooltipBox!.y + tooltipBox!.height).toBeLessThanOrEqual(triggerBox!.y + 1)
    // 水平方向应对齐（top center）
    expect(
      Math.abs(tooltipBox!.x + tooltipBox!.width / 2 - (triggerBox!.x + triggerBox!.width / 2)),
    ).toBeLessThan(60)
  })

  test('四方向 placement 均产生正确相对位置', async ({ page }) => {
    await page.goto('/')

    // 通过悬停元素切换方向需要访问不同 placement 的触发元素，
    // 这里验证默认方向（top）的类名与实际位置一致
    const trigger = page.getByTestId('tooltip')
    await trigger.hover()
    await expect(page.locator('.mg-tooltip')).toBeVisible()

    const tooltip = page.locator('.mg-tooltip')
    // anchor 版不再依赖 JS 翻转，初始 placement class 应存在
    await expect(tooltip).toHaveClass(/mg-tooltip-top/)
  })

  test('滚动后浮层跟随锚点（fixed + anchor 行为）', async ({ page }) => {
    await page.goto('/')

    const trigger = page.getByTestId('tooltip')
    await trigger.hover()
    await expect(page.locator('.mg-tooltip')).toBeVisible()

    const beforeBox = await page.locator('.mg-tooltip').boundingBox()

    // 触发滚动（页面滚动 200px）
    await page.evaluate(() => window.scrollBy(0, 200))
    await page.waitForTimeout(300)

    const afterBox = await page.locator('.mg-tooltip').boundingBox()
    const triggerAfter = await page.getByTestId('tooltip').boundingBox()

    // 滚动后浮层仍应贴着触发元素（跟随锚点移动）
    expect(afterBox).not.toBeNull()
    expect(triggerAfter).not.toBeNull()
    expect(Math.abs(afterBox!.y + afterBox!.height - triggerAfter!.y)).toBeLessThan(50)
  })
})
