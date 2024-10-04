import React, { Fragment, useState } from 'react'
import { Button } from 'antd'
import classnames from 'classnames/dedupe'
import styles from './styles.styl'

const cx = classnames.bind(styles)

export default function PageWrapper({
  className,
  contentClassName,
  wrapperClassName,
  withFooter = false,
  okText = '',
  cancelText = '',
  children,
  ...props
}) {
  const [loading, setLoading] = useState(false)
  const onBack = () => history.go(-1)
  const onSubmit = async () => {
    let { onSubmit } = props
    try {
      setLoading(true)
      onSubmit && await onSubmit()
    } catch (error) {
      throw (error)
    } finally {
      setLoading(false)
    }
  }

  const renderFooter = () => {
    let { renderFooter, onCancel, onSubmit: showSubmit } = props
    return (
      <div className={cx('app-page-footer')}>

        {renderFooter
          ? renderFooter()
          : <Fragment>
            <div className={cx('app-page-footer-inner')}>
              <span
                className={cx('action-item', { 'cancel-active': !showSubmit })}
                onClick={!!onCancel ? onCancel : onBack}>
                {!!cancelText ? cancelText : '返回'}
              </span>
              {showSubmit &&
                <span
                  className={cx('action-item', 'submit-item')}
                  onClick={onSubmit}
                  loading={loading}>
                  {loading ? '提交中' : !!okText ? okText : '提交'}
                </span>
              }
            </div>
          </Fragment>
        }
      </div>
    )
  }

  return (
    <div className={cx('app-page-wrapper', 'web-components', wrapperClassName)} {...props}>
      {withFooter && renderFooter()}
      <div className={cx('app-page-body', className)}>
        <div className={cx('app-page-content', contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  )
}
