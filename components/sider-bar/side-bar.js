import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { Link, NavLink } from 'react-router-dom'
import classNames from 'classnames/dedupe'
import styles from './styles.styl'

const cx = classNames.bind(styles)

export default function AppSideBar(props) {
  const { menus = [], showLogo = true, layoutType = 1, theme = 'dark', onPathChange, currentSelectedMenuLink } = props
  const [collapsed, setCollapsed] = useState(false)
  const [openKeys, setOpenKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [selectedPathL1, setSelectedPathL1] = useState('')

  let pathname = (currentSelectedMenuLink || location.pathname).replace(/([()[\]{}\\/^$|?*+.])/g, '\\$1')
  let currUrlPath = currentSelectedMenuLink || location.pathname
  useEffect(() => {
    getMenuByPath()
  }, [pathname])

  const logo = collapsed
    ? 'https://oss-static.eaiot.cloud/aiot-factory-web/20230201-logo3@2x.png'
    : 'https://oss-static.eaiot.cloud/aiot-factory-web/20230201-logo3-1@2x.png'

  const onOpenChange = keys => {
    const roots = menus.filter(menu => menu.children && menu.children.length).map(m => `${m.id}`)
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1)
    if (roots.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  const onSelectedChange = (item) => {
    let { key } = item
    setSelectedKeys([key])
  }

  const onJumpUrl = (e, path) => {
    e.stopPropagation();
    e.preventDefault();
    window.open(path)
  }

  const getMenuByPath = () => {
    let reg = new RegExp(pathname, 'gi')
    let currentSelectedKey = ''
    let currentOpenKey = ''
    let currentOpenKeys = []
    for (const menu of menus) {
      let { path, children = [], id } = menu
      let flg = false
      let selectedPathL1_tmp = id
      //一级菜单无二级菜单
      if (reg.test(path)) {
        if (!currentSelectedKey) {
          currentSelectedKey = id
          currentOpenKey = id
        }
        if (path == currUrlPath) {
          flg = true
        }
      }
      if (children.length) {
        //二级菜单
        for (let child of children) {
          let { path: subPath, id: subCode } = child
          if (reg.test(subPath)) {
            if (!currentSelectedKey) {
              currentSelectedKey = subCode
              currentOpenKey = subCode
            }
            currentOpenKeys.push(`${id}`)
          }
          if (subPath == currUrlPath) {
            flg = true
          }
        }
      }

      if (flg) setSelectedPathL1(selectedPathL1_tmp)
    }
    setOpenKeys(currentOpenKeys)
    setSelectedKeys([`${currentSelectedKey}`])
    onPathChange?.(currentOpenKey)
  }

  const renderMenuTitle = ({ icon, checkedIcon, name, id, path = '' }) => {
    if (path) {
      if(path.includes('http') || path.includes('http')){
        return (
          <a href={path} onClick={(e)=>onJumpUrl(e, path)} target='_blank' className={cx('menu-item-inner', { 'menu-item-inner-light': theme == 'light' })}>
            {!!icon && <img src={selectedPathL1 == id && !!checkedIcon ? checkedIcon : icon} className={cx('menu-icon')} />}
            <span>{name}</span>
          </a>)
      }
      return (
        <NavLink to={path} className={cx('menu-item-inner', { 'menu-item-inner-light': theme == 'light' })}>
          {!!icon && <img src={selectedPathL1 == id && !!checkedIcon ? checkedIcon : icon} className={cx('menu-icon')} />}
          <span>{name}</span>
        </NavLink>)
    }

    return (
      <div className={cx('menu-item-inner', { 'menu-item-inner-light': theme == 'light' })}>
        {!!icon && <img src={selectedPathL1 == id && !!checkedIcon ? checkedIcon : icon} className={cx('menu-icon')} />}
        <span>{name}</span>
      </div>
    )
  }

  const renderMenuItem = menu => {
    let { id, icon, checkedIcon, name, path, children = [] } = menu
    if (children.length) {
      return (
        <Menu.SubMenu
          key={id}
          title={renderMenuTitle({ icon, checkedIcon, name, path, id })}
          popupClassName={cx('sider-bar-pop-menu', { 'sider-bar-pop-menu-light': theme == 'light' })}>
          {children.map(sub => renderMenuItem(sub))}
        </Menu.SubMenu>
      )
    }

    return (
      <Menu.Item key={id} className={cx('side-bar-item')}>
        {renderMenuTitle({ icon, checkedIcon, name, path, id })}
      </Menu.Item>
    )
  }

  const appMenu = (
    <Menu
      mode='inline'
      theme={theme}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onClick={onSelectedChange}
      onOpenChange={onOpenChange}
    >
      {menus.map(menu => renderMenuItem(menu))}
    </Menu>
  )

  const siderTrigger = (
    <div className={cx('sider-trigger')}>
      <img src={collapsed
        ? theme == 'light'
          ? 'https://oss-static.eaiot.cloud/aiot-factory-web/2022-03-07-fc@2x-1df842.png'
          : 'https://oss-static.eaiot.cloud/aiot-factory-web/2021-03-17-retract@2x-08cbf8.png'
        : theme == 'light'
          ? 'https://oss-static.eaiot.cloud/aiot-factory-web/2022-03-07-dc@2x-1d5165.png'
          : 'https://oss-static.eaiot.cloud/aiot-factory-web/2021-03-17-retract-0c937e.png'
      } />
    </div>
  )
  const cls = cx({
    'app-sider-bar': true,
    'app-sider-bar-light': theme == 'light',
    'web-components': true,
    'with-header-gap': layoutType == 2,
    collapsed,
  })
  return (
    <Layout.Sider
      theme={theme}
      width={192}
      collapsedWidth={64}
      // collapsible
      className={cls}
      trigger={siderTrigger}
      onCollapse={setCollapsed}
    >
      {showLogo &&
        <Link to='/' className={cx('side-app-logo', { collapsed })}>
          <img className={cx('app-logo')} src={logo} />
        </Link>
      }
      <div className={cx('side-app-menus')}>
        {appMenu}
      </div>
    </Layout.Sider>
  )
}
