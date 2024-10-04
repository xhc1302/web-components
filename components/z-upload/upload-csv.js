import React from 'react'
import { Upload, message, Drawer, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import classNames from 'classnames/dedupe'
import store from 'store'
import { ZTable, ZModal, FullStateLoading } from '@aiot/web-components'
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
    this.actionUrl = (process.env == 'UAT' || process.env == 'FAT' || process.env == 'DEV')
      ? `https://uat-extra-api.eaiot.cloud/${prefix}/planCalculate/excel/payload/import`
      : `https://extra-api.eaiot.cloud/${prefix}/planCalculate/excel/payload/import`
    this.state = {
      uploading: false,
      drawerOpen: false,
      showModal: false,
      errorInfo: [],
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
    let allowType = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
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

    // 检查文件大小，限制为10MB
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      message.error('文件大小不能超过10MB');
      return false;
    }

    if (!typeValid) {
      message.error('文件类型不支持')
      return false
    }
    onBeforeUpload && onBeforeUpload(file)
    this.setState({ uploading: true })
    return true
  }

  onUploadChange = res => {
    let { onChange, src, fileName, maxCount, isDrawer } = this.props
    // console.log(res)
    let { file: { name, status, response: { code, data, msg } = {} } = {} } = res
    if (status === 'done') {
      if (code === 200) {
        message.success('上传成功')
        this.setState({ uploading: false }, () => {
          fileName = maxCount > 1 ? [...fileName, name] : [name]
          src = maxCount > 1 ? [...src, data] : [data]
          if (src.length == 3 && !!isDrawer) this.setState({ drawerOpen: true })
          onChange && onChange({ fileName, src })
        })
      } else {
        let { excelValidErrors } = data
        this.setState({ showModal: true, uploading: false, errorInfo: excelValidErrors })
        // message.error(msg)
        // this.setState({ uploading: false })
      }
    } else if (status === 'error') {

      message.error('上传失败')
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
    let { src, fileName, isShow, type, tip } = this.props
    return (
      type === 'link'
        ? src.map(s => {
          return (
            <div className={cx('upload-button')} key={s}>
              <span className={cx('file-name')}>{s}</span>
              <span className={cx('file-delete')} data-src={s} onClick={this.onDeleteFile}></span>
              <p className={cx('file-tip')}>{tip}</p>
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

  render() {
    let { state: { uploading, drawerOpen, showModal, errorInfo }, actionUrl } = this
    let { children, src, maxCount, isShow, className, value, type = '', isDrawer, ...props } = this.props

    return (
      <div>
        <div className={cx('z-upload-wrapper', 'z-upload-pdf-wrapper', className, 'web-components')}>
          {maxCount > 1 ? !!isDrawer && maxCount > 3 ? this.renderOmitPreview() : this.renderPreview() : ''}
          {<FullStateLoading state={uploading ? 'loading' : ''}><span></span></FullStateLoading>}
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
        {showModal &&
          <ZModal
            title='错误明细'
            width={640}
            className={cx('error-modal')}
            visible={showModal}
            bodyStyle={{ padding: 0 }}
            footer={<span className={cx('primary-btn')} onClick={() => this.setState({ showModal: false })}>我知道了</span>}
            onCancel={() => this.setState({ showModal: false })}>
            <div className={cx('error-table-wrapper')}>
              <ZTable dataSource={errorInfo} rowKey='rowNum' pagination={false}>
                <ZTable.Column title='行数' dataIndex='rowNum' />
                <ZTable.Column title='错误提示' dataIndex='message' />
              </ZTable>
            </div>
          </ZModal>
        }
      </div>
    )
  }
}
