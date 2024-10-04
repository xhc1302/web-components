import React, { useState } from 'react'
import classNames from 'classnames/bind'
import styles from './styles.styl'

const cx = classNames.bind(styles)

export default function ZPhoneWrapper (props) {
  let { value, className } = props

  const [visible, setVisible] = useState(false)

  const onToggleVisible = () => {
    setVisible(!visible)
  }

  return (
    <div className={cx('z-phone-wrapper', className)}>
      <span>{visible ? value : '*********'}</span>
      <span
        className={cx('icon-view', { visible, mask: !visible })}
        onClick={onToggleVisible}>
      </span>
    </div>
  )
}
