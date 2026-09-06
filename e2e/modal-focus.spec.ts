import { test, expect } from '@playwright/test'

// ==================== Modal 焦点管理（打开入弹层、关闭回触发） ====================

test.describe('Modal 焦点管理', () => {
  test('打开后焦点进入弹层内首个可聚焦元素', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('open-modal').click()
    await expect(page.locator('.mg-modal')).toBeVisible()

    // 焦点应在弹层内（关闭按钮是第一个可聚焦元素）
    const active = await page.evaluate(() => document.activeElement?.closest('.mg-modal') !== null)
    expect(active).toBe(true)
  })

  test('ESC 关闭后焦点返回触发按钮', async ({ page }) => {
    await page.goto('/')

    const trigger = page.getByTestId('open-modal')
    await trigger.click()
    await expect(page.locator('.mg-modal')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.locator('.mg-modal')).not.toBeVisible()

    // 焦点回到触发按钮（H2 修复的验证）
    await expect(page.locator('body')).toHaveText(/.+/)
    const focusedTrigger = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null
      return el?.dataset?.testid === 'open-modal'
    })
    expect(focusedTrigger).toBe(true)
  })

  test('遮罩点击关闭后焦点返回触发按钮', async ({ page }) => {
    await page.goto('/')

    const trigger = page.getByTestId('open-modal')
    await trigger.click()
    await expect(page.locator('.mg-modal')).toBeVisible()

    // 点击遮罩（modal-overlay）
    await page.locator('.mg-modal-overlay').click({ position: { x: 10, y: 10 } })
    await expect(page.locator('.mg-modal')).not.toBeVisible()

    const focusedTrigger = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null
      return el?.dataset?.testid === 'open-modal'
    })
    expect(focusedTrigger).toBe(true)
  })
})
