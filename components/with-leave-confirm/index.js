import React, { Fragment } from 'react'
import { Prompt } from 'react-router-dom'

export default function withLeaveConfirm (message = '确定离开当前页面吗？') {
  return (WrappedComponent) => {
    class withLeaveConfirm extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          shouldLeaveConfirm: true
        }
      }
      componentDidMount () {
        window.addEventListener('beforeunload', this.onBeforeUnload)
      }

      componentWillUnmount () {
        window.removeEventListener('beforeunload', this.onBeforeUnload)
      }

      onBeforeUnload = e => {
        let { shouldLeaveConfirm } = this.state
        e = e || window.event
        if (!shouldLeaveConfirm) return ''
        if (e && shouldLeaveConfirm) {
          e.returnValue = message // Gecko, Trident, Chrome 34+
          return message // Gecko, WebKit, Chrome <34
        }
        return message
      }

      setLeaveConfirm = () => this.setState({ shouldLeaveConfirm: true })
      unsetLeaveConfirm = () => this.setState({ shouldLeaveConfirm: false })
      unsetLeaveConfirmFn = () => {
        window.removeEventListener('beforeunload', this.onBeforeUnload)
      }

      render () {
        let { shouldLeaveConfirm } = this.state
        return (
          <Fragment>
            {shouldLeaveConfirm && <Prompt when={true} message={message} />}
            <WrappedComponent
              {...this.props}
              setLeaveConfirm={this.setLeaveConfirm}
              unsetLeaveConfirm={this.unsetLeaveConfirm}
              unsetLeaveConfirmFn={this.unsetLeaveConfirmFn}
            />
          </Fragment>
        )
      }
    }

    const componentName = WrappedComponent.displayName
      || WrappedComponent.name
      || 'Component'

    withLeaveConfirm.displayName = `withLeaveConfirm(${componentName})`
    return withLeaveConfirm
  }
}
