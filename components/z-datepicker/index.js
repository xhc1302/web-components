import React from 'react'
import { DatePicker } from 'antd'
import classnames from 'classnames/bind'
import styles from './styles.styl'

const cx = classnames.bind(styles)

const suffixIcon = (
  <img
    style={{ width: 16, height: 16, objectFit: 'cover' }}
    src='https://aiot-web-static.oss-cn-hangzhou.aliyuncs.com/aiot-factory-web/date16%402x.png'
    alt='' />
)

const suffixIcon1 = (
  <img
    style={{ width: 16, height: 16, objectFit: 'cover' }}
    src='https://oss-static.eaiot.cloud/aiot-web/20230212-time_begin@2x.png'
    alt='' />
)

const separator = (
  <span style={{
    width: 16,
    height: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2
  }}>
    <img
      style={{ width: '100%', height: 6, objectFit: 'cover' }}
      src='https://oss-static.eaiot.cloud/aiot-factory-web/2022-07-19-l@2x-6a0bf2.png'
      alt='' />
  </span>
)

function ZDatePicker (props) {

  return (
    <DatePicker
      {...props}
      popupClassName={cx('z-datapicker-pop')}
      suffixIcon={suffixIcon}
    />
  )
}

function ZRangePicker (props) {
  return (
    <DatePicker.RangePicker
      {...props}
      popupClassName={cx('z-rangedatapicker-pop')}
      suffixIcon={suffixIcon1}
      separator={separator}
    />
  )
}

ZDatePicker.RangePicker = ZRangePicker
export default ZDatePicker
