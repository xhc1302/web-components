import React from 'react'
import { Popconfirm } from 'antd'
import classNames from 'classnames/dedupe'
import styles from './styles.styl'

const cx = classNames.bind(styles)

export default class ZPopconfirm extends React.PureComponent {
  static defaultProps = {
    title: '',
    content: '',
  }

  renderTitle = () => {
    let { title, content, icon } = this.props
    
    return (
      <div className={cx('z-popconfirm-info')}>
        <div className={cx('info-header')}>
          {icon && <img src={icon} />}
          <span>{title}</span>
        </div>

        <p className={cx('info-content')}>{content}</p>
      </div>
    )
  }

  render () {
    let { children, ...props } = this.props
    return (
      <span onClick={e => e.stopPropagation()}>
        <Popconfirm
          {...props}
          title={this.renderTitle}
          icon=''
        >
          {children}
        </Popconfirm>
      </span>

    )
  }
}
