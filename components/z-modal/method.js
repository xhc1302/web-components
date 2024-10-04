import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import classNames from 'classnames/bind'
import ZModal from './modal'
import styles from './styles.styl'

const cx = classNames.bind(styles)

const containers = []

function unmount (container) {
  const unmountResult = ReactDOM.unmountComponentAtNode(container)
  if (unmountResult && container.parentNode) {
    container.parentNode.removeChild(container)
  }
}

export function show (props) {
  const {
    className,
    content,
    okText = '确定',
    okType = 'primary',
    okButtonProps = {},
    confirmLoading = false,
    cancelText = '取消',
    showCancel = false,
    onOk,
    onCancel,
  } = props
  const parentContainer = document.body
  const container = document.createElement('div')
  parentContainer.appendChild(container)
  clear()
  containers.push(container)

  const TempModal = () => {
    const [visible, setVisible] = useState(true)
    const [loading, setLoading] = useState(false)
    const onDone = async () => {
      setLoading(true)
      await onOk?.()
      setVisible(false)
      setLoading(false)
    }

    const onClose = async () => {
      await onCancel?.()
      setVisible(false)
    }

    const footer = () => {
      return (
        <div className={cx('z-modal-notice-footer')}>
          
          {showCancel &&
            <Button className={cx('footer-button')} onClick={onClose}>{cancelText}</Button>
          }
          <Button
            type={okType}
            className={cx('footer-button')}
            loading={confirmLoading || loading}
            {...okButtonProps}
            onClick={onDone}>
            {okText}
          </Button>
        </div>
      )
    }

    return (
      <ZModal
        {...props}
        visible={visible}
        closable={false}
        width={255}
        wrapClassName={cx('z-modal-notice')}
        footer={footer()}
        onOk={onDone}
        onCancel={onClose}>
        {!!content && <p className={cx(className)}>{content}</p>}
      </ZModal>
    )
  }

  ReactDOM.render(<TempModal />, container)
}

export function showLoading (props) {
  const { className, show = true, message = '处理中...' } = props
  if (!show) {
    clear()
    return
  }
  const parentContainer = document.body
  const container = document.createElement('div')
  parentContainer.appendChild(container)
  clear()
  containers.push(container)

  const LoadingDom = () => {
    return (
      <div className={cx('z-modal-loading', className)}>
        <div className={cx('modal-inner')}>
          <div className={cx('loading')}></div>
          <p>{message}</p>
        </div>
      </div>
    )
  }

  ReactDOM.render(<LoadingDom />, container)
}

export function info (props = {}) {
  return show({ showCancel: false, ...props })
}

export function success (props = {}) {
  return show({ showCancel: false, ...props })
}

export function confirm (props = {}) {
  return show({ ...props })
}

export function loading (props = {}) {
  return showLoading(props)
}

export function clear () {
  while (true) {
    const container = containers.pop()
    if (!container) break
    unmount(container)
  }
}
