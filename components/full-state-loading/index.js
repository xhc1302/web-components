import React, { Fragment } from 'react'
import classnames from 'classnames/dedupe'
import styles from './styles.styl'

const cx = classnames.bind(styles)

export class FullStateLoading extends React.PureComponent {
  render() {

    return (
      <div className={cx('wc-full-state-loading')}>
        <div className={cx('loading-spin')}></div>
      </div>
    )
  }
}

export default class StateWrapper extends React.PureComponent {
  static defaultProps = {
    size: 'default', //default, small
    type: 'default', //default, 'list'
    state: '', //loading, empty, error
    message: undefined
  }

  render() {
    let { state, children } = this.props
    if (state === 'loading') return (
      <Fragment>
        <FullStateLoading />
        {children}
      </Fragment>
    )
    return children
  }
}
