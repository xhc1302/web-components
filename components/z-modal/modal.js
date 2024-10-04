import React from 'react'
import { Modal } from 'antd'
import DownloadWrapper from '../download-wrapper'
import classNames from 'classnames/bind'
import styles from './styles.styl'

const cx = classNames.bind(styles)
export default class ZModal extends React.PureComponent {

  componentDidMount() {
    let { onAfterOpen } = this.props
    onAfterOpen && onAfterOpen()
  }

  renderCloseIcon = () => {
    return (
      <div className={cx('z-modal-icon-close')}>
        <img src='https://oss-static.eaiot.cloud/aiot-factory-web/2021-03-22-closed16_grey@2x-ec27ee.png' alt='' />
      </div>
    )
  }

  renderFooter = () => {
    let { showSubmit = true, onOk, confirmLoading = false, isDownload = false, onCancel, okText, cancelText } = this.props
    return (
      <div className={cx('modal-footer-inner')}>
        <span
          className={cx('action-item', { 'cancel-active': !showSubmit })}
          onClick={onCancel}>
          {!!cancelText ? cancelText : '取消'}
        </span>
        {showSubmit && !isDownload &&
          <span
            className={cx('action-item', 'submit-item')}
            onClick={onOk}
            loading={confirmLoading}>
            {confirmLoading ? '提交中' : !!okText ? okText : '确定'}
          </span>
        }
        {showSubmit && isDownload &&
          <DownloadWrapper onDownload={onOk}>
            <span
              className={cx('action-item', 'submit-item')}
              loading={confirmLoading}>
              {confirmLoading ? '提交中' : !!okText ? okText : '确定'}
            </span>
          </DownloadWrapper>
        }
      </div>
    )
  }

  render() {
    let { children, wrapClassName, ...props } = this.props
    return (
      <Modal
        centered
        forceRender={true}
        destroyOnClose={true}
        bodyStyle={{ padding: '24px 36px' }}
        closeIcon={this.renderCloseIcon()}
        footer={this.renderFooter()}
        {...props}
        wrapClassName={cx('z-modal', `${wrapClassName}`)}>
        {children}
      </Modal>
    )
  }
}
