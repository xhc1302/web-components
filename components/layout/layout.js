import React, { useEffect, useState, useRef, useCallback, Fragment } from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { Layout, notification } from 'antd'
import classNames from 'classnames/bind'
import { API_HOST } from '@config'
import SiderBar from '../sider-bar'
import Header from '../header'
import Crumbs from '../crumbs'
import { StateLoading } from '../state-wrapper'
import styles from './styles.styl'

const cx = classNames.bind(styles)

function findPageId(tree, path) {
  for (const menu of tree) {
    if (path == menu.path) {
      return menu.id
    }
    if (menu.children) {
      const res = findPageId(menu.children, path)
      if (res) return res
    }
  }
}

function findPagePath(routes, pathname, menus) {

  let route = routes.find(r => r.path === pathname)
  if (route) {
    let { names = [], paths = [] } = route.meta

    for (let item of menus) {
      // console.log(11, item, pathname, names)
      let flg = 0
      let flg_l3 = 0
      let nameL1 = ''
      let nameL2 = ''
      let nameL1_L3 = ''
      let nameL2_L3 = ''
      nameL1 = item.name
      if (item.path == pathname) {
        names[0] = item.name
        paths[0] = item.path
        names.splice(1);
        paths.splice(1);
        flg = 1
      }
      if (item.path == paths[0]) {
        nameL1_L3 = item.name
      }
      if (item.path == paths[1]) {
        flg_l3 = 3
        names[0] = item.name
        paths[0] = item.path
        names.splice(1, 1);
        paths.splice(1, 1);
        nameL2_L3 = item.name
      }
      let menusInner = !!item.children ? item.children : []
      for (let itemInner of menusInner) {
        nameL2 = itemInner.name
        if (itemInner.path === pathname) {
          names[0] = nameL1
          names[1] = itemInner.name
          flg = 2
        }
        if (itemInner.path === paths[1]) {
          nameL2_L3 = itemInner.name
          flg_l3 = 2
        }
      }

      if (flg) {
        break
      }
      if (flg_l3) {
        if (flg_l3 == 3) {
        } else {
          names[0] = nameL1_L3
          names[1] = nameL2_L3
        }
        break
      }
    }
    return route.meta || {}
  }
  return {}
}

const treeToArray = tree => {
  return tree.reduce((res, item) => {
    const { children, ...i } = item
    return res.concat(i, children && children.length ? treeToArray(children) : [])
  }, [])
}

export default function AppLayout(props) {

  const {
    layoutType = 1,
    user = {},
    menus = [],
    todayFault = [],
    todayFaultCount = '',
    deviceOnoffStatus = '',
    routes = [],
    theme = 'light',
    showFullButton = true,
    showSiderBarLogo = true,
    location: { pathname },
    children,
    onPathPermission = () => { },
    onAppBoot = () => { },
    onLogout,
    resetPassword,
    onShowVersion = () => { },
  } = props

  const [loading, setLoading] = useState(true)
  const [currentSelectedMenuLink, setCurrentSelectedMenuLink] = useState('')
  const [error, setError] = useState('')
  const crumbRef = useRef(null)

  let pageId = findPageId(menus, pathname)
  let crumbs = findPagePath(routes, pathname, menus)

  useEffect(() => {
    if (crumbs.paths.length == 1 && crumbs.paths[0]) {
      setCurrentSelectedMenuLink(crumbs.paths[0])
    }

    if (crumbs.paths.length >= 2 && crumbs.paths[1]) {
      setCurrentSelectedMenuLink(crumbs.paths[1])
    }

    if (crumbs.paths.length >= 2 && !!crumbs.paths[0]) {
      setCurrentSelectedMenuLink(crumbs.paths[0])
    }

  }, [crumbs])


  useEffect(() => {
    onAppBootCallback()
  }, [])

  const ws = useRef(null);
  const [deviceOnoffInfo, setDeviceOnoffInfo] = useState('');
  const [readyState, setReadyState] = useState('正在链接中');

  const socket = useRef();
  const sendCount = useRef(1);
  const [alarmCount, setAlarmCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [reset, setReset] = useState(false);
  // 获取告警数量
  const UNREAD_WARN_COUNT = 'UNREAD_WARN_COUNT';
  // 获取消息数量
  const UNREAD_MSG_COUNT = 'UNREAD_MSG_COUNT';
  // 获取消息的间隔
  const INT_TIME = 10000;
  // websocket状态
  const webSocketStatus = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
  };

  // 开启事件,主动获取数据
  const socketOnOpen = useCallback(() => {
    // 判断连接状态是不是open
    if (socket?.current?.readyState === webSocketStatus.OPEN) {
      // 第一次加载触发一次
      socket?.current?.send(JSON.stringify({ businessKey: [UNREAD_MSG_COUNT, UNREAD_WARN_COUNT] }));
    }
    const timer = setInterval(() => {
      if (socket?.current?.readyState === webSocketStatus.OPEN) {
        socket?.current?.send(JSON.stringify({ businessKey: [UNREAD_MSG_COUNT, UNREAD_WARN_COUNT] }));
      }
    }, INT_TIME);
    // 返回信息出错清除定时器
    if (sendCount.current === 0) {
      clearInterval(timer);
      setReset(true);
    }
  }, [sendCount]);

  // 关闭事件重新连接
  const socketOnClose = useCallback(() => {
    setReset(true);
  }, []);

  // 出错事件
  const socketOnError = useCallback((err) => {
    console.log('err: ', err);
  }, []);

  // 收发信息
  const socketOnMessage = useCallback(
    (e) => {
      if (!!e.data) {
        console.log('收到消息：', e.data)
        if (e.data.includes('在线')) {
          notification.success({
            icon: null,
            message: undefined,
            duration: 15,
            description: <a href='/station/on-off'>{e.data}</a>,
            placement: 'top',
            closeIcon: <img className={cx('notification-close-icon')} src='https://aiot-web-static.oss-cn-hangzhou.aliyuncs.com/aiot-web/closed16_grey%402x.png' />
          });
        }
        if (e.data.includes('离线')) {
          notification.error({
            icon: null,
            message: undefined,
            duration: 15,
            description: <a href='/station/on-off'>{e.data}</a>,
            placement: 'top',
            closeIcon: <img className={cx('notification-close-icon')} src='https://aiot-web-static.oss-cn-hangzhou.aliyuncs.com/aiot-web/closed16_grey%402x.png' />
          });
        }
      }
    },
    [sendCount],
  );

  // 初始化连接socket
  const socketInit = useCallback(() => {
    if (user.token) {
      try {
        let scoketUrl = API_HOST.replace('https', 'wss') + '/websocket?token=' + user.token
        const socketObj = new WebSocket(scoketUrl);
        socketObj.addEventListener('close', socketOnClose);
        socketObj.addEventListener('error', socketOnError);
        socketObj.addEventListener('message', socketOnMessage);
        socketObj.addEventListener('open', socketOnOpen);
        socket.current = socketObj;
        sendCount.current = 1;
      } catch (err) {
        console.log('err: ', err);
      }
    }

  }, [socketOnClose, socketOnError, socketOnMessage, socketOnOpen, user.token]);

  // 初始化连接socket
  useEffect(() => {
    socketInit();
  }, [socketInit]);

  // 断线重连
  useEffect(() => {
    if (!reset) return;
    setTimeout(() => {
      socketInit();
      setReset(false);
    }, 30000);
  }, [reset, socketInit]);


  const onAppBootCallback = async () => {
    try {
      await onAppBoot()
      setLoading(false)
      setError('')
    } catch (error) {
      console.error(error)
      setLoading(false)
      setError(error.message || '出错了，请刷新重试')
    }
  }

  const updatePageCrumb = (index, crumb) => {
    crumbRef.current?.updateCrumb(index, crumb)
  }

  const renderBootState = () => {
    return (
      <div className={cx('aiot-app', 'web-components')}>
        <div className={cx('app-booting')}>
          {error
            ? <img
              className={cx('booting-icon', 'booting-icon-error')}
              src='https://oss-static.eaiot.cloud/aiot-web/2021-03-19-defeat@2x-4cb4f5.png'
              alt='' />
            : <StateLoading desc='' />
          }
          {error && <p>{error}</p>}
        </div>
      </div>
    )
  }

  if (loading || error) {
    return renderBootState()
  }

  const Wrapper = layoutType == 1 ? Fragment : Layout
  return (
    <Layout className={cx('aiot-app', 'web-components')}>
      {layoutType == 1 &&
        <SiderBar
          menus={menus}
          theme={theme}
          currentSelectedMenuLink={currentSelectedMenuLink}
          showLogo={showSiderBarLogo}
          layoutType={layoutType} />
      }
      {layoutType == 2 &&
        <Header
          user={user}
          onLogout={onLogout}
          resetPassword={resetPassword}
          theme={theme}
          layoutType={layoutType}
          showFullButton={showFullButton}
          todayFaultCount={todayFaultCount}
          onShowVersion={onShowVersion}
        />
      }
      <Layout className={cx('app-main', { 'with-header-gap': layoutType == 2 })}>
        {layoutType == 2 &&
          <SiderBar
            menus={menus}
            theme={theme}
            currentSelectedMenuLink={currentSelectedMenuLink}
            showLogo={showSiderBarLogo}
            layoutType={layoutType}

          />
        }
        <Wrapper className={cx('app-content-wrapper')}>
          {layoutType == 1 &&
            <Header
              user={user}
              onLogout={onLogout}
              theme={theme}
              layoutType={layoutType}
              showFullButton={showFullButton}
              todayFaultCount={todayFaultCount}
              onShowVersion={onShowVersion}
            />
          }
          <Crumbs ref={crumbRef} crumbs={crumbs} path={pathname} todayFault={todayFault} todayFaultCount={todayFaultCount} />
          <Layout.Content className={cx('app-content')}>
            <Switch>
              {React.Children.map(children, child => {
                return React.cloneElement(
                  child,
                  {
                    pageId,
                    onPathPermission,
                    userId: user.userId,
                    updatePageCrumb: updatePageCrumb
                  })
              })}
              <Redirect to='/404' />
            </Switch>
          </Layout.Content>
        </Wrapper>
      </Layout>
    </Layout>
  )
}
