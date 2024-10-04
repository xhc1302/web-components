import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Dropdown, Input, Form, message } from 'antd'
import classNames from 'classnames/dedupe'
import { JSEncrypt } from 'jsencrypt'
import { PUBLIC_KEY } from '@config'
import ZModal from '../z-modal'
import { Validator } from '@utils'
import styles from './styles.styl'

const cx = classNames.bind(styles)
const DEAULT_ICON = 'https://oss-static.eaiot.cloud/aiot-web/2021-03-17-people_mormal@2x-14b7cb.png'

export default function AppHeader(props) {
  const { user = {}, theme = 'light', layoutType = 1, showFullButton = true,
    onLogout, resetPassword, todayFaultCount, onShowVersion } = props

  const { username = '', icon = DEAULT_ICON, logo, systemName } = user
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm();

  function onFullScreen() {
    const ele = document.documentElement
    if (ele.requestFullscreen) {
      ele.requestFullscreen()
    } else if (ele.mozRequestFullScreen) {
      ele.mozRequestFullScreen()
    } else if (ele.webkitRequestFullscreen) {
      ele.webkitRequestFullscreen()
    } else if (ele.msRequestFullscreen) {
      ele.msRequestFullscreen()
    }
  }

  function onLogoutVisible(visible) {
    setVisible(visible)
  }

  function renderLogout() {
    return (
      <span
        className={cx('login-out-button')}
        onClick={() => onLogout?.()} >
        退出
      </span>
    )
  }

  const items = [
    {
      label: <span className={cx('header-dropdown-item')}> <img src='https://aiot-web-static.oss-cn-hangzhou.aliyuncs.com/aiot-web/%E4%BF%AE%E6%94%B9%E5%AF%86%E7%A0%81%402x.png' /> 修改密码</span>,
      key: '0',
    },
    {
      label: <span className={cx('header-dropdown-item')}><img src='https://aiot-web-static.oss-cn-hangzhou.aliyuncs.com/aiot-web/%E9%80%80%E5%87%BA%E7%99%BB%E5%BD%95%402x.png' /> 退出登录</span>,
      key: '1',
    },
  ];

  function onDropdownItemClick(item) {
    let { key } = item
    if (key === '0') {
      form.resetFields()
      setVisible(true)
    }
    if (key === '1') {
      onLogout?.()
    }
  }

  function renderPasswordTitle() {
    return (
      <span className={cx('header-password-title')}>修改密码 <span>（6～20个字符串，数字或数字字母组合）</span> </span>
    )
  }

  function ps1Validator(_, value) {
    if (!value || value.trim() == '') return Promise.reject(new Error('请输入原密码'))
    if (Validator.pIntAllCapital(value) && value.length >= 6 && value.length <= 20) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('6到20之间的字符串，数字或数字和字母组合'))
  }

  function ps2Validator(_, value) {
    if (!value || value.trim() == '') return Promise.reject(new Error('请输入新密码'))
    if (Validator.pIntAllCapital(value) && value.length >= 6 && value.length <= 20) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('6到20之间的字符串，数字或数字和字母组合'))
  }

  function ps3Validator(_, value) {
    if (!value || value.trim() == '') return Promise.reject(new Error('请输入确认新密码'))
    if (value != form.getFieldValue('password2')) {
      return Promise.reject(new Error('2次密码输入不一致！'))
    }

    if (Validator.pIntAllCapital(value) && value.length >= 6 && value.length <= 20) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('6到20之间的字符串，数字或数字和字母组合'))
  }

  async function onChangePassword() {
    try {
      await form.validateFields().then()

      let passwordData = form.getFieldsValue()
      let { password1, password3 } = passwordData
      let encrypt = new JSEncrypt()
      encrypt.setPublicKey(PUBLIC_KEY)
      let oldPassword = encrypt.encrypt(password1)
      let newPassword = encrypt.encrypt(password3)
      await resetPassword?.({ oldPassword, newPassword })
      // this.props.history.push('/login')
      // message.success('操作成功')
    } catch (error) {
      message.error(error.msg || error.response?.data?.msg || '操作失败')
      console.error(error)
    }
  }

  return (
    <Layout.Header className={cx('app-header', 'web-components', { [theme]: true })}>
      <div className={cx('header-inner')}>
        {layoutType == 2 &&
          <div className={cx('header-company')}>
            {!!logo &&
              <span className={cx('company-logo')}>
                <img src={logo} alt='' />
              </span>
            }
            <span className={cx('company-name')}>{systemName}</span>
          </div>
        }
        <div className={cx('header-main')}></div>
        <div className={cx('header-widget')}>
          {!(user.roleName == '合作商' || user.roleName == '投资商') &&
            <img
              onClick={() => { onShowVersion && onShowVersion(true) }}
              className={cx('version-btn')}
              src='https://aiot-web-static.oss-cn-hangzhou.aliyuncs.com/aiot-iems/%E7%89%88%E6%9C%AC%E6%9B%B4%E6%96%B0%E8%AF%B4%E6%98%8E%402x.png'
            />
          }
          {showFullButton &&
            <Link className={cx('dashboard-button')} to='/' onClick={onFullScreen}>
              <i className={cx('button-icon')}></i>
              <span>大屏</span>
            </Link>
          }
          {user.roleName == '合作商' || user.roleName == '投资商'
            ? <a
              target='_blank'
              href='https://v0wlg98ri4g.feishu.cn/docx/FF7adreaxoyPwXxXDk9cezL5nEf'
              className={cx('download-file')}>
              <img src='https://aiot-web-static.oss-cn-hangzhou.aliyuncs.com/aiot-web/%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C%402x.png' />
              手册
            </a>
            : <a
              target='_blank'
              href='https://v0wlg98ri4g.feishu.cn/docx/P0J0dR3GPoIzC6xCGOGcGE2lnqf'
              className={cx('download-file')}>
              <img src='https://aiot-web-static.oss-cn-hangzhou.aliyuncs.com/aiot-web/%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C%402x.png' />
              手册
            </a>
          }

          {!(user.roleName == '合作商' || user.roleName == '投资商') && <Link
            to={`/operation/warn?alarm=${3}`}
            className={cx('message-wrapper')}>
            {!!todayFaultCount && <span className={cx('message-count')}>{todayFaultCount > 99 ? '99+' : todayFaultCount}</span>}
            <img src='https://aiot-web-static.oss-cn-hangzhou.aliyuncs.com/aiot-web/%E6%B6%88%E6%81%AF%E9%80%9A%E7%9F%A5%402x.png' />
            通知
          </Link>
          }
          <div className={cx('login-user')}>
            {/* <img className={cx('user-avatar')} src={icon || DEAULT_ICON} /> */}
            <Dropdown
              menu={{
                items,
                onClick: onDropdownItemClick
              }}
              overlayClassName={cx('login-user-popover')}
              placement="bottom"
            >
              <span className={cx('user-name-wrapper')}>
                <span className={cx('user-name')}>{username}</span>
                <span className={cx('down-icon', { visible })} />
              </span>
            </Dropdown>
          </div>
        </div>
      </div>

      {visible &&
        <ZModal
          title={renderPasswordTitle()}
          open={visible}
          cancelText='取消'
          okText='确认'
          onCancel={() => {
            setVisible(false)
          }}
          onOk={onChangePassword}
          bodyStyle={{ padding: '24px' }}
        >
          <div>
            <Form form={form} labelCol={{ span: 6 }}>
              <Form.Item label="原密码" name="password1" rules={[{ required: true, validator: ps1Validator }]}>
                <Input placeholder='请输入' maxLength={20} />
              </Form.Item>

              <Form.Item label="新密码" name="password2" rules={[{ required: true, validator: ps2Validator }]}>
                <Input placeholder='请输入' maxLength={20} />
              </Form.Item>

              <Form.Item label="确认新密码" name="password3" rules={[{ required: true, validator: ps3Validator }]}>
                <Input placeholder='请输入' maxLength={20} />
              </Form.Item>
            </Form>
          </div>
        </ZModal>
      }
    </Layout.Header >
  )
}
