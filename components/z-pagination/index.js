import React from 'react'
import { Pagination } from 'antd'
import classnames from 'classnames/dedupe'
import ZSelect from '../z-select'
import styles from './styles.styl'

const prefixCls = 'z-pagination'
const cx = classnames.bind(styles)

export default function ZPagination (props) {
  const getIcons = () => {
    const direction = props.direction
    const prevIcon = (
      <button className={cx(`${prefixCls}-item-link`)} type='button' tabIndex={-1}>
        <span className={cx('link-icon', 'link-prev-icon')}></span>
      </button>
    )
    const nextIcon = (
      <button className={cx(`${prefixCls}-item-link`)} type='button' tabIndex={-1}>
        <span className={cx('link-icon', 'link-next-icon')}></span>
      </button>
    )

    if (direction === 'rtl') {
      [prevIcon, nextIcon] = [nextIcon, prevIcon]
    }
    return {
      prevIcon,
      nextIcon,
    }
  }

  return (
    <Pagination
      {...props}
      {...getIcons()}
      selectComponentClass={ZSelect}
    />
  )
}
