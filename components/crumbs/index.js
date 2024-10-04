import React, { useEffect, useState, useImperativeHandle } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames/dedupe'
import styles from './styles.styl'

const cx = classnames.bind(styles)

function Crumbs(props, ref) {
  const { path, crumbs = {}, todayFault, todayFaultCount } = props
  const { names = [], paths = [] } = crumbs
  const [labels, setLabels] = useState(names)
  const [urls, setUrls] = useState(paths)

  useEffect(() => {
    setLabels([...names])
    setUrls([...paths])
  }, [path])

  useImperativeHandle(ref, () => ({
    updateCrumb: (index, crumb = {}) => {
      labels.splice(index, 1, crumb.name)
      urls.splice(index, 1, crumb.path)
      setLabels([...labels])
      setUrls([...urls])
    }
  }))

  return (
    <nav className={cx('app-breadcrumb', 'web-components')}>
      <img src='https://aiot-web-static.oss-cn-hangzhou.aliyuncs.com/aiot-factory-web/%E5%AE%9A%E4%BD%8D%402x.png' />
      {labels.map((label, index) => {
        let last = index === labels.length - 1
        let cls = cx({
          'breadcrumb-item': true,
          'breadcrumb-link': !!urls[index] && !last,
          'breadcrumb-current': last,
        })
        return (
          <span className={cls} key={index}>
            {!!paths[index] && !last
              ? <Link to={urls[index]}>{label}</Link>
              : <span>{label}</span>
            }
            {!last && <i className={cx('breadcrumb-separator')} />}
          </span>
        )
      })}

      {/* {!!todayFaultCount && <Link to={`/operation/warn?alarm=${3}`} className={cx('alarm-link')}>{todayFaultCount} 条三级告警</Link>} */}
    </nav>
  )
}

export default React.forwardRef(Crumbs)
