
import React from 'react'
import ClassName from 'classnames/dedupe'
import styles from './styles.styl'

const cx = ClassName.bind(styles)

export default function PageModule(props) {
  let { title, tip = '', children, icon = '' } = props
  return (
    <div className={cx('page-module', 'web-components')}>
      <div className={cx('module-wrapper')}>
        <div className={cx('module-title')}>
          {icon && <img className={cx('title-icon')} src={icon} />}
          <span className={cx('title-text')}>{title}</span>
        </div>
        <span className={cx('module-tip')}>{tip}</span>
      </div>
      <div className={cx('module-body')}>
        {children}
      </div>
    </div>
  )
}
