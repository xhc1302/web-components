import React from 'react'
import { Link } from 'react-router-dom'
import CacheContext from './context'

export default class CacheLink extends React.Component {
  static contextType = CacheContext
  static defaultProps = {
    to: '',
    cache: true
  }

  onClick = e => {
    let { cache } = this.props
    if (cache) {
      this.context.setCacheFlag(true)
    }
  }

  render () {
    let { cache, children, ...rest } = this.props
    return (
      <Link  {...rest} onClick={this.onClick}>
        {children}
      </Link>
    )
  }
}
