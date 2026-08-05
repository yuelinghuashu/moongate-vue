import { describe, it, expect, afterEach } from 'vitest'
import { useMessage } from '../../composables/useMessage'
import { closeAllOverlays } from '../../composables/createOverlay'

describe('useMessage', () => {
  afterEach(() => {
    closeAllOverlays()
    document.body.innerHTML = ''
    document.querySelectorAll('.mg-message-container').forEach((el) => el.remove())
  })

  it('show 显示消息', () => {
    const { show } = useMessage()
    show({ message: '测试消息' })
    const container = document.body.querySelector('.mg-message-container')
    expect(container).not.toBeNull()
    expect(container?.textContent).toContain('测试消息')
  })

  it('success 方法显示成功消息', () => {
    const { success } = useMessage()
    success('操作成功')
    const msg = document.body.querySelector('.mg-message')
    expect(msg).not.toBeNull()
    expect(msg?.classList.contains('mg-message-success')).toBe(true)
    expect(msg?.textContent).toContain('操作成功')
  })

  it('error 方法显示错误消息', () => {
    const { error } = useMessage()
    error('出错了')
    const msg = document.body.querySelector('.mg-message-error')
    expect(msg).not.toBeNull()
  })

  it('warning 方法显示警告消息', () => {
    const { warning } = useMessage()
    warning('请注意')
    expect(document.body.querySelector('.mg-message-warning')).not.toBeNull()
  })

  it('info 方法显示信息消息', () => {
    const { info } = useMessage()
    info('普通信息')
    expect(document.body.querySelector('.mg-message-info')).not.toBeNull()
  })

  it('支持同时显示多条消息（堆叠）', () => {
    const { success, error } = useMessage()
    success('第一条')
    error('第二条')
    const container = document.body.querySelector('.mg-message-container')
    expect(container?.querySelectorAll('.mg-message')).toHaveLength(2)
  })

  it('options 透传 duration/closable', () => {
    const { success } = useMessage()
    success('带选项', { duration: 5000, closable: true })
    const msg = document.body.querySelector('.mg-message')
    expect(msg?.querySelector('.mg-message-close')).not.toBeNull()
  })
})
