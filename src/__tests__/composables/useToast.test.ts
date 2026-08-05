import { describe, it, expect, afterEach } from 'vitest'
import { useToast } from '../../composables/useToast'
import { closeAllOverlays } from '../../composables/createOverlay'

describe('useToast', () => {
  afterEach(() => {
    closeAllOverlays()
    document.body.innerHTML = ''
    document.querySelectorAll('.mg-toast-container').forEach((el) => el.remove())
  })

  it('show 显示通知', () => {
    const { show } = useToast()
    show({ message: '测试通知' })
    const container = document.body.querySelector('.mg-toast-container')
    expect(container).not.toBeNull()
    expect(container?.textContent).toContain('测试通知')
  })

  it('success 方法显示成功通知', () => {
    const { success } = useToast()
    success('操作成功')
    const toast = document.body.querySelector('.mg-toast-success')
    expect(toast).not.toBeNull()
    expect(toast?.textContent).toContain('操作成功')
  })

  it('error/warning/info 方法显示对应类型', () => {
    const { error, warning, info } = useToast()
    error('出错了')
    warning('请注意')
    info('普通通知')
    expect(document.body.querySelector('.mg-toast-error')).not.toBeNull()
    expect(document.body.querySelector('.mg-toast-warning')).not.toBeNull()
    expect(document.body.querySelector('.mg-toast-info')).not.toBeNull()
  })

  it('支持堆叠多条通知', () => {
    const { success, warning } = useToast()
    success('第一条')
    warning('第二条')
    const container = document.body.querySelector('.mg-toast-container')
    expect(container?.querySelectorAll('.mg-toast')).toHaveLength(2)
  })

  it('position=bottom 使用底部容器', () => {
    const { success } = useToast()
    success('底部通知', { position: 'bottom' })
    const bottomContainer = document.body.querySelector(
      '.mg-toast-container.mg-toast-container-bottom',
    )
    expect(bottomContainer).not.toBeNull()
  })

  it('options 透传 closable', () => {
    const { info } = useToast()
    info('带关闭按钮', { closable: true })
    const toast = document.body.querySelector('.mg-toast')
    expect(toast?.querySelector('.mg-toast-close')).not.toBeNull()
  })
})
