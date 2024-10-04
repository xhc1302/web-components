import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { StateWrapper } from '@aiot/web-components'

export default class AuthRouter extends React.Component {
  static defaultProps = {
    userId: 0,
    pageId: -1
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      error: '',
      auth: false
    }
  }

  componentDidMount () {
    this.onPathPermission()
  }

  onPathPermission = async () => {
    let { onPathPermission, path } = this.props
    try {
      let permission = await onPathPermission?.(path)
      this.setState({ loading: false, error: '', auth: permission })
    } catch (error) {
      console.error(error)
      this.setState({ loading: false, error: error.msg || '出错了', auth: false })
    }
  }


  render () {
    let { component: Component, ...props } = this.props
    let { loading, error, auth } = this.state
    let { userId } = props
    let state = error ? 'error' : loading ? 'loading' : !auth ? 'unauthorized' : ''
    let message = error ? error : undefined

    if (!userId) {
      return <Redirect to='/login' />
    } else {
      return (
        <StateWrapper state={state} message={message}>
          <Route {...props} render={ps => <Component {...ps} {...props} />} />
        </StateWrapper>)
    }
  }
}
