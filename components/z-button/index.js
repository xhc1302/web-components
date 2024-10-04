import React, { Fragment } from 'react'
import { Button } from 'antd'
import classnames from 'classnames/bind'
import styles from './styles.styl'

const cx = classnames.bind(styles)

function ZButton(props) {

  const primaryButton = () => {
    let { className } = props
    return (
      <Button
        {...props}
        className={cx('primary-btn', className)}
      />
    )
  }

  const searchButton = () => {
    let { className } = props
    return (
      <Button
        {...props}
        className={cx('search-btn', className)}
      />
    )

  }

  let { type = 'primary' } = props
  return (
    <div className={cx('btn-wrapper')}>
      {type == 'primary'
        ? primaryButton()
        : type == 'search'
          ? searchButton()
          : ''
      }
    </div>
  )
}

export default ZButton
