import React from 'react'
import { Select } from 'antd'

function ZSelect (props) {
  const suffixIcon = () => {
    if (props.suffixIcon) {
      return props.suffixIcon()
    }
    return (
      <img
        style={{ width: 12, height: 12, objectFit: 'cover' }}
        src='https://oss-static.eaiot.cloud/aiot-web/2022-07-19-arrow-down@2x-4da2df.png'
        alt='' />
    )
  }

  const clearIcon = () => {
    if (props.clearIcon) {
      return props.clearIcon()
    }
    return (
      <img
        style={{ maxWidth: '100%', objectFit: 'cover' }}
        src='https://oss-static.eaiot.cloud/aiot-web/2022-07-19-clear@2x-648584.png'
        alt='' />
    )
  }
  return (
    <Select
      {...props}
      suffixIcon={suffixIcon()}
      clearIcon={clearIcon()}
    />
  )
}

ZSelect.Option = Select.Option
ZSelect.OptGroup = Select.OptGroup
export default ZSelect
