import React, { Fragment } from 'react'
import classnames from 'classnames/dedupe'
import styles from './styles.styl'

const cx = classnames.bind(styles)

export class StateLoading extends React.PureComponent {
  render() {
    let { message = '加载中...', size = 'default' } = this.props

    return (
      <div className={cx('wc-state-loading')}>
        <div className={cx('loading-spin', { 'small': size === 'small' })}></div>
        <div className={cx('loading-tip', { 'small': size === 'small' })}>{message}</div>
      </div>
    )
  }
}

export class FullStateLoading extends React.PureComponent {
  render() {

    return (
      <div className={cx('wc-full-state-loading')}>
        <div className={cx('loading-spin')}></div>
      </div>
    )
  }
}


export class StateError extends React.PureComponent {
  render() {
    let { message = '出错了...' } = this.props

    return (
      <div className={cx('wc-state-error')}>
        <img className={cx('state-pic')} src='https://oss-static.eaiot.cloud/aiot-web/2021-08-17-defeat@2x-1629198236937.png' />
        <p className={cx('state-tip')}>{message}</p>
      </div>
    )
  }
}

export class StateEmpty extends React.PureComponent {
  render() {
    let { message = '暂无数据' } = this.props

    return (
      <div className={cx('wc-state-empty')}>
        <img className={cx('state-pic')} src='https://oss-static.eaiot.cloud/aiot-web/2021-08-17-empty@2x-1629198409022.png' />
        <p className={cx('state-tip')}>{message}</p>
      </div>
    )
  }
}

export class StateUnAuthorized extends React.PureComponent {
  render() {
    let { message = '无权限', buttonText, buttonFn = () => { } } = this.props

    return (
      <div className={cx('wc-state-unauthorized')}>
        <img className={cx('state-pic')} src='https://oss-static.eaiot.cloud/aiot-web/2021-11-18-nopermission-0ed23f.png' />
        <div className={cx('state-tip')}>{message}</div>
        {!!buttonText &&
          <p className={cx('state-button')} >
            <span onClick={buttonFn}>{buttonText || '返回'}</span>
          </p>
        }
      </div>
    )
  }
}

export class ComponentEmpty extends React.PureComponent {
  render() {
    let { message = '暂无数据' } = this.props

    return (
      <div className={cx('wc-component-empty')}>
        <img className={cx('empty-pic')} src='https://oss-static.eaiot.cloud/aiot-web/2021-11-02-nodata@2x-995560.png' />
        <p className={cx('empty-tip')}>{message}</p>
      </div>
    )
  }
}

export class StateWrapper extends React.PureComponent {
  static defaultProps = {
    size: 'default', //default, small
    type: 'default', //default, 'list'
    state: '', //loading, empty, error
    message: undefined
  }

  render() {
    let { state, size, className, children, style, fullState = false } = this.props
    if (!!state) {
      return (
        <div
          style={{ ...style }}
          className={cx(
            className,
            'wc-state-wrapper',
            { 'small': size === 'small' })}>
          {state === 'error'
            ? <StateError {...this.props} />
            : state === 'loading'
              ? <StateLoading {...this.props} />
              : state === 'empty'
                ? <StateEmpty {...this.props} />
                : state === 'unauthorized'
                  ? <StateUnAuthorized {...this.props} />
                  : null
          }
        </div>
      )
    }

    // if (!!fullState) return (
    //   <Fragment>
    //     <FullStateLoading />
    //     {children}
    //   </Fragment>
    // )
    return children
  }
}
