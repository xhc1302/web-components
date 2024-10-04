import React from 'react'
import { Upload, Button, Message, Image, Drawer } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import classNames from 'classnames/dedupe'
import store from 'store'
import { API_HOST } from '../../config'
import styles from './styles.styl'

const cx = classNames.bind(styles)
const USER_INFO_KEY = '_login_user_'

export default class ZUploadImage extends React.Component {
  static defaultProps = {
    maxSize: 20, //单位 M,
    maxCount: 999999,
    fileName: [],
    src: [],
    name: '',
    type: 'link',  // card、link
    buttonType: 'button', // card、button
    buttonText: '上传',
    tip: '支持jpg、png、svg格式',
    isShow: false,
    isDrawer: false
  }

  constructor(props) {
    super(props)
    let user = store.get(USER_INFO_KEY) || {}
    let prefix = user.platform == 1 ? 'yys' : 'ks'
    this.user = user
    this.actionUrl = `${API_HOST}/${prefix}/file/upload`
    this.state = {
      uploading: false,
      drawerOpen: false
    }
  }

  onDrawerShow = () => {
    this.setState({ drawerOpen: true })
  }

  onDrawerClose = () => {
    this.setState({ drawerOpen: false })
  }

  onPreview = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  checkImageType = (file) => {
    let { type } = file
    let allowType = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']
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
    let typeValid = this.checkImageType(file)
    let { maxSize, onBeforeUpload } = this.props

    if (uploading) return false

    if (!typeValid) {
      Message.error('文件类型不支持')
      return false
    }
    if (file.size > maxSize * 1000 * 1000) {
      Message.error(`图片大小不超过${maxSize}M哦`)
      return false
    }
    onBeforeUpload && onBeforeUpload(file)
    this.setState({ uploading: true })
    return true
  }

  onUploadChange = res => {
    let { onChange, src, fileName, maxCount, isDrawer, type } = this.props
    let { file: { name, status, response: { code, data, msg } = {} } = {} } = res
    if (status === 'done') {
      if (code === 200) {
        Message.success('上传成功')
        this.setState({ uploading: false }, () => {
          fileName = maxCount > 1 ? [...fileName, name] : [name]
          src = maxCount > 1 ? [...src, data] : [data]
          if (src.length == 3 && !!isDrawer && type == 'card') this.setState({ drawerOpen: true })
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
    let { fileName, src, isDrawer, type, onChange } = this.props
    src = src.filter((c, index) => {
      if (c !== s) {
        return true
      } else {
        fileName.splice(index, 1)
      }
    })
    if (src.length == 2 && !!isDrawer && type == 'card') this.setState({ drawerOpen: false })
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
    let { src, maxCount, isShow } = this.props
    let { drawerOpen } = this.state
    return (
      src.map((s, index) => {
        if (index < 3) {
          return (
            <div className={cx('upload-preview')} key={s}>
              {!isShow && index != 2 && <span className={cx('preview-delete')} data-src={s} onClick={this.onDeleteFile}></span>}
              <span className={cx('prev-wrapper')}>
                {!drawerOpen && index == 2 && maxCount > 3 && <div className={cx('report-mask')} onClick={this.onDrawerShow}>+{src.length - 3}</div>}
                <div className={cx('report-wrapper')}>
                  <Image
                    className={cx('preview-img')}
                    src={`${s}`}
                    preview={index != 2 ? { src: s } : false}
                    onClick={this.onPreview}
                  />
                </div>
              </span>
            </div>
          )
        }
      })
    )
  }

  renderPreview = () => {
    let { type, src, maxCount, isShow } = this.props
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
        : src.map(s => {
          return (
            <div className={cx('upload-preview')} key={s}>
              {!isShow &&
                <span
                  className={cx('preview-delete')}
                  data-src={s}
                  onClick={this.onDeleteFile}>
                </span>
              }
              <span className={cx('prev-wrapper')}>
                <Image
                  className={cx('preview-img')}
                  src={`${s}`}
                  preview={{ src: s }}
                  onClick={this.onPreview} />
                {maxCount === 1 && !isShow && <span className={cx('preview-tip')}>重新上传</span>}
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
            <p className={cx('file-tip')}>{tip}</p>
          </div>
          : <div className={cx('type-button')}>
            <Button
              ghost
              type='primary'
              className={cx('upload-button')}
              icon={this.renderIcon()} >
              {uploading ? '上传中' : buttonText}
            </Button>
            <p className={cx('file-tip')}>{tip}</p>
          </div>
        }
      </div>
    )
  }

  render () {
    let { state: { uploading, drawerOpen }, actionUrl } = this
    let { children, src, maxCount, isShow, className, value, type = '', isDrawer, ...props } = this.props

    return (
      <div>
        <div className={cx('z-upload-wrapper', 'web-components', className)}>
          {maxCount > 1 ? !!isDrawer && type == 'card' && maxCount > 3 ? this.renderOmitPreview() : this.renderPreview() : ''}
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
              {(!!src.length && !uploading && maxCount === 1) ? !!isDrawer && type == 'card' && maxCount > 3 ? this.renderOmitPreview() : this.renderPreview() : ''}
              {!isShow && src.length < 3 &&
                ((maxCount > 1 && src.length != maxCount) || uploading || (maxCount === 1 && !src.length)) &&
                this.renderButton()
              }
            </div>
          </Upload>
        </div>
        {!!isDrawer && type == 'card' && maxCount > 3 && < Drawer
          placement='top'
          closable={false}
          onClose={this.onDrawerClose}
          visible={drawerOpen}
          getContainer={false}
          style={{ position: 'absolute' }}
          className={cx('drawer-wrapper')}
        >
          <div className={cx('z-upload-wrapper', 'z-upload-image-wrapper')}>
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
