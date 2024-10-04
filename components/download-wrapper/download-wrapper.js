import React, { Fragment, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames/bind'
import { message } from 'antd'
import styles from './styles.styl'

const cx = classNames.bind(styles)

export default function DownloadWrapper (props) {
  const { loadingTip = '下载中...', url, onDownload, onAfterDownload } = props
  const [loading, setLoading] = useState(false)

  function openFile (url, name = '') {
    const ele = document.createElement('a')
    ele.setAttribute('href', url)
    ele.setAttribute('target', '_blank')
    ele.setAttribute('download', name)
    ele.setAttribute('style', 'display:none')
    document.body.appendChild(ele)
    ele.click()
    document.body.removeChild(ele)
  }

  async function saveFile () {
    try {
      setLoading(true)
      let res = await onDownload?.()
      setLoading(false)
      if (!res) return
      let { fileName, data } = res || {}
      let blob = new Blob([data])
      let ele = document.createElement('a')
      let href = window.URL.createObjectURL(blob)
      ele.setAttribute('href', href)
      ele.setAttribute('download', fileName)
      ele.setAttribute('style', 'display:none')
      document.body.appendChild(ele)
      ele.click()
      document.body.removeChild(ele)
      window.URL.revokeObjectURL(href)
      onAfterDownload?.()
    } catch (error) {
      console.error(error)
      message.error(error.msg || error.message || '出错了')
      setLoading(false)
    }
  }

  const onClick = () => {
    if (url) {
      openFile(url)
      return
    }
    saveFile()
  }

  const renderLoading = () => {
    let modal = (
      <div className={cx('modal-download')}>
        <div className={cx('modal-inner')}>
          <div className={cx('download-loading')}></div>
          <p>{loadingTip}</p>
        </div>
      </div>
    )
    return createPortal(modal, document.body)
  }

  return (
    <Fragment>
      {loading && renderLoading()}
      <div className={cx('download-wrapper', 'web-components')} onClick={onClick}>
        {React.cloneElement(props.children, { disabled: loading })}
      </div>
    </Fragment>
  )
}
