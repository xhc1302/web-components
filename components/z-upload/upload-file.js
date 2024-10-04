import React from 'react'
import { Upload, Message, Drawer, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import classNames from 'classnames/dedupe'
import store from 'store'
import { API_HOST } from '../../config'
import styles from './styles.styl'

const cx = classNames.bind(styles)
const USER_INFO_KEY = '_login_user_'

export default class ZUploadFile extends React.Component {
  static defaultProps = {
    maxCount: 1,
    fileName: [],
    src: [],
    isShow: false,
    isDrawer: false,
    type: 'link',  // card、link
    buttonType: 'button', // card、button
    buttonText: '上传',
  }

  constructor(props) {
    super(props)
    let user = store.get(USER_INFO_KEY) || {}
    let prefix = user.platform == 1 ? 'yys' : 'ks'
    this.user = user
    this.actionUrl = `${API_HOST}/${prefix}/file/upload`
    this.state = {
      uploading: false,
      drawerOpen: false,
    }
  }

  onDrawerShow = () => {
    this.setState({ drawerOpen: true })
  }

  onDrawerClose = () => {
    this.setState({ drawerOpen: false })
  }

  checkPdfType = (file) => {
    let { type } = file
    let allowType = ['application/pdf']
    let index = allowType.indexOf(type)
    return index >= 0
  }

  getHeaders = () => {
    let { token, platform } = this.user
    let key = platform == 1 ? 'token' : 'authorization'
    return { [key]: token }
  }

  onBeforeUpload = file => {
    let { uploading } = this.state
    let typeValid = this.checkPdfType(file)
    let { onBeforeUpload } = this.props

    if (uploading) return false

    if (!typeValid) {
      Message.error('文件类型不支持')
      return false
    }
    onBeforeUpload && onBeforeUpload(file)
    this.setState({ uploading: true })
    return true
  }

  onUploadChange = res => {
    let { onChange, src, fileName, maxCount, isDrawer } = this.props
    let { file: { name, status, response: { code, data, msg } = {} } = {} } = res
    if (status === 'done') {
      if (code === 200) {
        Message.success('上传成功')
        this.setState({ uploading: false }, () => {
          fileName = maxCount > 1 ? [...fileName, name] : [name]
          src = maxCount > 1 ? [...src, data] : [data]
          if (src.length == 3 && !!isDrawer) this.setState({ drawerOpen: true })
          onChange && onChange({ fileName, src })
        })
      } else {
        Message.error(msg)
        this.setState({ uploading: false })
      }
    } else if (status === 'error') {
      Message.error('上传失败')
      this.setState({ uploading: false })
    }
  }

  onDeleteFile = e => {
    e.preventDefault()
    e.stopPropagation()
    let { dataset: { src: s } } = e.target
    let { fileName, src, isDrawer, onChange } = this.props
    src = src.filter((c, index) => {
      if (c !== s) {
        return true
      } else {
        fileName.splice(index, 1)
      }
    })
    if (src.length == 2 && !!isDrawer) this.setState({ drawerOpen: false })
    onChange && onChange({ fileName, src })
  }

  renderIcon = () => {
    let { uploading } = this.state
    return (
      <span className={cx('upload-icon')}>
        {uploading
          ? <LoadingOutlined />
          : <img src='https://aiot-web-static.oss-cn-hangzhou.aliyuncs.com/aiot-web/upload%402x.png' />
        }
      </span>
    )
  }

  renderOmitPreview = () => {
    let { src, fileName, isShow, maxCount } = this.props
    let { drawerOpen } = this.state
    return (
      src.map((s, index) => {
        if (index < 3) {
          return (
            <div className={cx('upload-preview')} key={s + index}>
              {!isShow && index != 2 && <span className={cx('preview-delete')} data-src={s} onClick={this.onDeleteFile}></span>}
              <span className={cx('prev-wrapper', { 'prev-wrapper-mask': !drawerOpen && index == 2 })}>
                {!drawerOpen && index == 2 && maxCount > 3 && <div className={cx('report-mask')} onClick={this.onDrawerShow}>+{src.length - 3}</div>}
                <a className={cx('report-wrapper')} href={s} target='_blank'>
                  <img className={cx('report-icon')} src='https://oss-static.eaiot.cloud/aiot-web/2020-11-17-of-1605595249327.png' />
                  <p className={cx('report-name')} >{fileName[index]}</p>
                </a>
              </span>
            </div>
          )
        }
      })
    )
  }

  renderPreview = () => {
    let { src, fileName, isShow, type } = this.props
    return (
      type === 'link'
        ? src.map(s => {
          return (
            <div className={cx('upload-button')} key={s}>
              <span className={cx('file-name')}>{s}</span>
              <span className={cx('file-delete')} data-src={s} onClick={this.onDeleteFile}></span>
            </div>
          )
        })
        : src.map((s, index) => {
          return (
            <div className={cx('upload-preview')} key={s + index}>
              {!isShow && <span className={cx('preview-delete')} data-src={s} onClick={this.onDeleteFile}></span>}
              <span className={cx('prev-wrapper')}>
                <a className={cx('report-wrapper')} href={s} target='_blank'>
                  <img className={cx('report-icon')} src='https://oss-static.eaiot.cloud/aiot-web/2020-11-17-of-1605595249327.png' />
                  <p className={cx('report-name')} >{fileName[index]}</p>
                </a>
              </span>
            </div>
          )
        })
    )
  }

  renderButton = () => {
    let { buttonType, tip, buttonText } = this.props
    let { state: { uploading } } = this
    return (
      <div className={cx('upload-button-wrapper')}>
        {buttonType === 'card'
          ? <div className={cx('type-card')}>
            <p className={cx('type-card-inner')}>
              {uploading
                ? <LoadingOutlined className={cx('type-card-loading')} />
                : <i className={cx('type-card-icon')} />
              }
            </p>
          </div>
          : <div className={cx('type-button')}>
            <Button
              ghost
              type='primary'
              className={cx('upload-button')}
              icon={this.renderIcon()} >
              {uploading ? '上传中' : buttonText}
            </Button>
          </div>
        }
      </div>
    )
  }

  render() {
    let { state: { uploading, drawerOpen }, actionUrl } = this
    let { children, src, maxCount, isShow, className, value, type = '', isDrawer, ...props } = this.props

    return (
      <div>
        <div className={cx('z-upload-wrapper', 'z-upload-pdf-wrapper', className, 'web-components')}>
          {maxCount > 1 ? !!isDrawer && maxCount > 3 ? this.renderOmitPreview() : this.renderPreview() : ''}
          <Upload
            {...props}
            name='file'
            className={cx('z-upload-button')}
            action={actionUrl}
            maxCount={maxCount}
            headers={this.getHeaders()}
            showUploadList={false}
            disabled={uploading}
            beforeUpload={this.onBeforeUpload}
            onChange={this.onUploadChange}>
            <div className={cx('z-upload-main')}>
              {(!!src.length && !uploading && maxCount === 1) ? !!isDrawer && maxCount > 3 ? this.renderOmitPreview() : this.renderPreview() : ''}
              {!isShow && src.length < 3 &&
                ((maxCount > 1 && maxCount != src.length) || uploading || (maxCount === 1 && !src.length)) &&
                this.renderButton()
              }
            </div>
          </Upload>
        </div>
        {!!isDrawer && maxCount > 3 && <Drawer
          placement='top'
          closable={false}
          onClose={this.onDrawerClose}
          visible={drawerOpen}
          getContainer={false}
          style={{ position: 'absolute' }}
          className={cx('drawer-wrapper')}
        >
          <div className={cx('z-upload-wrapper', 'z-upload-pdf-wrapper')}>
            {maxCount > 1 && this.renderPreview()}
            <Upload
              {...props}
              name='file'
              className={cx('z-upload-button')}
              action={actionUrl}
              headers={this.getHeaders()}
              showUploadList={false}
              disabled={uploading}
              beforeUpload={this.onBeforeUpload}
              onChange={this.onUploadChange}>
              <div className={cx('z-upload-main')}>
                {!isShow &&
                  ((maxCount > 1 && maxCount != src.length) || uploading) && this.renderButton()
                }
              </div>
            </Upload>
          </div>
        </Drawer>}
      </div>
    )
  }
}
